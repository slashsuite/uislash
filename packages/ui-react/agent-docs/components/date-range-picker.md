## DateRangePicker

Group: Forms

When to use: A from and to date: a report period, a timeline filter.

### The one right way
A from and to date is one `DateRangePicker`, with the app's presets built from its own today.
```tsx
import {
  Caption,
  DateRangePicker,
  DateRange,
  fromISODate,
  Stack,
  toISODate,
} from "@slashsuite/ui-react";
import { useState } from "react";

function Example() {
  const today = fromISODate("2026-10-31");
  const presets = today
    ? [7, 30, 90].map((days) => ({
        label: `Last ${days} days`,
        value: { start: today.subtract({ days: days - 1 }), end: today },
      }))
    : [];
  const [period, setPeriod] = useState<DateRange | null>(
    today ? { start: today.set({ day: 1 }), end: today } : null,
  );
  return (
    <Stack gap="xs">
      <DateRangePicker
        label="Report period"
        startName="from"
        endName="to"
        value={period}
        onChange={setPeriod}
        presets={presets}
      />
      <Caption>
        {period
          ? `From ${toISODate(period.start)} to ${toISODate(period.end)}.`
          : "No period yet."}
      </Caption>
    </Stack>
  );
}
```

### Do
- A from and to date is one `DateRangePicker`, never two `DateField`s. A single date is a `DateField`.
- The value is `{ start, end }` of `CalendarDate`s, or `null`. It is reported only when both sides are complete, real dates within `minValue` and `maxValue` and the start is on or before the end; anything else reports `null` and the field says why. `startName` and `endName` post each side as `YYYY-MM-DD` in a form, or an empty string while there is no range.
- Presets come from the app: build "Last 7 days", "Last 30 days" and "Last 90 days" from the app's own today (`today(getLocalTimeZone())` from `@internationalized/date`) and pass them as `presets`. The picker has none of its own and never reads the clock. A preset sets the range and closes the calendar.
- It draws its own label: give it `label` and `hint`, and do not wrap it in a `Field`. `error`, `size`, `disabled`, `required`, `monthLabel` and `yearLabel` work as on `DateField`.

### Don't
Two `DateField`s do not know about each other: nothing stops an end before the start, and there is no one press for "Last 30 days".
```tsx
import { Cluster, DateField, fromISODate } from "@slashsuite/ui-react";

<Cluster gap="sm">
  <DateField calendar label="From" defaultValue={fromISODate("2026-10-02")} />
  <DateField calendar label="To" defaultValue={fromISODate("2026-10-31")} />
</Cluster>
```

### Accessibility
- Each side is a `role="group"` named "Start date" and "End date", of DD, MM and YYYY segments (`role="spinbutton"`) that take digits or the arrow keys.
- The calendar button is labelled "Calendar" and opens a popover dialog: the arrow keys move across days, Enter on a day starts the range and Enter on a second ends it, and Escape closes it without a change.
- An impossible day, such as 31/02/2026, keeps what was typed and says which side and why: "End date: February 2026 has 28 days."
- Inside a `Dialog` or `Drawer` the calendar opens inside it, so it still takes focus. The focus ring comes from the component.

### Props
### DateRangePicker
A from and to date in one field: DD/MM/YYYY "to" DD/MM/YYYY and a calendar button that opens one Monday-first month, where two presses pick the range. `presets` adds the app's ready-made ranges above the month. The range is reported only when both sides are complete, real dates within min/max and the start is on or before the end; otherwise `null`.
- defaultOpen: boolean. Open the calendar on mount.
- defaultValue: { start: CalendarDate; end: CalendarDate } | null. The range shown first when the picker holds its own value.
- disabled: boolean. Disables the field: no typing, no calendar.
- endName: string. Posts the end as `YYYY-MM-DD` in a form, or `""` while there is no range.
- error: ReactNode. Marks the field invalid and shows this in red with `role="alert"`, in place of the hint and of
the built-in message (an impossible date, or one outside min/max). Like `Field`'s `error`.
- hint: ReactNode. A muted line under the field that says more; an error replaces it.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- label: ReactNode. The field's visible label, above it. Without one, name the field with `aria-label`.
- maxValue: DateValue | null. The latest date allowed: a later one marks the field invalid with its own message.
- minValue: DateValue | null. The earliest date allowed: an earlier one marks the field invalid with its own message.
- monthLabel: string (default Month). The month dropdown's name, for an app in another language.
- onChange: ((range: { start: CalendarDate; end: CalendarDate } | null) => void). Called with the range once both sides make one, and with `null` when they stop making one.
- presets: readonly DateRangePreset[]. Ready-made ranges, a row of buttons above the month. The app builds them from its own today;
the picker has none of its own and never reads the clock.
- required: boolean. Marks a date required: the field is `aria-required`, and an empty one is invalid.
- size: "sm" | "md" | "lg" (default md). The field's height and text, on the same scale as an `Input`: `sm` is `text-sm`, `md` `text-base`,
`lg` `text-lg`, one step down under an `AppShell density="compact"`, and never under 16px on touch.
- startName: string. Posts the start as `YYYY-MM-DD` in a form, or `""` while there is no range.
- value: { start: CalendarDate; end: CalendarDate } | null. The range, or `null` for none. Reported only when both days are complete, real and in order.
- yearLabel: string (default Year). The year dropdown's name, for an app in another language.

### Types
- DateRange: `{ start: CalendarDate; end: CalendarDate }`. A from and to date: `start` on or before `end`.
- DateRangePreset: `{ label: string; value: DateRange }`. A ready-made range the app builds from its own today, such as "Last 7 days".
