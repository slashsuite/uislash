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
split the built `llms.txt` (with a `make-docs.ts` script, since dropped) rather than calling `renderLlms`,
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

The harness lives on as `scripts/agent-bench/` (`bunx moon run scripts:agent-bench`), against the
docs and skill the package now ships. It keeps arms A and C; B and D answered their questions here
and were dropped. Its `README.md` says how to run and read it.

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

The spike's harness is kept as `scripts/agent-bench/`: `task.md`, `check.ts` and `bench.ts`, with
the docs read from the package's `agent-docs/` and the skill from its `skills/`.
