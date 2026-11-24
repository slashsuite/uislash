## EmptyState

Group: Feedback

When to use: A whole page or list with no content yet: say what belongs here and offer the first step.

### Use instead
- Callout (callout.md): There is content, and a line or two about it must be seen.
- Status pages (status-pages.md): The route itself cannot show, not just its content.

### The one right way
An empty page says what belongs here and offers the first step as the primary action.
```tsx
import { Button, EmptyState, Text } from "@slashsuite/ui-react";

<EmptyState title="No builds yet" actions={<Button>Create a project</Button>}>
  <Text>Builds appear here once a project has uploaded its first capture.</Text>
</EmptyState>
```

### Do
- Give it a `title`, one `Text` that says what belongs here, and the first step as `actions`, with the primary `Button` first.
- For a get-started list, put `Steps` after the `Text` in the children.
- The title's heading level comes from where it sits: an `h2` on the page, an `h3` in a `Section`, so the outline does not skip or repeat; `level` sets it by hand and the look does not change.
- On its own it draws a dashed frame round itself; inside a `Card` the card is the frame. `icon` sets one of the library's icons above the title.
- It is the one empty look. Give it to the part's `empty` slot (`ListLayout`, `CardGrid`, `ChatThread`, `TableBody`, `Timeline`, a `Stack as="ul"`), which shows it when the part has no children: `empty={<EmptyState title="No invoices yet." />}` everywhere.
- The slot picks the size: one muted line (`size="sm"`, no heading) in a `TableBody`, a `Timeline` or a `Stack as="ul"`; the titled block (`md`) on a page, in a `CardGrid` or a `ChatThread`. `size` sets it by hand.
- `padding="inset"` pads all four sides, for an EmptyState in a `Card flush`, whose body has no padding of its own; the default pads above and below.

### Don't
- Do not leave it as a title alone: a page with nothing in it and nothing to do is a dead end.

A bare "Nothing here" is a dead end: it does not say what belongs here or what to do next.
```tsx
import { EmptyState } from "@slashsuite/ui-react";

<EmptyState title="Nothing here" />

```

A muted `Text` written by hand is a second empty look, and it stays on screen when the list fills.
```tsx
import { Card, Text } from "@slashsuite/ui-react";

<Card title="Builds">
  <Text tone="muted">No builds yet.</Text>
</Card>
```

### Accessibility
- At `md` an EmptyState is a `<section>` named by its `title`, which is an `h2` unless `level` says otherwise, so it is a landmark region a screen reader can jump to.
- At `sm` it is a plain block whose title is a paragraph, so a table cell or a list adds no heading or region to the outline.
- The actions are ordinary buttons and links, in reading order after the explanation.

### Props
### EmptyState
The one empty look: what a list, a table or a page shows when there is nothing in it yet. Give it to the part's `empty` slot (`ListLayout`, `CardGrid`, `TableBody`, `Timeline`, `ChatThread`, a `Stack as="ul"`), which shows it when the part has no children and picks its size. `md` is a centred `title`, the `children` as the explanation under it (a `Text`, then `Steps` for a "get started" list), and `actions` (buttons, links) in a centred row at the bottom, with an optional `icon` above the title. A named `<section>`. On its own it draws a dashed frame round itself; inside a `Card` the card is the frame. `level` is the title's heading level, one below the heading that holds it: a 2 on the page, a 3 in a `Section`. `sm` is the one-line form for inside a table, a timeline or a list: the title as one centred muted line, the `children` under it in the same small text and the `actions` after. It is a plain block with no heading and no landmark, so a table cell or a card does not grow a region.
- actions: ReactNode. Buttons or links in a centred row at the bottom.
- icon: "page" | "grid" | "search" | "table" | "type" | "diff" | "baseline" | "review" | "ci" | "self-host" | "privacy" | "capture" | "branch" | "theme" | "speed" | "chevron-right" | "chevron-down" | "close" | "external-link" | "settings" | "bell" | "check" | "plus" | "more" | "window" | "card" | "pointer" | "field" | "compass" | "briefcase". One of the library's icons, at feature size in the muted ink above the title.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- level: 2 | 3 | 4 | 5 | 6 (default one below the heading that holds it: 2 on the page). The title's heading level, 2 to 6. It does not change how the title looks.
- padding: "default" | "inset" (default default). `inset` pads all four sides, for an empty state in a `Card flush`, whose body has no padding
of its own. `default` pads above and below only. On its own, outside a card, it pads all four
sides inside its frame either way.
- size: "sm" | "md" (default the slot's: sm in a TableBody, a Timeline or a Stack as="ul", else md). `md` is the titled block; `sm` one muted line with no heading, for inside a table, a timeline or
a list. `icon` and `level` do nothing at `sm`.
- title: ReactNode (required). The heading, centred: what is missing ("No projects yet"). It names the section.
