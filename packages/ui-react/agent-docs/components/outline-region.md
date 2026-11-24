## OutlineRegion

Group: Content

When to use: Marking an area of a screenshot or an image: one that is ignored, flagged or picked.

### Use instead
- Image (image.md): The picture is shown with nothing marked on it.

### The one right way
A `label` says why the area is marked, so a reader can tell an ignored area from a flagged one.
```tsx
import { OutlineRegion, RegionFrame } from "@slashsuite/ui-react";

<RegionFrame src={sampleShot} alt="The dashboard">
  <OutlineRegion
    rect={{ x: 228, y: 4, width: 80, height: 20 }}
    within={sampleShotSize}
    label="ignored"
    hatched
  />
</RegionFrame>
```

### Do
- Put the picture in a `RegionFrame` (`src`, `alt`, and any `<img>` prop such as `onLoad`) and the `OutlineRegion`s inside it; each region places itself over the picture.
- `rect` is the area and `within` the picture's full size, both in the picture's own pixels (its natural size), so the box stays on its area at any width.
- Size the frame as an `Image`: `width` (`full`, or `sm`, `md`, `lg`) and `aspect` (`natural`, its own proportions, or a shape that letterboxes the picture, never cropping it and never scaling it up). The regions stay on the picture, not the box. A shape also holds the frame's height before the picture loads.
- `label` is a short tag in the top-left corner that says what the area is or where it came from. `hatched` stripes the inside, for an area that is left out.
- The outline is the accent colour in every theme; do not draw a box of your own with a raw colour.

### Don't
An unlabelled box leaves the reader to guess what it marks and where it came from.
```tsx
import { OutlineRegion, RegionFrame } from "@slashsuite/ui-react";

<RegionFrame src={sampleShot} alt="The dashboard">
  <OutlineRegion rect={{ x: 228, y: 4, width: 80, height: 20 }} within={sampleShotSize} />
</RegionFrame>
```

### Accessibility
- The region takes no pointer events, so it never blocks the picture or a layer drawn over it; the hatch is hidden from assistive tech.
- A `label` is plain text and is read out; a region with no label says nothing to a screen reader, so name the areas in text as well when they matter.

### Props
### RegionFrame
A picture with a hairline edge, and `children` laid over it: the `OutlineRegion`s that mark its areas. Every other prop goes to the `<img>` (`onLoad`, `loading`, `data-*`), so the app can read the picture's own size for `within`. It sizes as `Image` does. `width` is `full` (the parent's width) or 96, 160 or 256px. `aspect` `natural` keeps the picture's own proportions; any other shape letterboxes it (contain, never a crop) on the inset surface, centred and never scaled up, and the regions are laid over the picture itself, not the box, so each stays on its spot. A letterboxed picture needs its own size: a screenshot has one; an SVG needs `width` and `height` on its root, not only a `viewBox`.
- alt: string (required). What the picture shows; `""` for one that only decorates.
- aspect: "square" | "4:3" | "3:2" | "16:9" | "3:4" | "9:16" | "natural" (default natural). The box's shape: `natural` is the picture's own; any other letterboxes the picture inside it.
- children: ReactNode. The `OutlineRegion`s over the picture.
- src: string (required). The picture.
- width: "sm" | "md" | "lg" | "full" (default full). How wide the frame is: `full` fills its parent; `sm`, `md` and `lg` are 96, 160 and 256px, capped at the parent's width.

### OutlineRegion
An accent outline over one area of a picture, such as a screenshot's ignored or flagged region. `rect` is in the picture's own units and `within` is the picture's full size in the same units; the box is placed in percent of them, so it sits right at any scale. Put it in a `RegionFrame`, over the picture. `label` is a small tag in its top-left corner; `hatched` stripes the inside, for an area that is left out. It takes no pointer events, so it never blocks the picture or a layer drawn over it.
- hatched: boolean (default false). Stripes the inside, for an area left out (ignored, masked).
- label: ReactNode. A short tag in the top-left corner: where the area came from, or what it is.
- rect: RegionRect (required). The area, in the picture's own units.
- within: { width: number; height: number; } (required). The picture's full size, in the same units as `rect`.

### Types
- RegionRect: `{ x: number; y: number; width: number; height: number }`. A box in a picture's own units (an image's pixels): its top-left corner and its size.
