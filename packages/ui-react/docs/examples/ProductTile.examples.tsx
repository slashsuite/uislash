import { CardGrid, ProductTile } from "@slashsuite/ui-react";
import { sampleScenes } from "./sampleScene.js";

const [first, second, third] = sampleScenes;

/** A shop's grid is `ProductTile`s in a `CardGrid`: each one link, named by its name and price. */
export const DoGrid = () => (
  <CardGrid as="ul" columns={3} minColumns={2}>
    <ProductTile href="#print-dusk" name="Print: harbour at dusk" src={first?.src} price="R420" />
    <ProductTile
      href="#print-hills"
      name="Print: hills over the bay"
      src={second?.src}
      price="R380"
      was="R450"
      status="sale"
    />
    <ProductTile
      href="#print-moon"
      name="Print: the bay by moonlight"
      src={third?.src}
      price="R420"
      status="sold-out"
    />
  </CardGrid>
);

/** A picture with a separate link under it is two stops for a keyboard, and the picture's link has no name. */
export const DontGrid = () => (
  <div>
    <a href="#print-dusk">
      <img src={first?.src} alt="" />
    </a>
    <a href="#print-dusk">Print: harbour at dusk</a> R420
  </div>
);
