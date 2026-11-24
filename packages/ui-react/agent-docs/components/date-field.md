## DateField

Group: Forms

When to use: Any date a person enters; leave `calendar` off for a date the person knows by heart.

### The one right way
```tsx
import { DateField } from "@slashsuite/ui-react";

<DateField calendar label="Date of birth" hint="As on your ID document." />

```

### Do
- A date is a `DateField`, never an `Input`. The format is always DD/MM/YYYY and weeks start on Monday, whatever the browser's locale.
- `calendar` adds a calendar button, and `defaultOpen` opens it on mount; without `calendar` the field is typed only, for a date the person knows by heart (a birthday).
- It draws its own label: give it `label` and `hint`, and do not wrap it in a `Field`.
- A message from outside, a server's say, is `error`: it marks the field invalid and replaces the hint. An impossible date, such as 31/02/1990, shows its own message.
- The value is a `CalendarDate` (`value`, `defaultValue`, `onChange`, `minValue`, `maxValue`). `fromISODate` reads a stored `YYYY-MM-DD` and `toISODate` writes one.
- `name` posts the date as `YYYY-MM-DD` in a form, or an empty string.
- `size` is `sm`, `md` (default) or `lg`, the same heights as `Input`. `disabled` and `required` work as on an `Input`; say why it is disabled in its `hint`.
- With `calendar`, `monthLabel` and `yearLabel` name the month and year dropdowns, for an app in another language.

### Don't
A text input takes any characters, so 17/5/90, 1990-05-17 and "May" all arrive, and nothing says which is meant.
```tsx
import { Input } from "@slashsuite/ui-react";

<Input aria-label="Date of birth" placeholder="DD/MM/YYYY" />

```

A hint where the error belongs: the field is never marked invalid and the reader is not told what is wrong. A rejected date takes `error` with the reason.
```tsx
import { DateField } from "@slashsuite/ui-react";

<DateField calendar label="Paid on" hint="The day the money moved." />

```

A stored date written by hand from its parts drops the leading zeros (2026-10-6). `toISODate` writes the one `YYYY-MM-DD` form.
```tsx
import { Caption, DateField, fromISODate, Stack } from "@slashsuite/ui-react";
import { useState } from "react";

function Example() {
  const [paid, setPaid] = useState(fromISODate("2026-10-06"));
  return (
    <Stack gap="xs">
      <DateField calendar label="Paid on" value={paid} onChange={setPaid} />
      <Caption>
        Stored as {paid ? `${paid.year}-${paid.month}-${paid.day}` : "nothing yet"}.
      </Caption>
    </Stack>
  );
}
```

A calendar for a date the person knows by heart makes them page back decades. A birthday is typed: leave `calendar` out.
```tsx
import { DateField } from "@slashsuite/ui-react";

<DateField calendar label="Date of birth" hint="DD/MM/YYYY" />

```

### Accessibility
- The label names a `role="group"`; each of day, month and year is its own editable segment (`role="spinbutton"`), so a person can type digits or use the arrow keys.
- The `hint` is the field's `aria-describedby`; the `error` and the built-in messages replace it, and an `error` is `role="alert"`.
- With `calendar`, the calendar button is labelled "Calendar" and opens a popover dialog, with a month and a year select (named by `monthLabel` and `yearLabel`), arrow-key movement across days and a Clear button.
- Inside a `Dialog` or `Drawer` the calendar opens inside it, so it still takes focus.
- The focus ring comes from the component.

### Props
### DateField
A segmented DD / MM / YYYY date input. Values are `CalendarDate`s; `name` posts it as `YYYY-MM-DD`. `calendar` adds a calendar button that opens a month view in a popover, at the same height as the plain field; `defaultOpen` opens it on mount. While `loading` the label is drawn and the field is a bone of its height.
- calendar: boolean. Adds a calendar button that opens a month view in a popover; the field is a date picker.
- defaultOpen: boolean. Open the calendar on mount. Only a `calendar` field takes `defaultOpen`.
- defaultValue: CalendarDate | null. The date it starts with, uncontrolled.
- disabled: boolean. Disables the field: no typing, no calendar.
- error: ReactNode. Marks the field invalid and shows this in red with `role="alert"`, in place of the hint and of
the built-in message (an impossible date, or one outside min/max). Like `Field`'s `error`.
- hint: ReactNode. A muted line under the field that says more; an error replaces it.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- label: ReactNode. The field's visible label, above it. Without one, name the field with `aria-label`.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- maxValue: DateValue | null. The latest date allowed: a later one marks the field invalid with its own message.
- minValue: DateValue | null. The earliest date allowed: an earlier one marks the field invalid with its own message.
- monthLabel: string (default Month). The month dropdown's name, for an app in another language. Only a `calendar` field takes `monthLabel`.
- name: string. Posts the date in a form as `YYYY-MM-DD` under this key, or an empty string.
- onChange: ((value: CalendarDate | null) => void). Called with the new date, or `null` when the field is cleared or the date is incomplete.
- required: boolean. Marks a date required: the field is `aria-required`, and an empty one is invalid.
- size: "sm" | "md" | "lg" (default md). The field's height and text, on the same scale as an `Input`: `sm` is `text-sm`, `md` `text-base`,
`lg` `text-lg`, one step down under an `AppShell density="compact"`, and never under 16px on touch.
- value: CalendarDate | null. The date shown, controlled, with `onChange`; `null` is an empty field.
- yearLabel: string (default Year). The year dropdown's name, for an app in another language. Only a `calendar` field takes `yearLabel`.

### Functions
- fromISODate: `fromISODate(iso: string | null | undefined): CalendarDate | null`. Reads a stored `"YYYY-MM-DD"` into the `CalendarDate` a picker takes; `null` for an empty, malformed or impossible string.
- toISODate: `toISODate(date: CalendarDate | null | undefined): string`. Writes a `CalendarDate` as `"YYYY-MM-DD"`, or `""` for none, so it drops into a form field or storage.
