import { Caption, DateField, fromISODate, Input, Stack, toISODate } from "@slashsuite/ui-react";
import { type ReactNode, useState } from "react";

/** The docs and Storybook show every example of this file in it. A column as wide as a form field. */
export const Frame = ({ children }: { children: ReactNode }) => (
  <div className="flex max-w-xs flex-col gap-4">{children}</div>
);

export const DoDate = () => (
  <DateField calendar label="Date of birth" hint="As on your ID document." />
);

/** A text input takes any characters, so 17/5/90, 1990-05-17 and "May" all arrive, and nothing says which is meant. */
export const DontDate = () => <Input aria-label="Date of birth" placeholder="DD/MM/YYYY" />;

/** A message from outside the field, a server's say, is `error`: it replaces the hint and is announced as an alert. */
export const DoError = () => (
  <DateField
    calendar
    label="Paid on"
    hint="The day the money moved."
    error="That date is before the invoice."
  />
);

/** A hint where the error belongs: the field is never marked invalid and the reader is not told what is wrong. A rejected date takes `error` with the reason. */
export const DontError = () => (
  <DateField calendar label="Paid on" hint="The day the money moved." />
);

/** The value is a `CalendarDate`. `fromISODate` reads a stored `YYYY-MM-DD`, `toISODate` writes it back, and `name` posts the same string in a form. */
export const DoValue = () => {
  const [paid, setPaid] = useState(fromISODate("2026-10-26"));
  return (
    <Stack gap="xs">
      <DateField calendar label="Paid on" name="paidOn" value={paid} onChange={setPaid} />
      <Caption>Stored as {toISODate(paid) || "nothing yet"}.</Caption>
    </Stack>
  );
};

/** A stored date written by hand from its parts drops the leading zeros (2026-10-6). `toISODate` writes the one `YYYY-MM-DD` form. */
export const DontValue = () => {
  const [paid, setPaid] = useState(fromISODate("2026-10-06"));
  return (
    <Stack gap="xs">
      <DateField calendar label="Paid on" value={paid} onChange={setPaid} />
      <Caption>
        Stored as {paid ? `${paid.year}-${paid.month}-${paid.day}` : "nothing yet"}.
      </Caption>
    </Stack>
  );
};

/** `DateField` without `calendar` is the same input with no calendar button, for a date the person knows by heart. */
export const DoTypedOnly = () => <DateField label="Date of birth" hint="As on your ID document." />;

/** A calendar for a date the person knows by heart makes them page back decades. A birthday is typed: leave `calendar` out. */
export const DontTypedOnly = () => (
  <DateField calendar label="Date of birth" hint="As on your ID document." />
);
