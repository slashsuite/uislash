## ListRow

Group: Data

When to use: A short list where each row opens something, toggles a section or holds its own buttons.

### Use instead
- Table (table.md): The records are read and compared across columns.
- KeyValueList (key-value-list.md): One record's fields, each label beside its value.
- MetaList (meta-list.md): A few facts inline on one line, not rows to open.

### The one right way
Rows sit in a `Card flush`, and `divided` draws the line between them on every row after the first.
```tsx
import { Card, ListRow } from "@slashsuite/ui-react";

<Card flush>
  <ListRow trailing="R 9 500">Rent</ListRow>
  <ListRow divided trailing="R 1 850">
    Transport
  </ListRow>
  <ListRow divided href="#bills" trailing="3">
    Bills
  </ListRow>
</Card>
```

### Do
- Put the rows in a `Card flush` and set `divided` on every row after the first. `trailing` is a value, a count or a `Pill`; `leading` is an `Avatar` or an icon.
- A row with `onClick` is a button; with `href` it is a link. `external` opens a link in a new tab.
- `expanded` makes the row the header of a collapsible section: you own the state and the section, and pass `aria-controls` to name it.
- `selected` marks the one row whose detail is open; set it on a single row of a list. `focused` marks the row the keyboard cursor is on in a list you move through yourself: an inset accent ring, apart from `selected`'s fill.
- A button row (`onClick`) or a link row (`href`) can hold its own link or button in `trailing`: it sits above the row's button or link and takes its own click, with no class from you, so a row that selects can still carry a "View" link to its page. A row with no `href` and no `onClick` has no action of its own: its buttons go in `actions`, after `trailing`. `revealOnHover` shows them only on hover or focus, so a long list is not a wall of buttons.
- A row's own link or button goes in `trailing`, never in the label. `size="sm"` is the dense padding for a list that must fit more rows, `size="lg"` the roomy one for a short list of big targets; `md` is the default.
- A compact bordered list for read-only data, such as the lines of a split, is a `Card flush` around rows with no action at `size="sm"`, `divided` after the first, with the amount in `trailing`. There is no separate part: a row with no action has no hover fill and no click target.
- Records with several columns to compare are a `Table`, not rows.

### Don't
- Do not add your own indent or a wrapper around the row.

Rows in a Card that is not `flush` sit inside its padding, so the hover fill stops short of the edges and the lines do not run across.
```tsx
import { Card, ListRow } from "@slashsuite/ui-react";

<Card>
  <ListRow trailing="R 9 500">Rent</ListRow>
  <ListRow divided trailing="R 1 850">
    Transport
  </ListRow>
</Card>
```

A row that silently ignores its click leaves the person tapping it again.
```tsx
import { Card, ListRow } from "@slashsuite/ui-react";

<Card flush>
  <ListRow onClick={() => undefined} trailing="R 1 850">
    Rent
  </ListRow>
  <ListRow divided onClick={() => undefined} trailing="R 640">
    Water
  </ListRow>
</Card>
```

### Accessibility
- A button row is a `<div>` with a native `<button type="button">` stretched over it, named by the label alone; a link row is a `<div>` with a real link stretched over it, named by the whole row; a row with no `href` and no `onClick` is a plain `<div>` with no click target.
- `selected` sets `aria-current="true"` on the row.
- `expanded` sets `aria-expanded` and draws a chevron, which is hidden from assistive tech.
- A button or link row has a focus ring from the component; a button row's `disabled` fades the row and disables its button, so a tap on the row itself does nothing; a link or button in `trailing` still works.
- A button row with `disabledReason` fades and its button is `aria-disabled`, still in the tab order; a click, Enter and Space do nothing, and the reason shows as a tooltip on hover, keyboard focus and a tap, read out as its description (the native `title` without CSS anchor positioning).
- `revealOnHover` actions appear when the row is hovered or has focus inside it, so a keyboard user can reach them, and they are always shown on a touch screen.

### Props
### ListRow
A full-width row that runs `onClick` (or, with `href`, opens a link) with a hover fill, a left-aligned label and `trailing` content at the far end. The row is a `<div>` with its `<button>` or link stretched over it, so a tap anywhere on the row runs it; a `TextLink`, `Button` or `Checkbox` in the row (in `trailing`, say a "View" link on a row that selects) sits above it and is clickable on its own. A button row's button is named by the label alone. With `expanded` it is the header of a collapsible section: `aria-expanded` and a chevron. Rows sit in a `Card flush`; `divided` draws the line between them, on each row after the first. `secondary` is a second, muted line under the label. `leading` is content before the label (`leadingWidth="thumbnail"` gives it a fixed picture width), `selected` marks the row in view, `focused` the one the keyboard cursor is on and `highlighted` fills the row a list follows (`onPointerEnter`, `onPointerLeave` and `onFocus` reach every form; on a button or linked row the pointer handlers go on the row itself). The label is a `<div>`, so it can hold block content (a name over a path). A row with no `href` and no `onClick` is a plain `<div>` with no action of its own, for one that holds its own buttons: `actions` follow `trailing`, and `revealOnHover` shows them only on hover or focus. Such a row also takes a `panel`, content under the row that starts where the label does (a conversation that opens under its chat); `divided` draws the line above the whole row, panel included, so a list of them is `divided={index > 0}` on each. Inside a row a `Stack` is `xs` apart, and a `sm` row makes the buttons in it `sm`. While `loading` an empty label is a bone, and what the row holds waits with it.
- actions: ReactNode. Buttons for this row, after `trailing`: `Button size="sm"`, `IconButton`.
- disabledReason: string. Why the row cannot be pressed: it fades, `aria-disabled` and focusable, the reason its tooltip.
- divided: boolean. A hairline above the row: set it on every row after the first.
- expanded: boolean. Makes the row a collapsible header: sets `aria-expanded` and shows a chevron that turns down
when open. The caller owns the state and the section; pass `aria-controls` to name it.
- external: boolean. Opens in a new tab: adds `target="_blank"` and `rel="noreferrer"`.
- focused: boolean. Marks the row the keyboard cursor is on, for a list moved with the arrow keys or `j`/`k` while
focus stays on the list: the focus ring, drawn inside the row. It says nothing to a screen
reader (move real focus for that) and combines with `selected`.
- highlighted: boolean. Marks the row a list follows with the pointer and the keyboard alike (set it from
`onPointerEnter` and `onFocus`): a fill one step deeper than hover, so it shows on a white card
and on a tinted panel alike. On a static row it shows the fill without `revealOnHover`, and
shows `actions` that `revealOnHover` hides. `selected` wins.

Clear it from `onPointerLeave`.
- href: string. Makes the row a link to this URL; an in-app path goes through the app's `LinkProvider`.
- leading: ReactNode. Content before the label: an Avatar, a thumbnail, an icon.
- leadingWidth: "thumbnail". A fixed width for `leading`, for a thumbnail (an `<img>` fills it), so the labels of rows with
and without a picture still line up. Without it `leading` is as wide as its content.

For a row that shows a screenshot.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- onClick: MouseEventHandler<HTMLButtonElement> | MouseEventHandler<HTMLAnchorElement>. What the row does when pressed: it makes the row a button.
- onPointerEnter: PointerEventHandler<HTMLDivElement>. On the row, not its link or button, so a link or button in the row does not count as entering it.
- onPointerLeave: PointerEventHandler<HTMLDivElement>. On the row, not its link or button, so a link or button in the row does not count as leaving it.
- panel: ReactNode. Content under the row, lined up with the label rather than the row's edge (past `leading`): the
panel of a row that opens in place, such as a conversation under its chat. It sits inside the
row, so `divided`, the fill and `revealOnHover` cover it too. Only a row that is neither a
button nor a link takes it.
- revealOnHover: boolean. Hides `actions` until the row is hovered or something in it has focus, so a long list is not a
wall of buttons. A touch screen has no hover, so they are always shown there.
- secondary: ReactNode. A second, muted line under the label (a date, a note), like `TableCell`'s `secondary`.
- selected: boolean. Marks the row in view, the one whose detail is open: an accent fill and `aria-current="true"`.
Set it on one row of a list.
- size: "sm" | "md" | "lg" (default md). `sm` is dense padding, `lg` one step roomier than `md`. A `Button`, `IconButton` or `Pill` in a
`sm` row with no `size` of its own is `sm` too.
- trailing: ReactNode. Content at the far end of the row: a value, a count, a Pill.
