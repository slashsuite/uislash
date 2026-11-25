# @slashsuite/oxlint-testing

A shared [oxlint](https://oxc.rs/docs/guide/usage/linter.html) config and plugin for UI tests:
Playwright specs, Testing Library and Vitest tests, and Playwright configs. It enforces the parts of
the UI testing rules below that a linter can see, and every message names the rule it enforces by
its number and title (`UI testing rule 7: Behaviour in tests, look in PixelSlash`).

## The UI testing rules

| # | Rule | What it means | Linted |
| --- | --- | --- | --- |
| 1 | Find elements the way a user does | By role and accessible name, never a selector string, a raw locator or a DOM walk (in a test or inside `page.evaluate`). A test id is the fallback for what has no accessible name (a canvas, a chart body), with a comment saying why. The one exception is the app's ready marker, `html[data-hydrated]`. | yes |
| 2 | Wait on a state, never on a clock | No fixed sleeps, no `networkidle`, and timeouts stay at the config's defaults unless a comment names the ticket that needs more. | yes |
| 3 | Every test owns its world | A fresh store per run, and each test creates the data it reads. | no |
| 4 | The network ends at localhost | Every third party is a local stub. | no |
| 5 | Assert what the user sees | The outcome of a step is checked on the page. One `if` in a test is two tests. | yes |
| 6 | One journey per test | A test is one user goal, its stages named with `test.step`. | no |
| 7 | Behaviour in tests, look in PixelSlash | No assertion on a class, a style, a computed style, layout geometry, pixels or a screenshot. The look is the visual check's. The one measurement that stays is no sideways scroll on the phone (`scrollWidth - clientWidth`). | yes |
| 8 | One config shape | `fullyParallel: true`, `retries: 0`, the CI reporter, `reuseExistingServer: false`, `trace: "retain-on-failure"`, Chromium only (the phone project is `devices["iPhone 15"]` on Chromium), and no bare, focused or ticketless skip. | yes |
| 9 | Where it runs | The e2e suite runs in CI on every pull request. | no |

It is about tests only. Lint rules for using `@slashsuite/ui-react` itself are a separate package, and
a repo can extend either without the other.

Status: `0.x`. License: MIT.

## Install

```sh
bun add -d -E @slashsuite/oxlint-testing oxlint@1.94.0 eslint-plugin-playwright@2.12.2 eslint-plugin-testing-library@7.16.2
```

The three peers are exact versions. oxlint's `jsPlugins`, which loads the ESLint plugins and this
package's own, is alpha and not under semver, so the versions move together, in a release of this
package.

## Use

Extend the config from the repo's `.oxlintrc.json`. `extends` takes a path, relative to the file:

```json
{
  "extends": ["./node_modules/@slashsuite/oxlint-testing/.oxlintrc.json"]
}
```

Every rule is scoped by a glob (below), so the config changes nothing outside test files, and the
repo's own plugins, categories and rules stay as they are.

A line that is a real exception (a `setTimeout` inside a stub server, say) says why on the line
above:

```ts
// oxlint-disable-next-line no-restricted-globals -- the stub answers late on purpose, HC-123
setTimeout(reply, 50);
```

## The globs

| Files | What they are | Rules |
| --- | --- | --- |
| `**/*.test.{ts,tsx,js,jsx,mjs}` | DOM and unit tests (Vitest, Testing Library) | Vitest, Testing Library, `ui-testing/no-node-access`, `ui-testing/no-style-assertions`, `ui-testing/testid-needs-reason`, sleeps, style reads |
| `**/*.built.test.{ts,tsx,js,jsx,mjs}` | checks of built output (a loop over parsed `dist/` pages) | as a DOM test, less the two that flag reading HTML as data |
| `**/e2e/**`, `**/smoke/**`, `**/*.spec.{ts,tsx,js,mjs}` | Playwright e2e and smoke specs | Playwright, `ui-testing/no-selector-actions`, `no-node-access`, `no-style-assertions`, `no-adhoc-screenshot`, `no-raised-timeout`, `skip-names-ticket`, `testid-needs-reason`, sleeps, style and geometry reads |
| `**/playwright.config.*`, `**/playwright.*.config.*` | Playwright configs | `ui-testing/config-shape` |

A check that parses built HTML (meta tags, `href`, `id`) reads it as data, not as a user would, so
its file is named `*.built.test.ts`. That glob turns off `vitest/no-conditional-in-test` (a parse
branches) and `ui-testing/no-node-access` (it queries a parsed document). `vitest/require-mock-type-parameters` is off in every test: it flags every
`vi.fn()`.

## The lint rules

The `ui-testing` rules are this package's plugin (`plugin.js`). The rest are oxlint's own or come
from `eslint-plugin-playwright` and `eslint-plugin-testing-library`.

| Rule | Where | Reports | UI testing rule |
| --- | --- | --- | --- |
| `ui-testing/no-selector-actions` | e2e | `page.click('#x')`, `page.fill('.y', v)`, `page.$('a')`: an action or a read that takes a selector string | 1. Find elements the way a user does |
| `playwright/no-raw-locators` | e2e | `page.locator('.card')`; `html[data-hydrated]` is allowed | 1. Find elements the way a user does |
| `playwright/no-wait-for-selector` | e2e | `page.waitForSelector('#ready')` | 1 and 2 |
| `ui-testing/no-node-access` | DOM, e2e | `.parentElement`, `.closest(...)`, `document.querySelector(...)`, `getByRole(...).click()`, in a file that imports Testing Library directly or through a local module that re-exports it (`export { render, screen } from "@testing-library/react"`); and in any file, the same walks inside the callback of `page.evaluate`, `locator.evaluate`, `evaluateAll`, `evaluateHandle`, `$eval` or `$$eval`. Reading `document.activeElement` passes: where focus is, is what a keyboard test asserts | 1. Find elements the way a user does |
| `ui-testing/testid-needs-reason` (warn) | DOM, e2e | `getByTestId(...)` (and its `getAll`, `query`, `find` forms) with no comment earlier in its test, or on the helper that makes the query, saying why the element has no accessible name | 1. Find elements the way a user does |
| `testing-library/no-container` | DOM | `container.querySelector(...)` | 1. Find elements the way a user does |
| `testing-library/prefer-screen-queries` | DOM | `view.getByText(...)` in place of `screen` | 1. Find elements the way a user does |
| `playwright/no-wait-for-timeout` | e2e | `page.waitForTimeout(500)` | 2. Wait on a state, never on a clock |
| `playwright/no-networkidle` | e2e | `waitForLoadState('networkidle')` | 2. Wait on a state, never on a clock |
| `no-restricted-globals` | DOM, e2e | `setTimeout`, `setInterval` (rule 2); `getComputedStyle` (rule 7) | 2 and 7 |
| `no-restricted-properties` | DOM, e2e | `Bun.sleep` (rule 2); `className`, `classList`, `window.getComputedStyle`, and in e2e `boundingBox`, `getBoundingClientRect`, `offsetWidth`, `offsetHeight`, `offsetTop`, `offsetLeft`, `measureText` and `getImageData` (rule 7). `scrollWidth` and `clientWidth` pass: the phone's no-sideways-scroll check reads them | 2 and 7 |
| `ui-testing/no-raised-timeout` | e2e | a `timeout` option on any call (an action, an `expect`, `goto`, `request.get`, `test.use`), and `test.setTimeout(...)`, unless a comment on the line or the line above names a ticket such as `FS-12` | 2. Wait on a state, never on a clock |
| `testing-library/no-wait-for-side-effects` | DOM | a render or an event inside `waitFor` | 2. Wait on a state, never on a clock |
| `vitest/no-conditional-in-test` | DOM | an `if`, ternary or `switch` in a test | 5. Assert what the user sees |
| `playwright/no-conditional-in-test`, `playwright/no-conditional-expect` | e2e | the same, in a spec | 5. Assert what the user sees |
| `ui-testing/no-style-assertions` | DOM, e2e | `toHaveAttribute('class')`, `getAttribute('style')`, `toHaveProperty('className')`, a `className` or `style` key in a `toMatchObject` or `toEqual` object | 7. Behaviour in tests, look in PixelSlash |
| `vitest/no-restricted-matchers`, `playwright/no-restricted-matchers` | DOM, e2e | `toHaveClass`, `toHaveStyle`, `toHaveCSS`, `toHaveScreenshot`, `toMatchScreenshot` | 7. Behaviour in tests, look in PixelSlash |
| `ui-testing/no-adhoc-screenshot` | e2e | `page.screenshot()`, `locator.screenshot()`: any `.screenshot(...)` call. The visual check owns every shot | 7. Behaviour in tests, look in PixelSlash |
| `vitest/no-focused-tests`, `playwright/no-focused-test` | DOM, e2e | `test.only`, `describe.only` | 8. One config shape |
| `vitest/no-disabled-tests`, `playwright/no-skipped-test` | DOM, e2e | a bare skip or fixme (`test.skip('title', fn)`, `test.skip()`); a conditional skip with a reason passes on to the next rule | 8. One config shape |
| `ui-testing/skip-names-ticket` | e2e | `test.skip(cond, reason)`, `test.fixme(...)`, `test.fail(...)` whose reason (or, for `test.fail('title', fn)`, title) names no ticket such as `FS-12` | 8. One config shape |
| `ui-testing/config-shape` | Playwright configs | `retries` other than `0`, `reuseExistingServer` other than `false`, `trace` other than `"retain-on-failure"`, `fullyParallel` other than `true`, a `reporter` other than `process.env.CI ? [["github"], ["html", { open: "never" }]] : "list"`, a `browserName` other than `"chromium"`, a project on a non-Chromium device with no `browserName: "chromium"` after it, a phone project (named phone or mobile, or on a phone device) not on `devices["iPhone 15"]`; and a config with no `trace`, `fullyParallel` or `reporter` (their defaults are `"off"`, `false` and `"dot"` on CI) | 8. One config shape |

`config-shape` reads literal values: `retries: process.env.CI ? 2 : 0` is reported, as it should be.

## What lint cannot see

The rest of the rules need a reviewer or the run itself:

- **Every test owns its world (rule 3):** a fresh, migrated store per run, and each test creating the
  data it reads. Lint cannot tell seeded data from a shared developer database.
- **The network ends at localhost (rule 4):** every third party stubbed. A real request is a runtime
  fact.
- **A test passes alone and in any order.** Only running it that way shows it.
- **One journey per test (rule 6):** whether a test is one user goal, and its `test.step` names.
- **Presence inventories (rule 7):** a test that lists what is on a page and checks each is visible,
  with no action and no outcome. Each line of it is a legal assertion.
- **A class or style inside a string:** `expect(html).toContain('class="sr-only"')` on rendered
  markup is a string match to a linter.
- **Layering:** whether a check belongs in a unit test, an e2e spec or a visual shot.
- **Where it runs (rule 9):** that the e2e suite runs in CI on every pull request.

## In this repo: report first, then enforced

Turning the config on for a project with old violations would fail its `lint` task, so the repo
counts them first. `bun run lint:testing` (`scripts/testing-lint-report.ts` at the root) runs this
config, with its own globs, over each project that does not enforce it yet, prints the count per
project and per rule, and exits 0. It is not part of the gate.

A project switches to enforced once its count is 0:

1. Give the project its own `.oxlintrc.json`, extending the root's config and this one:
   `{ "extends": ["../../.oxlintrc.json", "../../packages/oxlint-testing/.oxlintrc.json"] }`.
2. Point its `lint` script at it: `oxlint -c .oxlintrc.json --type-aware --deny-warnings`.
3. Remove the project from the report's list in `scripts/testing-lint-report.ts`.

## Developing

```sh
bunx moon run oxlint-testing:test         # the fixture suite
bunx moon run oxlint-testing:pack-check   # the tarball's files, and a consumer that installs it
```

`fixtures/bad/` holds planted violations, each line a rule must report ending with
`// expect: <rule>` (or carrying it alone on the line below); `fixtures/good/` holds code no rule may report.
The suite runs the pinned oxlint with this config over both, and fails on a marked line that is not
reported, on anything reported that is not marked, and on a rule the config turns on that no fixture
plants. A new rule adds its bad lines in the same change.
