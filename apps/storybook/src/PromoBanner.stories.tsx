import type { Meta, StoryObj } from "@storybook/react-vite";
import { PromoBanner, Stack } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/PromoBanner.examples.js";

const meta: Meta = { title: "Content/PromoBanner" };
export default meta;
type S = StoryObj;

/** The link form, the button form, and a long offer that wraps. */
export const Default: S = {
  render: () => (
    <Stack gap="md">
      <PromoBanner action="Shop refills" href="#refills">
        Refills from R390 this week
      </PromoBanner>
      <PromoBanner action="Get the code" onClick={() => undefined}>
        10% off your first order
      </PromoBanner>
      <PromoBanner action="See the kits" href="#kits">
        Every brewing kit ships free this weekend, to anywhere in the country, with a bag of malt
      </PromoBanner>
    </Stack>
  ),
};

export const DoOffer: S = {
  render: examples.DoOffer,
};

export const DontOffer: S = {
  render: examples.DontOffer,
};
