import type { Meta, StoryObj } from "@storybook/react-vite";
import * as examples from "../../../packages/ui-react/docs/examples/TableSort.examples.js";

const meta: Meta = { title: "Data/Table" };
export default meta;
type S = StoryObj;

export const DoSort: S = {
  render: examples.DoSort,
};

export const DontSort: S = {
  render: examples.DontSort,
};
