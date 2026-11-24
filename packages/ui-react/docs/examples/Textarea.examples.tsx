import { Field, Input, Textarea } from "@slashsuite/ui-react";

/** Text that runs to a paragraph is a `Textarea` in a `Field`, so the person can see what they wrote. */
export const DoLongText = () => (
  <Field label="Review" htmlFor="do-review" hint="What did you find? How were the prices?">
    <Textarea id="do-review" rows={4} />
  </Field>
);

/** An `Input` is one line: a paragraph typed into it scrolls out of sight. */
export const DontLongText = () => (
  <Field label="Review" htmlFor="dont-review" hint="What did you find? How were the prices?">
    <Input id="dont-review" />
  </Field>
);
