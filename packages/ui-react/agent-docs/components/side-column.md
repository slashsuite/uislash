## SideColumn

Group: Layout

When to use: Any main area beside a side panel, such as a thread beside its assistant or a record beside its facts; a whole page with a header is `DetailLayout`, which is this split under a `PageHeader`.

### The one right way
A main area and a side column of a known width are a `SideColumn`: the aside is exactly as wide as `asideWidth`, whatever it holds.
```tsx
import { Card, SideColumn, Text } from "@slashsuite/ui-react";

<SideColumn
  aside={
    <Card title="Reply agent">
      <Text>Ask for a draft, then edit it before it is sent.</Text>
    </Card>
  }
>
  <Card title="Thread">
    <Text>The main area takes everything the aside leaves.</Text>
  </Card>
</SideColumn>
```

### Do
- `children` are the main area and `aside` is the side column. From `lg` the aside is `asideWidth` wide on the right and the main area takes the room left; below `lg` the aside stacks under the main area.
- `asideWidth` is `sm` (18rem), `md` (24rem, the default) or `third` (one third of the row, the main area two thirds). `sm` and `md` are exact, whatever the aside holds; there is no other width.
- `sticky` keeps the aside in view from `lg` as a long page scrolls: it sticks under the header and, when it is taller than the screen, scrolls itself.
- `asideLabel` is for an aside that should not take a phone's screen: below `lg` it folds, closed, behind a disclosure of that name, and from `lg` it is the same column, always shown, with no toggle. The aside stays mounted while folded, so state inside it is kept. Left out, the aside is always shown. It also names the aside's landmark.
- It sets no page width, padding or header of its own: put it inside a layout, a `Card` or a panel. Space inside each column with a `Stack`.
- `DetailLayout`'s aside is a `SideColumn asideWidth="third"`, so a split inside a page that wants the thirds is `SideColumn asideWidth="third"`, never a `CardGrid`. A rail of links on the left is `SidebarLayout`. A `Stack` with `rowFrom` and a `ClusterGrow` sizes the side by its content, so it is not a fixed column.

### Don't
A `Stack` with `rowFrom` and a `ClusterGrow` sizes the side by its content: a long line makes it wide and takes the room from the main area.
```tsx
import { Card, ClusterGrow, Overline, Stack, Text } from "@slashsuite/ui-react";

<Stack rowFrom="lg">
  <ClusterGrow>
    <Card title="Thread">
      <Text>The main area takes what is left.</Text>
    </Card>
  </ClusterGrow>
  <Card>
    <Overline>Reply agent</Overline>
    <Text>
      Whatever width the aside's text wants is the width it takes, so it changes with its words.
    </Text>
  </Card>
</Stack>
```

### Accessibility
- The side column is an `<aside>`, a complementary landmark; the main area is a plain `div`. Give the aside a heading, or set `asideLabel`, which also names it, when it needs a name.
- In the DOM the main area comes first and the aside second, so that is the reading and tab order on every screen.
- A `sticky` aside that is taller than the screen and holds no link or field takes a tab stop of its own, named by `asideLabel`, so the keyboard can scroll it.
- With `asideLabel` the aside is a native `<details>` disclosure below `lg`: its `<summary>` is the toggle, on the keyboard like any button. From `lg` the summary is gone and, once the page has loaded, the `<details>` is open for real, so the aside is in the accessibility tree.

### Props
### SideColumn
A main area beside a side column, in the Container the page already has: from `lg` the `aside` is `asideWidth` on the right and `children` take the room left; below `lg` the aside stacks under `children`. It sets no page width, padding or header of its own, so it sits inside a layout, a `Card` or a panel. `asideWidth` is `sm` (18rem), `md` (24rem) or `third` (one third of the row, the main area two thirds: the split `DetailLayout` draws). A rail of links on the left is `SidebarLayout`. `asideLabel` is for an aside that should not take the phone's screen: below `lg` it folds, closed, behind a native disclosure of that name, and from `lg` it is the same column, always shown. The aside stays mounted while folded, so a conversation or a draft inside it is kept. `sticky` keeps the aside in view from `lg` as a long page scrolls: it sticks under AppShell's header and, if it is taller than the room left, scrolls itself (a tab stop named by `asideLabel`) so its end stays reachable.
- aside: ReactNode (required). The side column: `asideWidth` wide on the right from `lg`, under `children` below it.
- asideLabel: string. Folds the aside behind a disclosure with this name below `lg`, and names the `<aside>` landmark. Left out, the aside is always shown and unnamed.
- asideWidth: "sm" | "md" | "third" (default md). The aside's width from `lg`: `sm` 18rem, `md` 24rem, or `third`, one third of the row.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- sticky: boolean (default false). From `lg`, keeps the aside in view under the header as the page scrolls; an aside taller than
the screen scrolls inside itself.

### Types
- SideColumnWidth: `"sm" | "md" | "third"`. How wide a `SideColumn`'s aside is from `lg`: `sm` 18rem, `md` 24rem, or `third` a third of the row.
