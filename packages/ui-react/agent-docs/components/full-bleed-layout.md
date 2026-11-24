## FullBleedLayout

Group: Page layouts

When to use: A viewer that needs the whole width, such as a snapshot, a canvas or a player; an ordinary page is not.

### The one right way
A viewer that needs the whole width (a snapshot, a canvas, a player) fills it, with the facts in the `aside`.
```tsx
import {
  Button,
  FullBleedLayout,
  KeyValue,
  KeyValueList,
  Overline,
  Text,
} from "@slashsuite/ui-react";

<FullBleedLayout
  aside={
    <>
      <Overline as="h2">Snapshot</Overline>
      <KeyValueList>
        <KeyValue label="Story">Button / Primary</KeyValue>
        <KeyValue label="Changed">0.4%</KeyValue>
      </KeyValueList>
    </>
  }
>
  <Text>The snapshot fills the width.</Text>
</FullBleedLayout>
```

### Full page
A whole viewer page: the shell with `bleed`, then the layout with the viewer in `children` and the facts in `aside`. The `EmptyState` stands in for the app's own viewer.
```tsx
import {
  AppShell,
  Button,
  EmptyState,
  FullBleedLayout,
  KeyValue,
  KeyValueList,
  Tabs,
  Overline,
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
  bleed
>
  <FullBleedLayout
    aside={
      <>
        <Overline as="h2">Snapshot</Overline>
        <KeyValueList>
          <KeyValue label="Story">Button / Primary</KeyValue>
          <KeyValue label="Changed">0.4%</KeyValue>
        </KeyValueList>
      </>
    }
  >
    <EmptyState title="Snapshot viewer">
      <Text>Your viewer goes here and fills the width.</Text>
    </EmptyState>
  </FullBleedLayout>
</AppShell>
```

### Do
- Render it in an `AppShell` with `bleed`; the canvas starts at the viewport's start edge.
- It adds no padding and has no page title; the canvas is the `children`. Set `padded` when the body is not a viewer and should have the other layouts' page padding.
- Put the facts about what is shown in `aside`, a `KeyValueList` under an `Overline`. From `lg` the aside is a fixed-width column at the end; below it, it stacks under the canvas.
- Omit `aside` when the canvas stands alone.
- `asideLabel` names the aside's landmark. Set it when the page has another complementary landmark.
- `bar` is a full-width row above the canvas and the panel, such as a viewer's title and its actions in a `Cluster justify="between"`. It is a `StickyBar`: it sticks under the shell's header as the page scrolls; `padded` does not pad it.
- A page with a title and content is `ListLayout` or `DetailLayout`.

### Don't
`FullBleedLayout` adds no padding unless `padded`, so an ordinary page lands on the screen edge. A page with a title is a `ListLayout` or `DetailLayout`.
```tsx
import { Card, FullBleedLayout, Text } from "@slashsuite/ui-react";

<FullBleedLayout>
  <Card title="Quotes">
    <Text>Every quote you have sent.</Text>
  </Card>
</FullBleedLayout>
```

### Accessibility
- The `aside` is an `<aside>`, a complementary landmark; give it a heading with `Overline as="h2"`, or name it with `asideLabel`.
- The canvas comes first in the DOM, then the panel.

### Props
### FullBleedLayout
Edge-to-edge `children` with an optional `aside` at the end (`lg:w-72`) that stacks below on a smaller screen. Render it in `<AppShell bleed>`. It deliberately breaks the shared start edge: a viewer that needs the whole width has no Container of its own, so `children` start at the viewport's start edge. `padded` gives them the Container's padding instead (`px-4`, `sm:px-6`, `py-8`), for a page of ordinary content beside a full-height `aside`. A `bar` is a `StickyBar` above both: the full width, on the surface with a bottom line, sticking under AppShell's header as the page scrolls. While `loading` it owns the wait and passes it to everything inside, the header too.
- aside: ReactNode. A side column on the right (`lg:w-72`) on a tinted surface; below `lg` it stacks under `children`.
- asideLabel: string. Names the `<aside>` landmark (`aria-label`). Left out, it is unnamed.
- bar: ReactNode. A full-width row above `children` and `aside` that sticks under the header, e.g. a viewer's title and actions. `padded` does not pad it.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- padded: boolean (default false). Pads `children` as the Container pads every other page. Off, they run to the viewport's edges.
A notice in the column is a plain `Callout` in a `Stack`, never a `Callout banner`.
