// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { Field } from "./Field.js";
import {
  announced,
  drawn,
  errorRegion,
  follows,
  liveRegions,
  render,
  screen,
} from "./render.harness.js";

const HINT = "Shown on your reviews.";
const ERROR = "Pick a shorter name.";

describe("Field", () => {
  it("points the label at the control through htmlFor", () => {
    render(
      <Field label="Name" htmlFor="name">
        <input id="name" />
      </Field>,
    );
    const control = screen.getByRole("textbox", { name: "Name" });
    expect(control.id).toBe("name");
    // A real <label> tied through htmlFor, so a click on it focuses the control.
    expect(screen.getByText("Name")).toHaveProperty("control", control);
  });

  it("shows the hint when there is no error", () => {
    render(
      <Field label="Name" htmlFor="name" hint={HINT}>
        <input id="name" />
      </Field>,
    );
    expect(screen.getByText(HINT)).toBeInstanceOf(HTMLElement);
    expect(announced()).toEqual([]);
  });

  it("keeps the hint and adds the error under it, announced politely and never as an alert", () => {
    render(
      <Field label="Name" htmlFor="name" hint={HINT} error={ERROR}>
        <input id="name" />
      </Field>,
    );
    const hint = screen.getByText(HINT);
    const error = drawn(ERROR);
    expect(follows(hint, error as Node)).toBe(true);
    expect(screen.queryByRole("alert")).toBeNull();
    expect(errorRegion()?.getAttribute("aria-live")).toBe("polite");
    expect(announced()).toEqual([ERROR]);
  });

  it("puts one live region on the page for every field", () => {
    const { rerender } = render(
      <>
        <Field label="Name" htmlFor="name">
          <input id="name" />
        </Field>
        <Field label="Email" htmlFor="email">
          <input id="email" />
        </Field>
      </>,
    );
    expect(announced()).toEqual([]);
    rerender(
      <>
        <Field label="Name" htmlFor="name" error="Name is required.">
          <input id="name" />
        </Field>
        <Field label="Email" htmlFor="email" error="Email is required.">
          <input id="email" />
        </Field>
      </>,
    );
    expect(liveRegions()).toBe(1);
    expect(announced()).toEqual(["Name is required.", "Email is required."]);
  });

  it("marks a required field's label with an asterisk hidden from assistive tech", () => {
    render(
      <Field label="Name" htmlFor="name" required>
        <input id="name" />
      </Field>,
    );
    const mark = screen.getByText("*");
    expect(mark.getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByRole("textbox", { name: "Name" })).toBeInstanceOf(HTMLElement);
  });
});

describe("Field layout", () => {
  it("still names the control and puts the label before it with layout=row", () => {
    render(
      <Field label="Rank" htmlFor="rank" layout="row">
        <input id="rank" />
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Rank" });
    expect(follows(screen.getByText("Rank"), input)).toBe(true);
  });

  it("keeps the hint after the control, and the error under it, with layout=row", () => {
    const { unmount } = render(
      <Field label="Rank" htmlFor="rank" layout="row" hint="Lower first.">
        <input id="rank" />
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Rank" });
    expect(follows(input, screen.getByText("Lower first."))).toBe(true);
    unmount();
    render(
      <Field label="Rank" htmlFor="rank" layout="row" hint="Lower first." error="Required.">
        <input id="rank" />
      </Field>,
    );
    expect(announced()).toEqual(["Required."]);
    expect(follows(screen.getByText("Lower first."), drawn("Required."))).toBe(true);
  });
});
