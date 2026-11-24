## DetailLayout

Group: Page layouts

When to use: One quote, build or member, with its content in the main column and its facts in the aside.

### The one right way
The record's content is the main column; the facts about it go in `aside`.
```tsx
import {
  Button,
  Card,
  DetailLayout,
  KeyValue,
  KeyValueList,
  Text,
} from "@slashsuite/ui-react";

<DetailLayout
  title="Quote Q-1042"
  description="Naledi Mokoena"
  actions={<Button variant="outline">Edit</Button>}
  aside={
    <Card title="Details">
      <KeyValueList>
        <KeyValue label="Status">Sent</KeyValue>
        <KeyValue label="Premium">R 1 240 / mo</KeyValue>
      </KeyValueList>
    </Card>
  }
>
  <Card title="Cover">
    <Text>Life cover of R 1 500 000, to age 65.</Text>
  </Card>
</DetailLayout>
```

### Full page
A whole record page: the shell with its brand and nav, then the layout with the record in `children` and its facts in `aside`.
```tsx
import {
  AppShell,
  Button,
  Card,
  DetailLayout,
  KeyValue,
  KeyValueList,
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
  <DetailLayout
    title="Quote Q-1042"
    description="Naledi Mokoena"
    actions={<Button variant="outline">Edit</Button>}
    aside={
      <Card title="Details">
        <KeyValueList>
          <KeyValue label="Status">Sent</KeyValue>
          <KeyValue label="Premium">R 1 240 / mo</KeyValue>
        </KeyValueList>
      </Card>
    }
  >
    <Card title="Cover">
      <Text>Life cover of R 1 500 000, to age 65.</Text>
    </Card>
    <Card title="Notes">
      <Text>The client asked to be debited on the 25th.</Text>
    </Card>
  </DetailLayout>
</AppShell>
```

### Do
- The record's content is the `children`, in the main two thirds; they are spaced as a `Stack`, so give each block its own `Card`.
- The facts about the record go in `aside`, in the third beside it: a `Card` with a `KeyValueList`, a status, the people on it.
- Both columns are required: with nothing for the aside, use `ListLayout`.
- From `lg` the aside sits beside the content; below it, it stacks under the content.
- `sticky` keeps the aside in view from `lg` as a long page scrolls: it sticks under the shell's header, and an aside taller than the room left scrolls inside itself, so its end stays reachable. Leave it off when the aside is ordinary cards that may be taller than the screen; below `lg` it stacks either way.
- `asideLabel` names the aside's landmark. Set it when the page has another complementary landmark (a `SidebarLayout` rail, a `FullBleedLayout` panel), so a screen reader can tell them apart. It only names the aside; `DetailLayout` never folds it.
- The header props are the same as `ListLayout`: `breadcrumbs`, `title`, `description`, `actions`, `tabs`.

### Don't
`ListLayout` has no aside, so the facts become one more block under the content. Use `DetailLayout` for a record.
```tsx
import {
  Button,
  Card,
  KeyValue,
  KeyValueList,
  ListLayout,
  Text,
} from "@slashsuite/ui-react";

<ListLayout
  title="Quote Q-1042"
  description="Naledi Mokoena"
  actions={<Button variant="outline">Edit</Button>}
>
  <Card title="Cover">
    <Text>Life cover of R 1 500 000, to age 65.</Text>
  </Card>
  <Card title="Details">
    <KeyValueList>
      <KeyValue label="Status">Sent</KeyValue>
      <KeyValue label="Premium">R 1 240 / mo</KeyValue>
    </KeyValueList>
  </Card>
</ListLayout>
```

### Accessibility
- The title is the page's `h1`.
- The aside is an `<aside>`, a complementary landmark; the main column is a plain `div`.
- In the DOM the content comes first and the aside second, so that is the reading and tab order on every screen.
- With `sticky` a scrolling aside is still in the tab order, and a focus ring on a control in it is not cut off at its edge. An aside that scrolls and holds no link, field or button (plain text) takes one tab stop, named by `asideLabel`, so the keyboard can scroll it; an aside with a control in it takes none.

### Props
### DetailLayout
A detail page: header, then `children` (two thirds from `lg`) beside `aside` (one third), which stacks below on a smaller screen: a `SideColumn asideWidth="third"` under a `PageHeader`. `sticky` keeps the aside in view from `lg` as a long page scrolls: it sticks under AppShell's header and, if it is taller than the room left, scrolls itself so its end stays reachable. While `loading` it owns the wait and passes it to everything inside, the header too.
- actions: ReactNode. Right of the title on `sm` and up, below it on a phone.
- aside: ReactNode (required). The side column: one third from `lg`, below `children` on a smaller screen.
- asideLabel: string. Names the aside's landmark (`aria-label`), so a page with another complementary landmark can tell them apart. It does not fold the aside. Left out, the aside is unnamed.
- breadcrumbs: ReactNode. A `Breadcrumbs` above the title.
- description: ReactNode. The lede under the title: a `Lead`, so it outranks the body text after it.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- sticky: boolean (default false). From `lg`, keeps the aside in view under the header as the page scrolls; an aside taller than
the screen scrolls inside itself. Off by default, since an aside of ordinary cards may be
taller than the screen. Below `lg` the aside stacks as ever.
- tabs: ReactNode. A `Tabs` (or similar) under the title.
- title: ReactNode (required). The page's `h1`.
