## MetaList

Group: Text

When to use: The facts about a record under its title (branch, SHA, date), or a footer's row of links (Privacy, Terms, Contact).

### Use instead
- Table (table.md): Many records with the same columns, to read across and compare.
- KeyValueList (key-value-list.md): One record's fields, one per line, each label beside its value.
- ListRow (list-row.md): Each item is a thing to open, on a row of its own.

### The one right way
A row of facts is a `MetaList`; an item is text, a `Code` or a `TextLink`.
```tsx
import { Code, MetaList, TextLink } from "@slashsuite/ui-react";

<MetaList>
  <TextLink href="#hc-145">hc-145</TextLink>
  <Code>0f9d376</Code>
  <span>26 Oct 2026</span>
</MetaList>
```

### Do
- Each child is one item: text, a `Code` or a `TextLink`.
- `separator` is `·` (default), `•` or `none`.
- An item never breaks inside itself; the row wraps between items.
- `mono` sets the whole row in the monospace face, for ids and paths.
- A labelled fact is a `KeyValueList`.

### Don't
- Never type the separators yourself: a wrap can leave one at the start of a line, and a screen reader reads them.

Dots typed into one string are one item to a screen reader and can wrap onto the end of a line.
```tsx
import { Caption } from "@slashsuite/ui-react";

<Caption>hc-145 · 0f9d376 · 26 Oct 2026</Caption>

```

Separators typed by hand are read aloud and can wrap onto the end of a line.
```tsx
import { Prose, TextLink } from "@slashsuite/ui-react";

<Prose as="p">
  <TextLink href="#privacy">Privacy</TextLink> | <TextLink href="#terms">Terms</TextLink> |{" "}
  <TextLink href="#contact">Contact</TextLink>
</Prose>
```

### Accessibility
- A `MetaList` renders a `<ul>` with an `<li>` per item.
- The separators are `aria-hidden` and trail every item but the last, held to their item like a comma, so a wrap never leaves one at the start of a line.
- Each link keeps its own focus ring; the row adds no extra tab stop.
- `aria-*` and `data-*` go on the list.

### Props
### MetaList
A wrapping row of facts or links in muted small text, joined by a `·`: branch · SHA · date, or a footer's Privacy · Terms · Email. An item is text, a `Code` or a `TextLink`. The separator is `aria-hidden` and trails each item but the last, held to its item like a comma, so a wrap leaves it at the end of a line and never at the start; `separator` swaps it for a `•` or none. An item never breaks inside itself: the row wraps between items. `mono` sets the whole row in the monospace face, for ids and paths. While `loading` with no items it draws three word-sized bones.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- mono: boolean (default false). The whole row in the monospace face, for ids and paths.
- separator: "none" | "·" | "•" (default ·). The mark between items: `·`, `•`, or `none` for a gap alone.

### Types
- MetaListSeparator: `"none" | "·" | "•"`. The mark between MetaList items: `·`, `•`, or `none` for a gap alone.
