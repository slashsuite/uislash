import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, Slider } from "@slashsuite/ui-react";
import { CompactApp } from "./typeSteps";
import * as examples from "../../../packages/ui-react/docs/examples/Slider.examples.js";

const meta: Meta = { title: "Forms/Slider" };
export default meta;
type S = StoryObj;

export const Default: S = {
  render: () => (
    <Field label="Volume">
      <Slider defaultValue={30} />
    </Field>
  ),
};
/** A price as a currency, from 0 to 200 in steps of 5. */
export const Currency: S = {
  render: () => (
    <Field label="Highest price" hint="Beers up to this price are shown.">
      <Slider
        defaultValue={45}
        min={0}
        max={200}
        step={5}
        formatOptions={{ style: "currency", currency: "EUR", maximumFractionDigits: 0 }}
      />
    </Field>
  ),
};
export const Invalid: S = {
  render: () => (
    <Field label="Overlay opacity" error="Choose an opacity above 10%.">
      <Slider
        defaultValue={0.05}
        min={0}
        max={1}
        step={0.05}
        formatOptions={{ style: "percent" }}
      />
    </Field>
  ),
};
export const Disabled: S = {
  render: () => (
    <Field label="Volume">
      <Slider defaultValue={60} disabled />
    </Field>
  ),
};
export const Widths: S = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["xs", "sm", "md", "lg", "full", "fill", "auto"] as const).map((width) => (
        <Field key={width} label={width}>
          <Slider width={width} defaultValue={50} />
        </Field>
      ))}
    </div>
  ),
};
export const Sizes: S = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Field key={size} label={size}>
          <Slider size={size} defaultValue={50} />
        </Field>
      ))}
    </div>
  ),
};
export const SizesCompact: S = {
  render: () => (
    <CompactApp>
      {(["sm", "md", "lg"] as const).map((size) => (
        <Field key={size} label={size}>
          <Slider size={size} defaultValue={50} />
        </Field>
      ))}
    </CompactApp>
  ),
};
export const DoLevel: S = { render: examples.DoLevel };
export const DontLevel: S = { render: examples.DontLevel };
