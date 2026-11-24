import type { Meta, StoryObj } from "@storybook/react-vite";
import * as examples from "../../../packages/ui-react/docs/examples/AppShellDocs.examples.js";

/**
 * The docs examples for `AppShell`. The shell is a whole page (`min-h-dvh`, a sticky header), so
 * the examples show its brand slot, the part that is small enough to put beside the text; the
 * full shell is the `Layout/AppShell` stories.
 */
const meta: Meta = { title: "Layout/AppShell" };
export default meta;
type S = StoryObj;

export const DoBrand: S = {
  render: examples.DoBrand,
};

export const DontBrand: S = {
  render: examples.DontBrand,
};

export const DoRouterBrand: S = {
  render: examples.DoRouterBrand,
};

export const DontRouterBrand: S = {
  render: examples.DontRouterBrand,
};

export const DoHideBelow: S = {
  render: examples.DoHideBelow,
};

export const DontHideBelow: S = {
  render: examples.DontHideBelow,
};

export const DoAnchor: S = {
  render: examples.DoAnchor,
};

export const DontAnchor: S = {
  render: examples.DontAnchor,
};
