import type { Meta, StoryObj } from "@storybook/react-vite";
import { SplitBar } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/SplitBar.examples.js";

const meta: Meta = { title: "Data/SplitBar", parameters: { layout: "padded" } };
export default meta;
type S = StoryObj;

export const Default: S = {
  render: () => (
    <div className="max-w-sm">
      <SplitBar a={35} b={65} label="Pot split" names={["Debt", "Renos"]} />
      <div className="mt-1 flex justify-between text-xs text-slate-500">
        <span>Debt 35%</span>
        <span>Renos 65%</span>
      </div>
    </div>
  ),
};

export const Tones: S = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-3">
      <SplitBar a={50} b={50} toneA="accent" toneB="warn" label="Accent and warn" />
      <SplitBar a={20} b={80} toneA="warn" toneB="positive" label="Warn and positive" />
    </div>
  ),
};

export const Sizes: S = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-3">
      <SplitBar a={40} b={60} size="sm" label="sm, 6px" />
      <SplitBar a={40} b={60} label="md, 8px (the default)" />
      <SplitBar a={40} b={60} size="lg" label="lg, 12px" />
    </div>
  ),
};

export const Edges: S = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-3">
      <SplitBar a={0} b={0} label="Nothing on either side" />
      <SplitBar a={0} b={10} label="All to one side" />
      <SplitBar a={10} b={0} label="All to the other" />
    </div>
  ),
};

export const DoParties: S = {
  render: examples.DoParties,
};

export const DontParties: S = {
  render: examples.DontParties,
};

/** While `loading` the bar is one bone, since 0 is a real value. */
export const Loading: StoryObj<{ loading: boolean }> = {
  args: { loading: true },
  render: ({ loading }) => (
    <div className="max-w-md">
      <SplitBar loading={loading} a={35} b={65} label="Pot split" />
    </div>
  ),
};
