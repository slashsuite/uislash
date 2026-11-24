## KeyValueList

Group: Content

When to use: A set of facts about one thing: size, status, dates, shortcut keys.

### Use instead
- Table (table.md): Many records with the same columns, to read across and compare.
- ListRow (list-row.md): The items are things to open, not the fields of one record.
- MetaList (meta-list.md): A few short facts inline, with no labels to line up.

### The one right way
Label and value pairs are a `KeyValueList`: one row per fact, the label muted, the value in tabular figures.
```tsx
import { KeyValue, KeyValueList } from "@slashsuite/ui-react";

<KeyValueList>
  <KeyValue label="Size">1280×720</KeyValue>
  <KeyValue label="Changed pixels">0.4%</KeyValue>
  <KeyValue label="Captured">2 min ago</KeyValue>
</KeyValueList>
```

### Do
- Put a `KeyValue` with a `label` for each fact; the value is its children.
- `align="end"` is the default: each label at the left and its value right-aligned. `align="start"` puts every value left-aligned in one column beside the labels, which suits long values.
- A value can be any content, such as a `Kbd` for a shortcut.
- `total` closes a column of amounts: a firm rule above it and strong text. `tone` (`muted`, `positive`, `warn`, `danger`, `info`) colours the value on any row; a total that does not reconcile is `total tone="warn"`. Say it in words too, with a sign or "off", since colour alone does not.

### Don't
- Do not build the rows by hand from a `Cluster`; a grid of records is a `Table`.

Rows built by hand from a `Cluster` and `Text` drift from the list's label colour and figures. Use `KeyValueList`.
```tsx
import { Cluster, Stack, Text } from "@slashsuite/ui-react";

<Stack gap="xs">
  <Cluster justify="between">
    <Text as="span">Size</Text>
    <Text as="span">1280×720</Text>
  </Cluster>
  <Cluster justify="between">
    <Text as="span">Changed pixels</Text>
    <Text as="span">0.4%</Text>
  </Cluster>
</Stack>
```

Long values at the default `align="end"` push against the right edge in a ragged column. Long values take `align="start"`.
```tsx
import { KeyValue, KeyValueList } from "@slashsuite/ui-react";

<KeyValueList>
  <KeyValue label="Branch">hc-145-docs-for-every-export</KeyValue>
  <KeyValue label="Commit">83422a6</KeyValue>
  <KeyValue label="Captured">2 min ago</KeyValue>
</KeyValueList>
```

### Accessibility
- `KeyValueList` is a `<dl>`; each `KeyValue` is a `<div>` holding a `<dt>` for the label and a `<dd>` for the value, so a screen reader announces them as terms and definitions.
- `id`, `data-*` and `aria-*` go on the list and on each row.

### Props
### KeyValueList
A definition list of label/value rows. By default each label is on the left and its value right-aligned. `align="start"` puts every value left-aligned in one column beside the labels, which are sized to the widest. While `loading` with no rows it draws three rows of bones.
- align: "end" | "start" (default end). `end` right-aligns each value; `start` puts every value left-aligned in one column beside the labels, sized to the widest.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.

### KeyValue
One row of a KeyValueList: a label on the left, a tabular value on the right (or beside it, in an `align="start"` list). `total` makes it the sum row: a rule above, strong text. `tone` colours the value, on any row: a total that does not reconcile is `total tone="warn"`. While `loading`, a label or value not here yet is a bone.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- label: ReactNode (required). The term, on the left.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- tone: "neutral" | "info" | "positive" | "warn" | "danger" | "muted" | "accent". The meaning of the value, in the colours of a `Table` cell's `tone` (`TextTone`; `neutral`, the default, is the list's ink); the label keeps its ink. Colour alone does not say it, so the value or the label says it too: a sign, a word.
- total: boolean (default false). The sum the rows above add up to: a firm rule above it and the label and value in strong ink.
