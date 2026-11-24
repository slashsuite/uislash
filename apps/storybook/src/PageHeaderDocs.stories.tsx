import type { Meta, StoryObj } from "@storybook/react-vite";
import * as examples from "../../../packages/ui-react/docs/examples/PageHeaderDocs.examples.js";

/** The docs examples for `PageHeader`. */
const meta: Meta = { title: "Layout/PageHeader" };
export default meta;
type S = StoryObj;

export const DoSlots: S = {
  render: examples.DoSlots,
};

export const DontSlots: S = {
  render: examples.DontSlots,
};

export const DoInStack: S = {
  render: examples.DoInStack,
};

export const DontInStack: S = {
  render: examples.DontInStack,
};
