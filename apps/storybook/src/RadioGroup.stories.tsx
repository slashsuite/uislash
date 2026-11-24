import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Radio, RadioGroup, Stack, Text } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/RadioGroup.examples.js";

const meta: Meta = { title: "Forms/RadioGroup" };
export default meta;
type S = StoryObj;

export const Default: S = {
  render: () => (
    <RadioGroup label="Shop type" name="shop-type">
      <Radio value="vintage" label="Vintage" />
      <Radio value="books" label="Books" />
      <Radio value="furniture" label="Furniture" />
    </RadioGroup>
  ),
};
/** `defaultValue` starts the group on one option and lets it keep the choice. */
export const Chosen: S = {
  render: () => (
    <RadioGroup label="Shop type" defaultValue="books">
      <Radio value="vintage" label="Vintage" />
      <Radio value="books" label="Books" />
      <Radio value="furniture" label="Furniture" />
    </RadioGroup>
  ),
};
/** `value` and `onChange` keep the choice in the caller's state. */
export const Controlled: S = {
  render: () => {
    const [value, setValue] = useState("weekly");
    return (
      <Stack gap="sm">
        <RadioGroup label="Digest" value={value} onChange={setValue}>
          <Radio value="daily" label="Daily" />
          <Radio value="weekly" label="Weekly" />
          <Radio value="never" label="Never" />
        </RadioGroup>
        <Text>Chosen: {value}</Text>
      </Stack>
    );
  },
};
/** A `hint` is a muted line under an option's label, read as the radio's description. */
export const WithDescriptions: S = {
  render: () => (
    <RadioGroup label="Who can see your reviews" defaultValue="followers">
      <Radio value="public" label="Everyone" hint="Anyone with the link, signed in or not." />
      <Radio value="followers" label="Followers" hint="People who follow you." />
      <Radio value="me" label="Only me" />
    </RadioGroup>
  ),
};
/** An `error` is a red line under the options, announced when it appears; it marks every circle red. */
export const WithError: S = {
  render: () => (
    <RadioGroup label="Shop type" error="Choose a shop type to continue.">
      <Radio value="vintage" label="Vintage" />
      <Radio value="books" label="Books" />
      <Radio value="furniture" label="Furniture" />
    </RadioGroup>
  ),
};
export const Disabled: S = {
  render: () => (
    <RadioGroup label="Shop type" defaultValue="books" disabled>
      <Radio value="vintage" label="Vintage" />
      <Radio value="books" label="Books" />
      <Radio value="furniture" label="Furniture" />
    </RadioGroup>
  ),
};
/** One option off, the rest live; the arrow keys skip it. */
export const DisabledOption: S = {
  render: () => (
    <RadioGroup label="Delivery" defaultValue="post">
      <Radio value="post" label="Post" />
      <Radio value="courier" label="Courier" />
      <Radio value="pickup" label="Pick up" hint="Not available in your area." disabled />
    </RadioGroup>
  ),
};

export const DoChoice: S = {
  render: examples.DoChoice,
};

export const DontChoice: S = {
  render: examples.DontChoice,
};

/** `size` on the group sizes every `Radio` in it: `sm`, `md` (the default) or `lg`. */
export const Sizes: S = {
  render: () => (
    <div className="flex flex-wrap gap-8">
      {(["sm", "md", "lg"] as const).map((size) => (
        <RadioGroup
          key={size}
          label={`Shop type, ${size}`}
          name={`shop-${size}`}
          size={size}
          defaultValue="books"
        >
          <Radio value="vintage" label="Vintage" />
          <Radio value="books" label="Books" />
        </RadioGroup>
      ))}
    </div>
  ),
};

/** While `loading` the labels are drawn and each circle is a bone. */
export const Loading: StoryObj<{ loading: boolean }> = {
  args: { loading: true },
  render: ({ loading }) => (
    <RadioGroup label="Delivery" defaultValue="fri" loading={loading}>
      <Radio label="Friday" value="fri" />
      <Radio label="Monday" value="mon" />
    </RadioGroup>
  ),
};
