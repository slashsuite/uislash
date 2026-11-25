import { Price } from "@slashsuite/ui-react";

/** A sale is the price with the old one as `was`: struck through on the page, "R52, was R65" out loud. */
export const DoSale = () => <Price value="R52" was="R65" />;

/** A strike drawn by hand is silent: a screen reader hears two prices and cannot tell which one is paid. */
export const DontSale = () => (
  <span>
    R52 <s>R65</s>
  </span>
);
