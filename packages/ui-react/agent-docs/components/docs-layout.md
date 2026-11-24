## DocsLayout

Group: Page layouts

When to use: Every page of a docs site: a nav of grouped pages, an article with its own headings, and previous and next in reading order.

### The one right way
A docs page is one `DocsLayout`: the nav, the title, `contents` and the neighbours are props, and the layout draws the list and the links.
```tsx
import { DocsLayout, Section, Text } from "@slashsuite/ui-react";

<DocsLayout
  nav={[{ title: "Guides", items: [{ label: "Install", href: "#install", selected: true }] }]}
  navLabel="Docs"
  title="Install"
  contents={[
    { id: "do-setup", label: "Setup", level: 2 },
    { id: "do-run", label: "Run", level: 2 },
  ]}
  next={{ label: "First build", href: "#first-build" }}
>
  <Section id="do-setup" title="Setup">
    <Text>Add the package.</Text>
  </Section>
  <Section id="do-run" title="Run">
    <Text>Capture the stories.</Text>
  </Section>
</DocsLayout>
```

### Full page
A whole docs page in the shell: nav, breadcrumbs, a `Prose` article whose h2 and h3 ids match `contents`, the second heading `current`, and previous and next.
```tsx
import { Breadcrumbs, DocsLayout, Prose, Section, Text } from "@slashsuite/ui-react";

<DemoShell>
  <DocsLayout
    nav={[
      { items: [{ label: "All docs", href: "#docs" }] },
      {
        title: "Get started",
        items: [
          { label: "Install", href: "#install", selected: true },
          { label: "First build", href: "#first-build" },
        ],
      },
      {
        title: "Guides",
        items: [
          { label: "Baselines", href: "#baselines" },
          { label: "Ignore areas", href: "#ignore" },
          { label: "CI", href: "#ci" },
        ],
      },
    ]}
    navLabel="Docs"
    breadcrumbs={<Breadcrumbs items={[{ label: "Docs", href: "#docs" }, "Install"]} />}
    title="Install"
    description="Add the CLI to a project and run its first capture."
    contents={[
      { id: "requirements", label: "Requirements", level: 2 },
      { id: "package", label: "The package", level: 2 },
      { id: "token", label: "A token", level: 3 },
      { id: "check", label: "Check it works", level: 2 },
    ]}
    current="package"
    previous={{ label: "All docs", href: "#docs" }}
    next={{ label: "First build", href: "#first-build" }}
  >
    <Prose>
      <Section id="requirements" title="Requirements">
        <Text>Bun 1.3 or Node 24, and a Storybook that builds.</Text>
      </Section>
      <Section id="package" title="The package">
        <Text>Add the CLI as a dev dependency of the project that owns the stories.</Text>
        <Section id="token" title="A token">
          <Text>Create a token on the server and keep it in the CI secrets.</Text>
        </Section>
      </Section>
      <Section id="check" title="Check it works">
        <Text>Run a capture; the report lists every story it shot.</Text>
      </Section>
    </Prose>
  </DocsLayout>
</DemoShell>
```

### Do
- Give `nav` the docs pages in reading order, in groups: each group's `title` over its links, a group with no title at the top. `navLabel` names the rail and the disclosure it folds behind below `md`.
- Give `contents` the page's own headings (`id`, `label`, `level` 2 or 3) in order; the layout draws the On this page list, a closed disclosure above the article below `xl` and a sticky column right of it from `xl`. With fewer than two there is no list.
- `current` is the id of the heading being read, a value the page passes; a site that follows the reader computes it. Left out, no entry is marked.
- Give `previous` and `next` the pages either side in reading order; they are links, not cards, so they add no heading to the outline.
- Wrap the article in a `Prose`; its `Section` headings start at `h2` under the layout's `h1`.

### Don't
- Do not hand-build a contents list or a pager beside a `SidebarLayout`: that is `DocsLayout`.
- Never put a scroll spy in the page to mark the list; pass `current`.

A `SidebarLayout` with a hand-built contents list and pager: two copies of the rules every docs site must then keep in step. Use `DocsLayout`.
```tsx
import {
  Overline,
  Section,
  SidebarLayout,
  Stack,
  Tabs,
  Text,
  TextLink,
} from "@slashsuite/ui-react";

<SidebarLayout
  aside={
    <Tabs
      orientation="vertical"
      label="Guides"
      items={[{ label: "Install", href: "#install", selected: true }]}
    />
  }
>
  <Stack gap="md">
    <nav aria-label="Contents">
      <Overline>Contents</Overline>
      <TextLink href="#dont-setup">Setup</TextLink> <TextLink href="#dont-run">Run</TextLink>
    </nav>
    <Section id="dont-setup" title="Setup">
      <Text>Add the package.</Text>
    </Section>
    <TextLink href="#first-build">Next: First build</TextLink>
  </Stack>
</SidebarLayout>
```

### Accessibility
- The rail is an `<aside>` named `navLabel`; each group is a `<nav>` named by its title (the top group by `navLabel`), and the current page has `aria-current="page"`.
- The title is the page's one `h1`.
- The On this page list is one `<nav>` named `contentsLabel` at every width, so there is one copy of each link; the entry for `current` has `aria-current="location"`.
- Previous and next are one `<nav>` named from `previousLabel` and `nextLabel`; each link's name is its visible text, the word then the page ("Previous Install").

### Props
### DocsLayout
A docs page: a `SidebarLayout` whose rail is the docs `nav` (each group's title over its links, folded behind a disclosure named `navLabel` below `md`), and a canvas of the page's title, an "On this page" list of its `contents`, the article and the previous and next links. The contents list is rendered once: from `xl` a 12rem column right of the article that sticks under the header, below `xl` a closed disclosure above the article. `current` marks the heading being read; it is a value the page passes (a site that follows the reader computes it), with no scroll spy inside. The previous and next links are links, not cards, so they add no heading to the page's outline.
- breadcrumbs: ReactNode. A `Breadcrumbs` above the title.
- children: ReactNode (required). The article. Wrap long text in a `Prose`.
- contents: DocsHeading[] (default []). The page's own headings, in order. With fewer than two there is no "On this page" list.
- contentsLabel: string (default On this page). The contents list's name and its label.
- current: string. The id of the heading being read: its entry is marked (`aria-current="location"`). A value the page passes, never tracked inside.
- description: ReactNode. The line under the title (a `Lead`).
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- nav: DocsNavGroup[] (required). The docs nav, in reading order: each group's title over a vertical pill list of its pages.
- navLabel: string (required). Names the nav's landmark, and the disclosure it folds behind below `md` ("Docs", "All components").
- next: DocsNeighbour. The page after this one in reading order.
- nextLabel: string (default Next). The word over the next page's label.
- previous: DocsNeighbour. The page before this one in reading order.
- previousLabel: string (default Previous). The word over the previous page's label.
- title: ReactNode (required). The page's title, its `h1`.

### Types
- DocsHeading: `{ id: string; label: string; level: 2 | 3 }`. One entry of "On this page": a heading's id, its text and its level.
- DocsNavGroup: `{ title?: string; items: Tab[] }`. One group of the docs nav: a title over its links (`Tab`s with an `href`). A group with no title is the nav's top.
- DocsNeighbour: `{ label: string; href: string }`. The page before or after this one in reading order.
