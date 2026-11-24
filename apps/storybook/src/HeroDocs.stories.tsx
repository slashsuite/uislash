import type { Meta, StoryObj } from "@storybook/react-vite";
import * as examples from "../../../packages/ui-react/docs/examples/HeroDocs.examples.js";

/** The docs examples for `Hero`. */
const meta: Meta = { title: "Layout/Hero" };
export default meta;
type S = StoryObj;

export const DoLanding: S = {
  render: examples.DoLanding,
};

export const DontLanding: S = {
  render: examples.DontLanding,
};

export const DoInnerPage: S = {
  render: examples.DoInnerPage,
};

export const DontInnerPage: S = {
  render: examples.DontInnerPage,
};
