import type { Meta, StoryObj } from "@storybook/react-vite";
import { CardGrid, ProductTile } from "@slashsuite/ui-react";
import { sampleScenes } from "../../../packages/ui-react/docs/examples/sampleScene.js";
import * as examples from "../../../packages/ui-react/docs/examples/ProductTile.examples.js";

const meta: Meta = { title: "Content/ProductTile" };
export default meta;
type S = StoryObj;

const [first, second] = sampleScenes;

/** A tile at full price, on sale, sold out, in the 3:4 shape, with no picture, and loading. */
export const Default: S = {
  render: () => (
    <CardGrid as="ul" columns={3} minColumns={2}>
      <ProductTile href="#a" name="Print: harbour at dusk" src={first?.src} price="R420" />
      <ProductTile
        href="#b"
        name="Print: hills over the bay"
        src={second?.src}
        price="R380"
        was="R450"
        status="sale"
      />
      <ProductTile href="#c" name="Linen tote" price="R260" status="sold-out" />
      <ProductTile href="#d" name="Linen shirt" src={first?.src} price="R650" aspect="3:4" />
      <ProductTile
        href="#e"
        name="A product with a name long enough to run onto a second line"
        price="R90"
      />
      <ProductTile href="#f" name={undefined} price={undefined} loading />
    </CardGrid>
  ),
};

export const DoGrid: S = {
  render: examples.DoGrid,
};

export const DontGrid: S = {
  render: examples.DontGrid,
};
