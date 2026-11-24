import type { Meta, StoryObj } from "@storybook/react-vite";
import { CopyButton } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/CopyButton.examples.js";

const meta: Meta = { title: "Actions/CopyButton" };
export default meta;
type S = StoryObj;

export const DoClipboard: S = {
  render: examples.DoClipboard,
};

export const DontClipboard: S = {
  render: examples.DontClipboard,
};

export const Default: S = {
  render: () => <CopyButton text="bun add @slashsuite/ui-react" />,
};
export const Labels: S = {
  render: () => <CopyButton text="token" label="Copy token" copiedLabel="Token copied" />,
};
export const Disabled: S = {
  render: () => <CopyButton text="bun add @slashsuite/ui-react" disabled />,
};
