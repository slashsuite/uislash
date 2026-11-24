import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, FileDrop } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/FileDrop.examples.js";

const meta: Meta = { title: "Forms/FileDrop" };
export default meta;
type S = StoryObj;

export const Default: S = {
  render: () => <FileDrop accept=".csv">Drop a bank statement here or click to choose</FileDrop>,
};
export const Disabled: S = {
  render: () => (
    <FileDrop accept=".csv" disabled>
      Drop a bank statement here or click to choose
    </FileDrop>
  ),
};
/** `size="sm"`: a compact chip or tile, with dense padding. */
export const Small: S = {
  render: () => (
    <div className="max-w-xs">
      <FileDrop size="sm" accept=".jpg,.png">
        Add a photo
      </FileDrop>
    </div>
  ),
};

export const DoChosen: S = {
  render: examples.DoChosen,
};

export const DontChosen: S = {
  render: examples.DontChosen,
};

/** `sm`, `md` (the default) and `lg`: the zone's padding. */
export const Sizes: S = {
  render: () => (
    <div className="flex max-w-md flex-col gap-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <FileDrop key={size} size={size} accept=".csv">
          Drop a bank statement here, {size}
        </FileDrop>
      ))}
    </div>
  ),
};

/** In an errored `Field`, the zone's dashed edge turns red and the input is described by the error. */
export const Invalid: S = {
  render: () => (
    <div className="max-w-md">
      <Field label="Bank statement" error="Choose a CSV file.">
        <FileDrop accept=".csv">Drop a bank statement here or click to choose</FileDrop>
      </Field>
    </div>
  ),
};
