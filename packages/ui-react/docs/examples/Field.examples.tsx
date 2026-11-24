import { Field, Input } from "@slashsuite/ui-react";

/** Every control sits in a `Field`, with no `htmlFor` and no `id`: the Field ties its label and hint to the control itself. */
export const DoLabel = () => (
  <Field label="Display name" hint="Shown on your reviews.">
    <Input />
  </Field>
);

/** A placeholder is not a label: it vanishes as soon as the person types, and it names nothing for a screen reader. */
export const DontLabel = () => <Input placeholder="Display name" />;

/** `error` goes under the hint, in red with an alert icon, and is announced politely; the control's edge turns red and it is marked `aria-invalid`. */
export const DoError = () => (
  <Field label="Display name" hint="Shown on your reviews." error="Pick a shorter name.">
    <Input defaultValue="A very long display name indeed" />
  </Field>
);

/** An error passed as the `hint` looks like help text: it is grey and is not announced. */
export const DontError = () => (
  <Field label="Display name" hint="Pick a shorter name.">
    <Input defaultValue="A very long display name indeed" />
  </Field>
);
