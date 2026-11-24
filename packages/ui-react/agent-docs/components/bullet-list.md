## BulletList

Group: Text

When to use: Items that read as a list of points: what changed, what to bring.

### Use instead
- Steps (steps.md): The items are a sequence the reader follows in order.
- Timeline (timeline.md): The items are a history, each with when it happened.

### The one right way
A list is a `BulletList` of `BulletItem`s: the list owns the discs, the indent and the gap.
```tsx
import { BulletItem, BulletList } from "@slashsuite/ui-react";

<BulletList>
  <BulletItem>Moved the nightly build from cron to a queue.</BulletItem>
  <BulletItem>Cut the cold start from nine seconds to two.</BulletItem>
  <BulletItem>Wrote the runbook the team still uses.</BulletItem>
</BulletList>
```

### Do
- Give a `BulletList` `BulletItem` children: each is an `<li>` in the body text.
- Steps a reader follows in order are a `BulletList ordered`: a numbered `<ol>` with the same indent and gap.
- Items that have a label and a value are a `KeyValueList`; a list of records is a `Table` or a `ListRow`.

### Don't
- Never type a hyphen into a paragraph to make a list.

Hyphens typed into paragraphs are not a list: no discs, no indent and no list for a screen reader.
```tsx
import { Stack, Text } from "@slashsuite/ui-react";

<Stack gap="xs">
  <Text>- Moved the nightly build from cron to a queue.</Text>
  <Text>- Cut the cold start from nine seconds to two.</Text>
  <Text>- Wrote the runbook the team still uses.</Text>
</Stack>
```

### Accessibility
- A `BulletList` renders a `<ul>` (an `<ol>` with `ordered`), so a screen reader announces a list and the number of items.
- `id`, `aria-*` and `data-*` go on the list, or on one item.

### Props
### BulletList
A bulleted `<ul>`: discs, indented, a small gap between items. `ordered` makes it a numbered `<ol>` (steps a reader follows in order), with the same indent and gap. Its children are `BulletItem`s.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- ordered: boolean (default false). A numbered `<ol>` instead of the bulleted `<ul>`, for items whose order matters.

### BulletItem
One item of a `BulletList`: an `<li>` in the body text's size and ink (the long-form scale inside a `Prose`). A long unbroken string (a URL, a token) breaks at the edge instead of overflowing.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
