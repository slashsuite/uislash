import { CardGrid, CartButton, Cluster, Price, ProductTile } from "@slashsuite/ui-react";
import { sampleScenes } from "../../../packages/ui-react/docs/examples/sampleScene.js";

/** The shop set: a CartButton empty and with a total, Prices plain and on sale, and ProductTiles at full price, on sale and sold out. */
export function GalleryShop() {
  const first = sampleScenes[0]?.src;
  const second = sampleScenes[1]?.src;
  const third = sampleScenes[2]?.src;
  return (
    <div className="flex max-w-xl flex-col gap-4">
      <Cluster>
        <CartButton count={0} onClick={() => undefined} />
        <CartButton count={2} total="R800" onClick={() => undefined} />
        <Price value="R420" />
        <Price value="R380" was="R450" />
      </Cluster>
      <CardGrid as="ul" columns={3} minColumns={2}>
        <ProductTile href="#dusk" name="Print: harbour at dusk" src={first} price="R420" />
        <ProductTile
          href="#hills"
          name="Print: hills over the bay"
          src={second}
          price="R380"
          was="R450"
          status="sale"
        />
        <ProductTile
          href="#moon"
          name="Print: the bay by moonlight"
          src={third}
          price="R420"
          status="sold-out"
        />
      </CardGrid>
    </div>
  );
}
