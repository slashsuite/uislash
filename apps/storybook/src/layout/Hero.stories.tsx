import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Cluster, Hero, Image, Lead, Stack, Text } from "@slashsuite/ui-react";
import { DemoShell, layoutPage } from "../../../../packages/ui-react/docs/examples/DemoShell.js";

const meta: Meta = {
  title: "Layout/Hero",
  parameters: { layout: "fullscreen", bare: true },
  beforeEach: layoutPage,
};
export default meta;
type S = StoryObj;

/** A landing page's top block: the overline, the page's h1 and the lede, over the theme's glow. */
export const Landing: S = {
  render: () => (
    <DemoShell>
      <Stack gap="xl">
        <Hero overline="Products" title="Software we make, and the tools we make it with.">
          <Lead>
            A component library, a visual review tool and feature switches you can use today, and
            more on the way.
          </Lead>
        </Hero>
        <Text>The page's first block starts here, a page gap under the hero.</Text>
      </Stack>
    </DemoShell>
  ),
};

/** The page's first actions go after the lede, inside the hero. */
export const WithActions: S = {
  render: () => (
    <DemoShell>
      <Hero overline="UISlash" title="Build the page with props, not CSS.">
        <Lead>Components and themes designed together, so a site looks right from the start.</Lead>
        <Cluster gap="sm">
          <Button>Get started</Button>
          <Button variant="outline">Browse components</Button>
        </Cluster>
      </Hero>
    </DemoShell>
  ),
};

/** A product page's hero: the picture beside the words from `md` up, under them on a phone. */
export const WithMedia: S = {
  render: () => (
    <DemoShell>
      <Hero
        overline="New"
        title="A linen shirt for the hottest days."
        media={<Image alt="A linen shirt on a hanger" aspect="4:3" width="full" />}
      >
        <Lead>Cut loose, washed soft, and made to last a dozen summers.</Lead>
        <Cluster gap="sm">
          <Button>Shop the shirt</Button>
        </Cluster>
      </Hero>
    </DemoShell>
  ),
};

/** A landing page with no picture: the words and the glow in the middle of the page. */
export const Centered: S = {
  render: () => (
    <DemoShell>
      <Hero align="center" overline="UISlash" title="Build the page with props, not CSS.">
        <Lead>Components and themes designed together, so a site looks right from the start.</Lead>
        <Cluster gap="sm" justify="center">
          <Button>Get started</Button>
          <Button variant="outline">Browse components</Button>
        </Cluster>
      </Hero>
    </DemoShell>
  ),
};
