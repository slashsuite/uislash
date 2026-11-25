import type { Meta, StoryObj } from "@storybook/react-vite";
import { Audio } from "@slashsuite/ui-react";
import { sampleAudio } from "./sampleAudio";
import * as examples from "../../../packages/ui-react/docs/examples/Audio.examples.js";

const meta: Meta = { title: "Content/Audio" };
export default meta;
type S = StoryObj;

/** The browser's own player at one fixed size, 20rem wide and narrower only in a narrower column, named by `label`. */
export const Default: S = {
  render: () => (
    <Audio src={sampleAudio} label="Voice note from Anna, 0:01">
      Your browser cannot play audio.
    </Audio>
  ),
};

export const DoLabel: S = {
  render: examples.DoLabel,
};

export const DontLabel: S = {
  render: examples.DontLabel,
};
