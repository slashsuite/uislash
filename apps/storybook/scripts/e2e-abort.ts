/**
 * Proves an aborted e2e run leaves nothing behind: starts `bunx moon run storybook:e2e` on a known
 * port, waits until its server answers, signals the run's process group, and checks that no process holds
 * the port and no `e2e/serve.ts` of this checkout is left. Run it once per signal:
 *
 *   bun apps/storybook/scripts/e2e-abort.ts SIGTERM
 *   bun apps/storybook/scripts/e2e-abort.ts SIGINT
 *
 * It exits 1 naming what was left. A real run waits on Storybook's build and on Playwright, so this is
 * a script for people to run, not a test.
 */
import { join } from "node:path";

const signal = process.argv[2] === "SIGINT" ? "SIGINT" : "SIGTERM";
const repo = join(import.meta.dirname, "..", "..", "..");
const serve = join(repo, "apps", "storybook", "e2e", "serve.ts");

const probe = Bun.serve({ hostname: "127.0.0.1", port: 0, fetch: () => new Response() });
const port = probe.port;
await probe.stop(true);

/** Whether something answers on the port. */
async function listening(): Promise<boolean> {
  try {
    await fetch(`http://127.0.0.1:${port}/`);
    return true;
  } catch {
    return false;
  }
}

/** The pids of this checkout's `e2e/serve.ts`, wherever they were started. */
function serves(): string[] {
  const out = Bun.spawnSync(["pgrep", "-f", "e2e/serve.ts"]).stdout.toString();
  return out
    .split("\n")
    .filter(Boolean)
    .filter((pid) => {
      const cwd = Bun.spawnSync(["readlink", `/proc/${pid}/cwd`])
        .stdout.toString()
        .trim();
      const args = Bun.spawnSync(["ps", "-o", "args=", "-p", pid]).stdout.toString();
      return args.includes(serve) || cwd === join(repo, "apps", "storybook");
    });
}

/** Polls `check` until it holds or `ms` pass. */
async function until(check: () => boolean | Promise<boolean>, ms: number): Promise<boolean> {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (await check()) return true;
    await Bun.sleep(200);
  }
  return check();
}

const before = serves();
if (before.length > 0) {
  console.error(
    `e2e-abort: serve.ts already running here (pid ${before.join(", ")}); stop it first`,
  );
  process.exit(1);
}

// Its own process group, signalled whole, as a terminal's Ctrl-C or a CI cancel does: moon does not
// pass a signal sent to its pid alone on to the task it runs.
const run = Bun.spawn(["setsid", "bunx", "moon", "run", "storybook:e2e", "--force"], {
  cwd: repo,
  env: { ...process.env, E2E_PORT: String(port) },
  stdout: "inherit",
  stderr: "inherit",
});

if (!(await until(listening, 600_000))) {
  run.kill("SIGKILL");
  console.error(`e2e-abort: the run never served on ${port}`);
  process.exit(1);
}
console.log(`e2e-abort: serving on ${port}; sending ${signal} to its process group (${run.pid})`);
process.kill(-run.pid, signal);
await run.exited;

const freed = await until(async () => !(await listening()) && serves().length === 0, 15_000);
const left = serves();
if (!freed) {
  console.error(
    `e2e-abort: after ${signal}, port ${port} ${(await listening()) ? "is still held" : "is free"}` +
      (left.length ? `, serve.ts left: pid ${left.join(", ")}` : ""),
  );
  process.exit(1);
}
console.log(`e2e-abort: after ${signal}, port ${port} is free and no serve.ts is left`);
