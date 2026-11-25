import { Stepper } from "@slashsuite/ui-react";

/** A few short step names, the current one given: the reader sees what is done and what is left. */
export const DoProgress = () => (
  <Stepper
    label="Checkout progress"
    steps={["Cart", "Shipping", "Payment", "Review"]}
    current={2}
  />
);

/** Sentences for step names crowd the row and hide where the reader is. */
export const DontProgress = () => (
  <Stepper
    label="Checkout progress"
    steps={[
      "Check the items in your cart",
      "Tell us where to send it",
      "Pay with a card or a transfer",
      "Read it all back once more",
    ]}
    current={2}
  />
);
