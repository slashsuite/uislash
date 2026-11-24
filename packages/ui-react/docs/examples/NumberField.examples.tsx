import { NumberField, Select } from "@slashsuite/ui-react";

/** A count the person sets is a `NumberField`: type it, or step it with the buttons. */
export const DoQuantity = () => (
  <NumberField label="Quantity" defaultValue={1} minValue={1} maxValue={99} width="sm" />
);

/** A `Select` of numbers caps the count at its last option and makes the person scroll for it. */
export const DontQuantity = () => (
  <Select
    aria-label="Quantity"
    defaultValue="1"
    items={Array.from({ length: 10 }, (_, i) => ({
      value: String(i + 1),
      label: String(i + 1),
    }))}
  />
);
