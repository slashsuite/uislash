import { Video } from "@slashsuite/ui-react";

/** `captions` is a WebVTT file offered as the default track; `children` is the text for a browser that cannot play it. */
export const DoCaptions = () => (
  <Video src="/media/walkthrough.webm" captions="/media/walkthrough.vtt">
    Your browser cannot play this video.
  </Video>
);

/** A video with speech and no `captions` leaves out anyone who cannot hear it. */
export const DontCaptions = () => <Video src="/media/walkthrough.webm" />;
