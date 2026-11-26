# Contributing to uislash

Thanks for looking. This repo is the UISlash design system: React components (`@slashsuite/ui-react`) and
the themes (`@slashsuite/themes`, one CSS file per theme), each its own npm package, in a moon +
Bun-workspaces monorepo. By taking part you agree to the [Code of Conduct](CODE_OF_CONDUCT.md). For
a security problem, follow [SECURITY.md](SECURITY.md) instead of opening an issue.

## Issues and pull requests

Bug reports, questions and proposals are welcome as GitHub issues, and so are pull requests. The
maintainer reads each issue and tracks the work in a private tracker; the issue stays open until
the fix has landed, and is closed then. A small fix needs no issue first: open the pull request.

## What belongs here

UISlash is an opinionated, strict UI library that is fully integrated with its theming: the
components and themes are designed together, and every theme remaps every palette utility the
components use. It fixes the look and feel so agents reliably build good-looking sites; it is not an
extensible framework. So the bar for a component ask is high. The default answer to a new prop,
variant or escape hatch is no, unless it is the one right way to meet a need that recurs across
consumers. We prefer fixed named choices to open styling, and consumers compose the parts without
restyling them: components take no `className` or `style`, and a consumer writes no styling. When you propose something, say what recurring need it serves.

## Setup

You need [Bun](https://bun.sh) and Node. Then:

```sh
bun install
bunx playwright install chromium   # once per machine, for the e2e (Chromium only)
bunx moon run storybook:storybook   # http://localhost:6006
```

Open Storybook, flip the theme switcher in the toolbar, and read the stories. **Overview / All
themes** shows every component in every theme on one page.

## Layout

| Folder | Package | What it is |
| --- | --- | --- |
| `packages/ui-react` | `@slashsuite/ui-react` | The components. Builds to `dist/` (ESM + `.d.ts`). Peers: react, react-dom, tailwindcss v4. No theme CSS. |
| `themes` | `@slashsuite/themes` | One CSS file per theme, `<id>.css`, shipped as-is. |
| `packages/oxlint-testing` | `@slashsuite/oxlint-testing` | The shared oxlint config and plugin for UI tests. Its fixture suite is its `test`; `bun run lint:testing` reports what it finds in this repo. |
| `packages/oxlint-ui` | `@slashsuite/oxlint-ui` | The oxlint config and plugin that hold an app to `@slashsuite/ui-react`, the same rules as `ui-review`'s layer 1. Its fixture and parity suites are its `test`. |
| `packages/core` | (private) | What the renderers share: token tables, prop types, story fixtures, `parity.json` and the native theme generator. Pure TypeScript, no runtime dependencies. ui-react's build vendors its `dist` into `dist/core/`, so it is private and never published; ui-react names it by its version on disk (`0.0.0`), not `workspace:*`, because Nx's npm publish refuses a `workspace:` specifier. |
| `packages/ui-react-native` | (private) | The components for React Native, from core's tables and each theme's `<id>.native.json`. Its lint adds the native rules (`scripts/native-lint.ts`). A change to a component in `packages/core/parity.json` changes its twin on the other renderer in the same pull request, or names a follow-up with a `Parity: follow-up <ref>` line in the body. |
| `apps/storybook` | (private) | Storybook and the Playwright e2e. |
| `packages/themes-shared` | (private) | How Storybook and the docs find the themes: the `themes/*.css` glob, the theme ids and each theme's scope class. |
| `tools/docs` | (private) | The component docs' tooling: `bunx moon run docs:props` regenerates `packages/ui-react/docs/props.json` and `types.json`, `docs:llms` writes `tools/docs/dist/llms.txt`, and its tests check the docs data. The docs site is built outside this repo. |
| `tools/ui-review` | (private) | Dev tooling for the `ui-review.yml` reusable workflow: a deterministic check of a pull request's added lines and an advisory model review. Not published; no package depends on it. |

## The gate

A change is ready when all of this passes:

```sh
bun install
bunx moon run :typecheck :lint :test :build      # tsc strict · oxlint + check-slop · Vitest · dist + Storybook build
bun run format:check                             # oxfmt --check (`bun run format` fixes)
bunx moon run :pack-check                        # npm pack --dry-run for every package; ui-react also typechecks its tarball in a consumer app
bunx moon run storybook:e2e                      # Playwright, in Chromium: builds Storybook, flips every theme
```

moon runs every task through the cache, so an unchanged project is a cache hit; `--force` reruns
one anyway. Lint rules are all errors: fix the code, do not disable a rule.

The shared testing lint (`@slashsuite/oxlint-testing`) is part of `ui-react`'s, `storybook`'s and
`docs`'s `lint`, so a ui-react test that walks the DOM, or a Storybook spec that
finds an element by CSS, branches or waits on a style, fails the gate. For every other project, `bun run lint:testing` reports, per
project and per rule, what it finds in the tests, and always exits 0. Each project moves into its own
`lint` once its count is 0 (`packages/oxlint-testing/README.md`).

**Nothing is time dependent.** Jacobus, 2026-11-14: "The architecture of the test is wrong if it relies on timings for displaying it. We should be able to pass it in a value and then render that. It should not be time dependent. The component itself should not be time dependent." A component renders from the value it is given, and a test passes that value and asserts what renders. No fake timers, no waiting on a delay, no story driven by a timer, no `waitForTimeout` in an e2e spec. A visual delay, a fade or a label that reverts is CSS (an animation and its delay), as `CopyButton` and `NavigationProgress` do; a pending state is a value the story holds (a promise that never settles, or a button that lands it). The lint (`scripts/slopRules.ts`) fails a test, story or e2e file that uses a fake or real timer, and a `@slashsuite/ui-react` component that calls `setTimeout` or `setInterval`; a line with `// time-dependent: <why>` on it or above it is exempt, and needs a reason a reviewer accepts.

Stop a process by the pid you started or by its port. Never `pkill -f` or `killall` a word such as storybook, moon, bun or vite: a shared machine can be running someone else's capture or upload.

Tasks are declared in `.moon/workspace.yml`, `.moon/tasks/all.yml` and each project's `moon.yml`;
each runs the `package.json` script of its name. moon hashes no dependency's files on its own, so a
task that reads another project lists that project's files in its inputs. On top of the local
cache in `.moon/cache`, moon shares a remote cache (the `remote:` block in `.moon/workspace.yml`).
Every request needs a token in `MOON_REMOTE_TOKEN`, reads included. Only `main`'s CI writes to it;
a pull request's CI reads it, and a local run only reads (`localReadOnly`). With no token set, moon
logs one 401 warning, turns the remote cache off and runs as before, so a local run needs nothing.
A task's declared `outputs` are all a remote hit restores, so anything a later task reads from a
build must be listed there. Each `e2e` task is cached on everything its run reads, its build's
inputs included, so a repeat run on unchanged code is a hit; `--force` re-runs it. Nx is still installed, for one job
only: `nx release` versions and publishes the packages (`docs/releasing.md`).

The shared compiler options live in `tsconfig.shared.json`, not a root `tsconfig.base.json` or
`tsconfig.json`: Nx, which `nx release` still runs, reads those two names, and TypeScript 7 has no
classic compiler API for it to parse them with.

## Rules of the repo

1. **`@slashsuite/ui-react` carries no theme.** Components use stock Tailwind utilities (`bg-white`,
   `text-slate-900`, …) and never a `dark:` variant or a palette colour. A theme is the only place
   a palette lives; it remaps those utilities under its own scope class. The colour utilities a
   component may use are listed in `packages/ui-react/palette.json`. A new one is a palette change: add
   it there and remap it in every theme in the same change. With no theme the
   components render in Tailwind's own default colours; that works, but it is only what a theme
   remaps, not a look the repo designs or checks, so Storybook offers no unthemed choice.
2. **A theme is a file and nothing else registers it.** No theme name appears in code.
3. **Almost no runtime dependencies.** `@slashsuite/ui-react` has two approved dependencies,
   `react-aria-components` (with `@internationalized/date`), for the date picker, and `@dagrejs/dagre`,
   for `FlowDiagram`'s layout; its peers are react,
   react-dom and tailwindcss v4, plus `@types/react` and `@types/react-dom` as optional peers (types only, so a consumer's
   tsc resolves `react` under strict linkers). `@slashsuite/themes` has only the tailwindcss peer. A new dependency needs a
   maintainer's agreement first.
4. **Source imports in `packages/ui-react` use `.js` specifiers** (`./Card.js`, resolved to `Card.tsx`),
   because a `.tsx` specifier is emitted into the `.d.ts` and breaks consumers' types.
5. **A new component** is exported from `packages/ui-react/src/index.ts`, has its own story, and appears
   in `apps/storybook/src/Gallery.tsx`. Its docs page names Do/Don't topics, the stories
   `Do<Topic>` and `Dont<Topic>`. A topic shows both halves when a counter-example teaches
   something; one shown on its own (a feature, or a wrong way the types already refuse) is listed
   with its reason in `ONE_HALF` in `tools/docs/test/docs.test.ts`.
   Its story title is `<Section>/<Page name>`, read from the docs' `componentSections`
   (`packages/ui-react/docs/components/`): add the component to a page there first, then
   title the story file with that page's section and name. Storybook's sidebar takes its order from
   the same list, so nothing else needs editing, and `visual-plan.test.ts` fails on a title that
   differs from the site's.

6. **No `className` or `style` on a component.** A public component has no styling prop and its
   HTML props are typed `Unstyled<…>` (`packages/ui-react/src/props.ts`). If a story or a site needs a
   look the component lacks, propose the prop or variant (say what recurring need it serves) or
   drop the look. `noStyling.test.tsx` enforces it.

7. **The platform first.** An overlay is built on what the browser already does: a modal is a
   `<dialog>` opened with `showModal()`, a floating layer (a tooltip, a popover, a menu) is a native
   popover rendered in place, and a disclosure is `<details>`. A floating layer sits beside its
   trigger by CSS anchor positioning, feature-detected (`supports-[anchor-name:--a]:`), with a
   placement that works without it. React Aria is only for the large keyboard patterns the
   platform has no element for (the date picker, the combobox, the number field), and its popup
   is portalled into the open dialog, so it is never under the dialog's top layer.
8. **A new part lands with its first consumer.** A component added for a need ships in the same
   change as the swap on a consumer app that uses it, so the library
   grows only from a need that is real and a part nobody uses does not wait in the package.
9. **A card is not a choice.** `Card` and `MediaTile` have no selected state. A pick among cards is an
   option card (`RadioGroup` or `Checkbox` with `variant="card"`), so the choice is a form value with its
   own keyboard and its own announcement, never a highlighted link.

## Items or children

A component whose parts are all one shape, each a label, a value or a link, takes them as data in
an `items` prop and draws every part itself: `Menu`, `SiteSearch`, `Breadcrumbs` and
`SegmentedControl`. A component whose parts hold other content, so one part's layout can differ
from the next, takes them as children parts: `Stack`, `Card` and `Table` (`TableRow`, `TableCell`).
Do give a new component of the first kind `items` typed as an array of plain objects. Don't take
children parts for a list of labels (a `MenuItem` child), or an `items` array for blocks of
content, since either way a consumer can pass in what the component cannot lay out.

## Adding a theme

A theme is one CSS file in `themes/`; copy one and change it. The steps are in the README
([How to add a theme](README.md#how-to-add-a-theme)). Each theme names its own scope class (the
class of the first top-level `.<class> { … }` rule in its CSS file), and `themes/themes.test.ts`
is the contract for every CSS file there; Storybook and the e2e find them from `themes/*.css`, so there is no list to edit. The
contract includes WCAG AA contrast, measured from the theme's CSS for every pairing in
`palette.json` (`packages/themes-shared/src/contrastRules.ts`); a colour that fails is fixed in
the theme's CSS file, with a comment saying why when a published token moves.

## The visual check

The maintainers also run a comparison of shots (PixelSlash, an internal tool that is not published)
against the branch's merge-base with `main`. It is not part of the gate above and **you do not need
it to contribute**: it runs from a separate checkout of PixelSlash.

**CI uploads every pull request and every push to `main`.** The `Visual` workflow
(`.github/workflows/visual.yml`) checks out the pull request's head commit (never GitHub's merge
commit) and PixelSlash at a pinned commit, runs `storybook:visual-upload`, and sends the Storybook
build to the maintainers' PixelSlash server, whose address is the `PIXELSLASH_SERVER` secret. The
server renders each group's stories itself, so the job installs no browser. It diffs
a pull request against the `main` build it holds, one subproject of the `uislash` project per section,
and posts one GitHub status for the project (`PixelSlash / uislash`) on the head commit; the
maintainers review the result there, and a push to `main` becomes the next baseline. A fork's pull request gets no secrets, so the job skips with a notice and the maintainers
check its visuals. A pull request uploads only the groups its change reaches (as in the affected mode
below), each one whole, and Overview, which is always captured; the log names each group it skipped.
A skipped group has no build on the commit, and the status counts only the groups that have one. A
change that reaches everything uploads every group, and a push to `main` always does, so each group
keeps a baseline near `main`'s tip. A pull request behind `main`'s tip needs no rebase for this: the server diffs it
against the `main` build at its merge-base, so it shows only its own changes.
A local `bunx moon run storybook:visual` is your own check and needs no server. A manual
`visual-upload` to that server (with `PIXELSLASH_SERVER` and `PIXELSLASH_TOKEN`) is only for re-seeding `main`, and
never mixes a local capture into a pull request's build.

The stories are split into groups, one per section of the [component docs](https://hack-cove.com/ui/)
(Layout, Page layouts, Text, … and Overview), read from
`packages/ui-react/docs/components`. Each group is its own folder (`.pixelslash/<section>/`)
and its own PixelSlash subproject (`uislash/<section>`), with its own baseline and review queue.
A story file goes in the section of the docs page that names it in `pairs`, `fullPage` or
`stories`; one that no page names fails the storybook tests, so a new story file comes with its
docs page.

**One theme in full, the Gallery sections in the rest.** Every story is shot in the reference
theme, the first file in `themes/` in sorted order (`catppuccin-latte.css` today), worked
out from the folder, never named in code. Every other theme is shot in **Overview / Gallery
sections** only, one story per `gallerySections` entry, which render every component the library
exports (a storybook test fails on one that is missing). So a regression in any story shows in the
reference theme, every component is still seen in every theme, and a theme added costs a Gallery's
worth of shots, not every story. A new theme whose file sorts first becomes the reference and takes
the full set over, so its first upload shows every story as new in it and removed from the old
reference, but for the old reference's Gallery sections, which it keeps. Stories shot once (**Overview / All themes sections**, which show every theme in one
shot) stay shot once.

The check runs in one of two modes:

- **Affected** (`bunx moon run storybook:visual`): only the stories
  the change reaches, found by following imports from each story file. They are shot in the
  reference theme, and when the Gallery sections are among them (a component change usually
  reaches them), those are shot in every theme. A change to the reference theme's CSS file captures
  every story in it and the Gallery sections in every other theme (the file may be a new theme that
  took the reference over); a change to another theme's CSS file, only the Gallery sections in that
  theme.
  Overview is always captured. Anything shared (the palette, Storybook's config, the lockfile, a
  `package.json`, the visual scripts) or a diff that cannot be read captures everything. The run
  says at the top what it picked and why, how much it skipped, and the shots per theme.
- **Everything** (`bunx moon run storybook:visual -- --all`, or
  `VISUAL_ALL=1 bunx moon run storybook:visual`): every group whole. An upload (`visual-upload`) on `main` is always this mode; on a pull request it
  takes the groups the affected mode reaches, each one whole, since the server reads a story missing
  from a build as removed.

**A run can be split into steps.** A bare run plans, runs every group and totals them in one
process. The same three steps run one at a time, so a full check fits a machine that limits how
long one browser run may take:

```bash
bunx moon run storybook:visual -- --all --plan-only        # write the plan and build the base; no browser
bunx moon run storybook:visual -- --all --group overview   # one group of the saved plan; repeat per group
bunx moon run storybook:visual -- --all --group forms --group pages   # or several in one run
bunx moon run storybook:visual -- --summary-only           # total the saved plan's results
```

`--plan-only` writes `apps/storybook/.pixelslash/plan.json` and stops (for a local compare, after
building the base Storybook) and prints the group slugs. `--group <slug>` runs only the named groups
of that plan, and takes the same `--all` and `--upload` the plan had. It refuses when there is no
plan, when the plan differs from this run in either flag (an upload or not, everything or only what
the change reaches), when `HEAD` has moved since the plan (plan again), or for a slug the plan does
not have, naming the plan's. `--summary-only` prints the per-group lines and the total, and
fails naming each group with no result for this plan. Each group is its own run of a few minutes at
most, so each can be wrapped in whatever limits a browser run on your machine.

The local run (`visual`) builds the merge-base's Storybook in a shared worktree, captures it and
writes one report per group to `apps/storybook/.pixelslash/<slug>/report/index.html`. An upload
(`bunx moon run storybook:visual-upload`, which needs `PIXELSLASH_SERVER` and a token; see "The
server renders an upload" below) builds and
captures no base at all. It has two modes, picked from the checkout:

- **A branch**, on origin/main's tip or behind it, uploads the branch only. The
  server diffs it against the newest `main` build at its merge-base or an ancestor, so the run's summary prints the server's counts against main
  (changed and new, and how many shots are to review, with the build's status) and the
  build's page. Before any upload it checks that each project holds a `main` build at the
  merge-base or an ancestor, and fails naming the project when none does.
- **A checkout at origin/main's tip** (clean; a detached HEAD in a throwaway worktree counts)
  uploads that commit as branch `main` and compares nothing. The `Visual` run on a push to `main`
  does this, which keeps those `main` builds on the server. Any other commit on `main` is refused,
  and so is a commit already on origin/main but behind its tip (a `main` run that a later push
  overtook): re-seed `main` from its tip instead.

**The server renders an upload.** An upload sends the built Storybook and each group's stories and
themes (`pixelslash upload --bundle`), and the server captures them in its own browser: nothing is
captured on your machine or the CI runner. Every group is sent at once; the server renders them in
turn, and the run waits for each build's diff. One render takes one set of stories in one set of
themes, so Overview goes in two subprojects: `uislash/overview` holds its stories in the reference
theme, and `uislash/overview-themes` the Gallery sections in every other theme.

`VISUAL_RENDER=client` is the fallback: the upload captures here and sends the shots, Overview whole
to `uislash/overview`, as it did before the server rendered. It needs Chromium (`bunx playwright
install chromium` in the PixelSlash checkout's `packages/engine`), and `VISUAL_PARALLEL` (a whole
number, default 1) sets how many groups capture at once:

```bash
VISUAL_RENDER=client VISUAL_PARALLEL=3 bunx moon run storybook:visual-upload
```

Each group's capture then takes `max(1, min(10, floor(cpus / VISUAL_PARALLEL)))` workers, where
`cpus` is what `os.availableParallelism()` reports, and a `VISUAL_PARALLEL` above the CPU count is
refused. The server tells the two apart (a different browser and fonts), and it refuses a pull
request build made one way against `main` baselines made the other, so switching between them
starts with a `main` upload made the new way. The local compare (`visual`) always captures here,
serially: it builds and captures the base under one lock.

PixelSlash ends a build at errored on a shot over 24.5 Mpx (19140px tall at 1280 wide), so the
one-page **Overview / Gallery** and **Overview / All themes** are not shot whole: the run shoots
**Overview / Gallery sections** and **Overview / All themes sections** instead, one story per entry
of `gallerySections` in `apps/storybook/src/Gallery.tsx`. A new Gallery block goes in a section
(or a new one, with a story in both files). The run fails on a shot over the limit, naming it, and
warns on one past 75% of it.

What it means for you:

- If you cannot run it, say so in the pull request. A maintainer runs it before merging and reads
  every changed capture.
- A change that should not alter any visuals (a refactor, a doc, a test) is expected to show
  `0 changed`. A component or theme CSS change will show changes: say in the pull request which
  stories should look different and why. Attach a before/after screenshot from Storybook if you can.
- You can get most of the benefit without it: run Storybook, flip each theme, and read the
  affected stories (and **Overview / All themes**); `bunx moon run storybook:e2e` checks every theme under
  its scope class.

## Commit messages

Commits are [Conventional Commits](https://www.conventionalcommits.org): `<type>(<scope>): <subject>`,
for example `fix(ui-react): keep the Pill label on one line`. `nx release` reads them to version and release each
package, so the type is honest:

- `feat`, `fix` and `perf` release a patch while a package is `0.x`. A `!` after the type, or a
  `BREAKING CHANGE:` footer, releases a minor.
- `docs`, `test`, `chore`, `refactor`, `build` and `ci` release nothing.

Which packages a commit bumps depends on the files it touches, not on its scope.

## Pull requests

- Branch from `main`, keep the change small and focused, and run the gate before you push.
- Describe what changed and why, and say whether you ran the visual check (above).
- CI runs the gate (without the visual check) on every pull request; it needs to be green.
- Maintainers squash-merge, keeping a conventional subject.
- Releases are cut by a maintainer from GitHub Actions ([docs/releasing.md](docs/releasing.md)).
  Contributors never publish.

## Licence

MIT. By contributing you agree your contribution is licensed under the same terms (see `LICENSE`).
