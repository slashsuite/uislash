## Cluster

Group: Layout

When to use: Items in a line that are not buttons: a label beside a value, an input beside its actions, a row of pills.

### The one right way
The one item that should take the room left goes in `ClusterGrow`: the input fills the row and the buttons keep their size.
```tsx
import { Button, Cluster, ClusterGrow, Input } from "@slashsuite/ui-react";

<Cluster>
  <ClusterGrow>
    <Input aria-label="Search" placeholder="Search invoices" />
  </ClusterGrow>
  <Button>Search</Button>
</Cluster>
```

### Do
- `gap` is `xs`, `sm` (default) or `md`, the first steps of the `Stack` scale: the items of a row sit closer than the blocks of a column. The `Size` type lists every default that is not `md`.
- `align` is the cross axis: `center` (default), `baseline` for mixed text sizes, `start` or `end`. `justify` is the main axis: `start` (default), `between` for the two ends, `end`.
- The items flow onto more lines when the row runs out of room; `wrap={false}` keeps them on one line.
- Wrap the one item that should fill the row in `ClusterGrow`; it can shrink to nothing, so a long value truncates and the others stay.
- An empty `ClusterGrow` is a spacer: what follows it goes to the end.
- A row of buttons is a `ButtonGroup`, which wraps on a phone and can pin an item to the end. Use `Cluster` for every other row.
- `justify="between"` is for two items; with more, the middle one floats, so use a spacer.
- `as="ul"` or `as="ol"` makes a wrapping row of like things (tags, chips) a list. Write each item as an `<li>`, as in a `Stack` list; the Cluster does not wrap them, and a `ClusterGrow` does not belong in a list.

### Don't
Without `ClusterGrow` the input keeps a fixed width and the rest of the row sits empty. Wrap the input in `ClusterGrow` instead.
```tsx
import { Button, Cluster, Input } from "@slashsuite/ui-react";

<Cluster>
  <Input aria-label="Search" placeholder="Search invoices" width="sm" />
  <Button>Search</Button>
</Cluster>
```

`Cluster` is for every other row; a row of buttons in it does not wrap and has no end slot.
```tsx
import { Button, Cluster } from "@slashsuite/ui-react";

<Cluster>
  <Button>Send</Button>
  <Button variant="outline">Download</Button>
  <Button variant="outline">Back</Button>
</Cluster>
```

`justify="between"` spreads three items evenly, so the middle one floats away from the group it belongs to.
```tsx
import { Button, Cluster, Text } from "@slashsuite/ui-react";

<Cluster justify="between">
  <Text strong>Invoice 1042</Text>
  <Button size="sm" variant="outline">
    Edit
  </Button>
  <Button size="sm" variant="outline" tone="danger">
    Remove
  </Button>
</Cluster>
```

The same pills in a plain Cluster are three loose items: no list, no count.
```tsx
import { Cluster, Pill } from "@slashsuite/ui-react";

<Cluster>
  <Pill>Vintage</Pill>
  <Pill>Books</Pill>
  <Pill>Vinyl</Pill>
</Cluster>
```

### Accessibility
- A `Cluster` is a `div` (or a `span` with `as="span"`) and adds no role; the reading and tab order is the source order of its children.
- A `ul` or `ol` Cluster is a list a screen reader counts; give it an `aria-label` when more than one list is on the page.
- `ClusterGrow` is a `div` too: put the labelled control inside it, with its own `aria-label` or `Field`.

### Props
### Cluster
A horizontal row of items a fixed `gap` apart (`sm` by default): the row counterpart of `Stack`. `align` is the cross axis (`center` default, `baseline` for mixed text sizes, `start`, `end`) and `justify` the main one (`start` default, `between` to push the first and last items to the two ends, `end`). The items flow onto further lines when the row runs out of room; `wrap={false}` keeps them on one line. Put one `ClusterGrow` around the item that takes the room left over, an input beside its buttons, say. An empty `ClusterGrow` is a spacer that pushes what follows it to the end. `ButtonGroup` is the row for buttons; use `Cluster` for any other row. `as="span"` is for a row inside phrasing content, such as a `PageHeader` description (a `<p>`): its items must be phrasing content too, so no `ClusterGrow`. `as="ul"` or `as="ol"` is a wrapping list with no markers (tags, chips): as in a `Stack` list the Cluster does not wrap its children, so each child is an `<li>` the caller writes, and a `ClusterGrow` (a `div`) does not belong in it.
- align: "center" | "baseline" | "end" | "start" (default center). The cross axis: `center`, `baseline` (for mixed text sizes), `start` or `end`.
- as: "div" | "ol" | "span" | "ul" (default div). The element: `div`, `span` for a row inside a `<p>` or other phrasing content, or `ul` or `ol`
for a list (no markers; each child is an `<li>`).

In a `span` the items must be phrasing content, so no `ClusterGrow`.
- gap: "sm" | "md" | "xs" (default sm). The space between items: the first steps of the gap scale. Its default is one of those the
`Size` type lists as not `md`.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- justify: "end" | "start" | "between" (default start). The main axis: `start`, `between` (the first and last items at the two ends) or `end`.
- wrap: boolean (default true). Let the items flow onto further lines when the row runs out of room. `false` keeps them on one line.

### ClusterGrow
The one child of a `Cluster` (or of a `Stack` with `rowFrom`) that grows to the room left in the row. By default it can shrink to nothing (`min-w-0`), so the items beside it stay on the line and a long value truncates instead of pushing them out. With `minWidth` it instead keeps that width (`sm` 12rem, `md` 17rem) and, in a `Cluster` with `wrap`, drops onto the next line when the room left is narrower, rather than being squashed. Empty, it is a spacer.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- minWidth: "sm" | "md". The narrowest it gets: `sm` 12rem or `md` 17rem. In a `Cluster` with `wrap` it wraps under the other items below this width. Left out, it shrinks to nothing.

### Types
- ClusterAlign: `"center" | "baseline" | "start" | "end"`. Where a `Cluster`'s items sit across the row: `center`, `baseline` for mixed text sizes, `start` or `end`.
- ClusterGap: `"sm" | "md" | "xs"`. The first three steps of `Stack`'s scale: `xs` between items in a line, `sm` inside a group, `md` between blocks.
- ClusterGrowMinWidth: `"sm" | "md"`. The narrowest a `ClusterGrow` gets before the row wraps: `sm` or `md`.
- ClusterJustify: `"start" | "end" | "between"`. Where a `Cluster`'s items sit along the row: `start`, `end`, or `between` to spread them to both ends.
