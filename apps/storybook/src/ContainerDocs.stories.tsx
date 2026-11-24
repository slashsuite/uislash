import type { Meta, StoryObj } from "@storybook/react-vite";
import * as examples from "../../../packages/ui-react/docs/examples/ContainerDocs.examples.js";

/** The docs examples for `Container`. */
const meta: Meta = { title: "Layout/Container" };
export default meta;
type S = StoryObj;

export const DoOneEdge: S = {
  render: examples.DoOneEdge,
};

export const DontOneEdge: S = {
  render: examples.DontOneEdge,
};
