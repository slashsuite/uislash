## Container

Group: Layout

When to use: Content outside an `AppShell`, such as a band in a `bleed` shell, that must start at the same x as the page.

### The one right way
One `Container` is the content edge: everything inside it starts at the same x.
```tsx
import { Card, Container, Text } from "@slashsuite/ui-react";

<Container as="section" aria-label="Billing">
  <Card title="Plan">
    <Text>Team, billed monthly.</Text>
  </Card>
</Container>
```

### Do
- `Container` is the only place the page width (`max-w-6xl`) and side padding are defined; a header, a page and a footer inside one start at the same x.
- `AppShell` already wraps its header, main and footer in one. Use `Container` only for a part of a `bleed` shell that spans the page, so its content still keeps the edge.
- `as` picks the element: `div` (default), `main`, `header`, `footer`, `section` or `nav`. A `section` or `nav` needs an `aria-label`.
- Space inside it with a `Stack`; a `Container` has no vertical padding or gap of its own.
- `ref` reaches the rendered element, for a parent that measures or scrolls it.

### Don't
- Never nest a `Container` in a `Container`: the padding doubles.

A `Container` inside a `Container` pads the content twice, so it no longer lines up with the page. `AppShell` already wraps its main in one.
```tsx
import { Card, Container, Text } from "@slashsuite/ui-react";

<Container as="section" aria-label="Billing">
  <Container>
    <Card title="Plan">
      <Text>Team, billed monthly.</Text>
    </Card>
  </Container>
</Container>
```

### Accessibility
- A `Container` adds no role: a `div` is not a landmark. `as` picks `main`, `header`, `footer`, `section` or `nav` when the part should be one.
- `aria-*` and `data-*` go on the rendered element.

### Props
### Container
The one content edge: every page's width and side padding. This file is the only place they are defined, so a header, a page and a footer inside a Container start at the same x.
- as: "nav" | "header" | "footer" | "div" | "main" | "section" (default div). The element: `div`, `main`, `header`, `footer`, `section` or `nav`.
- ref: Ref<HTMLElement>. Reaches the rendered element, for a parent that measures or scrolls it.
