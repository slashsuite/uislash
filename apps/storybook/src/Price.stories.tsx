import type { Meta, StoryObj } from "@storybook/react-vite";
import { Price, Stack } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/Price.examples.js";

const meta: Meta = { title: "Content/Price" };
export default meta;
type S = StoryObj;

/** A price at each size, then a sale at each size, then a price still loading. */
export const Default: S = {
  render: () => (
    <Stack gap="sm">
      <Price value="R52" size="sm" />
      <Price value="R52" />
      <Price value="R52" size="lg" />
      <Price value="R52" was="R65" size="sm" />
      <Price value="R52" was="R65" />
      <Price value="R1 250" was="R1 600" size="lg" />
      <Price value={undefined} loading />
    </Stack>
  ),
};

export const DoSale: S = {
  render: examples.DoSale,
};

export const DontSale: S = {
  render: examples.DontSale,
};
