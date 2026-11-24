## Body text

Group: Text

When to use: Every run of text that is not a heading: a paragraph, a supporting line, a note, a label, the line in an empty Card.

### The one right way
Body copy is `Text`, with `Text strong` for emphasis inside it and `Caption` for the fine print.
```tsx
import { Caption, Stack, Text } from "@slashsuite/ui-react";

<Stack gap="xs">
  <Text>
    Invoice{" "}
    <Text as="span" strong>
      INV-204
    </Text>{" "}
    is due on Friday.
  </Text>
  <Caption>Sent 2 minutes ago</Caption>
</Stack>
```

### Do
- Set a paragraph in `Text`, a `<p>`. Inside a row, a cell or a sentence it is `Text as="span"`. A block of it stops at a readable line length.
- Emphasise a run with `Text strong` inside the `Text`: font-medium in the primary ink. Use `Caption` for fine print and metadata, `Caption as="span"` inside a row.
- Put a `Text` under a heading and `Lead` under a `Display`. `Overline` is the small all-caps label above a group, not a title.
- A Card, a table or a list with nothing in it yet takes an `EmptyState` in its `empty` slot, which draws it as one muted line there; a muted `Text` is not an empty state.
- `tone` is the one ink prop: `neutral`, the default, the role's own ink; `muted` and `accent` for the hierarchy of the text; and `positive`, `warn`, `danger` or `info` for what a run means. The words still say it, so colour is never the only signal.
- `numeric` sets tabular figures so a column of amounts lines up and `mono` the monospace face for an id or a path. `lines` (1 to 4) on `Text` or `Caption` shows at most that many lines and ends in an ellipsis: `lines={1}` cuts a run where its box ends, `lines={3}` clamps a long description. A "Show all" is your own state: `lines={open ? undefined : 3}` beside a `Button`.
- `align` sets a run at `start`, `center` or `end` of its block, for a table header or a right-hand column. `minWidth="amount"` on `Text` fixes a width and right-aligns a money figure in it, so a column of amounts lines up.
- `italic` on `Text` or `Caption` sets a muted hint or a caption in italic. `breakWords` breaks a long unbroken string, such as a URL or a token, at the edge of its box.

### Don't
- Never write a bare `<p>`, `<span>`, `<strong>` or `<small>`: they carry none of the theme's type scale or colour.

Plain HTML text elements carry no size, weight or colour of the theme. Every run of text is a typography part.
```tsx
import { Stack } from "@slashsuite/ui-react";

<Stack gap="xs">
  <p>
    Invoice <strong>INV-204</strong> is due on Friday.
  </p>
  <small>Sent 2 minutes ago</small>
</Stack>
```

`muted` and `accent` are the hierarchy of text, not its meaning: an error in the accent ink reads as a link, and in muted grey as nothing at all.
```tsx
import { Stack, Text } from "@slashsuite/ui-react";

<Stack gap="xs">
  <Text tone="accent">Saved.</Text>
  <Text tone="muted">Could not save: the name is taken.</Text>
</Stack>
```

An `Overline` is a `span`, not a heading: a section titled by one has no place in the page outline. Use `SectionHeading`.
```tsx
import { Overline, Stack, Text } from "@slashsuite/ui-react";

<Stack gap="xs">
  <Overline>Invoices</Overline>
  <Text>Two invoices are due this week.</Text>
</Stack>
```

A bare `<p>` in a Card has its own colour and size, so it drifts from every other empty Card: use `Text tone="muted"`.
```tsx
import { Card } from "@slashsuite/ui-react";

<Card title="Done" count={0}>
  <p>Nothing finished yet.</p>
</Card>
```

One muted line is not a view: with a button under it nothing says what the page is for. Use `EmptyState`.
```tsx
import { Button, Stack, Text } from "@slashsuite/ui-react";

<Stack>
  <Text tone="muted">No projects yet.</Text>
  <Button>Create a project</Button>
</Stack>
```

### Accessibility
- `Text`, `Caption` and `Lead` render a `p`, and `Overline` a `span`. `as` changes the element: a `span` for `Text` or `Caption` inside a row or a sentence, an `li`, or a `label` for an `Overline` with `htmlFor`.
- `Overline` is a label, not a heading: it adds nothing to the page outline. A small section title is `Section size="sm"`, not `Overline as="h2"`.
- `lines` sets the full text as the `title` when the content is plain text, so a pointer user can read what was cut. Give a `title` of your own when the content is not.
- A `tone` changes only the colour. The wording has to carry the meaning.

### Props
### Text
Running text. A paragraph (`p`; `as="span"` for a run inside a row, a cell or a sentence), text-base/6 normal, secondary (text-sm/5 under an `AppShell density="compact"`, text-base/7 inside a `Prose`). A block of it stops at a readable line length (`max-w-[72ch]`), wherever it sits. `strong` emphasises it: font-medium in the primary ink, unless `tone` says otherwise. `preserveNewlines` keeps the line breaks in the text (a user-typed note); runs of spaces still collapse. `tone` colours it by meaning (`positive` for "Saved.", `danger` for an error, `muted` for a quieter line), `numeric` sets tabular figures, `mono` the monospace face, and `lines` shows at most 1 to 4 lines, ending in an ellipsis (the full text becomes its `title`). `align` sets it at `start`, `center` or `end`. `italic` slants it, `breakWords` breaks a long unbroken string at the edge of its box, and `minWidth="amount"` fixes a width and right-aligns the figure in it (a column of amounts lines up); it does not take `align`.
- align: "center" | "end" | "start". Set the text at `start`, `center` or `end` of its block. The run becomes block-level, so the
alignment has a box to act on (a table header cell, a right-hand column).
- as: ElementType. The element to render (each role has a semantic default); the other props follow it.
- breakWords: boolean. Break a long unbroken string (a URL, a token) where the container ends, instead of overflowing.
- italic: boolean. Italic: a muted hint or a caption.
- lines: 2 | 3 | 4 | 1. Show at most this many lines (1 to 4) and end in an ellipsis: `1` cuts the run where its
container ends, `2` to `4` wrap and stop. With plain-text content the full text becomes the
`title`. A "Show all" toggle is the app's own state: `lines={open ? undefined : 3}`.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- minWidth: "amount". A fixed width: `amount` is a right-aligned money figure, min-w-24, in tabular figures.
- mono: boolean. The monospace face, for an id, a path or a command.
- numeric: boolean. Tabular figures, so a column of amounts lines up.
- preserveNewlines: boolean. Keep the line breaks in the text (a user-typed note); runs of spaces still collapse.
- strong: boolean. Emphasis: font-medium in the primary ink (`tone` still wins).
- tone: "neutral" | "info" | "positive" | "warn" | "danger" | "muted" | "accent". The ink: `neutral`, the default, is the role's own; `muted` and `accent` set the hierarchy of
the text; `positive`, `warn`, `danger` and `info` say what a run means (see `TextTone`).

### Caption
Fine print / metadata. A paragraph (`p`; `as="span"` inline), text-sm/5 normal, tertiary (text-xs/4 under an `AppShell density="compact"`). Takes `tone`, `numeric`, `mono`, `lines` and `align` like `Text`, and `italic` for a muted hint and `breakWords` for a long unbroken string such as a URL.
- align: "center" | "end" | "start". Set the text at `start`, `center` or `end` of its block. The run becomes block-level, so the
alignment has a box to act on (a table header cell, a right-hand column).
- as: ElementType. The element to render (each role has a semantic default); the other props follow it.
- breakWords: boolean. Break a long unbroken string (a URL, a token) where the container ends, instead of overflowing.
- italic: boolean. Italic: a muted hint or a caption.
- lines: 2 | 3 | 4 | 1. Show at most this many lines (1 to 4) and end in an ellipsis: `1` cuts the run where its
container ends, `2` to `4` wrap and stop. With plain-text content the full text becomes the
`title`. A "Show all" toggle is the app's own state: `lines={open ? undefined : 3}`.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- mono: boolean. The monospace face, for an id, a path or a command.
- numeric: boolean. Tabular figures, so a column of amounts lines up.
- tone: "neutral" | "info" | "positive" | "warn" | "danger" | "muted" | "accent". The ink: `neutral`, the default, is the role's own; `muted` and `accent` set the hierarchy of
the text; `positive`, `warn`, `danger` and `info` say what a run means (see `TextTone`).

### Overline
Small all-caps label above a group. `span`, text-xs semibold uppercase, tertiary. `tone`, `numeric`, `mono` and `align` are opt-in, as on `Text`.
- align: "center" | "end" | "start". Set the text at `start`, `center` or `end` of its block. The run becomes block-level, so the
alignment has a box to act on (a table header cell, a right-hand column).
- as: ElementType. The element to render (each role has a semantic default); the other props follow it.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- mono: boolean. The monospace face, for an id, a path or a command.
- numeric: boolean. Tabular figures, so a column of amounts lines up.
- tone: "neutral" | "info" | "positive" | "warn" | "danger" | "muted" | "accent". The ink: `neutral`, the default, is the role's own; `muted` and `accent` set the hierarchy of
the text; `positive`, `warn`, `danger` and `info` say what a run means (see `TextTone`).

### Lead
The supporting sentence under a `Display`. `p`, text-lg/7 normal, secondary.
- as: ElementType. The element to render (each role has a semantic default); the other props follow it.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.

### Types
- TextAlign: `"center" | "start" | "end"`. Where a run of text sits across its block.
- TextLines: `1 | 2 | 3 | 4`. How many lines a clamped run shows before it ends in an ellipsis.
- TextMinWidth: `"amount"`. A fixed width for a run of text: `amount` is a money figure, right-aligned, at a width that lines a column up.
- TextTone: `Tone | "accent" | "muted"`. The meaning of a run of inline text: the library's `Tone`, plus `muted` for a quieter line and `accent` for the theme's accent ink. `neutral` (the default) is the role's own ink. Colour alone does not say a meaning, so the words do too.
