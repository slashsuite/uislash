import {
  Caption,
  Cluster,
  DateField,
  DateRangePicker,
  type DateRange,
  fromISODate,
  Stack,
  toISODate,
} from "@slashsuite/ui-react";
import { type ReactNode, useState } from "react";

/** The docs and Storybook show every example of this file in it. A column as wide as a form field. */
export const Frame = ({ children }: { children: ReactNode }) => (
  <div className="flex max-w-sm flex-col gap-4">{children}</div>
);

/** A from and to date is one `DateRangePicker`, with the app's presets built from its own today. */
export const DoPresets = () => {
  // An app takes today from `today(getLocalTimeZone())`; a fixed day keeps the story still.
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
        {period ? `From ${toISODate(period.start)} to ${toISODate(period.end)}.` : "No period yet."}
      </Caption>
    </Stack>
  );
};

/** Two `DateField`s do not know about each other: nothing stops an end before the start, and there is no one press for "Last 30 days". */
export const DontPresets = () => (
  <Cluster gap="sm">
    <DateField calendar label="From" defaultValue={fromISODate("2026-10-02")} />
    <DateField calendar label="To" defaultValue={fromISODate("2026-10-31")} />
  </Cluster>
);
