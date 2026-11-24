import type { Meta, StoryObj } from "@storybook/react-vite";
import { Callout, Disclosure, Stack, Text } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/Disclosure.examples.js";

const meta: Meta = { title: "Content/Disclosure" };
export default meta;
type S = StoryObj;

export const Closed: S = {
  render: () => (
    <Disclosure summary="Override trail">
      <Text>Three overrides, the latest on Tuesday.</Text>
    </Disclosure>
  ),
};
/** `defaultOpen` starts it with the body showing; it then closes and opens like any other. */
export const Open: S = {
  render: () => (
    <Disclosure summary="Override trail" defaultOpen>
      <Text>Three overrides, the latest on Tuesday.</Text>
    </Disclosure>
  ),
};
/** The summary is any inline content, and the body any parts. */
export const RichBody: S = {
  render: () => (
    <Disclosure summary="Shipping and returns" defaultOpen>
      <Stack gap="sm">
        <Text>Posted within two working days.</Text>
        <Callout tone="info">Returns are free for thirty days.</Callout>
      </Stack>
    </Disclosure>
  ),
};
/** Several in a column are independent: each keeps its own state. */
export const Several: S = {
  render: () => (
    <Stack gap="xs">
      <Disclosure summary="What is a hold?" defaultOpen>
        <Text>A hold keeps an item for you for an hour.</Text>
      </Disclosure>
      <Disclosure summary="How do I cancel?">
        <Text>Open the order and choose Cancel.</Text>
      </Disclosure>
      <Disclosure summary="Can I change the address?">
        <Text>Until the order has been posted.</Text>
      </Disclosure>
    </Stack>
  ),
};

/** `bordered` draws a panel: the summary a roomy row (it fills on hover), the body padded under a hairline. For a section that opens in place on a page of cards. */
export const Bordered: S = {
  render: () => (
    <Stack gap="sm">
      <Disclosure bordered summary="Customise by month" defaultOpen>
        <Stack gap="sm">
          <Text>Override the debt and reno split for individual months.</Text>
          <Callout tone="info">The default applies everywhere else.</Callout>
        </Stack>
      </Disclosure>
      <Disclosure bordered summary="2027">
        <Text>Twelve months.</Text>
      </Disclosure>
    </Stack>
  ),
};

export const DoSecondary: S = {
  render: examples.DoSecondary,
};

export const DontSecondary: S = {
  render: examples.DontSecondary,
};

export const DoEssential: S = {
  render: examples.DoEssential,
};

export const DontEssential: S = {
  render: examples.DontEssential,
};
