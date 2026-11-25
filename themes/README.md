# @slashsuite/themes

The UISlash themes, all in one package. Each theme is one CSS file with its own scope class, and
each remaps the Tailwind slate/colour utilities that `@slashsuite/ui-react` is written against to its
own colours. Each also ships a `.link` class.

Beside each CSS file is `<id>.native.json`, the same theme for the native renderer: every palette
utility mapped to its colours, the pressed, focused, placeholder and scrim slots, the heading face and
any colour a heading takes, and the status bar style per scheme. It is generated from the CSS file (`bunx moon run themes:theme-native`) and never
edited by hand; `themes.test.ts` fails on a stale one. Import it as
`@slashsuite/themes/<id>.native.json`.

| Theme | File | Scope | |
| --- | --- | --- | --- |
| Catppuccin Mocha | `catppuccin-mocha.css` | `.dark` | dark; also declares the class-based `dark` variant |
| Catppuccin Latte | `catppuccin-latte.css` | `.latte` | light |
| Thrifty Paper | `thrifty-paper.css` | `.thrifty-paper` | light: cream paper, ink text, clay accent |
| Thriftloop | `thriftloop.css` | `.thriftloop` | light: butter paper, brown ink, clay accent |
| Thriftloop Dark | `thriftloop-dark.css` | `.thriftloop-dark` | dark: deep teal night, lit-window clay; declares the `dark` variant on its own scope |
| Slash suite | `slash-suite.css` | `.slash-suite` | light: Slash Day, a cool blue-grey canvas, navy ink, peach accent |
| Slash suite dark | `slash-suite-dark.css` | `.slash-suite-dark` | dark: Slash Night, a deep navy ground, peach pastel accent; declares the `dark` variant on its own scope |

Status: `0.x`. License: MIT.

## Install

```sh
bun add @slashsuite/themes
# peer: tailwindcss ^4
```

## Use

In your global stylesheet, after Tailwind, import the theme's file:

```css
@import "tailwindcss";
@import "@slashsuite/themes/catppuccin-mocha.css";
```

and put its scope class on `<html>` (`class="dark"` here). Import one theme, or several and switch
the class on `<html>`; the scopes do not overlap. The rules are unlayered, so they override
Tailwind's layered utilities.

The scope paints the canvas, so the cards lift off it and the app needs no page-background rule of
its own. The theme also sets the page font from `--font-sans` and the mono stack from `--font-mono`
(which starts at `ui-monospace`), so an app ships no page-background or font CSS: `AppShell` paints
the canvas (`bg-gray-50`, which the theme remaps) and sets `font-sans` and the ink.

Each theme chooses its own type faces. Most use Inter, then the system stack; Thriftloop uses DM
Sans, with DM Serif Display for headings through `--font-heading`. A theme ships no font file, so a
face shows only where the app loads it or the machine has it; Thriftloop's two come from Google
Fonts. A Slash theme names Inter, headings included, and JetBrains Mono next after `ui-monospace`
in its mono stack; the site that installs it loads those font files itself, as for every theme.

## How to add a theme

Add one CSS file here, `<id>.css`, and generate its `<id>.native.json` beside it. Its file name is the theme's id, and the id never changes once it
has baselines. Nothing else registers it: the package's exports and `files` are globs, and Storybook,
the docs and the e2e all read this folder. `themes.test.ts` is the contract, and it reads every CSS
file here. Run it with `bunx moon run themes:test`. The repo's
[README](https://github.com/slashsuite/uislash#how-to-add-a-theme) has the steps.

`bg-white/95` is the app header's ground: map it to your card colour, or to your canvas if the
header sits on the page ground.

## Make a brand theme

A brand theme is an existing theme with its accent swapped. The one way to make one is a spec and
the theme builder, never a copied CSS file edited by hand. Write a spec in
`tools/theme-builder/specs/` that names a base theme in this folder and the accent's six colours:

| Field | What it paints |
| --- | --- |
| `fill` | the primary button, the selected tab and chip, the selection highlight |
| `fillHover` | the primary button under the pointer |
| `label` | the text on the fill |
| `text` | the accent text and inline links (`--hc-accent`) |
| `textHover` | that text under the pointer |
| `edge` | the accent border, the checkbox, the focus ring |

`name` names the hue in the generated comments. Then run:

```sh
bun tools/theme-builder/src/cli.ts tools/theme-builder/specs/<brand>.json
```

It rewrites only the accent and the theme's id, scope and header, measures the result against the
same contrast, distinction, coverage and selection contracts as `themes.test.ts`, and writes
`themes/<id>.css` only when every theme in the spec passes; otherwise it names each failure and
writes nothing. It also reports how close the accent sits to the status colours (info, positive,
warn, danger): an accent under 0.09 in OKLab from a status text, or under 0.12 from a status fill,
reads as that status, so pick another tone. `theme-builder:test` fails when a committed file is not
what its spec builds.

Do: start from the base whose canvas and ink you want, and let the builder find the failing pair,
then deepen or lift that one colour.

Don't: copy a theme file and change its accent by hand. Nothing measures it until the suite runs,
and the next change to the base never reaches it.

## Colours for chrome the kit cannot draw

Some third-party DOM is not made of `@slashsuite/ui-react` parts, so it cannot take a utility: a
MapLibre popup or control, a map marker. Each theme therefore sets fourteen custom properties on its scope,
each equal to the value that theme's remap gives the utility named beside it:

| Property | Same value as |
| --- | --- |
| `--hc-surface` | `.bg-white` background |
| `--hc-subtle` | `.bg-slate-50` background |
| `--hc-line` | `.border-slate-200` border |
| `--hc-ink` | `.text-slate-900` colour |
| `--hc-mute` | `.text-slate-500` colour |
| `--hc-accent` | `.text-violet-600` colour |
| `--hc-cat-1` to `--hc-cat-8` | `.text-indigo-600`, `.text-orange-600`, `.text-teal-600`, `.text-pink-600`, `.text-lime-600`, `.text-fuchsia-600`, `.text-rose-600`, `.text-yellow-600` colour: the categorical scale, so a map pin matches the `Legend` beside it |

Read them in your own CSS, with a fallback for the page that has no theme:

```css
.maplibregl-popup-content {
  background: var(--hc-surface, #fff);
  color: var(--hc-ink, #111);
}
```

With no theme on the page the properties are unset, so the `var()` fallback is yours to choose. The
values are the theme's own, and `themes.test.ts` checks that each equals its utility's, so a palette
edit cannot leave them behind.

The set grows only when two consumers need the same colour for chrome the kit cannot draw: a tone
ink (`--hc-positive`, `--hc-warn`, `--hc-danger`, `--hc-info`) is added, tested and remapped in
every theme then, and not before. A colour only one app needs stays in that app's CSS.

## Palettes and attribution

### Catppuccin Mocha and Latte

The palettes are [Catppuccin](https://github.com/catppuccin/catppuccin) Mocha and Latte, © 2021 Catppuccin, used under the MIT license. The full notice ships in this package as `NOTICE`, and a one-line credit sits at the top of each CSS file. Tailwind's build drops that comment from a consumer's bundled CSS, so an app that wants the credit visible should add its own. This package's own license (MIT, see `LICENSE`) is separate.

Mocha: base `#1e1e2e` · mantle `#181825` · crust `#11111b` · surface0 `#313244` · surface1 `#45475a` ·
surface2 `#585b70` · text `#cdd6f4` · subtext1 `#bac2de` · subtext0 `#a6adc8` · overlay1 `#7f849c` ·
green `#a6e3a1` · red `#f38ba8` · yellow `#f9e2af` · blue `#89b4fa` · mauve `#cba6f7`

Latte: base `#eff1f5` · mantle `#e6e9ef` · crust `#dce0e8` · surface0 `#ccd0da` · text `#4c4f69` ·
subtext1 `#5c5f77` · subtext0 `#6c6f85` · overlay1 `#8c8fa1` · mauve `#8839ef` · red `#d20f39` ·
green `#40a02b` · yellow `#df8e1d` · blue `#1e66f5`

Latte's accents are strong on white, so its cards are white and lift off the base canvas. Where a
token alone misses the WCAG AA contrast contract (text 4.5:1, controls 3:1), `catppuccin-latte.css`
darkens it just enough, and the rule's comment names the token it started from.

### Thrifty Paper

From Thrifty's light theme. Thrifty has no danger colour of its own, so the red utilities map to a
deep wine red that sits clear of the clay (danger `#7a1220`, danger-hover `#5f0e1a`, danger-soft
`#fdf2f4`). The accent is two tones: its fills are the bright clay, and its text (a link, an outline
button's label) is the deeper `accent-ink`, so a page of links reads as text rather than as a block of
the primary button.

canvas `#fdfbf7` · surface `#ffffff` · subtle `#f7f2e9` · line `#ece3d4` · ink `#1c1917` ·
ink-body `#3b342e` · ink-mute `#6b6259` · accent `#c2410c` · accent-hover `#9a3412` ·
accent-ink `#9a3412` · accent-ink-hover `#7c2d12` · accent-soft `#fdf5f0` ·
positive `#047857` / `#ecfdf5` · warn `#b45309` / `#fffbeb` · note `#0f766e` / `#f0fdfa`

### Slash suite and Slash suite dark

The Slash suite pair, built from Catppuccin Latte and Mocha (the credit is the same, see above), with
the suite's peach as the accent. Slash Day is the light ground: canvas `#eef2f9` · card `#ffffff` ·
subtle `#e6e9f1` · deep `#dee1ea` · lines `#d8dbe5`, `#c6c9d5`, `#b4b7c5` · ink `#24273a` (Macchiato's
base) · ink-2 `#3a3d52` · mute `#5b5e74` · faint `#85879c`. Slash Night is the dark one: crust
`#080d1c` · canvas `#0d1326` · card `#19233e` · s0 `#25304d` · s1 `#374463` · s2 `#485574` · ink
`#e2e8fc` · ink-2 `#ccd4ee` · mute `#c6cce2` · faint `#b1b8d0`.

The fills take the Mocha peach pastel `#fab387` in both, with a dark label. On Day the accent text,
edges and focus rings are the deep peach `#a03604`, since a pastel line is under 3:1 on white. The
status tones stay Latte's; the avatar initials are the accent's label, so on Day the avatar fills, the
positive button among them, are Latte's own colours, which the dark label clears. On Night everything is
the pastel, except the accent text (`#fbc5a1`, lifted so it clears AA on the Callout tints), and the status tones are Mocha's.

### Thriftloop

From Thriftloop's brand theme, the shop sign: butter paper and brown ink by day, a deep teal night
where the clay accent glows like a lit window. Both files come from Thrifty's `docs/brand/theme/`
at `df3e8c8`, one per mode, and the dark file is scoped to `.thriftloop-dark` here so it can sit
beside Mocha, which owns `.dark`.

Thriftloop's danger red is a crimson, clear of the clay in OKLab, so the destructive button does not
read as the primary one; its accent text is the same clay a step darker than the fill, so a link
clears 4.5:1 on the cream band while the fill and the focus rings keep the brand `#c2410c`. On the
dark side the accent text is a step lighter than the fill, for the same reason.

light: canvas `#f8f1d8` · surface `#fffaea` · subtle `#f5eac7` · line `#eedca0` · ink `#352d13` ·
accent `#c2410c` · accent-ink `#be3d04` · danger `#b31960` · warn `#ad4d00` · positive `#047857`

dark: canvas `#0c191d` · surface `#102026` · subtle `#18333c` · line `#214450` · ink `#e6edef` ·
accent `#e2622b` · accent-ink `#f37c4c` · danger `#fca5a5` · warn `#fcd34d` · positive `#6ee7b7`
