import { Callout, PromoBanner } from "@slashsuite/ui-react";

/** One offer and one action whose words say where it goes. */
export const DoOffer = () => (
  <PromoBanner action="Shop refills" href="#refills">
    Refills from R390 this week
  </PromoBanner>
);

/** A toned Callout is a message about the page, not an offer, and its button is not held to the strip's contrast. */
export const DontOffer = () => (
  <Callout tone="positive" title="Refills from R390 this week">
    Shop refills on the refills page.
  </Callout>
);
