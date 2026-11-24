## ScrollStrip

Group: Content

When to use: A row of media or people that is longer than the page is wide: recent statuses, a team.

### The one right way
A row of media that runs past the page is a `ScrollStrip`: one line, a thin scrollbar, snapping.
```tsx
import { MediaTile, ScrollStrip } from "@slashsuite/ui-react";

<ScrollStrip label="Recent statuses">
  {[...sampleScenes, ...sampleScenes].map((scene, index) => (
    <MediaTile key={index} src={scene.src} alt={scene.alt} label="Anna" />
  ))}
</ScrollStrip>
```

### Do
- Put `MediaTile`s or `Avatar`s as the children and name the strip with `label`. They keep their own width and never shrink or wrap.
- `gap` is a `Cluster`'s: `xs`, `sm` (the default) or `md`; the `Size` type lists every default that is not `md`.
- It scrolls only when the items run past its width, with a thin themed scrollbar, and the items snap to the start edge.

### Don't
- Do not use it for a few items that fit: that is a `Cluster`. A grid that wraps is a `CardGrid`.

A `Cluster` wraps the tiles onto several lines, so the row takes over the page instead of staying in one line.
```tsx
import { Cluster, MediaTile } from "@slashsuite/ui-react";

<Cluster>
  {[...sampleScenes, ...sampleScenes].map((scene, index) => (
    <MediaTile key={index} src={scene.src} alt={scene.alt} label="Anna" />
  ))}
</Cluster>
```

### Accessibility
- A `role="group"` named by `label`. It takes keyboard focus (`tabindex="0"`) with a focus ring, so the arrow keys scroll it without a pointer.
- `id`, `data-*` and `aria-*` go on the strip.

### Props
### ScrollStrip
A single row of items that scrolls sideways when it runs past the width of its parent, with a thin themed scrollbar and the items snapping into place: a strip of `MediaTile`s or `Avatar`s. Items never shrink or wrap. The strip takes the keyboard focus, so the arrow keys scroll it without a pointer. A grid that wraps is a `CardGrid` or a `Cluster`.
- children: ReactNode (required). The items, one after another: `MediaTile`s, `Avatar`s. They keep their own width.
- gap: "sm" | "md" | "xs" (default sm). The space between items, as `Cluster`'s `gap`.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- label: string (required). Names the strip for a screen reader, e.g. "Recent statuses".
