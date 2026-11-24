# Spike: does UI SDK's shape cut an agent's calls and tokens on UISlash?

[vercel-labs/ui](https://github.com/vercel-labs/ui) (UI SDK, read at commit `926dab87`,
2026-11-23) claims agents spend less work on interfaces built with it. This spike asks whether
the parts of it that can apply to UISlash cut the tool calls and tokens an agent spends **building
a page with `@slashsuite/ui-react`**, and by more than the run-to-run noise.

**Answer: adopt in part.** Ship the docs in the package as a short index plus one Markdown page
per component, and ship a skill that points at them. On the same task, same model and same effort,
that took the median agent from 12 tool calls to 7, from 588k input tokens to 299k (−49%), from
$0.226 to $0.156 (−31%) and from 35 s to 22 s, and from 0 of 3 correct pages to 3 of 3. The three
runs of each arm do not overlap on calls, input tokens, cost or time. Drop the runtime agent bridge
(`createAgent`, agent tools, WebMCP) for now: it is for an agent operating a page, not building one,
and using it means rebuilding the components on UI SDK's primitives.

## 1. What it is, and what an agent calls or fetches

UI SDK is a headless component library (React, Vue, Svelte, Solid, web components) built on
`@ui-sdk/core` behaviours. Two things in it are aimed at agents:

- **Docs in the package, plus a skill.** Each framework package ships `docs/llms.txt`, a short
  index, and `docs/components/<name>.md`, one page per component (`files: ["dist", "docs",
  "skills"]`). A skill, `ui-sdk`, installed with `npx skills@latest add vercel-labs/ui --skill
  ui-sdk` and also shipped in the package, tells the agent to read the index first, then only the
  pages its task needs, and never the compiled JavaScript. An agent **building** a page reads these
  files with its ordinary file tools. Nothing is fetched over the network, and no server or MCP is
  involved.
- **A runtime agent bridge.** `createAgent` from `@ui-sdk/core/agent` gives an agent three tools on
  a live page, `snapshot`, `query` and `act`, also offered through WebMCP (`registerTools`). It sees
  only components built with `definePrimitive`, and it is for an agent **using** a page (filling a
  form, clicking a row menu) instead of reading the accessibility tree.

Their own benchmark (`benchmarks/agent`) measures only the bridge: an agent operating a settings
screen went from 17 tool calls and 294k tokens with browser tools to 7 calls and 70k tokens with the
agent tools (React, Sonnet, medians of 3). It does not measure building a page, and with browser
tools the UI SDK screen cost the same as Base UI's. Their numbers are theirs; this spike measured
only the docs-and-skill piece on UISlash.

## 2. Three UISlash components in its shape

The three components are **Button** (simple), **Field** (composite: a label, the control, a hint
and an error wired together) and **Table** (data-heavy: a head, a body, cell tones and numeric
columns).

| Piece | Hand-written or generated | Size |
| --- | --- | --- |
| `docs/components/button.md`, `field.md`, `table.md` | Generated: each is the page's section of the site's `/ui/llms.txt`, its heading made the page title | 11.0 KB, 4.7 KB, 24.2 KB |
| `docs/llms.txt` (the index) | Generated: the site's intro and Install section, then one line per page: name, path and its "When to use" | 2.8 KB for 3 pages, 14.5 KB for all 92 |
| `skill/SKILL.md` | Hand-written, modelled on UI SDK's: the rules (no `className`, `style` or raw elements), read the index then only the pages needed, finish with `tsc` | 20 lines |
| Runtime bridge | Not done: needs each component rebuilt on `definePrimitive` | n/a |

Everything an agent reads is generated from what UISlash already has: the docs pages
(`packages/ui-react/docs/components/`), the stories and `props.json`, which the site's `renderLlms`
already turns into one 478 KB `/ui/llms.txt`. The skill is the one hand-written file. The spike
split the built `llms.txt` (`make-docs.ts` in the appendix) rather than calling `renderLlms`,
because `renderLlms` reads the stories through Vite's `import.meta.glob` and runs only inside the
site's build.

What adopting it changes in UISlash:

- `packages/ui-react/package.json` `files` gains `docs` (and the skill). All 92 pages add 490 KB
  unpacked, about 130 KB gzipped, to a 289 KB tarball.
- The per-page docs are generated in a build step that the package's `pack-check` can check,
  versioned with the package, so the docs an agent reads match the installed version.
- A skill ships, installable from the repo and shipped in the package.
- No component, prop or theme changes. Consumer apps change nothing.

## 3. The scenario

One task, one fresh consumer app per run, four arms.

**The task** (`task.md`): write `src/SettingsPage.tsx`, a project settings page with a "Project
name" field (hint "Shown on the dashboard."), Save and Cancel buttons, and a "Members" table
(Name, Email, Role, Projects as a count) with three given rows. Use the library as its documentation
says, write no styling, change no other file, and pass `npx tsc --noEmit`.

**The app**: the packed `@slashsuite/ui-react` tarball from the checkout, React and its types at
the package's own dev versions, TypeScript 5.9.3, a strict `tsconfig`, Tailwind and a theme already
wired in `src/index.css`. Each run is a `git init` copy of it.

**The arms:**

| Arm | Docs in the package | Skill |
| --- | --- | --- |
| A | As published: `dist`, the 77 KB `README.md`, `MIGRATING.md` | None |
| B | A, plus the index and pages for Button, Field and Table only | Yes |
| C | A, plus the index and pages for all 92 pages | Yes |
| D | C's docs, plus one line at the top of the README pointing at them | None |

**The agent**: `claude -p` (Claude Code 2.1.331) on Sonnet at medium effort, project settings only,
no MCP servers, no auto memory, no session persistence, with WebFetch, WebSearch, Agent and Task
disallowed, so the docs in `node_modules` are the only docs it can reach. Claude Code's built-in
skills are listed in every arm, the same in each.

**What is measured**, from the run's `stream-json` log:

- **Tool calls**: the `tool_use` blocks.
- **Input tokens sent**: input, cache-creation and cache-read tokens summed over every model
  request (each unique assistant message), which is the context sent over the wire. **Uncached
  input** leaves out the cache reads.
- **Output tokens**, **cost** (Claude Code's `total_cost_usd`) and **time** (wall clock).
- **Text read**: the characters of every tool result. **Files read**: the paths of `Read` calls and
  of `cat`, `head`, `tail` and `sed -n` in `Bash`.
- **Correct** (`check.ts`): it typechecks, renders the rows on the server, imports from
  `@slashsuite/ui-react`, has no `className`, `style` or raw `<button>`, `<input>`, `<label>` or
  table elements, and follows the three pages' one right way and Do lines: the Field carries the
  label and hint, the Input has no `id`, the buttons sit in a `ButtonGroup` or a `FormLayout`
  `actions` row, Cancel is a quieter variant and Save the one primary, the Table has a `label`, a
  head and a body, the Projects column is `numeric` and the name cells are `tone="strong"`.

A ran alongside B, and C alongside D, three rounds each, on 2026-11-24. That is 12 agent runs.

### Re-run it

The harness is not in the repo; its five files are in the appendix. From a checkout, this writes
them to `spikes/vercel-ui/`, builds the package and the site, and runs all 12 runs in the same
pairs (about $2 and 5 minutes):

```bash
awk '/^<!-- file: /{f=$3;next} f&&/^```/{if(o){o=0;f=""}else{o=1;system("mkdir -p $(dirname " f ")")};next} o{print > f}' docs/spikes/vercel-labs-ui.md && bun install && bunx moon run ui-react:build hack-cove-site:build && bun spikes/vercel-ui/bench.ts --arms A,B && bun spikes/vercel-ui/bench.ts --arms C,D
```

Each `bench.ts` run prints a line per run and the table of medians, and writes `results.json` and
each run's log and app under `$TMPDIR/uislash-vercel-ui-bench/<time>/`. `bun
spikes/vercel-ui/check.ts <run dir>` scores one run again.

## 4. Results

### Raw numbers, every run

| Run | Tool calls | Requests | Input tokens sent | Uncached input | Output tokens | Text read (chars) | Files read | Cost | Time | Correct |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A-1 | 9 | 10 | 466,169 | 39,772 | 458 | 70,736 | 9 | $0.228 | 34 s | no: name cells |
| A-2 | 13 | 13 | 605,252 | 32,023 | 642 | 59,592 | 5 | $0.226 | 44 s | no: name cells |
| A-3 | 12 | 13 | 587,764 | 27,093 | 559 | 50,629 | 5 | $0.195 | 35 s | no: name cells |
| B-1 | 6 | 6 | 234,834 | 28,784 | 397 | 45,255 | 3 | $0.154 | 19 s | yes |
| B-2 | 7 | 7 | 271,722 | 19,199 | 376 | 34,503 | 4 | $0.120 | 20 s | yes |
| B-3 | 6 | 6 | 225,474 | 18,939 | 401 | 34,056 | 4 | $0.114 | 19 s | yes |
| C-1 | 7 | 7 | 279,582 | 19,348 | 430 | 32,307 | 5 | $0.127 | 21 s | yes |
| C-2 | 7 | 7 | 299,228 | 26,068 | 529 | 51,069 | 6 | $0.156 | 22 s | yes |
| C-3 | 7 | 8 | 354,904 | 27,832 | 467 | 55,866 | 7 | $0.168 | 22 s | yes |
| D-1 | 9 | 10 | 421,509 | 23,451 | 517 | 42,298 | 9 | $0.165 | 30 s | yes |
| D-2 | 10 | 10 | 406,605 | 22,252 | 573 | 38,143 | 8 | $0.159 | 31 s | yes |
| D-3 | 9 | 9 | 395,177 | 29,905 | 721 | 60,284 | 9 | $0.186 | 29 s | yes |

### Medians, and whether the gap beats the noise

A gap counts as real here only when the three runs of one arm all sit on one side of the other
arm's three (the ranges do not overlap). With three runs that is the honest bar; a wider study
would need more runs.

| Arm | Tool calls | Input tokens sent | Uncached input | Cost | Time | Correct |
| --- | --- | --- | --- | --- | --- | --- |
| A, as published | 12 (9 to 13) | 587,764 (466k to 605k) | 32,023 | $0.226 | 35 s | 0/3 |
| B, 3 pages + skill | 6 (6 to 7) | 234,834 (225k to 272k) | 19,199 | $0.120 | 19 s | 3/3 |
| C, all pages + skill | 7 (7 to 7) | 299,228 (280k to 355k) | 26,068 | $0.156 | 22 s | 3/3 |
| D, all pages, README pointer | 9 (9 to 10) | 406,605 (395k to 422k) | 23,451 | $0.165 | 30 s | 3/3 |

- **A to C, the change to adopt**: calls −42% (12 to 7), input sent −49%, cost −31%, time −37%,
  correct 0/3 to 3/3. No overlap on calls, input sent, cost or time. Uncached input (−19%) and
  text read (−14%) overlap, so they are not shown to move.
- **C against D, what the skill adds over a README pointer**: calls 7 against 9 to 10, input sent
  299k against 407k. No overlap. Cost overlaps ($0.127 to $0.168 against $0.159 to $0.186).
- **A to D, the docs with no skill**: input sent −31% and cost −27%, no overlap; calls touch at 9.
- **B overstates it.** With only three pages in the index the agent had nothing else to open; with
  all 92 it also read `form-layout.md` and `app-shell.md`. C, not B, is the number to expect.

Why it works: almost all of the input is the context resent on every model request, so the input
sent follows the number of requests (A 10 to 13, C 7 to 8). Arm A's agent ran `cat`, `grep` and
`head` over the README and the `.d.ts` files in 9 to 13 Bash calls. Arms B and C loaded the skill,
read the index, then read 2 to 5 pages and wrote the file.

Why A was wrong: all three A pages skipped `tone="strong"` on the name cells. The Table page says
it in its first line ("names in strong cells"); the README never says it of a table cell, and the
`.d.ts` gives the `tone` values with no word on when to use which. Every arm put Save and Cancel in
`FormLayout`'s `actions`, as the FormLayout page shows; `FormLayout` lays that row out itself
(`PageLayouts.tsx`).

**A correction to the check.** The first scoring required a `ButtonGroup`, and so failed all of A,
C and D. Reading their pages showed they followed the FormLayout page's own example, which puts
the buttons straight into `actions`, so the rule was changed to accept a `ButtonGroup` or a
`FormLayout` `actions` row and every run was scored again from its saved file. No run was repeated.
The token and call numbers do not depend on the check.

What this does not show: one task, one model, one effort; a larger or vaguer task may read more
pages. A and C ran in different rounds a few minutes apart, not side by side. The runtime bridge was not measured
on UISlash.

## 5. Recommendation: adopt in part

| Piece of UI SDK | Verdict | Why |
| --- | --- | --- |
| Docs in the package: an index plus one page per component | **Adopt** | Calls 12 to 7, input sent −49%, cost −31%, 0/3 to 3/3 correct, beyond the noise. It is generated from the docs UISlash already writes. |
| A skill pointing at them | **Adopt**, with the docs | Over a README pointer alone: calls 9 to 7, input sent 407k to 299k, beyond the noise. 20 hand-written lines. |
| Runtime agent bridge (`createAgent`, agent tools, WebMCP) | **Drop for now** | It helps an agent use a finished page, not build one, and it sees only `definePrimitive` components: every component rebuilt on `@ui-sdk/core`, a new runtime dependency, which is a human decision. Revisit if UISlash pages need to be operated by agents. |

## Draft follow-up tickets

Drafts only, not filed.

1. **`feat(ui-react): ship the docs in the package as an index and one page per component`.**
   Generate `docs/llms.txt` (intro, Install, one line per page with its path and "When to use") and
   `docs/components/<slug>.md` from the same sources as the site's `/ui/llms.txt`, and add `docs`
   to `files`. Move the renderer out of the Astro build (it needs the stories without
   `import.meta.glob`), or run it as a task after the site build that writes into the package.
   `pack-check` asserts every component in `index.ts` has a page and the index lists every page.
   Done when an installed tarball has the index and all pages, and the site's `/ui/llms.txt` is
   unchanged.
2. **`feat(ui-react): ship a skill that tells an agent how to read the docs`.** The `uislash`
   skill: the rules, read the index then only the pages needed, never the README or `dist`, finish
   with `tsc`. Shipped in the package and installable from the repo. Done when a fresh app with the
   skill installed passes this spike's arm C again.
3. **`docs(ui-react): point the README at the packaged docs`.** One line at the top of the README
   (arm D's) for an agent with no skill installed: input sent −31% on its own.
4. **`test(scripts): keep the agent scenario as a regression check`** (optional). Keep `bench.ts`
   and `check.ts` in the repo, run by hand before a release that changes the docs shape, so a
   change that makes agents read more is caught. Cost about $1 a run of 6.

## Appendix: the harness

The five files the re-run command writes, each under the path in its marker.

<!-- file: spikes/vercel-ui/task.md -->

```md
In this React + TypeScript project, write `src/SettingsPage.tsx` that exports a `SettingsPage` component: a project settings page built with `@slashsuite/ui-react` (already installed; Tailwind and the theme are already wired in `src/index.css`).

The page has:
- a "Project name" text field, with the hint "Shown on the dashboard.";
- a "Save" button and a "Cancel" button;
- a "Members" table with the columns Name, Email, Role and Projects (a count), and these rows:
  Ada Lovelace, ada@example.com, Owner, 12; Grace Hopper, grace@example.com, Admin, 7; Alan Turing, alan@example.com, Member, 3.

Use the library's components the way its documentation says. Do not write any styling of your own. Do not change any other file. When it is written, run `npx tsc --noEmit` and make sure it passes.
```

<!-- file: spikes/vercel-ui/skill/SKILL.md -->

```md
---
name: uislash
description: Builds React pages with UISlash (@slashsuite/ui-react). Use whenever a project has @slashsuite/ui-react installed or the user mentions UISlash.
---

# Build with UISlash

UISlash is a strict React component library. Every component has one right way to use it, and a page is built only from its components configured through props: no `className`, no `style`, no raw `<button>`, `<input>`, `<label>` or `<table>`, no custom CSS.

## Read first

The docs for the installed version ship in the package, as Markdown:

- `node_modules/@slashsuite/ui-react/docs/llms.txt` is the index. Read it first.
- Then read only the pages your task needs, like `docs/components/table.md`.
- Don't read `README.md` or the compiled JavaScript in `dist/`. The docs pages and the `.d.ts` types are the API.

## When you're done

Typecheck with `npx tsc --noEmit` and fix what it reports.
```

<!-- file: spikes/vercel-ui/make-docs.ts -->

```ts
/**
 * Arm B's docs, in UI SDK's shape: `docs/llms.txt` is a short index (setup plus one line per page),
 * and each page is its own `docs/components/<slug>.md`. Generated from the site's built
 * `/ui/llms.txt` (apps/hack-cove-site/dist/ui/llms.txt), which is generated from
 * packages/ui-react/docs/components, the stories and props.json. Nothing here is hand-written.
 *
 * bun spikes/vercel-ui/make-docs.ts <out dir> [--all]
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const all = process.argv.includes("--all");
const out = resolve(process.argv.slice(2).find((a) => !a.startsWith("--")) ?? "out");
const src = readFileSync(
  resolve(import.meta.dirname, "../../apps/hack-cove-site/dist/ui/llms.txt"),
  "utf8",
);
const sections = src.split(/\n(?=## )/);
const [head = ""] = sections;
const slugOf = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
// Three pages by default (the spike's box); --all writes every page the site documents.
const pages = (
  all
    ? sections
        .slice(1)
        .map((s) => /^## (.*)/.exec(s)![1]!)
        .filter((n) => n !== "Install")
    : ["Button", "Field", "Table"]
).map((name) => ({ name, slug: slugOf(name) }));
const section = (name: string) => {
  const found = sections.find((s) => s.startsWith(`## ${name}\n`));
  if (found === undefined) throw new Error(`no section ${name}`);
  return found.trim();
};
const whenOf = (body: string) => /^When to use: (.*)$/m.exec(body)?.[1] ?? "";

mkdirSync(join(out, "components"), { recursive: true });
for (const { slug, name } of pages) {
  writeFileSync(join(out, "components", `${slug}.md`), `${section(name).replace(/^## /, "# ")}\n`);
}
const index = [
  head.trim(),
  section("Install"),
  "## Components",
  "Read only the pages your task needs. Each page has the one right way, Do, Don't and the props.",
  ...pages.map(
    ({ slug, name }) => `- ${name}: \`docs/components/${slug}.md\`. ${whenOf(section(name))}`,
  ),
].join("\n\n");
writeFileSync(join(out, "llms.txt"), `${index}\n`);
console.log(`wrote ${out}/llms.txt and ${pages.length} pages`);
```

<!-- file: spikes/vercel-ui/check.ts -->

```ts
/**
 * Is a run's result correct? It typechecks, renders, and uses the three components the way their
 * docs say (the "one right way" and Do lines of the Button, Field and Table pages).
 *
 * bun check.ts <run dir>   prints JSON { ok, failed: [...] }
 */
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

export function check(dir: string) {
  const file = join(dir, "src/SettingsPage.tsx");
  const failed: string[] = [];
  if (!existsSync(file)) return { ok: false, failed: ["no src/SettingsPage.tsx"] };
  const code = readFileSync(file, "utf8");
  const tsc = Bun.spawnSync(["node_modules/.bin/tsc", "--noEmit"], { cwd: dir });
  if (tsc.exitCode !== 0) failed.push(`tsc: ${tsc.stdout.toString().slice(0, 300)}`);

  const rules: [string, boolean][] = [
    ["imports from @slashsuite/ui-react", /from ["']@slashsuite\/ui-react["']/.test(code)],
    ["no className or style", !/\b(className|style)=/.test(code)],
    [
      "no raw button/input/label/table/th/td",
      !/<(button|input|label|table|thead|tbody|tr|th|td)[\s>]/.test(code),
    ],
    [
      "Field label Project name with hint",
      /<Field[^>]*label=["{]?["']?Project name/.test(code) && /hint=/.test(code),
    ],
    [
      "Input in a Field, no id/htmlFor",
      /<Input\b/.test(code) && !/<Input[^>]*\bid=/.test(code) && !/htmlFor=/.test(code),
    ],
    [
      "Buttons in a ButtonGroup or a FormLayout actions row",
      /<ButtonGroup\b/.test(code) || /<FormLayout\b[\s\S]*?actions=\{[\s\S]*?<Button\b/.test(code),
    ],
    [
      "Cancel is a quieter variant",
      /<Button[^>]*variant=["'](outline|ghost|link)["'][^>]*>\s*Cancel/.test(code),
    ],
    ["Save is the one primary", /<Button(?![^>]*variant=)[^>]*>\s*Save/.test(code)],
    ["Table has a label", /<Table\b[^>]*label=/.test(code)],
    [
      "Table composed of head and body",
      /<TableHead\b/.test(code) && /<TableBody\b/.test(code) && /<TableHeaderCell\b/.test(code),
    ],
    ["Projects column is numeric", /<TableHeaderCell[^>]*numeric[^>]*>\s*Projects/.test(code)],
    ["Name cells are strong", /tone=["']strong["']/.test(code)],
  ];
  for (const [name, pass] of rules) if (!pass) failed.push(name);

  const render = Bun.spawnSync(
    [
      "bun",
      "-e",
      `import { renderToString } from "react-dom/server"; import { createElement } from "react"; import { SettingsPage } from "./src/SettingsPage.tsx"; const h = renderToString(createElement(SettingsPage)); if (!h.includes("Ada Lovelace") || !h.includes("Project name")) { console.error("missing text"); process.exit(1) }`,
    ],
    { cwd: dir },
  );
  if (render.exitCode !== 0) failed.push(`render: ${render.stderr.toString().slice(0, 300)}`);
  return { ok: failed.length === 0, failed };
}

if (import.meta.main) console.log(JSON.stringify(check(resolve(process.argv[2] ?? "."))));
```

<!-- file: spikes/vercel-ui/bench.ts -->

```ts
/**
 * The scenario: one agent task (task.md), run in a fresh consumer app per run, in two arms.
 *
 *   A "today":  @slashsuite/ui-react as published (dist + README + MIGRATING), no skill.
 *   B "ui-sdk, 3 pages": the same tarball plus UI SDK's shape: docs/llms.txt + docs/components/<slug>.md
 *               in the package (make-docs.ts, Button, Field, Table only) and a project skill (skill/SKILL.md).
 *   C "ui-sdk, all pages": B with every page the site documents (make-docs.ts --all) and the skill.
 *   D "docs, no skill": C's docs, no skill; one line at the top of the package README points at them.
 *
 * Each pair runs A and B at the same moment, on Sonnet at medium effort, with no MCP servers, no
 * user settings and no web tools. Measures tool calls, tokens, text read, files read, cost, time
 * and correctness (check.ts).
 *
 * bun spikes/vercel-ui/bench.ts [--arms A,B] [--runs 3] [--out <dir>]
 * Needs: `bunx moon run ui-react:build hack-cove-site:build`, the claude CLI signed in.
 */
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { check } from "./check.ts";

const { values } = parseArgs({
  options: {
    runs: { type: "string", default: "3" },
    out: { type: "string" },
    model: { type: "string", default: "sonnet" },
    effort: { type: "string", default: "medium" },
    "setup-only": { type: "boolean" },
    arms: { type: "string", default: "A,B" },
  },
});
const here = import.meta.dirname;
const repo = resolve(here, "../..");
const out = resolve(
  values.out ??
    join(tmpdir(), "uislash-vercel-ui-bench", new Date().toISOString().replace(/[:.]/g, "-")),
);
const runs = Number(values.runs);
mkdirSync(out, { recursive: true });

function sh(cmd: string[], cwd: string) {
  const r = Bun.spawnSync(cmd, { cwd, stdout: "pipe", stderr: "pipe" });
  if (r.exitCode !== 0)
    throw new Error(`${cmd.join(" ")}: ${r.stderr.toString()}${r.stdout.toString()}`);
  return r.stdout.toString();
}

// The consumer app, installed once and copied per run.
const template = join(out, "template");
const pkgDir = join(repo, "packages/ui-react");
const pkg = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8"));
mkdirSync(join(template, "src"), { recursive: true });
sh(["npm", "pack", "--ignore-scripts", "--pack-destination", out], pkgDir);
const tarball = join(out, `slashsuite-ui-react-${pkg.version}.tgz`);
writeFileSync(
  join(template, "package.json"),
  JSON.stringify(
    {
      name: "settings-app",
      private: true,
      type: "module",
      dependencies: {
        "@slashsuite/ui-react": `file:${tarball}`,
        react: pkg.devDependencies.react,
        "react-dom": pkg.devDependencies["react-dom"],
        "@types/react": pkg.devDependencies["@types/react"],
        "@types/react-dom": pkg.devDependencies["@types/react-dom"],
        typescript: "5.9.3",
      },
    },
    null,
    2,
  ),
);
writeFileSync(join(template, "bunfig.toml"), '[install]\nlinker = "hoisted"\n');
writeFileSync(
  join(template, "tsconfig.json"),
  JSON.stringify(
    {
      compilerOptions: {
        target: "ES2023",
        jsx: "react-jsx",
        module: "ESNext",
        moduleResolution: "bundler",
        strict: true,
        skipLibCheck: true,
        noEmit: true,
        allowImportingTsExtensions: true,
      },
      include: ["src"],
    },
    null,
    2,
  ),
);
writeFileSync(
  join(template, "src/index.css"),
  '@import "tailwindcss";\n@import "@slashsuite/themes/catppuccin-latte.css";\n@source "../node_modules/@slashsuite/ui-react/dist";\n',
);
writeFileSync(
  join(template, "src/main.tsx"),
  'import { createRoot } from "react-dom/client";\nimport "./index.css";\n\ncreateRoot(document.getElementById("root")!).render(<h1>Settings app</h1>);\n',
);
sh(["bun", "install"], template);

const docs = join(out, "docs");
sh(["bun", join(here, "make-docs.ts"), docs], repo);
const docsAll = join(out, "docs-all");
sh(["bun", join(here, "make-docs.ts"), docsAll, "--all"], repo);
const pointer =
  "> **Agents:** the docs for this version ship in this package as Markdown. Read `docs/llms.txt` (the index) first, then only the `docs/components/<page>.md` pages your task needs.\n\n";
type Arm = "A" | "B" | "C" | "D";
const arms = values.arms!.split(",") as Arm[];
const task = readFileSync(join(here, "task.md"), "utf8");

function setup(arm: Arm, n: number) {
  const dir = join(out, "runs", `${arm}-${n}`);
  rmSync(dir, { recursive: true, force: true });
  cpSync(template, dir, { recursive: true });
  const lib = join(dir, "node_modules/@slashsuite/ui-react");
  if (arm !== "A") cpSync(arm === "B" ? docs : docsAll, join(lib, "docs"), { recursive: true });
  if (arm === "B" || arm === "C") {
    mkdirSync(join(dir, ".claude/skills/uislash"), { recursive: true });
    cpSync(join(here, "skill/SKILL.md"), join(dir, ".claude/skills/uislash/SKILL.md"));
  }
  if (arm === "D")
    writeFileSync(join(lib, "README.md"), pointer + readFileSync(join(lib, "README.md"), "utf8"));
  sh(["git", "init", "-q"], dir);
  return dir;
}

async function agent(dir: string) {
  const started = Date.now();
  const proc = Bun.spawn(
    [
      "claude",
      "-p",
      task,
      "--model",
      values.model!,
      "--effort",
      values.effort!,
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
  const text = await new Response(proc.stdout).text();
  await proc.exited;
  writeFileSync(join(dir, "..", `${dir.split("/").pop()}.jsonl`), text);
  return { text, ms: Date.now() - started };
}

function measure(jsonl: string) {
  const events = jsonl
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l));
  const seen = new Map<string, any>();
  let calls = 0;
  let textRead = 0;
  const tools: Record<string, number> = {};
  const files = new Set<string>();
  const bash: string[] = [];
  for (const e of events) {
    if (e.type === "assistant") {
      seen.set(e.message.id, e.message.usage);
      for (const b of e.message.content ?? [])
        if (b.type === "tool_use") {
          calls++;
          tools[b.name] = (tools[b.name] ?? 0) + 1;
          if (b.name === "Read") files.add(b.input.file_path);
          if (b.name === "Bash") bash.push(b.input.command);
        }
    }
    if (e.type === "user")
      for (const b of e.message.content ?? [])
        if (b.type === "tool_result") {
          textRead +=
            typeof b.content === "string"
              ? b.content.length
              : (b.content ?? []).reduce((n: number, c: any) => n + (c.text?.length ?? 0), 0);
        }
  }
  for (const c of bash)
    for (const m of c.matchAll(
      /(?:cat|head|tail|sed -n [^ ]+|less)\s+(\S+\.(?:md|txt|ts|tsx|js|json))/g,
    ))
      files.add(m[1]!);
  const result = events.find((e) => e.type === "result") ?? {};
  const turns = [...seen.values()];
  const sum = (k: string) => turns.reduce((n, u) => n + (u?.[k] ?? 0), 0);
  const init = events.find((e) => e.type === "system" && e.subtype === "init") ?? {};
  return {
    calls,
    tools,
    textRead,
    files: [...files],
    bash,
    requests: turns.length,
    inputSent:
      sum("input_tokens") + sum("cache_creation_input_tokens") + sum("cache_read_input_tokens"),
    uncached: sum("input_tokens") + sum("cache_creation_input_tokens"),
    output: sum("output_tokens"),
    cost: result.total_cost_usd,
    apiMs: result.duration_api_ms,
    isError: result.is_error,
    skills: init.skills,
    model: init.model,
  };
}

if (values["setup-only"]) {
  console.log(arms.map((a) => setup(a, 0)));
  process.exit(0);
}
const rows: any[] = [];
for (let n = 1; n <= runs; n++) {
  const pair = await Promise.all(
    arms.map(async (arm) => {
      const dir = setup(arm, n);
      const { text, ms } = await agent(dir);
      const row = { arm, n, ms, ...measure(text), correct: check(dir) };
      console.log(
        `${arm}-${n}: ${row.calls} calls, ${row.inputSent} in, ${row.output} out, ${row.textRead} chars read, $${row.cost?.toFixed(3)}, ${(ms / 1000).toFixed(0)} s, correct=${row.correct.ok} ${row.correct.failed.join("; ")}`,
      );
      return row;
    }),
  );
  rows.push(...pair);
  writeFileSync(join(out, "results.json"), JSON.stringify(rows, null, 2));
}

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m]! : (s[m - 1]! + s[m]!) / 2;
};
console.log(
  "\n| Arm | Tool calls | Files read | Text read (chars) | Input tokens sent | Output tokens | Cost | Time | Correct |",
);
console.log("| --- | --- | --- | --- | --- | --- | --- | --- | --- |");
for (const arm of arms) {
  const r = rows.filter((x) => x.arm === arm);
  const col = (k: string) =>
    r.map((x) => x[k]).join(" / ") + ` (median ${median(r.map((x) => x[k]))})`;
  console.log(
    `| ${arm} | ${col("calls")} | ${r.map((x) => x.files.length).join(" / ")} | ${col("textRead")} | ${col("inputSent")} | ${col("output")} | ${r.map((x) => "$" + x.cost?.toFixed(3)).join(" / ")} | ${r.map((x) => Math.round(x.ms / 1000) + " s").join(" / ")} | ${r.filter((x) => x.correct.ok).length}/${r.length} |`,
  );
}
console.log(`\nresults: ${join(out, "results.json")}`);
```

