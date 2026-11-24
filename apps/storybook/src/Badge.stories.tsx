import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, IconButton } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/Badge.examples.js";

const meta: Meta = { title: "Content/Badge" };
export default meta;
type S = StoryObj;

export const Counts: S = {
  render: () => (
    <div className="flex items-center gap-3">
      <Badge count={1} />
      <Badge count={12} />
      <Badge count={99} />
      <Badge count={120} />
    </div>
  ),
};

export const OnAnIcon: S = {
  render: () => (
    <div className="flex items-center gap-4">
      <span className="relative inline-flex">
        <IconButton label="Alerts" icon="bell" />
        <Badge count={3} corner />
      </span>
      <span className="relative inline-flex">
        <IconButton label="Alerts" icon="bell" />
        <Badge count={120} corner />
      </span>
    </div>
  ),
};

export const DoOnIcon: S = {
  render: examples.DoOnIcon,
};

export const DontOnIcon: S = {
  render: examples.DontOnIcon,
};

export const DoCount: S = {
  render: examples.DoCount,
};

export const DontCount: S = {
  render: examples.DontCount,
};

type Loading = StoryObj<{ loading: boolean }>;

/** A count is a number, so 0 is a value: while `loading` the badge is a bone of its size. */
export const Loading: Loading = {
  args: { loading: true },
  render: ({ loading }) => <Badge loading={loading} count={12} />,
};
