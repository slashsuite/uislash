import { Callout, Disclosure, Stack, Text } from "@slashsuite/ui-react";

/** Detail the person may not need, behind a summary that says what it is, is a `Disclosure`. */
export const DoSecondary = () => (
  <Stack gap="xs">
    <Text>Order 1042 was posted on Monday.</Text>
    <Disclosure summary="Tracking history">
      <Text>Posted Monday · Sorted Tuesday · Out for delivery Wednesday.</Text>
    </Disclosure>
  </Stack>
);

/** A hand-built `<details>` and `<summary>` has none of the library's look or focus ring. `Disclosure` replaces it. */
export const DontSecondary = () => (
  <Stack gap="xs">
    <Text>Order 1042 was posted on Monday.</Text>
    <details>
      <summary>Tracking history</summary>
      <Text>Posted Monday · Sorted Tuesday · Out for delivery Wednesday.</Text>
    </details>
  </Stack>
);

/** What the person must read to carry on, such as an error, is in view: a `Callout`, not a `Disclosure`. */
export const DoEssential = () => (
  <Callout tone="danger">Your payment was declined. Your order is not placed.</Callout>
);

/** What the person must read to carry on, such as an error, is not hidden behind a summary: show it. */
export const DontEssential = () => (
  <Disclosure summary="Details">
    <Callout tone="danger">Your payment was declined. Your order is not placed.</Callout>
  </Disclosure>
);
