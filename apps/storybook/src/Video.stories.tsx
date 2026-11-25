import type { Meta, StoryObj } from "@storybook/react-vite";
import { Video } from "@slashsuite/ui-react";
import { samplePhoto } from "./samplePhoto";
import { sampleVideo } from "./sampleVideo";
import * as examples from "../../../packages/ui-react/docs/examples/Video.examples.js";

const meta: Meta = { title: "Content/Video" };
export default meta;
type S = StoryObj;

export const WithPoster: S = {
  render: () => (
    <div className="max-w-xl">
      <Video src={sampleVideo} poster={samplePhoto}>
        Your browser cannot play this video.
      </Video>
    </div>
  ),
};

/** `aspect` fixes the player's shape, 16:9 unless set; a clip of another shape fits inside it, letterboxed. */
export const Aspects: S = {
  render: () => (
    <div className="grid max-w-3xl grid-cols-2 items-start gap-4">
      <Video src={sampleVideo} aria-label="Clip at 16:9" />
      <Video src={sampleVideo} aria-label="Clip at 4:3" aspect="4:3" />
      <Video src={sampleVideo} aria-label="Clip, square" aspect="square" />
    </div>
  ),
};

export const DoCaptions: S = {
  render: examples.DoCaptions,
};

export const DontCaptions: S = {
  render: examples.DontCaptions,
};
