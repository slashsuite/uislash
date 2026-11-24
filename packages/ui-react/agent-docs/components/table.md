## Table

Group: Data

When to use: Records that share columns, where a person compares values down a column.

### Use instead
- KeyValueList (key-value-list.md): One record's fields, each label beside its value.
- ListRow (list-row.md): Each record is a thing to open, with a line or two of detail.
- MetaList (meta-list.md): A few short facts inline, on one line under a title.

### The one right way
A table is a head and a body: names in strong cells, amounts in `numeric` cells so the figures line up.
```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@slashsuite/ui-react";

<Table label="Quotes">
  <TableHead>
    <TableRow>
      <TableHeaderCell>Client</TableHeaderCell>
      <TableHeaderCell numeric>Premium</TableHeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell tone="strong">Naledi Dlamini</TableCell>
      <TableCell numeric>R 1 249.00</TableCell>
    </TableRow>
    <TableRow>
      <TableCell tone="strong">Pieter van Wyk</TableCell>
      <TableCell numeric>R 880.50</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Do
- Compose a `Table` from `TableHead`, `TableBody` and, for totals, `TableFoot`. A `TableHead` holds one `TableRow` of `TableHeaderCell`s; give the `Table` a `label` that names it.
- A column of amounts says so once, with `numeric` on its `TableHeaderCell`: the title and every cell under it are end aligned and the figures line up. A code or a type is `mono`.
- A cell's `tone` is `neutral` (the default), `strong` for the name of the row, `muted` for the secondary column, or a Callout tone for an amount that carries a meaning; pair the tone with a sign or a word. `secondary` is a muted second line under a cell.
- The total of the whole table is a `TableFoot` row. A subtotal among the body's rows is a `TableRow` with `emphasis`, the same look; a bold subtotal is not a `tone`. Neither row takes a `tone`.
- Mark a row's status with `tone` (a stripe and a soft fill, or `muted` to fade the row) or with `stripe` (the stripe alone, in the `muted`, `info`, `positive`, `warn` or `danger` tone, which keeps the row's hover). Give one of them, never both, and name the status in a cell as well (a `Pill`), or draw a `Legend` for the colours.
- A table with no rows takes `TableBody empty={<EmptyState title="No quotes yet." />}`: one muted line in a cell that spans every column the head declares, with the head still drawn. Write `TableHead` and its cells inline, so the table can count them.
- Group rows with a `TableGroupRow`: it spans every column the head declares, and `trailing` is a count or a subtotal at the far end. A full-width note or panel is a `TableCell span="full"`; `align="center"` centres it. `indent` (1 to 3) sets a start-aligned cell in, for the lines under a parent row.
- A column with nothing to say in its head (its actions) takes a `TableHeaderCell` with `label="Actions"`. Inside a `Card` a table is plain: no card of its own, only the row dividers.

### Don't
Amounts in plain start-aligned cells do not line up, so the eye cannot compare them.
```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@slashsuite/ui-react";

<Table label="Quotes">
  <TableHead>
    <TableRow>
      <TableHeaderCell>Client</TableHeaderCell>
      <TableHeaderCell>Premium</TableHeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>Naledi Dlamini</TableCell>
      <TableCell>R 1 249.00</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Pieter van Wyk</TableCell>
      <TableCell>R 880.50</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

A total faked as one more body row, in a strong cell, reads like a line item and is not a `<tfoot>`.
```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@slashsuite/ui-react";

<Table label="Budget">
  <TableHead>
    <TableRow>
      <TableHeaderCell>Line</TableHeaderCell>
      <TableHeaderCell numeric>Spent</TableHeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>Groceries</TableCell>
      <TableCell numeric>R 4 120.00</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Eating out</TableCell>
      <TableCell numeric>R 2 980.00</TableCell>
    </TableRow>
    <TableRow>
      <TableCell tone="strong">Total</TableCell>
      <TableCell numeric tone="strong">
        R 7 100.00
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

A toned row whose cells never say what the tone means: colour alone tells nobody who cannot see it.
```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@slashsuite/ui-react";

<Table label="Debit orders">
  <TableHead>
    <TableRow>
      <TableHeaderCell>Debit order</TableHeaderCell>
      <TableHeaderCell numeric>Amount</TableHeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell tone="strong">Insurance</TableCell>
      <TableCell numeric>R 1 850.00</TableCell>
    </TableRow>
    <TableRow tone="danger">
      <TableCell tone="strong">Gym</TableCell>
      <TableCell numeric>R 349.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

An empty header cell leaves the column with no name, so a screen reader hears a column of unlabelled buttons.
```tsx
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@slashsuite/ui-react";

<Table label="Clients">
  <TableHead>
    <TableRow>
      <TableHeaderCell>Client</TableHeaderCell>
      <TableHeaderCell align="end" />
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell tone="strong">Naledi Dlamini</TableCell>
      <TableCell align="end">
        <Button variant="outline" size="sm">
          Open
        </Button>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

A button put in a header cell by hand says nothing about the order to a screen reader, and looks unlike every other sortable column.
```tsx
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@slashsuite/ui-react";

<Table label="Quotes">
  <TableHead>
    <TableRow>
      <TableHeaderCell>Quote</TableHeaderCell>
      <TableHeaderCell numeric>
        <Button variant="ghost" size="sm">
          Total
        </Button>
      </TableHeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>Q-1043</TableCell>
      <TableCell>R 18400</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

A cell with a column count written by hand breaks the day a column is added, and is a second empty look.
```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@slashsuite/ui-react";

<Table label="Quotes">
  <TableHead>
    <TableRow>
      <TableHeaderCell>Quote</TableHeaderCell>
      <TableHeaderCell>Customer</TableHeaderCell>
      <TableHeaderCell numeric>Total</TableHeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell colSpan={5} align="center" tone="muted">
        No quotes yet.
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Accessibility
- A Table renders a native `<table>`; its `label` is the accessible name, a visually hidden caption.
- A `TableHeaderCell` is a `<th scope="col">`; a `TableGroupRow` is a `<th scope="rowgroup">`.
- A `TableHeaderCell` `label` is hidden text inside the header cell, so an actions column still has a name for a screen reader.
- Colour alone never carries a row's or a cell's status; name it in text.
- A `truncate` cell puts its full text in a `title`.
- A stretched `TextLink` is a real link and the only tab stop in its row; the row's whole area is its click target.
- A `TableEditCell` or `InlineEdit` is a native `<button>` named by its value and its `label`. Opening moves the focus to the editor, a group named by `label`; Esc and `close` move it back to the value.
- On a narrow screen the card scrolls sideways instead of squeezing its columns.
- A sorted column's header has `aria-sort` (`ascending` or `descending`); a sortable column it is not sorted by has none, and its title is a native button named by the title.
- A `selected` row has `aria-current`, not `aria-selected`, which a plain table row does not support.
- A `TableExpandCell` is a native button named by its `label` and `count` ("Details, 3"), with `aria-expanded` and the `aria-controls` you give it.

### Props
### Table
A list of records in a rounded, bordered card that scrolls sideways on a narrow screen. Compose it from `TableHead`, `TableBody`, `TableFoot`, `TableRow`, `TableHeaderCell` and `TableCell`. `label` names the table for assistive tech and is not drawn. Inside a `Card` it is plain: no card of its own (border, fill and shadow), no tinted head strip and no row hover, only the row dividers. A column of figures says so once, with `numeric` on its `TableHeaderCell`: its cells then take end alignment and tabular figures. `size` is the row padding, and the controls in the rows follow it (`sm` by default). Other props (`id`, `data-*`, `aria-*`) go on the `<table>`. While `loading`, a body with no rows draws five rows of bones, one per column, and an empty cell draws a bone; the table keeps its role and its name.
- label: string (required). Names the table for assistive tech; it is not drawn.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- size: "sm" | "md" | "lg" (default sm). The row padding; the buttons and fields in the rows take the same size.

### TableHead
The `<thead>`: small uppercase column titles, on a tinted strip unless the table is in a card. Holds one `TableRow` of `TableHeaderCell`s.

### TableBody
The `<tbody>`: the rows, each with a line above it and, unless the table is in a card, a fill on hover. With no rows it draws `empty` (an `EmptyState`, one muted line here) in one cell that spans every column the head declares; the head stays drawn, so the reader sees what the table holds. In a loading `Table` a body with no rows draws five rows of bones instead, never `empty`.
- empty: ReactNode. Shown in one full-width cell when there are no rows: an `EmptyState`.

### TableFoot
The `<tfoot>`: totals and subtotals. Its cells are strong by default and each row has a firmer line above it, alone and in a card alike. Put it after `TableBody`; a row of it takes no `tone`.

### TableRow
A `<tr>`, `relative`: the anchor a `TextLink stretch` (with `href`) stretches to. Any other link, button or control in the row (a `TextLink`, a `Button`, a `Checkbox`) sits above that link and is clickable on its own, with no class from the caller. Use it in the head and the body. In the body it also draws the line above the row and, unless the table is in a card, the hover fill. `selected` marks the current row (the one open beside the table, the one being edited): the `ListRow` selected fill and `aria-current`, the row whose detail is open, not a multi-select; it wins over `tone` and `stripe`. `tone` marks the row's status (see `RowTone`): a stripe on the leading edge and a soft fill, or `muted` to fade it. A toned row keeps its fill on hover (the status stays readable), so a linked row's link, not a hover fill, says it is clickable. `stripe` is the stripe alone, in the `TextTone` colours (the first five names of a `StackedBar` segment's `VizTone`), with no fill: the row keeps its hover and its own look. Give `tone` or `stripe`, not both. Body rows only; colour alone does not say it, so name the status in a cell too (a `Pill`). A bold subtotal is not a tone: a total of the whole table is a `TableFoot` row, and a subtotal among the body's rows is `emphasis`, the same look.
- emphasis: boolean (default false). A subtotal in the body: the look of a `TableFoot` row, with strong cells, a firmer line
above and no hover. Give only one of `tone`, `stripe` and `emphasis`.

A sign row or a subtotal needs no other part.
- selected: boolean (default false). The row in view (its detail open beside the table): the selected fill and `aria-current`. Body
rows only.

As on a `ListRow`, it is not a multi-select, and a selected row takes no `tone`.
- stripe: "info" | "positive" | "warn" | "danger" | "muted" | "accent". A stripe on the leading edge in this tone, with no fill. Give only one of `tone`, `stripe` and `emphasis`.
- tone: "neutral" | "info" | "positive" | "warn" | "danger" | "muted". The row's status: a stripe on the leading edge plus the tone's soft fill, or `muted` to fade the row. Give only one of `tone`, `stripe` and `emphasis`.

### TableHeaderCell
A column title, `<th scope="col">`. `numeric` declares a column of figures, once: the title and every cell under it take end alignment and tabular figures. A column with nothing to show in its head (a row's actions) takes `label` instead of `children`: the name a screen reader hears ("Actions"), visually hidden so the head keeps its column. `sort` and `onSort` make the column sortable: the title becomes a button that asks for the next direction, and the column says where it stands with `aria-sort`. The app sorts its rows; the table never does.
- align: "center" | "end" | "start" (default numeric ? "end" : "start"). The title's horizontal alignment; `end` over a column of buttons, `center` over a centred column.
- label: string. The column's name for a screen reader, visually hidden, for a column with no visible title (a row's actions).
- numeric: boolean (default false). A column of figures: this title and the cells under it are end aligned, the cells in tabular figures.
- onSort: ((next: "ascending" | "descending") => void). Called with the next direction on a click: `none` goes to `ascending`, then each click flips it.
- sort: "none" | "ascending" | "descending". Where this column stands: `ascending`, `descending`, or `none` when the table is sorted by
another column. The app sorts its rows and passes it back; one sorted column at a time.

With `onSort` the title becomes a button that asks for the next direction. The table never
sorts, filters or pages.

### TableCell
A `<td>`. `tone` is the text weight and colour (see `CellTone`; in a `TableFoot` it defaults to `strong`); `numeric` sets end alignment and tabular figures (a cell under a `numeric` head cell is numeric already), `mono` a small mono face. `secondary` is a second, muted line under the content. One rule for wrapping: prose (a cell of plain text) wraps onto more lines (never narrower than `min-w-48`, so it scrolls the table before it becomes a sliver), a cell that holds a control or a link takes that content's width, and a `numeric` or `mono` cell (a figure, a code, a type) never breaks. `truncate` caps a long value's width, cuts it with an ellipsis on one line and puts the full text in a `title`; the content is then plain text (strings and numbers), since that is what the title shows. `colSpan` passes through: a cell that spans the row is a full-width panel (a note under a group), and `align="center"` centres it. A table with no rows takes `TableBody empty`, not a cell built by hand. `span="full"` spans every column the head declares, so a panel under a row needs no count. `indent` sets a start-aligned cell in by 1 to 3 levels, for a line under a parent row. While `loading` an empty cell draws one bone, the width of a short value.
- align: "center" | "end" | "start" (default end for a numeric cell, else start). The cell's horizontal alignment; `center` for a full-width note.
- colSpan: number. How many columns the cell spans; `span="full"` spans them all without a count.
- indent: 2 | 3 | 1. Sets the cell in by this many levels (1 to 3), for a line under a parent row. Start-aligned cells only.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- mono: boolean (default false). A small monospace face for a code or a type, and the cell never wraps.
- numeric: boolean (default the column's, from a `numeric` head cell). A figure: end aligned, tabular figures, and the cell never wraps.
- secondary: ReactNode. A second, muted line under the content.
- span: "full". `full` spans every column the head declares: a panel under a row, an open row's detail.
- tone: "strong" | "neutral" | "info" | "positive" | "warn" | "danger" | "muted". The text weight and colour (see `CellTone`). In a `TableFoot` it defaults to `strong`.
- truncate: boolean (default false). Caps the width and cuts a long value with an ellipsis on one line, the full text in a `title`.
Plain text content only.

Without it, a prose cell wraps down to a floor so it never becomes a sliver, a cell that holds
a control or a link (a `Pill`, a `Switch`, a `Button`, a `TextLink`) takes its content's width,
and a `numeric` or `mono` cell never breaks.

### TableEditCell
A `TableCell` whose value opens an editor in place: a cell that holds one `InlineEdit` and nothing else. It shows `children` as a button with a dotted underline; a click, Enter or Space swaps it for `renderEditor(close)` and moves the focus into the editor. The editor calls `close` when it has saved, and Esc closes it: both put the focus back on the value. A press outside it or Tab out of it closes it too and leaves the focus where it went, so the editor saves its value on its own change or submit, never on a close. Put the control in the cell itself, not in a popover of its own, which counts as outside. Takes `TableCell`'s `align`, `tone`, `numeric`, `mono`, `indent`, `secondary` and `span`. For an edit trigger in a cell that holds other content too, put an `InlineEdit` in a `TableCell`.
- align: "center" | "end" | "start" (default end for a numeric cell, else start). The cell's horizontal alignment; `center` for a full-width note.
- children: ReactNode (required). The value, shown while closed.
- colSpan: number. How many columns the cell spans; `span="full"` spans them all without a count.
- indent: 2 | 3 | 1. Sets the cell in by this many levels (1 to 3), for a line under a parent row. Start-aligned cells only.
- label: string (required). What the button does, for a screen reader, heard after the value: "Edit category". It also names the editor.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- mono: boolean. A small monospace face for a code or a type, and the cell never wraps.
- numeric: boolean (default the column's, from a `numeric` head cell). A figure: end aligned, tabular figures, and the cell never wraps.
- renderEditor: (close: () => void) => ReactNode (required). The control that edits the value, drawn while open. `close` shuts it and returns the focus to
the value.

Call `close` once the control has saved: a press outside the cell, Tab out of it and Esc all
close it without a save, so save on the control's own change or submit. The control sits in the
cell, not in a popover of its own.
- secondary: ReactNode. A second, muted line under the content.
- span: "full". `full` spans every column the head declares: a panel under a row, an open row's detail.
- tone: "strong" | "neutral" | "info" | "positive" | "warn" | "danger" | "muted". The text weight and colour (see `CellTone`). In a `TableFoot` it defaults to `strong`.

### InlineEdit
A value that opens an editor in place, as a part inside a `TableCell` that holds more than the value (an edit trigger in a column cell with other content, say). It shows `children` as a button with a dotted underline; a click, Enter or Space swaps it for `renderEditor(close)` and moves the focus into the editor. The part keeps its own open state. The editor calls `close` when it has saved, and Esc closes it: both put the focus back on the value. A press outside it or Tab out of it closes it too and leaves the focus where it went, so the editor saves its value on its own change or submit, never on a close. Put the control in the part itself, not in a popover of its own, which counts as outside. It takes the alignment of the cell around it. It is a block that bleeds half a rem into the padding of the cell it sits in, so it belongs inside a `TableCell`; a cell that holds only the value is a `TableEditCell`. `data-*` and `aria-*` go on the button, and on the editor's group while open.
- children: ReactNode (required). The value, shown while closed.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- label: string (required). What the button does, for a screen reader, heard after the value: "Edit category". It also names the editor.
- renderEditor: (close: () => void) => ReactNode (required). The control that edits the value, drawn while open. `close` shuts it and returns the focus to the value.

### TableGroupRow
A full-width group header in the body: a tinted row with a `label` that spans every column the head declares (or `colSpan` columns), and optional `trailing` content at the far end (a count, a subtotal, a small button). The group's rows follow it. For a panel of other content across the whole row, use a `TableCell span="full"` instead.
- colSpan: number (default every column the `TableHead` declares). How many columns the header spans.
- label: ReactNode (required). The group's name, at the start of the row.
- trailing: ReactNode. Content at the far end of the row: a count, a subtotal, a small button.

### TableExpandCell
The cell that opens and closes the row it sits in: a small ghost button with a chevron that turns down when `expanded`, named by `label` (visually hidden) and, with a `count`, the count chip after it, so it reads "Details, 3". The app holds `expanded` and renders what opens under the row: a `TableRow` with one `TableCell span="full"`, or indented child rows. Give its column a head of `<TableHeaderCell label="Details" />`. `aria-controls` names what it opens; other props go on the `<td>`.
- count: number. A count chip after the chevron: how many lines open under the row.
- expanded: boolean (required). Whether the row is open.

Hold it yourself and render what opens under the row: a `TableRow` with one `TableCell
span="full"`, or indented child rows. Head the column `<TableHeaderCell label="Details" />`.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- label: string (required). The button's name, visually hidden: "Details".
- onClick: MouseEventHandler<HTMLButtonElement> (required). Opens or closes the row: the app flips `expanded`.

### Types
- CellTone: `Tone | "muted" | "strong"`. The text of a cell: its weight and colour. `neutral` (the default), `strong` and `muted` are the plain ones; the rest are the shared tones, for an amount that carries a meaning (a gain, an overspend). Colour alone does not say it, so a signed figure or a word says it too.
- RowTone: `"neutral" | "info" | "positive" | "warn" | "danger" | "muted"`. The status of a row: the Callout's tones, plus `muted`. A toned row gets a stripe on its leading edge and the tone's soft fill; `muted` fades the row instead, for one that matters less. The stripe takes the tone's text colour, which every theme already remaps, so no new palette entry.
- TableSort: `"ascending" | "descending" | "none"`. Where a sortable column stands: ARIA's own words. `none` is a column the table is not sorted by.
