# uislash: repo conventions

The UISlash design system: React components (`@slashsuite/ui-react`) and the themes
(`@slashsuite/themes`, one CSS file per theme), each its own npm package, in a moon + Bun-workspaces monorepo. moon runs every task; Nx is
here only for `nx release` (`docs/releasing.md`).
`README.md` is the user-facing contract (install, usage, how to add a theme);
`CONTRIBUTING.md` is the guide for contributors.

This file is the operating agreement for agents working here. Maintainers' tooling may load extra,
private agent rules on top of it.

## Purpose

UISlash is an opinionated, strict UI library that is fully integrated with its theming. The
components and the themes are designed together: every theme remaps every palette utility the
components use (`palette.json`, `themes/themes.test.ts`), so switching theme reskins a whole site with
no component change and nothing to configure. It fixes the look so agents reliably build good-looking
sites. It is not an extensible framework.

The default answer to a new prop, variant or escape hatch is **no**, unless it is the one right way
to meet a need that recurs across consumers. Prefer fixed named choices over open styling.
Consumers compose the parts and never restyle them: no component takes `className` or `style`, and
a consumer writes no styling of its own.

The end goal is a site built with components configured through props and nothing else: no custom
CSS, Tailwind classes or one-off styling. That is why the library ships whole pages (error, 404,
offline) and a loading skeleton matching each component's and layout's real shape in every theme.
Docs and site copy lead with the one way to do a thing, with do and don't, rather than a catalogue
of options.

## Layout

| Project | Path | What it is |
| --- | --- | --- |
| `ui-react` | `packages/ui-react` | `@slashsuite/ui-react`: the components. Builds to `dist/` (ESM + `.d.ts`). Peers: react, react-dom, tailwindcss v4, and optional `@types/react` + `@types/react-dom` (types reach consumers under isolated linkers); two runtime dependencies, react-aria-components (the date picker) and @dagrejs/dagre (`FlowDiagram`'s layout). No theme CSS. |
| `themes` | `themes` | `@slashsuite/themes`: every theme, one CSS file each, shipped as-is: `catppuccin-mocha.css` (dark; scope `.dark`), `catppuccin-latte.css` (light; scope `.latte`), `thrifty-paper.css` (light; scope `.thrifty-paper`), `thriftloop.css` (light; scope `.thriftloop`), `thriftloop-dark.css` (dark; scope `.thriftloop-dark`), `slash-suite.css` (light; scope `.slash-suite`) and `slash-suite-dark.css` (dark; scope `.slash-suite-dark`), each with its generated `<id>.native.json` beside it. |
| `oxlint-testing` | `packages/oxlint-testing` | `@slashsuite/oxlint-testing`: the shared oxlint config (`.oxlintrc.json`, overrides by glob) and plugin (`plugin.js`, plain ESM loaded through `jsPlugins`) for UI tests. Peers: oxlint, eslint-plugin-playwright and eslint-plugin-testing-library at exact versions. Its `test` runs the fixtures; `ui-react`'s, `storybook`'s and `docs`'s `lint` enforce it through each project's `.oxlintrc.json`, and `bun run lint:testing` reports the counts for the projects that do not yet. |
| `oxlint-ui` | `packages/oxlint-ui` | `@slashsuite/oxlint-ui`: the oxlint config (`.oxlintrc.json`) and plugin (`plugin.js`, rules `uislash/*`) that hold an app to building its UI from `@slashsuite/ui-react`: the hard rules of `ui-review`'s layer 1 (all but `new-css`), on every file an app lints. Its `scripts/data.ts` writes `ui-react.json` (ui-react's exports and palette, through `tools/ui-review`'s own code) before its tests, its pack check and `prepack`; never committed. Its parity test runs `tools/ui-review/test/cases.ts` through both and asserts the same verdict. Peer: oxlint. |
| `core` | `packages/core` | `@slashsuite/core`: what the renderers share, pure TypeScript with no runtime dependencies: each component's token tables and prop types (`src/button.ts`), story fixtures (`src/fixtures/`, a story as data under the story id both renderers use), the parity manifest (`parity.json`, written by its `parity` script from the tables; its test fails on a stale copy) and the native theme generator (`src/themeNative.ts`). Its `development` and `bun` export conditions point at `src`, so tsc, Vitest and Storybook read the source with no build; ui-react's build reads its `dist` and vendors it, so core is private and not in `nx release`; ui-react's devDependency names it by its version on disk (`0.0.0`), never `workspace:*`, which Nx's npm publish refuses (`themes-shared`'s `releaseManifests.test.ts`). Its lint holds the tables to `palette.json`, and a ui-react component that imports core may not write a colour or spacing utility of its own (`scripts/slopRules.ts`). |
| `ui-react-native` | `packages/ui-react-native` | `@slashsuite/ui-react-native`: the components for React Native, built natively (no react-native-web) from core's tables and each theme's `<id>.native.json`. `src/theme/` resolves a table's class string to styles per slot (idle, pressed, focused, disabled) and throws on a class it cannot place; `src/foundation/` holds what every component stands on (text inheritance, layout, links, overlays, icons, accessibility, events, hit areas); `src/components/` the components, Button first. Its tests run under jsdom with `react-native` aliased to `test/react-native.tsx`. Its lint adds `scripts/native-lint.ts` (bare text in a View, a class that does not resolve in every theme, a colour literal, `StyleSheet.create`), each rule proved by `scripts/fixtures/bad.tsx`. Peers: react and react-native. Private for now; not in `nx release`. |
| `storybook` | `apps/storybook` | Storybook for the components; a toolbar switcher lists every theme CSS file in `themes/`. Its `e2e/` is the Playwright layer (`test:e2e`). Private. |
| `themes-shared` | `packages/themes-shared` | `@slashsuite/themes-shared`: how Storybook and the docs find themes (the `themes/*.css` glob, the theme ids and each theme's scope class). Private; not in `nx release`. |
| `docs` | `tools/docs` | `@slashsuite/docs`: the component docs' tooling. Its `props` task writes `packages/ui-react/docs/props.json` and `types.json` from ui-react's source (committed; CI fails on a stale copy), its `scripts/agent-docs.ts` renders the docs `@slashsuite/ui-react` ships (`packages/ui-react/agent-docs/`, built by ui-react's `agent-docs` task and `prepack`, never committed), and its `llms` task writes `dist/llms.txt`, the whole reference in one file (the `ui-review.yml` `build-rubric`). Its tests hold the docs data to its rules (every export on one page, a Do and Don't per lead pair, the usage-rule wording). The docs site (hack-cove.com/ui/) is built outside this repo from `packages/ui-react/docs`, whose `ui.ts` holds the getting started words. Dev tooling; private; not in `nx release`. |
| `ui-review` | `tools/ui-review` | `@slashsuite/ui-review`: the engine behind the `ui-review.yml` reusable workflow (consumer pull requests are checked for building their UI the UISlash way: a deterministic layer, then an advisory model layer). Dev tooling; private; not in `nx release`. |
| `codemod` | `tools/codemod` | `@slashsuite/codemod`: the 0.10 to 0.11 codemod (`packages/ui-react/MIGRATING.md`, "Running the codemod"). It parses with `typescript` (pinned exact), edits JSX attributes by text range on elements imported from `@hackcove/ui-react`, and prints a `file:line` for each by-hand row; one fixture under `test/fixtures` per row. Dev tooling; private; not in `nx release`. |
| `theme-builder` | `tools/theme-builder` | `@slashsuite/theme-builder`: makes a brand theme from a spec (`specs/<brand>.json`: a base theme in `themes/` plus an accent of six colours) with `bun tools/theme-builder/src/cli.ts <spec.json>`. It rewrites only the accent and the id, scope and header, runs the contrast, distinction, coverage and selection contracts from `themes-shared`, and writes `themes/<id>.css` only when all pass; it reports the accent's OKLab distance from the status colours as a warning. `themes/README.md`, "Make a brand theme", has the spec. Dev tooling; private; not in `nx release`. |
| `scripts` | `scripts` | The repo's own scripts: `check-slop.ts` and its rules `slopRules.ts` (every project's `lint` runs it), `releasePick.ts` (the publish workflow's Pick step), `testing-lint-report.ts` (`bun run lint:testing`) and `release-version-actions.cjs` (the `nx release` hook in `nx.json`). Its `typecheck` and `lint` run them through tsc and oxlint, and its `lint` runs the slop check from the repo root, so it scans `scripts/`, the root `docs/` and the root `*.md` (`slopRules.ts` excluded: it holds its own patterns). Their tests are in `themes-shared`. Not a workspace; private; not in `nx release`. |

**One package, one CSS file per theme.** Adding a theme is adding a file (`README.md`, "How to add a
theme"); nothing else registers it: the package's `exports` and `files` are globs. A theme's id is its
file name without `.css` (`catppuccin-latte`); it names the switcher entry and the visual shots, so an
id never changes once it has baselines. **Each theme names its own scope class**: the class of the
first top-level `.<class> { … }` rule in its CSS file (Mocha's is `.dark`, Latte's `.latte`,
thrifty-paper's `.thrifty-paper`, Thriftloop Dark's `.thriftloop-dark`). Storybook and the e2e read
it from there. With no theme the components render in Tailwind's own default colours, a plain light
look; that is only what a theme remaps, not a look the repo designs or checks, so Storybook, its
Overview and the visual matrix list `themes/*.css` and nothing else.

**React Native is `packages/ui-react-native`, built natively rather than through react-native-web.** The two renderers stay in step through core: a value both draw lives in core's tables, never in one renderer's file, and the parity manifest (`packages/core/parity.json`) is the native test oracle for sizes. A component in the manifest has a twin on each side; a pull request that changes one twin changes the other too, or carries a `Parity: follow-up <ref>` line in its body (`scripts/parityLine.ts`, the `Parity` workflow, which reruns when the body is edited and exits 8 naming the component). A new native component adds itself to the manifest. Its gallery, device lanes and visual upload come later.

## The gate

Everything runs through moon 2.6.5 (Bun, strict tsconfig, oxlint + oxfmt, Vitest). Tasks are
declared in `.moon/workspace.yml`, `.moon/tasks/all.yml` and each project's `moon.yml`, and each
runs the `package.json` script of its name. moon hashes no dependency's files on its own, so a task
that reads another project lists that project's files in its inputs; a new cross-project read adds
one there. A change is green when
all of these pass **from the checkout**:

```bash
bun install                                        # a fresh checkout has no node_modules
bunx moon run --concurrency 3 :typecheck :lint :test :build   # tsc strict · oxlint --type-aware --deny-warnings + check-slop · Vitest · dist + Storybook build
bun run format:check                               # oxfmt --check  (`bun run format` fixes)
bunx moon run --concurrency 3 :pack-check        # npm pack --dry-run for every package; ui-react also typechecks its tarball in a consumer app
bunx moon run storybook:e2e                      # Playwright (Chromium): builds Storybook, serves it on a free loopback port, flips every theme
```

An unchanged project is a cache hit; `--force` on `moon run` forces a rerun. Lint rules are
all errors; fix the code, do not disable a rule. Stop a process by the pid you started or by its port. Never `pkill -f` or `killall` a word such as storybook, moon, bun or vite: a shared machine can be running someone else's capture or upload. A change to a component or a theme's CSS file also gets
a look: `bunx moon run storybook:storybook`, flip the theme switcher, and read the stories. Every component exported from `packages/ui-react/src/index.ts` has its own story and appears in `apps/storybook/src/Gallery.tsx`. A new component adds both in the same change. **A story's title is `<Section>/<Page name>`, taken from the docs' `componentSections` (`packages/ui-react/docs/components/`), never written from memory:** add the component to a page there first, then give its story file that page's section and name. The Storybook sidebar is built from the same list, in the site's rail order (`apps/storybook/scripts/visual-plan.ts`, `sidebarOrder`), so there is no sort list to edit; `visual-plan.test.ts` fails on a title that is not the site's, or a story file no page names. **Overview / All themes** is the one-page check of every component in every theme.

**Nothing is time dependent.** Jacobus, 2026-11-14: "The architecture of the test is wrong if it relies on timings for displaying it. We should be able to pass it in a value and then render that. It should not be time dependent. The component itself should not be time dependent." A component renders from the value it is given, and a test passes that value and asserts what renders. No fake timers, no waiting on a delay, no story driven by a timer, no `waitForTimeout` in an e2e spec. A visual delay, a fade or a label that reverts is CSS (an animation and its delay), as `CopyButton` and `NavigationProgress` do; a pending state is a value the story holds (a promise that never settles, or a button that lands it). The lint (`scripts/slopRules.ts`) fails a test, story or e2e file that uses a fake or real timer, and a `@slashsuite/ui-react` component that calls `setTimeout` or `setInterval`; a line with `// time-dependent: <why>` on it or above it is exempt, and needs a reason a reviewer accepts.

The e2e runs every spec in Chromium and nothing else (`apps/storybook/playwright.config.ts`; Jacobus, 2026-11-15: "We only test on Chrome. Nothing else."). It needs Chromium once per machine: `bunx playwright install chromium` (on Linux, `--with-deps` in CI). Each app's `playwright.config.test.ts` fails on a project in any other engine; a phone project keeps its phone device and sets `browserName: "chromium"` beside it. A spec that cannot pass in Chromium is fixed, not skipped. It discovers themes
from `themes/*.css` like the switcher does and asserts each one under the scope class its CSS file
names, so a new theme needs no test edit.

**The visual check** (PixelSlash, `CONTRIBUTING.md`, "The visual check") is split into one group
per section of the site's component docs, read from `componentSections`: one `.pixelslash/<section>/` folder
and one PixelSlash subproject `<section>` each, under the one project `uislash`, plus Overview,
which a local compare always captures and a pull request's upload only when the change reaches it
(one of its stories, or any theme). Every story is shot in the reference theme, the first theme file
in sorted order (`themeFiles`), read from `themes/`, never named in code. Every other theme is shot
in **Overview / Gallery sections** only, which must render every component `index.ts` exports
(`visual-shots.test.ts`), so a theme added costs one Gallery, not every story. A theme whose file
sorts first becomes the reference and moves the full set to it. `bunx moon run storybook:visual` captures only the
stories and themes the change reaches against the merge-base, and its report says what it picked
and why. `bunx moon run storybook:visual -- --all` (or `VISUAL_ALL=1 bunx moon run storybook:visual`)
captures everything. A gate run is `--all`. Every story file is
named by a docs page (`pairs`, `fullPage` or `stories`); the storybook tests fail on one that is not.

**A full run splits into one run per group.** `-- --all --plan-only` writes the plan and builds the
base (no browser); `-- --all --group <slug>` (repeatable) runs those groups of the saved plan, one
browser run each; `-- --summary-only` totals them and fails naming any group with no result. A group
run takes the plan's own `--all` and `--upload`, and refuses a missing plan, a plan made with other
flags, a `HEAD` that moved since the plan, and an unknown slug. A bare `--run` still does all three in one process
(`CONTRIBUTING.md`, "The visual check").

**CI uploads, and the server renders.** `.github/workflows/visual.yml` runs `storybook:visual-upload` on every
pull request's head commit and on every push to `main`, against the maintainers' PixelSlash server
(its address is the `PIXELSLASH_SERVER` secret). The upload sends the Storybook build
(`pixelslash upload --bundle`) and the server renders each group into one subproject of `uislash`
per section, so the runner installs no browser. A render takes one set of stories in one set of
themes, so Overview is two subprojects: `overview` (its stories in the reference theme) and
`overview-themes` (the Gallery sections in every other theme). It posts one GitHub status for the whole project (`PixelSlash / uislash`) on the head
commit; each section's build is read on the server.
A local `storybook:visual` is the contributor's own check and needs no server. A manual
`visual-upload` to that server (with `PIXELSLASH_SERVER` and `PIXELSLASH_TOKEN`) is only for re-seeding `main`, and never mixes a local capture into a
pull request's build.

**An upload sends every group at once; the local compare runs them one at a time.**
`scripts/visual.ts --run` plans, runs each group and totals them in one process. A server-rendered
upload sends every group at once and the server takes them in turn. `visual` stays serial, since it
builds and captures the base under the baseline lock. `VISUAL_RENDER=client` is the fallback upload:
it captures here (Chromium from the PixelSlash checkout's `packages/engine`), Overview whole to
`overview`, `VISUAL_PARALLEL` groups at once (default 1), each with
`max(1, min(10, floor(cpus / VISUAL_PARALLEL)))` capture workers, so never set `VISUAL_PARALLEL`
above the CPUs. The server reads the two renders as different environments and refuses a branch
build against `main` baselines made the other way, so a switch either way starts with a `main`
re-seed made the new way. `CONTRIBUTING.md`, "The visual check", has the rest.

**A shot may not pass PixelSlash's 24.5 Mpx limit** (19140px tall at 1280 wide; PS-323 ends a build
at errored on one). The two one-page Overviews, **Gallery** and **All themes**, are for people and are not
shot: the run shoots them in slices instead, one story per entry of `gallerySections`
(`apps/storybook/src/Gallery.tsx`) in **Overview / Gallery sections** and **Overview / All themes
sections**, and `visualSkipped` (`scripts/visual-shots.ts`) lists the two skipped pages. A new
Gallery block goes in a `gallerySections` entry and gets a story in both files (a test fails
otherwise). The run fails, naming the shot, on one over the limit and warns at 75% of it: split
that section.

## Browser support

UISlash supports the web platform as of the Baseline digest of August 2026
(<https://web.dev/blog/baseline-digest-aug-2026>, Jacobus, 2026-10-28). Anything Baseline newly
available by August 2026 may be used. Anything newer goes in only as feature-detected progressive
enhancement, with a working fallback. The `browserslist` in the root `package.json` is the
declared floor (Chrome and Edge 131, Firefox 143, Safari and iOS 18.4); it is declarative, since
nothing in the toolchain reads it (Tailwind v4 and Vite hard-code their own targets). The e2e runs in
Chromium only, so the rest of the floor is declared, not tested. Use of a feature that raises the floor (check
[web.dev/baseline](https://web.dev/baseline) or MDN) raises the `browserslist` in the same
change, and says so in the README's "Browser support". The visual check is Chromium-only.

When you build or change a component, follow Chrome's Modern Web Guidance within this floor:
`docs/research/chrome-modern-web-guidance.md` maps each guide to the library, met or a ticketed gap.

## Commits: conventional, because nx reads them

Every commit is `<type>(<scope>): <subject>`, as in `fix(ui-react): keep the Pill label on one line`:
branch commits and the squash commit on `main` alike. The squash commit on `main` is the one
`nx release` reads, so its subject keeps this form.

The type is honest because it drives the version bump:

- While a package is `0.x`, Nx shifts each bump one step down: `feat`, `fix` and `perf` → patch. A `!`
  after the type, or a `BREAKING CHANGE:` footer → minor. Nothing reaches `1.0.0` by a commit; that
  is a decision for later.
- `docs`, `test`, `chore`, `refactor`, `build` and `ci` release nothing.

Before 1.0, an API rename or removal is a plain breaking change: a `!` commit, with the mechanical
swap in the package's `MIGRATING.md`. Consumers migrate in their bump, so the old name goes in the
same change, since an alias would leave two ways to do one thing.

Versions come only from this bump: `publish.yml` takes no version input and nothing bumps by hand.

Which packages a commit bumps is decided by the files it touches, not by its scope. A `feat(ui-react)`
that touches only `packages/ui-react` bumps `@slashsuite/ui-react`, and nothing else.

## Landing: through a pull request

uislash lands through pull requests (Jacobus, 2026-10-27). Who opens and who merges is the
global rule; what is particular to uislash:

- **Shots before the merge.** The `Visual` workflow uploads the PR's head commit: each
  group the change reaches (Overview included, when the change reaches one of its stories or any theme), whole, each to its own subproject of `uislash` (`uislash/<section>`), and the server diffs it
  against the `main` build that subproject already holds. The server posts one GitHub status for the
  project, `PixelSlash / uislash`, on the head; the architect reads it, and opens the report for any
  section that changed. A group the change does not reach is skipped, named in the job's log, and has
  no build on the head; the status counts only the groups that have one, and a PR that reaches no group gets no status. A PR
  behind origin/main's tip needs no rebase for it: the server diffs it against the `main` build at its
  merge-base (or the nearest ancestor that has one), so it shows only the PR's own changes. A
  subproject that holds `main` builds but none at the merge-base or an ancestor fails the job, named;
  one that holds no `main` build at all is new, and its build reads every shot as new until the merge
  sets its baseline. Nobody uploads a PR by hand.
- **Shots after the merge.** The `Visual` run on the push to `main` uploads the merge
  commit as `main`, every group, which the server takes as the baseline for the next branch. Nobody uploads it
  by hand. A release commit that `publish.yml` pushes needs no upload of its own: the server picks
  its parent's build. That release push starts no `Visual` run, so a release dispatched while the
  merge's `Visual` run is still going moves `main` past it, and the run fails with "on origin/main,
  behind its tip" and uploads nothing. Dispatch a release only once the merge commit's `Visual` run is green. If it went
  red that way, re-seed `main` by hand: `visual-upload` (with `PIXELSLASH_TOKEN`) on a checkout at
  origin/main's tip.
- **The squash subject stays conventional** (`gh pr merge <pr> --squash --subject "…"`),
  because `nx release` reads it.
- **No branch protection.** `publish.yml` pushes its release commit straight to `main`, so
  nothing on GitHub blocks a merge and the architect enforces the rule: no merge while CI or a
  `uislash` subproject build for the head is failing, pending or holds unreviewed changes, unless the PR changes nothing a shot can see and
  says so.
- No commit, PR title or PR body carries a `Co-Authored-By` or any other AI attribution line.

## Repo invariants

1. **`@slashsuite/ui-react` carries no theme.** Components are written against stock Tailwind utilities
   (`bg-white`, `text-slate-900`, …) and never contain a `dark:` variant or a palette colour. A
   theme is the only place a palette lives, and it remaps those utilities under its own scope
   class (`.dark` for Mocha). Components use only the colour utilities in
   `packages/ui-react/palette.json` (the lint, `scripts/slopRules.ts`). A new colour utility in a component is a
   palette change: add it to `palette.json` and remap it in every theme in the same commit.
2. **A theme is a file and nothing else registers it.** No theme name appears in code: Storybook
   globs `themes/*.css`, and `themes/themes.test.ts` is the contract for every CSS file there (name
   `@slashsuite/themes`, wildcard exports and `files` that list no theme, rules scoped under each
   file's own scope class, no Tailwind import, remaps every palette utility, clears the WCAG AA contrast contract in `packages/themes-shared/src/contrastRules.ts` and the distinction contract in `packages/themes-shared/src/distinction.ts` (colours a page must tell apart, by OKLab distance); a dark theme also declares `@custom-variant dark`).
   The scope class is read from the CSS file, never listed. Do not add a theme list anywhere.
   Beside each CSS file sits its generated `<id>.native.json` (`themes:theme-native`, run by
   hand, from `packages/core/src/themeNative.ts`); the same test fails on a stale one
   or one that leaves a palette utility out. It is never edited by hand.
3. **Packages stay (nearly) dependency-free at runtime.** `@slashsuite/ui-react` has two approved runtime
   dependencies: `react-aria-components`, for the date picker (with `@internationalized/date`, whose
   `CalendarDate` is the picker's value type and which RAC already brings in), and `@dagrejs/dagre`,
   which lays out `FlowDiagram`; its peers are react,
   react-dom and tailwindcss v4. `@slashsuite/themes` has only the tailwindcss peer.
   `@slashsuite/core` has no dependency at all; ui-react takes it as a devDependency and its build
   vendors core's `dist` into `dist/core/` (`packages/ui-react/scripts/vendor-core.ts`), so a web app
   never installs it. Any other dependency is a human decision.
4. **`packages/ui-react` source imports use `.js` specifiers** (`./Card.js`, resolved to `Card.tsx`). A
   `.tsx` specifier is emitted into the `.d.ts` unchanged and points at a file `dist` does not
   have, which silently breaks consumers' types.
5. **No styling escape hatch.** No component exported from `packages/ui-react/src/index.ts` accepts
   `className` or `style`, as an own prop or through the HTML/ARIA props it spreads (those are typed
   `Unstyled<…>` from `props.ts`; `data-*`, `aria-*` and event props still pass). A need for a
   different look is a prop or a variant on the component, the one right way, or no. A class
   inside `packages/ui-react` is internal. `ContainerFrame` and `PageHeaderContent` take a
   `className` for the library's own layouts and are not exported from `index.ts`.
   `noStyling.test.tsx` fails if a public component's props accept either.
6. **Releases go only through the Action, and stay pre-release.** `.github/workflows/publish.yml`
   (which runs `nx release`) is the only way a package reaches npm: nothing is published from a
   laptop, a first publish included. Never run `nx release publish`, a bare `npm publish` or
   `npm login`. Jacobus or the uislash architect dispatches it whenever a release is needed, with no
   sign-off; the `npm-publish` environment has no approval step and accepts runs from `main` only.
   Every release is a pre-release: versions stay `0.x`, and moving a package to `1.0.0` is
   Jacobus's decision. A new package's first version is staged by the workflow's `NPM_TOKEN` step
   (`npm stage publish`, `docs/releasing.md`, "First publish of a new package"), and Jacobus
   approves it with 2FA on npmjs.com, then adds its trusted publisher. Never run `npm stage
   publish` by hand either; Jacobus manages that secret.
7. **Changes reach `main` only through a merged PR.** Nobody pushes to `main` directly; the
   release workflow's release commit is the one exception. Every package is MIT (a `LICENSE` in
   each package and at the root).
