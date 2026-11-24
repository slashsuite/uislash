## ListLayout

Group: Page layouts

When to use: An index of quotes, builds, members or any other collection; a single record is `DetailLayout`.

### The one right way
`filters` sit under the header, then the rows: one `Card` per item.
```tsx
import {
  Button,
  ButtonGroup,
  Card,
  Fieldset,
  ListLayout,
  Pill,
  Text,
} from "@slashsuite/ui-react";

<ListLayout
  title="Quotes"
  description="Every quote you have sent."
  actions={<Button>New quote</Button>}
  filters={
    <Fieldset label="Status">
      <ButtonGroup>
        <Button variant="outline" size="sm" pressed>
          All
        </Button>
        <Button variant="outline" size="sm" pressed={false}>
          Sent
        </Button>
      </ButtonGroup>
    </Fieldset>
  }
>
  <Card as="article" title="Naledi Mokoena" status={<Pill tone="positive">Accepted</Pill>}>
    <Text>Q-1042 · R 1 240 / mo</Text>
  </Card>
  <Card as="article" title="Pieter van Wyk" status={<Pill tone="neutral">Sent</Pill>}>
    <Text>Q-1041 · R 860 / mo</Text>
  </Card>
</ListLayout>
```

### Full page
A whole list page: the shell with its brand and nav, then the layout with its filters and rows.
```tsx
import {
  AppShell,
  Button,
  ButtonGroup,
  Card,
  Fieldset,
  ListLayout,
  Tabs,
  Text,
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
  <ListLayout
    title="Quotes"
    description="Every quote you have sent."
    actions={<Button>New quote</Button>}
    filters={
      <Fieldset label="Status">
        <ButtonGroup>
          <Button variant="outline" size="sm" pressed>
            All
          </Button>
          <Button variant="outline" size="sm" pressed={false}>
            Sent
          </Button>
          <Button variant="outline" size="sm" pressed={false}>
            Accepted
          </Button>
        </ButtonGroup>
      </Fieldset>
    }
  >
    <Card as="article">
      <Text strong>Naledi Mokoena</Text>
      <Text>Q-1042 · R 1 240 / mo</Text>
    </Card>
    <Card as="article">
      <Text strong>Pieter van Wyk</Text>
      <Text>Q-1041 · R 860 / mo</Text>
    </Card>
  </ListLayout>
</AppShell>
```

### Do
- Put the page's title, `description` and primary `actions` in the header props; `breadcrumbs` and `tabs` go there too.
- `filters` sit between the header and the list: a `Fieldset` of pressed-toggle `Button`s in a `ButtonGroup`.
- The items are the `children`, one `Card` per item, or a `Table`; the layout spaces them.
- Give `empty` an `EmptyState` that says what is missing and what to do next: it shows when there are no children, and with no `empty` an empty list is a blank page.

### Don't
- Do not build the header and the list by hand with `PageHeader` and `Stack`: the layout is the one right header, filters and list.

A one-off header and stack drifts from every other list page; `ListLayout` is the one header, filters and list.
```tsx
import { Card, PageHeader, Stack, Text } from "@slashsuite/ui-react";

<Stack>
  <PageHeader title="Quotes" description="Every quote you have sent." />
  <Card as="article" title="Naledi Mokoena">
    <Text>Q-1042 · R 1 240 / mo</Text>
  </Card>
</Stack>
```

A muted line as `empty` says nothing is here and offers no way forward: a dead end.
```tsx
import { ListLayout, Text } from "@slashsuite/ui-react";

<ListLayout
  title="Quotes"
  description="Every quote you have sent."
  empty={<Text tone="muted">No quotes yet.</Text>}
/>
```

### Accessibility
- The title is the page's `h1`.
- `filters` and `children` render as given, so each filter group keeps its own `fieldset` and legend.
- `data-*` and `aria-*` go on the list's wrapper.

### Props
### ListLayout
A list page: header, an optional `filters` slot, then the list, or `empty` when there are no children. While `loading` it owns the wait and passes it to everything inside, the header too. With no children yet it draws a card of row bones, never `empty`.
- actions: ReactNode. Right of the title on `sm` and up, below it on a phone.
- breadcrumbs: ReactNode. A `Breadcrumbs` above the title.
- description: ReactNode. The lede under the title: a `Lead`, so it outranks the body text after it.
- empty: ReactNode. Shown in place of `children` when there are none (no rows, an empty array, `null`): an `EmptyState`.
- filters: ReactNode. A row between the header and the list, e.g. a `Fieldset` of chips or an `Input type="search"`.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- tabs: ReactNode. A `Tabs` (or similar) under the title.
- title: ReactNode (required). The page's `h1`.
