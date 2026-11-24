## Breadcrumbs

Group: Navigation

When to use: A page several levels deep that needs a way back up: org, project, build, snapshot.

### The one right way
A parent crumb is `{ label, href }` and the last is plain text: the trail that leads back up, ending at the current page.
```tsx
import { Breadcrumbs } from "@slashsuite/ui-react";

<Breadcrumbs
  items={[
    { label: "Projects", href: "#projects" },
    { label: "Launch film", href: "#launch-film" },
    "Shots",
  ]}
/>
```

### Do
- Give the trail in order, parents first. A parent that links is `{ label, href }`, drawn through the app's `LinkProvider` for an in-app path; the last crumb is the current page, plain text.
- Breadcrumbs show a hierarchy. Peer sections are `Tabs` of links.
- Each crumb truncates, so a long name does not widen the row.
- Put the trail in the `breadcrumbs` slot of a `PageHeader`.

### Don't
Parents given as plain text look like the trail but lead nowhere, so a reader cannot go back up.
```tsx
import { Breadcrumbs } from "@slashsuite/ui-react";

<Breadcrumbs items={["Projects", "Launch film", "Shots"]} />

```

Siblings are not a hierarchy: switching between peer sections is `Tabs` of links.
```tsx
import { Breadcrumbs } from "@slashsuite/ui-react";

<Breadcrumbs
  items={[
    { label: "Quotes", href: "#quotes" },
    { label: "Invoices", href: "#invoices" },
    "Receipts",
  ]}
/>
```

### Accessibility
- `<nav aria-label="Breadcrumb">` around an ordered list.
- The last item has `aria-current="page"` and is never a link.
- The `/` separators are `aria-hidden`.

### Props
### Breadcrumbs
`org / project / build / snapshot`: each crumb truncates, and the last is the current page. A crumb is a node, or a `Crumb` object when it links.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- items: (ReactNode | Crumb)[] (required). The trail, first to current: a node, or a `Crumb` (`{ label, href, external? }`) for one that links. The last is the current page and never a link.
- label: string (default Breadcrumb). The trail's accessible name, on its `<nav>`, for an app in another language.

### Types
- Crumb: `{ label: ReactNode; href: string; external?: boolean }`. A crumb that links: `href`, drawn by the app's router link through `LinkProvider` for an in-app path, else a plain `<a>`. `external` opens in a new tab. The last crumb is the current page and is never a link.
