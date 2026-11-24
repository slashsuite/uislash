import { CalendarDate, CalendarDateTime } from "@internationalized/date";
import { describe, expect, it } from "vitest";
import { fromISODate, fromISODateTime, toISODate, toISODateTime } from "./isoDate.js";

describe("toISODate", () => {
  it("writes YYYY-MM-DD with leading zeros", () => {
    expect(toISODate(new CalendarDate(1990, 5, 7))).toBe("1990-05-07");
  });

  it("writes an empty string for no date", () => {
    expect(toISODate(null)).toBe("");
    expect(toISODate(undefined)).toBe("");
  });
});

describe("fromISODate", () => {
  it("reads YYYY-MM-DD into a CalendarDate", () => {
    const date = fromISODate("1990-05-17");
    expect(date?.compare(new CalendarDate(1990, 5, 17))).toBe(0);
  });

  it("round-trips with toISODate", () => {
    expect(toISODate(fromISODate("2024-02-29"))).toBe("2024-02-29");
  });

  it("returns null for a day that does not exist, rather than rolling it over", () => {
    expect(fromISODate("1990-02-31")).toBeNull();
    expect(fromISODate("2023-02-29")).toBeNull();
    expect(fromISODate("1990-13-01")).toBeNull();
  });

  it("returns null for anything that is not YYYY-MM-DD", () => {
    expect(fromISODate("")).toBeNull();
    expect(fromISODate(null)).toBeNull();
    expect(fromISODate("17/05/1990")).toBeNull();
    expect(fromISODate("1990-5-17")).toBeNull();
    expect(fromISODate("1990-05-17T00:00")).toBeNull();
  });
});

describe("toISODateTime", () => {
  it("writes YYYY-MM-DDTHH:mm, seconds dropped", () => {
    expect(toISODateTime(new CalendarDateTime(2026, 11, 29, 7, 5, 59))).toBe("2026-11-29T07:05");
    expect(toISODateTime(null)).toBe("");
  });
});

describe("fromISODateTime", () => {
  it("reads YYYY-MM-DDTHH:mm and round-trips", () => {
    const value = fromISODateTime("2026-11-29T14:30");
    expect(value?.compare(new CalendarDateTime(2026, 11, 29, 14, 30))).toBe(0);
    expect(toISODateTime(value)).toBe("2026-11-29T14:30");
  });

  it("returns null for an impossible day or hour, or any other shape", () => {
    expect(fromISODateTime("2026-02-30T10:00")).toBeNull();
    expect(fromISODateTime("2026-02-28T24:00")).toBeNull();
    expect(fromISODateTime("2026-02-28")).toBeNull();
    expect(fromISODateTime("2026-02-28T10:00:00")).toBeNull();
  });
});
