import type { Meta, StoryObj } from "@storybook/react-vite";
import { Combobox } from "@slashsuite/ui-react";
import { CompactApp } from "./typeSteps";
import * as examples from "../../../packages/ui-react/docs/examples/Combobox.examples.js";

const meta: Meta = { title: "Forms/Combobox" };
export default meta;
type S = StoryObj;

const COUNTRIES = [
  { value: "nl", label: "Netherlands" },
  { value: "nz", label: "New Zealand" },
  { value: "no", label: "Norway", disabled: true },
  { value: "za", label: "South Africa" },
  { value: "gb", label: "United Kingdom" },
];

export const Default: S = {
  render: () => <Combobox label="Country" items={COUNTRIES} />,
};
export const Chosen: S = {
  render: () => <Combobox label="Country" items={COUNTRIES} defaultValue="za" />,
};
export const WithHint: S = {
  render: () => <Combobox label="Country" items={COUNTRIES} hint="Where the order ships." />,
};
export const Invalid: S = {
  render: () => (
    <Combobox
      label="Country"
      items={COUNTRIES}
      hint="Where the order ships."
      error="We do not ship there yet."
      defaultValue="gb"
    />
  ),
};
export const Disabled: S = {
  render: () => <Combobox label="Country" items={COUNTRIES} defaultValue="nl" disabled />,
};
export const Sizes: S = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Combobox key={size} label={size} size={size} items={COUNTRIES} defaultValue="nl" />
      ))}
    </div>
  ),
};
export const SizesCompact: S = {
  render: () => (
    <CompactApp>
      {(["sm", "md", "lg"] as const).map((size) => (
        <Combobox key={size} label={size} size={size} items={COUNTRIES} defaultValue="nl" />
      ))}
    </CompactApp>
  ),
};
/** Every width, on the scale an `Input` takes. */
export const Widths: S = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["xs", "sm", "md", "lg", "full", "fill", "auto"] as const).map((width) => (
        <Combobox key={width} label={width} width={width} items={COUNTRIES} defaultValue="nl" />
      ))}
    </div>
  ),
};
export const Loading: S = {
  render: () => <Combobox label="Country" items={COUNTRIES} loading />,
};
export const DoTimeZone: S = { render: examples.DoTimeZone };
export const DontTimeZone: S = { render: examples.DontTimeZone };
