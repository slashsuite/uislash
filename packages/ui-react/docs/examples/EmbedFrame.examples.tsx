import { EmbedFrame } from "@slashsuite/ui-react";

/** The frame fixes the height and clips the corners; `status` covers the embed until its own load event says it is ready. */
export const DoStatus = () => (
  <EmbedFrame label="Map of the shops" height="sm" status="loading">
    <iframe title="Map of the shops" src="about:blank" sandbox="allow-scripts" />
  </EmbedFrame>
);

/** A bare `<iframe>` keeps the browser's 150px height and square border, and shows a blank box while it loads or after it fails. */
export const DontStatus = () => (
  <iframe title="Map of the shops" src="about:blank" sandbox="allow-scripts" />
);
