import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Card, CardGrid, ProseLayout, Text } from "@slashsuite/ui-react";
import { DemoShell, layoutPage } from "../../../../packages/ui-react/docs/examples/DemoShell.js";
import { ProsePage } from "./pages";
import * as examples from "../../../../packages/ui-react/docs/examples/ProseLayout.examples.js";

/** The `max-w-3xl` reading column starts at the title's x, with the header inside it: the e2e's every-Layout-story check holds the title's x to the logo's. */
const meta: Meta = {
  title: "Page layouts/ProseLayout",
  parameters: { layout: "fullscreen", bare: true },
  beforeEach: layoutPage,
};
export default meta;
type S = StoryObj;

export const FullPage: S = {
  render: examples.FullPage,
};

export const Privacy: S = {
  render: () => (
    <DemoShell>
      <ProsePage />
    </DemoShell>
  ),
};

export const DoArticle: S = {
  render: examples.DoArticle,
};

/** `width="wide"` is for a page that is not long prose, such as pricing: the column is `max-w-5xl`, so cards fill the width instead of leaving the right third empty. Paragraphs and the lede keep their reading measure. */
export const Wide: S = {
  render: () => (
    <DemoShell>
      <ProseLayout
        width="wide"
        title="Pricing"
        description="Pay for what you review. Every plan includes unlimited projects."
        actions={<Button>Contact sales</Button>}
      >
        <CardGrid columns={3}>
          {["Free", "Team", "Business"].map((plan) => (
            <Card key={plan} title={plan}>
              <Text>Everything you need to review a visual change before it ships.</Text>
            </Card>
          ))}
        </CardGrid>
      </ProseLayout>
    </DemoShell>
  ),
};

/** `width="full"` runs the column to the Container's width, for a page of wide blocks such as a comparison of plans. Paragraphs keep their reading measure. */
export const FullWidth: S = {
  render: () => (
    <DemoShell>
      <ProseLayout
        width="full"
        title="Compare plans"
        description="Every plan includes unlimited projects."
      >
        <CardGrid columns={4}>
          {["Free", "Team", "Business", "Enterprise"].map((plan) => (
            <Card key={plan} title={plan}>
              <Text>Everything you need to review a visual change before it ships.</Text>
            </Card>
          ))}
        </CardGrid>
      </ProseLayout>
    </DemoShell>
  ),
};

export const DontArticle: S = {
  render: examples.DontArticle,
};

/** While `loading` the layout owns the wait: the header draws as itself and every part inside waits with it. */
export const Loading: StoryObj<{ loading: boolean }> = {
  args: { loading: true },
  render: ({ loading }) => (
    <DemoShell>
      <ProseLayout title="Release notes" loading={loading}>
        <Text>{loading ? null : "Quotes now carry their VAT on their own line."}</Text>
      </ProseLayout>
    </DemoShell>
  ),
};
