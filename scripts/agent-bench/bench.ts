/**
 * The agent bench: one task (task.md) run by `claude -p` in a fresh consumer app per run, once per
 * arm (app.ts: A without the packaged docs and skill, C with them), the arms of a round at the
 * same moment. Prints a line per run and a table of medians; writes results.json, each run's log
 * and each run's app under $TMPDIR/uislash-vercel-ui-bench/<time>/. README.md says how to read it.
 *
 * bunx moon run scripts:agent-bench [-- --arms A,C --runs 3 --model sonnet --effort medium --out <dir>]
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { ARMS, isArm, makeTemplate, setup, type Arm } from "./app";
import { check, type Verdict } from "./check";
import { measure, type Measure } from "./measure";

const { values } = parseArgs({
  options: {
    arms: { type: "string", default: ARMS.join(",") },
    runs: { type: "string", default: "3" },
    model: { type: "string", default: "sonnet" },
    effort: { type: "string", default: "medium" },
    out: { type: "string" },
  },
});
const arms = values.arms.split(",").filter(Boolean);
if (arms.length === 0 || !arms.every(isArm))
  throw new Error(`--arms takes a comma-separated list of ${ARMS.join(", ")}`);
const runs = Number(values.runs);
if (!Number.isInteger(runs) || runs < 1) throw new Error("--runs takes a whole number above 0");

const here = import.meta.dirname;
const repo = resolve(here, "../..");
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const out = resolve(values.out ?? join(tmpdir(), "uislash-vercel-ui-bench", stamp));
mkdirSync(out, { recursive: true });
const task = readFileSync(join(here, "task.md"), "utf8");

interface Row extends Measure {
  arm: Arm;
  n: number;
  ms: number;
  correct: Verdict;
}

/** One agent run: Sonnet at medium effort by default, project settings only, no MCP, no web. */
async function agent(dir: string, log: string) {
  const started = Date.now();
  const proc = Bun.spawn(
    [
      "claude",
      "-p",
      task,
      "--model",
      values.model,
      "--effort",
      values.effort,
      "--output-format",
      "stream-json",
      "--verbose",
      "--setting-sources",
      "project",
      "--strict-mcp-config",
      "--mcp-config",
      '{"mcpServers":{}}',
      "--no-session-persistence",
      "--permission-mode",
      "bypassPermissions",
      "--disallowedTools",
      "WebFetch",
      "WebSearch",
      "Agent",
      "Task",
    ],
    {
      cwd: dir,
      stdout: "pipe",
      stderr: "pipe",
      env: { ...process.env, CLAUDE_CODE_DISABLE_AUTO_MEMORY: "1" },
    },
  );
  const [text, stderr] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
  ]);
  writeFileSync(log, text);
  // A CLI that is signed out, out of credit or refuses a flag would otherwise read as a run of zeros.
  if ((await proc.exited) !== 0)
    throw new Error(`claude exited ${proc.exitCode}: ${stderr || `see ${log}`}`);
  return { text, ms: Date.now() - started };
}

async function run(template: string, arm: Arm, n: number): Promise<Row> {
  const dir = setup(template, arm, join(out, "runs", `${arm}-${n}`));
  const { text, ms } = await agent(dir, join(out, "runs", `${arm}-${n}.jsonl`));
  const row: Row = { arm, n, ms, ...measure(text), correct: check(dir) };
  console.log(
    `${arm}-${n}: ${row.calls} calls, ${row.inputSent} in, ${row.output} out, ${row.textRead} chars read, $${row.cost.toFixed(3)}, ${(ms / 1000).toFixed(0)} s, correct=${row.correct.ok} ${row.correct.failed.join("; ")}`,
  );
  return row;
}

const median = (xs: number[]) => {
  const s = xs.toSorted((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? (s[m] ?? 0) : ((s[m - 1] ?? 0) + (s[m] ?? 0)) / 2;
};

function table(rows: Row[]) {
  console.log(
    "\n| Arm | Tool calls | Files read | Text read (chars) | Input tokens sent | Output tokens | Cost | Time | Correct |",
  );
  console.log("| --- | --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const arm of arms) {
    const r = rows.filter((x) => x.arm === arm);
    const col = (pick: (x: Row) => number) =>
      `${r.map(pick).join(" / ")} (median ${median(r.map(pick))})`;
    const cells = [
      col((x) => x.calls),
      r.map((x) => x.files.length).join(" / "),
      col((x) => x.textRead),
      col((x) => x.inputSent),
      col((x) => x.output),
      r.map((x) => `$${x.cost.toFixed(3)}`).join(" / "),
      r.map((x) => `${Math.round(x.ms / 1000)} s`).join(" / "),
      `${r.filter((x) => x.correct.ok).length}/${r.length}`,
    ];
    console.log(`| ${arm} | ${cells.join(" | ")} |`);
  }
}

const template = makeTemplate(repo, out);
const rows: Row[] = [];
for (let n = 1; n <= runs; n++) {
  rows.push(...(await Promise.all(arms.map((arm) => run(template, arm, n)))));
  writeFileSync(join(out, "results.json"), JSON.stringify(rows, null, 2));
}
table(rows);
console.log(`\nresults: ${join(out, "results.json")}`);
