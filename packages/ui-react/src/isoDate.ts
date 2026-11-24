import { CalendarDate, CalendarDateTime } from "@internationalized/date";

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** `"1990-05-17"` for `CalendarDate(1990, 5, 17)`; `""` for no date, so it drops into a form field. */
export function toISODate(date: CalendarDate | null | undefined): string {
  return date ? date.toString() : "";
}

/** The `CalendarDate` of a `"YYYY-MM-DD"` string; `null` for an empty, malformed or impossible one. */
export function fromISODate(iso: string | null | undefined): CalendarDate | null {
  const match = ISO_DATE.exec(iso ?? "");
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new CalendarDate(year, month, day);
  // CalendarDate constrains 1990-02-31 to 1990-02-28; a string that does not survive is impossible.
  return date.toString() === iso ? date : null;
}

const ISO_DATE_TIME = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

/** `"2026-11-29T14:30"` for `CalendarDateTime(2026, 11, 29, 14, 30)`, seconds dropped; `""` for none. */
export function toISODateTime(value: CalendarDateTime | null | undefined): string {
  return value ? value.toString().slice(0, 16) : "";
}

/**
 * The `CalendarDateTime` of a `"YYYY-MM-DDTHH:mm"` string; `null` for an empty, malformed or
 * impossible one (a day the month does not have, an hour past 23).
 */
export function fromISODateTime(iso: string | null | undefined): CalendarDateTime | null {
  const match = ISO_DATE_TIME.exec(iso ?? "");
  if (!match) return null;
  const [year, month, day, hour, minute] = [1, 2, 3, 4, 5].map((at) => Number(match[at]));
  if (Number(hour) > 23 || Number(minute) > 59) return null;
  const value = new CalendarDateTime(
    Number(year),
    Number(month),
    Number(day),
    Number(hour),
    Number(minute),
  );
  return toISODateTime(value) === iso ? value : null;
}
