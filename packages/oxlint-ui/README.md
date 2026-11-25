# @slashsuite/oxlint-ui

An [oxlint](https://oxc.rs/docs/guide/usage/linter.html) config and plugin for apps built on
[`@slashsuite/ui-react`](../ui-react). It holds an app to building its UI the UISlash way: compose
the library's parts, configured through props, and write no styling of your own. Every message says
what to use instead.

These are the hard rules of the `ui-review` pull request check (`tools/ui-review`, its layer 1), run
on every file an app lints, so an agent or a person hears about them in the editor, before a pull
request exists. A parity test in this package runs the check's own cases through both and asserts
the same verdict, line for line and word for word.

Status: `0.x`. License: MIT.

## Install

```sh
bun add -d -E @slashsuite/oxlint-ui oxlint@1.94.0
```

The oxlint peer is an exact version: oxlint's `jsPlugins`, which loads this package's plugin, is
alpha and not under semver, so the two move together, in a release of this package.

## Use

Extend the config from the app's `.oxlintrc.json`. `extends` takes a path, relative to the file:

```json
{
  "extends": ["./node_modules/@slashsuite/oxlint-ui/.oxlintrc.json"]
}
```

Every rule is on, as an error, for every file oxlint lints. Test files (`*.test.*`, `*.spec.*`) and
`.d.ts` files are outside it: a test may render raw markup to drive a part, and
`@slashsuite/oxlint-testing` is the lint for tests.

## The rules

| Rule | Fails | Use instead |
| --- | --- | --- |
| `uislash/style-block` | A `<style>` element in JSX. | Compose `@slashsuite/ui-react` parts; ask uislash for what is missing. |
| `uislash/raw-colour` | A stock Tailwind colour utility (`bg-slate-800`, `hover:text-violet-700`) or an arbitrary colour (`bg-[#1e1e2e]`) in any string or template literal. The message names the palette role the utility has. | The part that carries the colour. |
| `uislash/dark-variant` | A `dark:` variant in any string. | Nothing: a theme decides light or dark. |
| `uislash/styling-prop` | `className`, `class` or `style` on a component imported from `@slashsuite/ui-react`, under its own name or an alias. | The part's props, or a variant asked of uislash. |
| `uislash/duplicate-component` | A local component (a function, a class, an arrow, `memo(…)` or `forwardRef(…)`) named like a `@slashsuite/ui-react` export and not imported from it, or a file named after one. | The UISlash one, or another name. |
| `uislash/inline-colour` | A colour literal (hex, a colour function such as `rgb()` or `oklch()`, or a CSS named colour) in a JSX `style` value. | The part, or its `tone`, that carries the colour. |
| `uislash/raw-element` | A raw `<button>`, `<input>`, `<select>`, `<textarea>` or `<dialog>` in a `.tsx` or `.jsx` file. An `<input>` is told apart by its `type`; `type="hidden"` and `<img>` pass. | The part the message names: `Button`, `Input`, `Checkbox`, `Slider`, `Select`, `Textarea`, `Dialog` and the rest. |

A colour word in prose, in a plain string or in a comment is not a colour literal and passes.

**New stylesheets stay a `ui-review` check.** A linter sees one file's code, not that a pull request
adds a `.css` file, so `new-css` is not here.

## Where the component list comes from

The plugin reads `ui-react.json`, which ships with it: the components `@slashsuite/ui-react` exports
(from its `src/index.ts`), its palette (`palette.json`, the role of each colour utility) and the
fixed colour and element tables. It is written from the uislash source when the package is packed,
through the same code `ui-review` uses, so the two can never list different things. A release of
this package carries the list of the commit it was released from; an app on an older or newer
`@slashsuite/ui-react` gets that list, so keep the two on the same release.

## In this repo

`bunx moon run oxlint-ui:test` runs two suites. `test/fixtures.test.ts` lints `fixtures/`: one bad
and one good file per rule, each reported line of a bad file marked `// expect: <rule>` (on the line,
or on its own on the line below), and fails on a miss, on anything unmarked and on any report from
a good file. `test/parity.test.ts` runs `tools/ui-review/test/cases.ts` through layer 1 and through
oxlint. A rule changed in one changes in the other, and a new case goes in `cases.ts`.

`bun packages/oxlint-ui/scripts/data.ts` writes `ui-react.json`; the test, the pack check and
`prepack` run it, and the file is not committed.
