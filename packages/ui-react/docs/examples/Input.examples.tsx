import { Field, Input } from "@slashsuite/ui-react";

/** An amount is a `prefix` for the currency and `numeric`, which lines the digits up and brings up the number keypad. */
export const DoAmount = () => (
  <Input prefix="R" numeric width="md" aria-label="Amount" defaultValue="49.90" />
);

/** A currency typed into the placeholder is gone as soon as the person types, and nothing keeps the digits aligned. */
export const DontAmount = () => <Input placeholder="R 0.00" width="md" aria-label="Amount" />;

/** A count a person types is `numeric` with the whole-number keypad: a text field that keeps what was typed. */
export const DoNumber = () => (
  <Field label="Quantity">
    <Input numeric inputMode="numeric" width="xs" defaultValue="12" />
  </Field>
);

/** `type="number"` drops "1 250", puts spinner arrows where the figure should end, and lets the mouse wheel change the value as the page scrolls. */
export const DontNumber = () => (
  <Field label="Quantity">
    <Input type="number" width="xs" defaultValue="12" />
  </Field>
);

/** A search box is `type="search"` with an `icon`: the browser's own look is dropped and a clear button appears once there is a value. */
export const DoSearch = () => (
  <Input
    type="search"
    aria-label="Search shops"
    placeholder="Search by name or suburb…"
    icon="search"
  />
);

/** A plain text input used for search has no icon and no way to clear it. */
export const DontSearch = () => (
  <Input aria-label="Search shops" placeholder="Search by name or suburb…" />
);
