import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateTimeField, fromISODateTime } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/DateTimeField.examples.js";

const meta: Meta = {
  title: "Forms/DateTimeField",
  decorators: [
    (Story) => (
      <examples.Frame>
        <Story />
      </examples.Frame>
    ),
  ],
};
export default meta;
type S = StoryObj;

const at = fromISODateTime("2026-11-29T14:05");

export const Empty: S = {
  render: () => <DateTimeField label="Starts at" hint="Your local time." />,
};

/** The clock follows the locale: AM/PM in en-US, 24-hour in en-GB. */
export const Locale: S = {
  render: () => (
    <>
      <DateTimeField label="en-US" locale="en-US" defaultValue={at} />
      <DateTimeField label="en-GB" locale="en-GB" defaultValue={at} />
    </>
  ),
};

/** An error from outside, a server's say: shown under the hint, and the field is invalid. */
export const ExternalError: S = {
  render: () => (
    <DateTimeField
      label="Starts at"
      hint="Your local time."
      defaultValue={at}
      error="That slot is taken."
    />
  ),
};

export const Disabled: S = {
  render: () => (
    <DateTimeField label="Starts at" hint="Locked once booked." defaultValue={at} disabled />
  ),
};

/** `sm`, `md` (the default) and `lg`. */
export const Sizes: S = {
  render: () => (
    <>
      {(["sm", "md", "lg"] as const).map((size) => (
        <DateTimeField key={size} label={`Starts at, ${size}`} size={size} defaultValue={at} />
      ))}
    </>
  ),
};

/** While `loading` the label is drawn and the field is a bone of its height. */
export const Loading: StoryObj<{ loading: boolean }> = {
  args: { loading: true },
  render: ({ loading }) => <DateTimeField loading={loading} label="Starts at" defaultValue={at} />,
};

export const DoMoment: S = {
  render: examples.DoMoment,
};

export const DontMoment: S = {
  render: examples.DontMoment,
};
