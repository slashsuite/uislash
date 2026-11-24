## Callout

Group: Feedback

When to use: A message the reader should see in the page, without being made to answer it.

### Use instead
- Card (card.md): A block of content has a status: a `Card` with `tone`.
- EmptyState (empty-state.md): There is nothing here yet, and the message offers the first step.
- Status pages (status-pages.md): The whole route cannot show: not found, failed, offline, down or not allowed.

### The one right way
The tone matches how much the message matters: `warn` for a thing to check before going on.
```tsx
import { Callout, Stack } from "@slashsuite/ui-react";

<Stack gap="sm">
  <Callout tone="info">The import runs overnight.</Callout>
  <Callout tone="warn" title="3 uncategorised.">
    Sort them before the month closes.
  </Callout>
</Stack>
```

### Do
- Pick the `tone` by how much the message matters: `neutral` (the default) for a note, `info` for something worth knowing, `positive` for a result, `warn` for a thing to check before going on, `danger` for a failure or something that cannot be undone. Keep `danger` for the real failure.
- Add a `title` for a short bold lead-in; the body carries the detail.
- Put the one action in `actions`, at the end of the row: a `Button size="sm"` or a `TextLink stretch`, which makes the whole callout the click target.
- `banner` is the flat strip at the top of a `Card flush`; do not use it anywhere else. In a page's column (a `FullBleedLayout`, padded or not) the notice is a plain Callout, first in the column's `Stack`.
- A section that failed to load is a `Callout tone="danger"` with a `title` that says what failed and one `Button` in `actions` that tries again. A whole page that failed is an `ErrorPage`.
- A block of content that has a status is a `Card` with `tone`; a Callout is the message.
- A short confirmation that should not move the page ("Saved", "Copied") is a `Toast`. A message that must be answered before the reader goes on is a `Dialog`; a field's own error is the `error` of its `Field`; a submit's failure in a `Dialog` or `FormLayout` is its `error`.
- `align="center"` centres the title and body, for a success that stands alone; with `actions` only the text is centred. `start` is the default.

### Don't
`danger` on a plain note cries wolf: when everything is red, a real failure no longer stands out.
```tsx
import { Callout, Stack } from "@slashsuite/ui-react";

<Stack gap="sm">
  <Callout tone="danger">The import runs overnight.</Callout>
  <Callout tone="danger" title="3 uncategorised.">
    Sort them before the month closes.
  </Callout>
</Stack>
```

A button inside the body drops under the text and leaves the row without its action.
```tsx
import { Button, Callout } from "@slashsuite/ui-react";

<Callout tone="warn" title="Import failed.">
  The last file did not finish. <Button size="sm">Retry</Button>
</Callout>
```

A whole error page inside one section takes over the screen for a part that failed.
```tsx
import { ErrorPage, Section } from "@slashsuite/ui-react";

<Section title="Recent builds">
  <ErrorPage />
</Section>
```

### Accessibility
- `danger` is `role="alert"` and `warn` is `role="status"`, so a screen reader announces them when they appear; the other tones have no role. The tone is also colour and text, so say what happened in the words.
- A `title` is a bold paragraph, not a heading, so it adds nothing to the heading outline.
- Buttons and links in `actions` keep their own focus ring and keyboard behaviour.

### Props
### Callout
A tinted notice box, with an optional bold title above its body. Its text is text-sm (text-base/7 inside a `Prose`, boxed or `banner`). `actions` puts a button or link at the end of the row; `banner` makes it a flat strip (bottom border only, no radius) for the top of a `Card flush` and nowhere else: a padded card or a padded `FullBleedLayout` column would inset it. `align="center"` centres the text. In a page's column the notice is a plain Callout, first in the column's `Stack`. With `actions` the box is `relative`, so a `TextLink stretch` there makes the whole callout its click target, like a link in a table row. `icon` sets one of the library's icons at the start of the box, in the tone's ink. `danger` is `role="alert"` and `warn` is `role="status"`, so a screen reader announces them when they appear; the other tones have no role.
- actions: ReactNode. A button or link at the end of the row, beside the title and body.
- align: "center" | "start" (default start). `center` centres the title and body, for a success that stands alone. With
`actions` only the text is centred.
- banner: boolean (default false). A flat strip: `border-b` only and no radius, for the top of a `Card flush` only.
- icon: "page" | "grid" | "search" | "table" | "type" | "diff" | "baseline" | "review" | "ci" | "self-host" | "privacy" | "capture" | "branch" | "theme" | "speed" | "chevron-right" | "chevron-down" | "close" | "external-link" | "settings" | "bell" | "check" | "plus" | "more" | "window" | "card" | "pointer" | "field" | "compass" | "briefcase". One of the library's icons, at the start of the box beside the text.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- title: ReactNode. A bold line above the body.
- tone: "neutral" | "info" | "positive" | "warn" | "danger" (default neutral). What the notice means: `neutral` a plain note, `info` something worth knowing, `positive` a
result, `warn` a thing to check before going on, `danger` a failure or something that cannot
be undone.

### Types
- Tone: `"neutral" | "info" | "positive" | "warn" | "danger"`. The one tone vocabulary of the library: what a thing means, not what colour it is. `neutral` (no meaning, the role's own ink or surface) is every component's default, `info` is a note, `positive` a success, `warn` a caution and `danger` an error or a destructive act. A component extends it outward only where it has a real use, and says so beside its own type: the text roles add `muted` (a quieter line) and `accent` (the theme's accent ink), `Pill` and the charts add `accent` for a category that is none of the five meanings. No component renames a tone (`negative`, `default`, `slate` and the colour names are gone), and no scale skips `neutral`.
