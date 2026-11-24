// @vitest-environment jsdom
import { CalendarDate } from "@internationalized/date";
import type { ReactElement, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { I18nProvider } from "react-aria-components";
import { DateField } from "./DateField.js";
import { announced, drawn, render as renderPage, screen, user, within } from "./render.harness.js";

/** A British app: its own `I18nProvider` puts every date field in DD/MM/YYYY. */
function British({ children }: { children: ReactNode }) {
  return <I18nProvider locale="en-GB">{children}</I18nProvider>;
}
const render = (ui: ReactElement) => renderPage(ui, { wrapper: British });

const segments = () => screen.getAllByRole("spinbutton");
const shown = () => segments().map((s) => s.textContent);
const posted = () => new FormData(screen.getByRole<HTMLFormElement>("form")).get("dob");

/** Click into the day segment and type, as a person does: the field moves on segment by segment. */
async function typeDate(digits: string) {
  const u = user();
  await u.click(segments()[0] ?? document.body);
  await u.keyboard(digits);
  return u;
}

/** Click somewhere else on the page, which is how a person leaves the field. */
const leave = () => user().click(document.body);

describe("DateField", () => {
  it("shows DD, MM and YYYY placeholders in day-month-year order, under its label", () => {
    render(<DateField label="Date of birth" />);
    expect(screen.getByRole("group", { name: "Date of birth" })).not.toBeNull();
    expect(shown()).toEqual(["DD", "MM", "YYYY"]);
  });

  it("reads typed digits segment by segment as day, month, year", async () => {
    const onChange = vi.fn<(date: CalendarDate | null) => void>();
    render(<DateField aria-label="Date" onChange={onChange} />);
    await typeDate("17051990");
    expect(shown()).toEqual(["17", "05", "1990"]);
    expect(onChange.mock.lastCall?.[0]?.toString()).toBe("1990-05-17");
  });

  it("shows a filled value as DD/MM/YYYY", () => {
    render(<DateField aria-label="Date" defaultValue={new CalendarDate(1990, 5, 7)} />);
    expect(shown()).toEqual(["07", "05", "1990"]);
  });

  it("flags an impossible date with how many days the month has, tied to the field", async () => {
    render(<DateField aria-label="Date" />);
    await typeDate("31021990");
    expect(
      screen.getByRole("group", { name: "Date", description: "February 1990 has 28 days." }),
    ).not.toBeNull();
    expect(segments()[0]?.getAttribute("aria-invalid")).toBe("true");
  });

  it("keeps an impossible date as typed when focus leaves, and never reports a clamped one", async () => {
    const onChange = vi.fn<(date: CalendarDate | null) => void>();
    render(
      <form aria-label="Profile">
        <DateField aria-label="Date" name="dob" onChange={onChange} />
      </form>,
    );
    await typeDate("31021990");
    await leave();
    expect(shown()).toEqual(["31", "02", "1990"]);
    expect(drawn("February 1990 has 28 days.")).not.toBeNull();
    expect(segments()[0]?.getAttribute("aria-invalid")).toBe("true");
    expect(onChange).not.toHaveBeenCalled();
    expect(posted()).toBe("");
  });

  it.each([
    ["before minValue", "01061999"],
    ["after maxValue", "01062001"],
  ])("flags a typed date %s", async (_, digits) => {
    render(
      <DateField
        aria-label="Date"
        minValue={new CalendarDate(2000, 1, 1)}
        maxValue={new CalendarDate(2000, 12, 31)}
      />,
    );
    await typeDate(digits);
    await leave();
    expect(shown().join("")).toBe(digits);
    expect(segments()[0]?.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByRole("group", { name: "Date", description: /\S/ })).not.toBeNull();
  });

  it("shows an error from outside under the hint, announced politely, and marks the field invalid", () => {
    render(<DateField aria-label="Date" hint="A hint." error="Date is in the past." />);
    expect(screen.queryByRole("alert")).toBeNull();
    expect(announced()).toEqual(["Date is in the past."]);
    expect(
      screen.getByRole("group", { name: "Date", description: "A hint. Date is in the past." }),
    ).not.toBeNull();
    expect(segments()[0]?.getAttribute("aria-invalid")).toBe("true");
  });

  it("marks a required field's label with an asterisk hidden from assistive tech", () => {
    render(<DateField label="Start" required />);
    const mark = screen.getByText("*", { exact: false, selector: "[aria-hidden]" });
    expect(mark.getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByRole("group", { name: "Start" })).not.toBeNull();
  });

  it("marks a calendar DateField invalid from outside with error", () => {
    render(<DateField calendar aria-label="Date" error="Pick another day." />);
    expect(drawn("Pick another day.")).not.toBeNull();
    expect(segments()[0]?.getAttribute("aria-invalid")).toBe("true");
  });

  it("shows a calendar DateField's error from outside too", () => {
    render(<DateField calendar aria-label="Date" hint="Hint" error="Taken." />);
    expect(announced()).toEqual(["Taken."]);
    expect(screen.getByText("Hint")).not.toBeNull();
  });

  it("posts the value as YYYY-MM-DD under name", () => {
    render(
      <form aria-label="Profile">
        <DateField aria-label="Date" name="dob" defaultValue={new CalendarDate(1990, 5, 17)} />
      </form>,
    );
    expect(posted()).toBe("1990-05-17");
  });
});

describe("DateField calendar", () => {
  it("reads typed digits as day, month, year", async () => {
    const onChange = vi.fn<(date: CalendarDate | null) => void>();
    render(<DateField calendar aria-label="Date" onChange={onChange} />);
    await typeDate("17051990");
    expect(onChange.mock.lastCall?.[0]?.toString()).toBe("1990-05-17");
  });

  it("opens a Monday-first calendar with month and year dropdowns", () => {
    render(
      <DateField
        calendar
        aria-label="Date"
        defaultOpen
        defaultValue={new CalendarDate(1990, 5, 17)}
      />,
    );
    // The weekday row is hidden from assistive tech; each day is named with its weekday.
    const days = within(screen.getByRole("grid", { name: "May 1990" })).getAllByRole("button");
    expect(days[0]?.getAttribute("aria-label")).toBe("Monday, 30 April 1990");
    expect(screen.getByRole<HTMLSelectElement>("combobox", { name: "Month" }).value).toBe("5");
    expect(screen.getByRole<HTMLSelectElement>("combobox", { name: "Year" }).value).toBe("1990");
  });

  it("clears the value from the calendar footer", async () => {
    const onChange = vi.fn<(date: CalendarDate | null) => void>();
    render(
      <DateField
        calendar
        aria-label="Date"
        defaultOpen
        defaultValue={new CalendarDate(1990, 5, 17)}
        onChange={onChange}
      />,
    );
    await user().click(screen.getByRole("button", { name: "Clear" }));
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it("flags an impossible date", async () => {
    render(<DateField calendar aria-label="Date" />);
    await typeDate("31021990");
    expect(drawn("February 1990 has 28 days.")).not.toBeNull();
  });

  it("keeps an impossible date as typed when focus leaves", async () => {
    const onChange = vi.fn<(date: CalendarDate | null) => void>();
    render(
      <form aria-label="Profile">
        <DateField calendar aria-label="Date" name="dob" onChange={onChange} />
      </form>,
    );
    await typeDate("31021990");
    await leave();
    expect(shown()).toEqual(["31", "02", "1990"]);
    expect(drawn("February 1990 has 28 days.")).not.toBeNull();
    expect(onChange).not.toHaveBeenCalled();
    expect(posted()).toBe("");
  });

  it("keeps an impossible date as typed when focus moves to the calendar button", async () => {
    const onChange = vi.fn<(date: CalendarDate | null) => void>();
    render(<DateField calendar aria-label="Date" onChange={onChange} />);
    const u = await typeDate("31021990");
    await u.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: /^Calendar/ }));
    expect(shown()).toEqual(["31", "02", "1990"]);
    expect(onChange).not.toHaveBeenCalled();
  });
});
