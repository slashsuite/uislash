import type { ComponentPage } from "./types";

/** The OutlineRegion page, in the Content section after the chat pages. */
export const outlineRegionPage: ComponentPage = {
  slug: "outline-region",
  name: "OutlineRegion",
  summary: "An outline over one area of a picture, in the accent or a tone, with an optional tag.",
  whenToUse: "Marking an area of a screenshot or an image: one that is ignored, flagged or picked.",
  siblings: [{ slug: "image", when: "The picture is shown with nothing marked on it." }],
  pairs: ["OutlineRegion/Label"],
  usage: {
    do: [
      "Put the picture in a `RegionFrame` (`src`, `alt`, and `onLoad`, `id`, `data-*` or `aria-*`) and the `OutlineRegion`s inside it; each region places itself over the picture.",
      "`rect` is the area and `within` the picture's full size, both in the picture's own pixels (its natural size), so the box stays on its area at any width.",
      "Size the frame as an `Image`: `width` (`full`, or `sm`, `md`, `lg`, `xl`) and `aspect` (`natural`, its own proportions, or a shape that letterboxes the picture, never cropping it and never scaling it up). The regions stay on the picture, not the box. A shape also holds the frame's height before the picture loads.",
      "`label` is a short tag in the top-left corner that says what the area is or where it came from. `hatched` stripes the inside, for an area that is left out.",
      "`tone` says what the area is: `accent` (the default), `positive`, `warn` or `danger`. There is no `neutral` or `info`: their edges are too pale to stand out on a picture.",
      "`dashed` draws the edge dashed, for an area that is proposed or approximate. `active` draws a thicker edge on the one region the app has picked, such as the one hovered in a list beside the picture; the region has no hover state of its own.",
      "The outline takes its colour from the theme; do not draw a box of your own with a raw colour.",
    ],
  },
  accessibility: [
    "The region takes no pointer events, so it never blocks the picture or a layer drawn over it; the hatch is hidden from assistive tech.",
    "A `label` is plain text and is read out; a region with no label says nothing to a screen reader, so name the areas in text as well when they matter.",
  ],
  api: ["RegionFrame", "OutlineRegion"],
  types: ["OutlineRegionTone", "RegionRect"],
};
