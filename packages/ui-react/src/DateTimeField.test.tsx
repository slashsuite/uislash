// @vitest-environment jsdom
import { CalendarDateTime } from "@internationalized/date";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { DateTimeField } from "./DateTimeField.js";
import { drawn, render, screen, user } from "./render.harness.js";

const segments = () => screen.getAllByRole("spinbutton");

/** The `index`th segment: day, month, year, hour, minute (in en-GB). */
function segment(index: number): HTMLElement {
  const found = segments()[index];
  if (!found) throw new Error(`no segment ${index}`);
  return found;
}
const shown = () => segments().map((s) => s.textContent);
const posted = () => new FormData(screen.getByRole<HTMLFormElement>("form")).get("at");

/** A form holding the field under the name `at`. */
function inForm(field: ReactElement) {
  return render(<form aria-label="Booking">{field}</form>);
}

async function typeAll(...keys: string[]) {
  const u = user();
  await u.click(segment(0));
  for (const key of keys) await u.keyboard(key);
  return u;
}

describe("DateTimeField", () => {
  it("shows hours and minutes on a 24-hour clock in en-GB", () => {
    inForm(
      <DateTimeField
        aria-label="Starts"
        locale="en-GB"
        defaultValue={new CalendarDateTime(2026, 11, 29, 14, 5)}
      />,
    );
    expect(shown()).toEqual(["29", "11", "2026", "14", "05"]);
  });

  it("shows AM/PM in en-US, the browser's locale here", () => {
    inForm(
      <DateTimeField
        aria-label="Starts"
        defaultValue={new CalendarDateTime(2026, 11, 29, 14, 5)}
      />,
    );
    expect(shown()).toEqual(["11", "29", "2026", "02", "05", "PM"]);
  });

  it("posts YYYY-MM-DDTHH:mm on the 24-hour clock under name", () => {
    inForm(
      <DateTimeField
        aria-label="Starts"
        name="at"
        defaultValue={new CalendarDateTime(2026, 11, 29, 14, 5)}
      />,
    );
    expect(posted()).toBe("2026-11-29T14:05");
  });

  it("reads typed digits and a 12-hour time into one value", async () => {
    const onChange = vi.fn<(value: CalendarDateTime | null) => void>();
    inForm(<DateTimeField aria-label="Starts" name="at" onChange={onChange} />);
    await typeAll("11292026", "1205", "a");
    expect(onChange.mock.lastCall?.[0]?.toString()).toBe("2026-11-29T00:05:00");
    expect(posted()).toBe("2026-11-29T00:05");
  });

  it("reads a typed 24-hour time in en-GB", async () => {
    const onChange = vi.fn<(value: CalendarDateTime | null) => void>();
    inForm(<DateTimeField aria-label="Starts" name="at" locale="en-GB" onChange={onChange} />);
    await typeAll("29112026", "2330");
    expect(onChange.mock.lastCall?.[0]?.toString()).toBe("2026-11-29T23:30:00");
    expect(posted()).toBe("2026-11-29T23:30");
  });

  it("flags an impossible day and posts nothing", async () => {
    inForm(<DateTimeField aria-label="Starts" name="at" locale="en-GB" />);
    await typeAll("31022026", "1000");
    expect(drawn("February 2026 has 28 days.")).not.toBeNull();
    expect(posted()).toBe("");
  });

  it("blocks a submit and asks for the whole date and time when a required one is partly filled", async () => {
    const onSubmit = vi.fn();
    render(
      <form aria-label="Booking" onSubmit={onSubmit}>
        <DateTimeField
          aria-label="Starts"
          locale="en-GB"
          required
          defaultValue={new CalendarDateTime(2026, 11, 29, 14, 5)}
        />
        <button type="submit">Book</button>
      </form>,
    );
    const u = user();
    await u.click(segment(4));
    await u.keyboard("{Backspace}{Backspace}");
    await u.click(screen.getByRole("button", { name: "Book" }));
    expect(segment(4).getAttribute("aria-valuetext")).toBe("Empty");
    expect(onSubmit).not.toHaveBeenCalled();
    expect(drawn("Enter the whole date and time.")).not.toBeNull();
  });
});
