import type { Meta, StoryObj } from "@storybook/react-vite";
import * as examples from "../../../packages/ui-react/docs/examples/TabsReason.examples.js";

const meta: Meta = { title: "Navigation/Tabs" };
export default meta;
type S = StoryObj;

export const DoDisabledReason: S = {
  render: examples.DoDisabledReason,
};

export const DontDisabledReason: S = {
  render: examples.DontDisabledReason,
};
