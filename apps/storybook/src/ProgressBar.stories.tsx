import type { Meta, StoryObj } from "@storybook/react-vite";
import { type BarTone, ProgressBar } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/ProgressBar.examples.js";

const meta: Meta = { title: "Data/ProgressBar", parameters: { layout: "padded" } };
export default meta;
type S = StoryObj;

const tones: BarTone[] = ["accent", "positive", "warn", "danger"];

export const Default: S = {
  render: () => (
    <div className="max-w-sm">
      <ProgressBar value={60} label="Kitchen funded" />
    </div>
  ),
};

export const Tones: S = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-3">
      {tones.map((tone, i) => (
        <ProgressBar key={tone} value={25 * (i + 1)} tone={tone} label={`${tone} progress`} />
      ))}
    </div>
  ),
};

export const Sizes: S = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-3">
      <ProgressBar value={45} size="sm" label="sm, 6px" />
      <ProgressBar value={45} label="md, 8px (the default)" />
      <ProgressBar value={45} size="lg" label="lg, 12px" />
    </div>
  ),
};

export const Bounds: S = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-3">
      <ProgressBar value={0} label="Empty" />
      <ProgressBar value={3} max={12} label="Three of twelve" />
      <ProgressBar value={140} tone="positive" label="Over, held at full" />
    </div>
  ),
};

export const DoProgress: S = {
  render: examples.DoProgress,
};

export const DontProgress: S = {
  render: examples.DontProgress,
};

export const DoScale: S = {
  render: examples.DoScale,
};

export const DontScale: S = {
  render: examples.DontScale,
};

/** While `loading` the bar is one bone, since 0 is a real value. */
export const Loading: StoryObj<{ loading: boolean }> = {
  args: { loading: true },
  render: ({ loading }) => (
    <div className="max-w-md">
      <ProgressBar loading={loading} value={60} label="Upload" />
    </div>
  ),
};
