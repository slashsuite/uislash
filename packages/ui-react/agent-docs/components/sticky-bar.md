## StickyBar

Group: Layout

When to use: A page's filters or bulk actions that must stay in reach while a long `bleed` page scrolls.

### The one right way
The page's filters and its bulk action go in one `StickyBar`, so they stay in reach under the header as the list scrolls.
```tsx
import { Button, Cluster, Input, StickyBar } from "@slashsuite/ui-react";

<StickyBar>
  <Cluster justify="between">
    <Input aria-label="Filter builds" placeholder="Filter builds" width="auto" />
    <Button size="sm" variant="outline">
      Accept all
    </Button>
  </Cluster>
</StickyBar>
```

### Do
- Put it first in an `AppShell bleed` page; it spans its parent and sticks just under the shell's header as the page scrolls.
- It draws the surface, the bottom line and the padding; its `children` are the row, such as a `Cluster justify="between"` of filters and an action.
- `FullBleedLayout`'s `bar` is a `StickyBar`; with that layout, pass the row as `bar` instead.
- Write no `sticky` row of your own.

### Don't
Filters in a `Card` at the top of the page scroll away with it, so the action is out of reach halfway down a long list. Use `StickyBar`.
```tsx
import { Button, Card, Cluster, Input } from "@slashsuite/ui-react";

<Card>
  <Cluster justify="between">
    <Input aria-label="Filter builds" placeholder="Filter builds" width="auto" />
    <Button size="sm" variant="outline">
      Accept all
    </Button>
  </Cluster>
</Card>
```

### Accessibility
- It is a plain `<div>`, not a landmark; it sits in the page's `<main>` and its controls keep their own names.
- `aria-*` and `data-*` props go on the root element.

### Props
### StickyBar
A full-width row that sticks under AppShell's header as the page scrolls: a filter or actions bar, or a viewer's title and its actions. It sits on the surface with a bottom line and pads its content as the Container pads a page. Put a `Cluster` in it for the row's layout. It spans its parent, so it belongs at the top of an `AppShell bleed` page; `FullBleedLayout`'s `bar` is one.
- children: ReactNode (required). The bar's content, usually one `Cluster` (`justify="between"` for a title and its actions).
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
