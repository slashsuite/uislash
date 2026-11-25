import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArticleLayout, Text } from "@slashsuite/ui-react";
import { DemoShell, layoutPage } from "../../../../packages/ui-react/docs/examples/DemoShell.js";
import * as examples from "../../../../packages/ui-react/docs/examples/ArticleLayout.examples.js";

/** The `max-w-3xl` article starts at the title's x, the related cards under it run the Container's width. */
const meta: Meta = {
  title: "Page layouts/ArticleLayout",
  parameters: { layout: "fullscreen", bare: true },
  beforeEach: layoutPage,
};
export default meta;
type S = StoryObj;

export const FullPage: S = {
  render: examples.FullPage,
};

export const DoPost: S = {
  render: examples.DoPost,
};

export const DontPost: S = {
  render: examples.DontPost,
};

/** Only the title is needed: no byline, no picture and no foot draws a plain article. */
export const Bare: S = {
  render: () => (
    <DemoShell>
      <ArticleLayout title="Opening hours over the holidays">
        <Text>We close on 24 December and open again on 2 January.</Text>
      </ArticleLayout>
    </DemoShell>
  ),
};

/** While `loading` the layout owns the wait: the header draws as itself and every part inside waits with it. */
export const Loading: StoryObj<{ loading: boolean }> = {
  args: { loading: true },
  render: ({ loading }) => (
    <DemoShell>
      <ArticleLayout title="Brewing a pale ale at home" readingTime="6 min read" loading={loading}>
        <Text>{loading ? null : "Everything you need for a first brew."}</Text>
      </ArticleLayout>
    </DemoShell>
  ),
};
