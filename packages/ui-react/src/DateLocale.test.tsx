// @vitest-environment jsdom
import { CalendarDate } from "@internationalized/date";
import { describe, expect, it } from "vitest";
import { DateField } from "./DateField.js";
import { DateRangePicker } from "./DateRangePicker.js";
import { drawn, render, screen, user } from "./render.harness.js";

// jsdom's browser language is en-US, and React Aria reads it once, when it loads: these fields have
// no `I18nProvider` around them, so with no `locale` they follow that browser.

const shown = () => screen.getAllByRole("spinbutton").map((s) => s.textContent);

/** The field's first segment, to click before typing. */
function firstSegment(): HTMLElement {
  const [first] = screen.getAllByRole("spinbutton");
  if (!first) throw new Error("no segment");
  return first;
}

describe("a date field's locale", () => {
  it("follows the browser's by default: MM/DD/YYYY in en-US", () => {
    render(<DateField aria-label="Date" defaultValue={new CalendarDate(2026, 11, 29)} />);
    expect(shown()).toEqual(["11", "29", "2026"]);
  });

  it('is the one `locale` names: locale="en-ZA" shows 2026/11/29', () => {
    render(
      <DateField aria-label="Date" locale="en-ZA" defaultValue={new CalendarDate(2026, 11, 29)} />,
    );
    expect(shown()).toEqual(["2026", "11", "29"]);
    expect(screen.getByRole("group", { name: "Date" }).textContent).toBe("2026/11/29");
  });

  it("posts YYYY-MM-DD whatever the locale", () => {
    render(
      <form aria-label="Profile">
        <DateField
          aria-label="Date"
          name="dob"
          locale="en-US"
          defaultValue={new CalendarDate(2026, 11, 29)}
        />
      </form>,
    );
    expect(new FormData(screen.getByRole<HTMLFormElement>("form")).get("dob")).toBe("2026-11-29");
  });

  it("names the calendar's months in its locale", () => {
    render(
      <DateField
        calendar
        defaultOpen
        aria-label="Datum"
        locale="de-DE"
        defaultValue={new CalendarDate(2026, 10, 15)}
      />,
    );
    const month = screen.getByRole<HTMLSelectElement>("combobox", { name: "Month" });
    expect(month.selectedOptions[0]?.textContent).toBe("Oktober");
  });

  it("names an impossible date's month in its locale", async () => {
    const u = user();
    render(<DateField aria-label="Date" locale="en-GB" />);
    await u.click(firstSegment());
    await u.keyboard("31022026");
    expect(drawn("February 2026 has 28 days.")).not.toBeNull();
  });
});

describe("an out-of-range message", () => {
  it("writes the bound the way the field writes dates, not in the browser's order", async () => {
    const u = user();
    render(
      <DateField
        aria-label="Date"
        locale="en-GB"
        minValue={new CalendarDate(2026, 10, 15)}
        defaultValue={new CalendarDate(2026, 10, 20)}
      />,
    );
    await u.click(firstSegment());
    await u.keyboard("01");
    await u.click(document.body);
    expect(drawn("The date must be on or after 15/10/2026.")).not.toBeNull();
  });

  it("writes a range picker's bound in its locale too", async () => {
    const u = user();
    render(
      <DateRangePicker
        label="Stay"
        locale="en-GB"
        maxValue={new CalendarDate(2026, 10, 15)}
        defaultValue={{ start: new CalendarDate(2026, 10, 1), end: new CalendarDate(2026, 10, 10) }}
      />,
    );
    const end = screen.getByRole("spinbutton", { name: /^day, End date/i });
    await u.click(end);
    await u.keyboard("20");
    await u.click(document.body);
    expect(drawn("The date must be on or before 15/10/2026.")).not.toBeNull();
  });
});
