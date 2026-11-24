import type { Meta, StoryObj } from "@storybook/react-vite";
import { Code, Text } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/Code.examples.js";

const meta: Meta = { title: "Text/Code" };
export default meta;
type S = StoryObj;

export const Inline: S = {
  render: () => (
    <div className="max-w-xl">
      <Text>
        Run <Code>bun install</Code> once, then <Code>bunx nx run-many -t test</Code> to check it.
      </Text>
    </div>
  ),
};

export const DoInline: S = {
  render: examples.DoInline,
};

export const DontInline: S = {
  render: examples.DontInline,
};
