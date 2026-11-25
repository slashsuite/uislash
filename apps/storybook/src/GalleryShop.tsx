import {
  Button,
  CallToAction,
  CardGrid,
  CartButton,
  Cluster,
  Hero,
  Image,
  Lead,
  Price,
  ProductTile,
  PromoBanner,
} from "@slashsuite/ui-react";
import { sampleScenes } from "../../../packages/ui-react/docs/examples/sampleScene.js";

/** The marketing and shop set: a PromoBanner, a Hero with a picture, a CartButton empty and with a total, Prices plain and on sale, and ProductTiles at full price, on sale and sold out, and a CallToAction. */
export function GalleryShop() {
  const first = sampleScenes[0]?.src;
  const second = sampleScenes[1]?.src;
  const third = sampleScenes[2]?.src;
  return (
    <div className="flex max-w-xl flex-col gap-4">
      <PromoBanner action="Shop prints" href="#prints">
        Free framing on every print this week
      </PromoBanner>
      <Hero
        overline="New prints"
        title="The bay, framed."
        media={<Image src={first} alt="The harbour at dusk" aspect="4:3" width="full" />}
      >
        <Lead>Three new prints of the bay.</Lead>
      </Hero>
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
      <CallToAction
        overline="Ready when you are"
        title="Frame the bay"
        description="Every print ships framed this week."
        actions={<Button href="#prints">Shop prints</Button>}
      />
    </div>
  );
}
