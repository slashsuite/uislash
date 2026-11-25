import type { Meta, StoryObj } from "@storybook/react-vite";
import { CartButton, Cluster } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/CartButton.examples.js";

const meta: Meta = { title: "Content/CartButton" };
export default meta;
type S = StoryObj;

/** An empty cart, one item, two with a total, and the link form. */
export const Default: S = {
  render: () => (
    <Cluster>
      <CartButton count={0} onClick={() => undefined} />
      <CartButton count={1} onClick={() => undefined} />
      <CartButton count={2} total="R800" onClick={() => undefined} />
      <CartButton count={12} total="R4 120" href="#cart" />
    </Cluster>
  ),
};

export const DoDrawer: S = {
  render: examples.DoDrawer,
};

export const DontDrawer: S = {
  render: examples.DontDrawer,
};
