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

/** `lines={1}` keeps a long value on one line, cut with an ellipsis (its whole text shows in a tooltip while it is cut); `breakWords` breaks it at the edge instead. */
export const Long: S = {
  render: () => (
    <div className="max-w-xs">
      <Text>
        Built from{" "}
        <Code lines={1}>9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08</Code>.
      </Text>
      <Text>
        Served from{" "}
        <Code breakWords>
          https://cdn.example.com/assets/releases/2026/11/bundle.9f86d081884c.js
        </Code>
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
