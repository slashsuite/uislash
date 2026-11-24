## SidebarLayout

Group: Page layouts

When to use: A section with several sub-pages, such as settings, where the rail is the way between them.

### The one right way
A vertical pill `Tabs` is the rail: a short list of sections beside the page.
```tsx
import { Card, Tabs, PageHeader, SidebarLayout, Text } from "@slashsuite/ui-react";

<SidebarLayout
  aside={
    <Tabs
      orientation="vertical"
      label="Settings"
      items={[
        { label: "Profile", href: "#profile", selected: true },
        { label: "Billing", href: "#billing" },
        { label: "Team", href: "#team" },
      ]}
    />
  }
>
  <PageHeader title="Profile" description="Your name and email." />
  <Card title="Account">
    <Text>Naledi Mokoena, naledi@example.com</Text>
  </Card>
</SidebarLayout>
```

### Full page
A whole page with a rail: the shell with its brand and nav, then the layout with a vertical `Tabs` in `aside` and the page in `children`.
```tsx
import {
  AppShell,
  Button,
  Card,
  Tabs,
  PageHeader,
  SidebarLayout,
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
  <SidebarLayout
    aside={
      <Tabs
        orientation="vertical"
        label="Organisations"
        items={[
          { label: "Hack Cove", href: "#hack-cove", selected: true },
          { label: "Acme", href: "#acme" },
          { label: "Northwind", href: "#northwind" },
        ]}
      />
    }
  >
    <PageHeader
      title="Hack Cove"
      description="3 projects"
      actions={<Button>New project</Button>}
    />
    <Card title="Projects">
      <Text>Storybook, Dashboard, Site.</Text>
    </Card>
  </SidebarLayout>
</AppShell>
```

### Do
- The `aside` is `Tabs` of links with `orientation="vertical"` (the pill rail), one link per section and the current one `selected`.
- The `children` are the section's page: its `PageHeader`, then the content.
- From `md` the rail is a fixed width beside the page; below it, the rail stacks above the page.
- From `md` the rail stays in view under the shell's header as a long page scrolls, with or without `asideLabel`; it is always on, not an option. A rail taller than the screen scrolls inside itself, so its last link is reachable. Below `md` nothing sticks.
- The rail has no background or border: it is a list of links on the page.
- Once the page has loaded, a rail that scrolls shows its current link (the one with `aria-current`) in view, with its own thin scrollbar, and the folded disclosure reads `asideLabel` and the current link, such as "All components: Button". Nothing to set; in Astro, hydrate the layout (`client:load`).
- Facts about one record go in `DetailLayout`'s aside, not a rail.
- A docs site uses `DocsLayout`, which is this rail with the docs page's title, contents list and neighbours fixed.

### Don't
The default, horizontal pill `Tabs` wraps into a ragged block in the rail. Give the rail `orientation="vertical"`.
```tsx
import { Card, Tabs, PageHeader, SidebarLayout, Text } from "@slashsuite/ui-react";

<SidebarLayout
  aside={
    <Tabs
      label="Settings"
      items={[
        { label: "Profile", href: "#profile", selected: true },
        { label: "Billing", href: "#billing" },
        { label: "Team", href: "#team" },
      ]}
    />
  }
>
  <PageHeader title="Profile" description="Your name and email." />
  <Card title="Account">
    <Text>Naledi Mokoena, naledi@example.com</Text>
  </Card>
</SidebarLayout>
```

### Accessibility
- The rail is an `<aside>` holding the `Tabs`, which is a `<nav>` named by its `label`. `asideLabel` also names the `<aside>`, so a page with a second complementary landmark (a `DetailLayout` aside) can tell them apart.
- The current link has `aria-current="page"`.
- In the DOM the rail comes first, so it is first in the tab order; folded, the summary is that first stop and the links are skipped until it is opened.
- With `asideLabel` the rail is a native `<details>` disclosure: its `<summary>` is the toggle, on the keyboard like any button. From `md` the `<details>` is open for real (after the page loads; before that, and with no JavaScript, the CSS shows it), so the links are in the accessibility tree.
- A rail that scrolls itself is still in the tab order, and a focus ring on a link in it is not cut off at the rail's edge. A rail of links has no tab stop of its own; a rail that scrolls and holds no link takes one, named by `asideLabel`.

### Props
### SidebarLayout
An `aside` of links (the rail) beside the `children` canvas, in the Container the shell already gives every page (a plain `<AppShell>`, no `bleed`): the rail starts at the header logo's x and the canvas ends at the header's right edge. The rail has no background and no border, so it is a list of links on the page; a `Tabs orientation="vertical"` is its content. From `md` it is `w-56` with the canvas filling the rest, and it stays in view under the shell's header as a long page scrolls; a rail taller than the screen scrolls itself, so its last link is reachable. Below `md` it stacks above the canvas and nothing sticks. A long rail sets `asideLabel`: below `md` it then folds behind a disclosure of that name, closed, so the page comes first on a phone, and from `md` it is the same rail; `asideLabel` also names the rail's `<aside>` landmark. Once the page has loaded, a rail that scrolls shows its current link (the one with `aria-current`) in view, and the folded disclosure reads `asideLabel` and the current link's name ("All components: Button"); both need the layout to hydrate. While `loading` the canvas waits (the rail is navigation, drawn as itself) and the layout owns the wait.
- aside: ReactNode (required). The links beside the canvas, usually a `Tabs orientation="vertical"`.
- asideLabel: string. Folds the rail behind a disclosure with this name below `md` (a long rail), and names the rail's
`<aside>` landmark. Left out, the rail is always open and the aside is unnamed.

Folded, the page comes first on a phone; from `md` it is the same rail.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
