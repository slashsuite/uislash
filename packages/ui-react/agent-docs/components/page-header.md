## PageHeader

Group: Layout

When to use: The first block of every page but a landing page, which opens with a `Hero`; it puts the page's first content at the same y on every page.

### The one right way
Breadcrumbs, title, description, actions and tabs are slots of one `PageHeader`; each is optional.
```tsx
import { Breadcrumbs, Button, Tabs, PageHeader } from "@slashsuite/ui-react";

<PageHeader
  breadcrumbs={
    <Breadcrumbs
      items={[
        { label: "Hack Cove", href: "#project" },
        { label: "Builds", href: "#builds" },
        "Build 412",
      ]}
    />
  }
  title="Build 412"
  description="main · 3 changed"
  actions={
    <>
      <Button variant="outline">Reject</Button>
      <Button>Accept all</Button>
    </>
  }
  tabs={
    <Tabs
      label="Build"
      items={[
        { label: "Changed", href: "#changed", selected: true },
        { label: "New", href: "#new" },
      ]}
    />
  }
/>
```

### Do
- Pass `title`, and `description`, `breadcrumbs`, `actions` and `tabs` as needed; never build a title row from a heading and a `Cluster`.
- `actions` sit beside the title from `sm` up and under it on a phone: a `Button` or two, one primary.
- `breadcrumbs` take a `Breadcrumbs`; `tabs` take `Tabs` of links to pages.
- Its fixed bottom margin gives every page the same first-block position. As a direct child of a `Stack` it has none and the Stack's `gap` is the only space, so do not wrap it in another element.
- One `PageHeader` per page: it holds the page's `<h1>`. A landing page has a `Hero` in its place.

### Don't
A title row built from a heading, a description and a `Cluster` is a second header that drifts from every other page's. Use `PageHeader`.
```tsx
import { Button, Cluster, PageHeading, Stack, Text } from "@slashsuite/ui-react";

<Cluster justify="between">
  <Stack gap="xs">
    <PageHeading>Build 412</PageHeading>
    <Text>main · 3 changed</Text>
  </Stack>
  <Button>Accept all</Button>
</Cluster>
```

Wrapped in a `div`, the header is no longer a direct child of the Stack, keeps its margin and doubles the space.
```tsx
import { Card, PageHeader, Stack, Text } from "@slashsuite/ui-react";

<Stack gap="lg">
  <div>
    <PageHeader title="Members" description="Who can see this project." />
  </div>
  <Card title="Active">
    <Text>3 members</Text>
  </Card>
</Stack>
```

### Accessibility
- The title is the page's `<h1>`; the description is a paragraph.
- `Breadcrumbs` is a `<nav>` named Breadcrumb, with the last crumb marked `aria-current="page"`. Give the `Tabs` a `label`.
- On a narrow screen the actions move below the title.

### Props
### PageHeader
The top of a page: breadcrumbs, title, description, actions and tabs. Its fixed bottom margin puts every page's first block at the same y; as a direct child of a `Stack` it has none, so the Stack's gap is the only space under it. While `loading` it is the owner of the wait: what it has is drawn and an empty title is a bone.
- actions: ReactNode. Right of the title on `sm` and up, below it on a phone.
- breadcrumbs: ReactNode. A `Breadcrumbs` above the title.
- description: ReactNode. The lede under the title: a `Lead`, so it outranks the body text after it.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- tabs: ReactNode. A `Tabs` (or similar) under the title.
- title: ReactNode (required). The page's `h1`.
