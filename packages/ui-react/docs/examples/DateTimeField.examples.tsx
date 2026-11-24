import { DateField, DateTimeField, fromISODateTime, Input, Stack } from "@slashsuite/ui-react";
import type { ReactNode } from "react";

/** The docs and Storybook show every example of this file in it. A column as wide as a form field. */
export const Frame = ({ children }: { children: ReactNode }) => (
  <div className="flex max-w-xs flex-col gap-4">{children}</div>
);

/** A date with its time is one `DateTimeField`: one label, one value, posted as `YYYY-MM-DDTHH:mm`. */
export const DoMoment = () => (
  <DateTimeField
    label="Starts at"
    hint="Your local time."
    name="startsAt"
    defaultValue={fromISODateTime("2026-11-29T14:05")}
  />
);

/** A date field beside a text input: the time takes any characters, and the two halves are checked and posted apart. */
export const DontMoment = () => (
  <Stack gap="sm">
    <DateField label="Starts on" />
    <Input aria-label="Starts at" placeholder="14:05" />
  </Stack>
);
