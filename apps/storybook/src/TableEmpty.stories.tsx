import type { Meta, StoryObj } from "@storybook/react-vite";
import * as examples from "../../../packages/ui-react/docs/examples/TableEmpty.examples.js";

const meta: Meta = { title: "Data/Table" };
export default meta;
type S = StoryObj;

export const DoEmpty: S = {
  render: examples.DoEmpty,
};

export const DontEmpty: S = {
  render: examples.DontEmpty,
};
