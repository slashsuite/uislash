import { Field, NumberField, Slider } from "@slashsuite/ui-react";

/** A level set by eye (an opacity, a volume) is a `Slider` in a `Field`, its value written beside it. */
export const DoLevel = () => (
  <Field label="Overlay opacity">
    <Slider defaultValue={0.6} min={0} max={1} step={0.05} formatOptions={{ style: "percent" }} />
  </Field>
);

/** A figure the person must hit exactly is typed: a `NumberField`, not a `Slider`. */
export const DontLevel = () => (
  <NumberField
    label="Overlay opacity"
    defaultValue={0.6}
    minValue={0}
    maxValue={1}
    step={0.05}
    formatOptions={{ style: "percent" }}
  />
);
