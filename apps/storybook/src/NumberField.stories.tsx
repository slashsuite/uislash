import type { Meta, StoryObj } from "@storybook/react-vite";
import { NumberField } from "@slashsuite/ui-react";
import { CompactApp } from "./typeSteps";
import * as examples from "../../../packages/ui-react/docs/examples/NumberField.examples.js";

const meta: Meta = { title: "Forms/NumberField" };
export default meta;
type S = StoryObj;

export const Default: S = {
  render: () => <NumberField label="Guests" defaultValue={2} minValue={1} maxValue={12} />,
};
/** A currency, in the app's locale: the person types in the same format. */
export const Currency: S = {
  render: () => (
    <NumberField
      label="Price"
      defaultValue={12.5}
      minValue={0}
      step={0.5}
      formatOptions={{ style: "currency", currency: "EUR" }}
      width="md"
    />
  ),
};
/** At `minValue` the minus button is disabled. */
export const AtMinimum: S = {
  render: () => <NumberField label="Quantity" defaultValue={1} minValue={1} width="sm" />,
};
export const WithHint: S = {
  render: () => (
    <NumberField
      label="Seats"
      hint="Up to 8 per booking."
      defaultValue={2}
      minValue={1}
      maxValue={8}
    />
  ),
};
export const Invalid: S = {
  render: () => (
    <NumberField
      label="Seats"
      hint="Up to 8 per booking."
      error="Only 3 seats are left."
      defaultValue={6}
      minValue={1}
      maxValue={8}
    />
  ),
};
export const Disabled: S = {
  render: () => <NumberField label="Quantity" defaultValue={3} disabled />,
};
export const Sizes: S = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <NumberField key={size} label={size} size={size} defaultValue={4} width="sm" />
      ))}
    </div>
  ),
};
export const SizesCompact: S = {
  render: () => (
    <CompactApp>
      {(["sm", "md", "lg"] as const).map((size) => (
        <NumberField key={size} label={size} size={size} defaultValue={4} width="sm" />
      ))}
    </CompactApp>
  ),
};
/** Every width, on the scale an `Input` takes. */
export const Widths: S = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["xs", "sm", "md", "lg", "full", "fill", "auto"] as const).map((width) => (
        <NumberField key={width} label={width} width={width} defaultValue={4} />
      ))}
    </div>
  ),
};
export const Loading: S = {
  render: () => <NumberField label="Quantity" loading />,
};
export const DoQuantity: S = { render: examples.DoQuantity };
export const DontQuantity: S = { render: examples.DontQuantity };
