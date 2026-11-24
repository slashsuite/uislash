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

export const DoCaptions: S = {
  render: examples.DoCaptions,
};

export const DontCaptions: S = {
  render: examples.DontCaptions,
};
