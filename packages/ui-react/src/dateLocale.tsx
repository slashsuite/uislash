import { type DateValue, DateFormatter, toCalendarDateTime } from "@internationalized/date";
import type { ReactElement, ReactNode } from "react";
import { I18nProvider } from "react-aria-components";

/**
 * The locale a date field shows its segments, month names and messages in: `locale` when it is
 * given, else the app's own `I18nProvider`, else the browser's.
 */
export function DateLocale({
  locale,
  children,
}: {
  locale: string | undefined;
  children: ReactNode;
}): ReactElement {
  return locale ? <I18nProvider locale={locale}>{children}</I18nProvider> : <>{children}</>;
}

/** The twelve month names in `locale`, January first. */
export function monthNames(locale: string): string[] {
  const months = new DateFormatter(locale, { month: "long", timeZone: "UTC" });
  return Array.from({ length: 12 }, (_, i) => months.format(new Date(Date.UTC(2000, i, 1))));
}

/**
 * A date written the way its field shows it in `locale`, leading zeros and all: 15/10/2026 in
 * en-GB, 10/15/2026 in en-US, 2026/10/15 in en-ZA. With `time`, its hours and minutes follow.
 */
export function shownIn(value: DateValue, locale: string, time: boolean): string {
  const clock = time ? ({ hour: "2-digit", minute: "2-digit" } as const) : {};
  const format = new DateFormatter(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...clock,
    timeZone: "UTC",
  });
  return format.format(toCalendarDateTime(value).toDate("UTC"));
}
