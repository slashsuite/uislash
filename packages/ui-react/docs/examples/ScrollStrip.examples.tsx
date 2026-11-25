import { Cluster, MediaTile, ScrollStrip } from "@slashsuite/ui-react";
import { sampleScenes } from "./sampleScene.js";

/** A row of media that runs past the page is a `ScrollStrip`: one line, a themed scrollbar, snapping. */
export const DoRow = () => (
  <ScrollStrip label="Recent statuses">
    {[...sampleScenes, ...sampleScenes].map((scene, index) => (
      <MediaTile key={index} src={scene.src} alt={scene.alt} label="Anna" />
    ))}
  </ScrollStrip>
);

/** A `Cluster` wraps the tiles onto several lines, so the row takes over the page instead of staying in one line. */
export const DontRow = () => (
  <Cluster>
    {[...sampleScenes, ...sampleScenes].map((scene, index) => (
      <MediaTile key={index} src={scene.src} alt={scene.alt} label="Anna" />
    ))}
  </Cluster>
);
