import { CalendarDate, CalendarDateTime } from "@internationalized/date";
import type { ReactElement } from "react";
import * as ui from "./index.js";

/** The date and number fields' cases of `CASES` (`passthrough.harness.tsx`), each given the probe attributes `a`. */
export function fieldCases(a: Record<string, string>): Record<string, () => ReactElement> {
  return {
    DateField: () => (
      <ui.DateField label="Day" defaultValue={new CalendarDate(2026, 1, 2)} {...a} />
    ),
    DateTimeField: () => (
      <ui.DateTimeField label="At" defaultValue={new CalendarDateTime(2026, 1, 2, 9, 30)} {...a} />
    ),
    NumberField: () => <ui.NumberField label="Count" {...a} />,
    Slider: () => <ui.Slider aria-label="Level" {...a} />,
  };
}
