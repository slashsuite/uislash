## CardGrid

Group: Layout

When to use: Several cards or `StatTile`s of the same weight that should sit side by side on a wide screen.

### The one right way
Tiles go in a `CardGrid`: one column on a phone, two from `sm`, `columns` from `lg`.
```tsx
import { CardGrid, StatTile } from "@slashsuite/ui-react";

<CardGrid columns={3}>
  <StatTile label="Open" value="12" />
  <StatTile label="Won" value="8" tone="positive" />
  <StatTile label="Lost" value="3" tone="danger" />
</CardGrid>
```

### Full page
A whole dashboard page: the shell with its brand and nav, then a `PageHeader` and a `CardGrid` of tiles.
```tsx
import {
  AppShell,
  CardGrid,
  Tabs,
  PageHeader,
  Stack,
  StatTile,
} from "@slashsuite/ui-react";

<AppShell
  brand={<a href="#">Hack Cove</a>}
  nav={
    <Tabs
      label="Main"
      items={[
        { label: "Quotes", href: "#quotes", selected: true },
        { label: "Clients", href: "#clients" },
      ]}
    />
  }
>
  <Stack gap="xl">
    <PageHeader title="Business" description="This month at a glance." />
    <CardGrid columns={3}>
      <StatTile label="Open" value="12" />
      <StatTile label="Won" value="8" tone="positive" />
      <StatTile label="Lost" value="3" tone="danger" />
    </CardGrid>
  </Stack>
</AppShell>
```

### Do
- Use `columns` 2, 3 or 4 when you know how many; it is one column on a phone, two from `sm` and `columns` from `lg`.
- Use `columns="auto"` when the count varies: it fits as many per row as the width allows, none narrower than `minWidth` (`md`, the default, or `sm`).
- Every tile in a `CardGrid` is one width. A main card beside a narrower one is a `SideColumn` (`asideWidth="third"` for two thirds and one third), not a grid.
- `align="start"` keeps each card its own height; by default every card stretches to the tallest in its row.
- `CardGrid` goes inside a page layout; it sets no page width of its own.
- A single column of blocks is a `Stack`, not a one-column `CardGrid`.
- `as="ul"` makes the grid a list and wraps each child in a list item, for a set of like tiles a screen reader should count. The look is the same.
- `empty` is an `EmptyState`, drawn in place of the grid when it has no children.

### Don't
A `Stack` is one column, so the tiles never sit side by side and the page runs long. Use a `CardGrid`.
```tsx
import { Stack, StatTile } from "@slashsuite/ui-react";

<Stack>
  <StatTile label="Open" value="12" />
  <StatTile label="Won" value="8" tone="positive" />
  <StatTile label="Lost" value="3" tone="danger" />
</Stack>
```

A fixed `columns={4}` for a count that varies leaves the row part empty when there are three. When the count varies, use `columns="auto"`.
```tsx
import { Card, CardGrid, Text } from "@slashsuite/ui-react";

<CardGrid columns={4} align="start">
  <Card title="Dashboard">
    <Text>Quotes and renewals this week.</Text>
  </Card>
  <Card title="Billing">
    <Text>Invoices and payments.</Text>
  </Card>
  <Card title="Members">
    <Text>Who can sign in.</Text>
  </Card>
</CardGrid>
```

### Accessibility
- The grid is a plain `div` with no role: the cards keep their own order and semantics. With `as="ul"` it is a list, and each child is a list item.
- The order is the DOM order, so the tab order follows the reading order.

### Props
### CardGrid
A responsive grid of tiles of one width: one column on a phone, two from `sm`, `columns` from `lg`. A main area beside a narrower one is not a grid of tiles: it is `SideColumn` (`asideWidth="third"` for two thirds and one). `columns="auto"` instead fits as many per row as the width allows, each at least `minWidth` wide: `md` (17rem, the default) or `sm` (12rem). `align="start"` keeps each card its own height instead of stretching it to the tallest in its row. `as="ul"` makes it a list of cards for a screen reader: the grid is a `<ul>` and each child is wrapped in an `<li>`, still stretched. With no children it draws `empty` (an `EmptyState`) in place of the grid. While `loading` with none it draws one card of bones per column (three for `auto`), never `empty`.
- align: "start" | "stretch" (default stretch). `start` keeps each card its own height; the default stretches every card to the tallest in its row.
- as: "div" | "ul" (default div). `ul` makes the grid a list: each child is wrapped in an `<li>`. Default `div`.
- columns: "auto" | 2 | 3 | 4 (default 3). Cards per row from `lg` (one on a phone, two from `sm`), or `auto` for as many as fit.
- empty: ReactNode. Drawn in place of the grid when there are no children: an `EmptyState`.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- minWidth: "sm" | "md" (default md). With `columns="auto"`, the narrowest a card gets: `md` 17rem or `sm` 12rem.
