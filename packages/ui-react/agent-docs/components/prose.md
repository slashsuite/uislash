## Prose

Group: Text

When to use: The body of a docs page or an article, where a reader scans headings. An app screen never uses it.

### The one right way
A docs page or an article wraps its body in `Prose`: body 16, the h4 at body size in semibold, the h3 at 20 and the h2 at 24.
```tsx
import { Prose } from "@slashsuite/ui-react";

<Prose>
  <ProseDoc />
</Prose>
```

### Do
- Wrap the body of a docs page or an article in `Prose`, inside a `ProseLayout`, a `SidebarLayout` or anywhere else. `ProseLayout` takes no prop for it.
- Write the page with the usual parts: `SectionHeading` is the h2, `SubsectionHeading` the h3 and `SubsectionHeading size="sm"` (as `h4`) the h4, `Text` the paragraph. Inside `Prose` they take the long-form sizes; nothing else about them changes.
- `Callout` text, `BulletList` items, inline `Code` and a `TextLink` follow the body size. `Caption`, `Overline`, `Table`, `CodeBlock` and the form controls keep theirs.
- A `Dialog`, `Drawer` or `EmptyState` inside `Prose` looks as it does on any app screen.
- The sizes are fixed: `Prose` has no size to choose.

### Don't
- Never use `Prose` on an app screen. A dashboard, a form or a list keeps the app sizes.

Without `Prose` the same page has the dense app sizes: the h2 and the h3 are one size, only 2px above the body.
```tsx
<ProseDoc />

```

### Accessibility
- `Prose` renders a `div` and adds nothing to the page outline or to what a screen reader announces.
- The heading elements are unchanged: pick `as` to keep the outline in order, as everywhere else.
- `id`, `aria-*` and `data-*` go on the `div`.

### Props
### Prose
Long-form content, for a docs page or an article. A block (`div`) that sets the long line height (leading-7) on itself and puts the text roles inside it on the prose scale: `Text` text-base/7 (the size it is outside, on a longer line), `SectionHeading` text-2xl/8, `SubsectionHeading` `lg` text-2xl/8, `md` text-xl/7 and `sm` text-base/7 (a semibold line at body size), and the box of a `Callout` text-base/7. Every other role keeps its size. Nothing outside a `Prose` changes, and a `Dialog`, `Drawer` or `EmptyState` inside one is back on the app scale. An app screen never uses it: wrap the body of a docs page or an article, inside a `ProseLayout`, a `SidebarLayout` or anywhere else. Its blocks (`Section`s, paragraphs) are a `Stack`'s gap apart, as they would be in a `Stack`.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
