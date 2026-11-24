import type { Meta, StoryObj } from "@storybook/react-vite";
import { CopyLine } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/CopyLine.examples.js";

const meta: Meta = { title: "Actions/CopyLine" };
export default meta;
type S = StoryObj;

export const DoCommand: S = {
  render: examples.DoCommand,
};

export const DontCommand: S = {
  render: examples.DontCommand,
};

export const DoBlock: S = {
  render: examples.DoBlock,
};

export const DontBlock: S = {
  render: examples.DontBlock,
};

export const Default: S = {
  render: () => <CopyLine text="bun add @slashsuite/ui-react" label="install command" />,
};
export const LongToken: S = {
  render: () => (
    <CopyLine
      label="API token"
      text="hc_live_0b7f3c9a1e4d6f2a8b5c7e9d1f3a5b7c9e1d3f5a7b9c1e3d5f7a9b1c3e5d7f9a"
    />
  ),
};
/** `disabled` greys the copy button and stops it taking clicks, e.g. until hydration. */
export const Disabled: S = {
  render: () => <CopyLine text="bun add @slashsuite/ui-react" label="install command" disabled />,
};
