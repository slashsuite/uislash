// @vitest-environment jsdom
import { fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Field } from "./Field.js";
import { render, screen } from "./render.harness.js";
import { Slider } from "./Slider.js";

const slider = (name = "Opacity") => screen.getByRole<HTMLInputElement>("slider", { name });

describe("Slider", () => {
  it("is a native range, named and described by its Field", () => {
    render(
      <Field label="Opacity" hint="How much of the overlay shows">
        <Slider defaultValue={40} />
      </Field>,
    );
    expect(slider().type).toBe("range");
    expect(slider().value).toBe("40");
    expect(
      screen.getByRole("slider", { name: "Opacity", description: "How much of the overlay shows" }),
    ).not.toBeNull();
  });

  it("writes its value beside the track and reads it out the same way", () => {
    render(
      <Slider
        aria-label="Opacity"
        defaultValue={0.4}
        min={0}
        max={1}
        step={0.1}
        formatOptions={{ style: "percent" }}
      />,
    );
    expect(slider().getAttribute("aria-valuetext")).toBe("40%");
    expect(screen.getAllByText("40%")).toHaveLength(1);
  });

  it("follows the value as it moves, and passes the input's own onChange", () => {
    const onChange = vi.fn<(value: number) => void>();
    render(
      <Slider
        aria-label="Opacity"
        defaultValue={10}
        onChange={(e) => onChange(e.target.valueAsNumber)}
      />,
    );
    fireEvent.change(slider(), { target: { value: "70" } });
    expect(onChange).toHaveBeenCalledExactlyOnceWith(70);
    expect(slider().getAttribute("aria-valuetext")).toBe("70");
  });

  it("starts halfway with no defaultValue, as the browser's does", () => {
    render(<Slider aria-label="Opacity" min={0} max={200} />);
    expect(slider().getAttribute("aria-valuetext")).toBe("100");
  });

  it("shows the caller's value when controlled", () => {
    render(<Slider aria-label="Opacity" value={25} onChange={() => undefined} />);
    expect(slider().value).toBe("25");
    expect(slider().getAttribute("aria-valuetext")).toBe("25");
  });

  it("takes the Field's error as aria-invalid, and disabled", () => {
    render(
      <Field label="Opacity" error="Too faint">
        <Slider disabled />
      </Field>,
    );
    expect(slider().getAttribute("aria-invalid")).toBe("true");
    expect(slider().disabled).toBe(true);
  });
});
