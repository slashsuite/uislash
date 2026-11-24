import { Field, Select } from "@slashsuite/ui-react";

/** Choosing one of several is a `Select` in a `Field`. */
export const DoChoice = () => (
  <Field label="Category" htmlFor="do-category">
    <Select
      id="do-category"
      defaultValue="books"
      items={[
        { value: "books", label: "Books" },
        { value: "clothes", label: "Clothes" },
        { value: "furniture", label: "Furniture" },
        { value: "records", label: "Records" },
        { value: "toys", label: "Toys" },
      ]}
    />
  </Field>
);

/** A yes or no is not a choice from a list: it is a `Checkbox`. */
export const DontChoice = () => (
  <Field label="Open now" htmlFor="dont-open">
    <Select
      id="dont-open"
      defaultValue="yes"
      items={[
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ]}
    />
  </Field>
);
