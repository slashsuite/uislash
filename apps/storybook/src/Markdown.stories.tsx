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

/** Rich text from a CMS: a heading, a paragraph with a link, a picture, a numbered list and a table. */
export const Article: S = {
  render: () => (
    <div className="max-w-xl">
      <Markdown
        md={
          "## Pale ale\nA bright, easy beer. The [water report](https://example.com/water) has the salts.\n\n" +
          "![A pale ale in a glass](/missing.jpg)\n\n" +
          "### Grain bill\n| Malt | kg |\n| --- | --: |\n| Pale | 4.5 |\n| Crystal | 0.3 |\n\n" +
          "### Method\n1. Mash at 66 degrees for an hour\n2. Boil for an hour\n3. Chill and pitch"
        }
      />
    </div>
  ),
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
