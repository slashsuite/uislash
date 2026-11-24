# The agent bench

A hand-run check that the docs `@slashsuite/ui-react` ships still help an agent. It gives
`claude -p` one task, building a small settings page with the library (`task.md`), in a fresh
consumer app per run, and measures what the agent did. Run it before a release that changes the
shape of those docs: the `agent-docs/` index and pages, or the `skills/uislash/SKILL.md` skill. A
change that makes agents read more, or get the page wrong, shows up here.

It came from the spike in `docs/spikes/vercel-labs-ui.md`, which has the first results.

## Run it

```bash
bun install
bunx moon run scripts:agent-bench
```

The task builds `ui-react` and its `agent-docs` first, then the bench packs the package with
`npm pack --ignore-scripts` and installs the tarball into a template app. It runs two arms, three
rounds, with both arms of a round at the same moment:

| Arm | The installed package | Skill in the app |
| --- | --- | --- |
| A | Without `agent-docs/` and `skills/` | None |
| C | As packed | The package's `skills/uislash/SKILL.md`, copied to `.claude/skills/uislash/` |

Six runs on the defaults cost about $1.15 and take a few minutes. Flags go after `--`:

```bash
bunx moon run scripts:agent-bench -- --arms C --runs 1 --model sonnet --effort medium
```

It needs the `claude` CLI on `PATH` and signed in. **Every run is billed to that account.** CI never
runs it: CI names the tasks it runs, and the task sets `runInCI: false` as well.

## Read it

Each run prints one line as it finishes:

```
C-2: 6 calls, 277324 in, 458 out, 29503 chars read, $0.120, 22 s, correct=true
```

That is the tool calls, the input tokens sent (cached and uncached, summed over every model
request), the output tokens, the characters every tool result returned, Claude Code's own cost,
the wall-clock time, and whether the page passed `check.ts`. A failed check lists what failed after
`correct=false`.

Then a table, one row per arm. Each cell holds every run's value and, for the counts, their median:

```
| Arm | Tool calls | Files read | Text read (chars) | Input tokens sent | Output tokens | Cost | Time | Correct |
```

Read C against A. C should take fewer calls and fewer input tokens, and be correct in every run. If
C's medians climb toward A's, or C is wrong, the docs change made the agent's job harder. Three runs
per arm is noisy: a gap of a call or two is not a result, so run it again before reading much into it.

`check.ts` passes a page that typechecks, renders the rows on the server, imports from
`@slashsuite/ui-react`, writes no `className`, `style` or raw HTML controls, and follows the Button,
Field and Table pages' one right way. `bun scripts/agent-bench/check.ts <run dir>` scores one run
again.

## Where it writes

Everything goes under `$TMPDIR/uislash-vercel-ui-bench/<time>/` (`--out <dir>` picks another):

- `results.json`: every run's numbers, the files it read and its Bash commands.
- `runs/<arm>-<n>/`: the app the agent worked in, with its `src/SettingsPage.tsx`.
- `runs/<arm>-<n>.jsonl`: the agent's `stream-json` log.
- `template/` and the packed tarball.

Delete the folder when you are done with it; each run copies a full `node_modules`.
