import type { Meta, StoryObj } from "@storybook/react-vite";
import { Markdown } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/Markdown.examples.js";

const meta: Meta = { title: "Text/Markdown" };
export default meta;
type S = StoryObj;

export const DoSummary: S = {
  render: examples.DoSummary,
};

export const DontSummary: S = {
  render: examples.DontSummary,
};

export const MarkdownStory: S = {
  render: () => <Markdown md={"## What I did\n- **HC-42** shipped\n- plain item"} />,
};

type Loading = StoryObj<{ loading: boolean }>;

/** A note with no source yet is a paragraph of bones. */
export const Loading: Loading = {
  args: { loading: true },
  render: ({ loading }) => (
    <div className="max-w-md">
      <Markdown loading={loading} md={loading ? undefined : "## Notes\n- **HC-42** shipped"} />
    </div>
  ),
};
