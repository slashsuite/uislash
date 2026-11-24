import type { Meta, StoryObj } from "@storybook/react-vite";
import * as examples from "../../../packages/ui-react/docs/examples/Pagination.examples.js";

const meta: Meta = { title: "Navigation/Pagination" };
export default meta;
type S = StoryObj;

export const DoLinks: S = {
  render: examples.DoLinks,
};

export const DontLinks: S = {
  render: examples.DontLinks,
};
