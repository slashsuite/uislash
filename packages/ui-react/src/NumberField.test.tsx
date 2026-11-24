// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { NumberField } from "./NumberField.js";
import { render, screen, user } from "./render.harness.js";

const field = () => screen.getByRole<HTMLInputElement>("textbox", { name: "Quantity" });
const minus = () => screen.getByRole<HTMLButtonElement>("button", { name: /^Decrease/ });
const plus = () => screen.getByRole<HTMLButtonElement>("button", { name: /^Increase/ });

describe("NumberField", () => {
  it("is a text field named by its label, between a minus and a plus button", () => {
    render(<NumberField label="Quantity" defaultValue={2} />);
    expect(field().value).toBe("2");
    expect(minus()).toBeTruthy();
    expect(plus()).toBeTruthy();
  });

  it("steps by `step` with the buttons, and reports each number", async () => {
    const onChange = vi.fn<(value: number) => void>();
    render(<NumberField label="Quantity" defaultValue={5} step={5} onChange={onChange} />);
    await user().click(plus());
    expect(field().value).toBe("10");
    await user().click(minus());
    await user().click(minus());
    expect(field().value).toBe("0");
    expect(onChange.mock.calls.map(([value]) => value)).toEqual([10, 5, 0]);
  });

  it("steps with the arrow keys", async () => {
    render(<NumberField label="Quantity" defaultValue={1} />);
    await user().click(field());
    await user().keyboard("{ArrowUp}{ArrowUp}{ArrowDown}");
    expect(field().value).toBe("2");
  });

  it("stops the buttons at minValue and maxValue", () => {
    render(<NumberField label="Quantity" defaultValue={1} minValue={1} maxValue={1} />);
    expect(minus().disabled).toBe(true);
    expect(plus().disabled).toBe(true);
  });

  it("clamps a typed number to maxValue when the field is left", async () => {
    render(<NumberField label="Quantity" defaultValue={1} maxValue={10} />);
    await user().clear(field());
    await user().type(field(), "40");
    await user().tab();
    expect(field().value).toBe("10");
  });

  it("writes the number with formatOptions", () => {
    render(
      <NumberField label="Quantity" defaultValue={0.25} formatOptions={{ style: "percent" }} />,
    );
    expect(field().value).toBe("25%");
  });

  it("keeps the buttons out of the tab order", () => {
    render(<NumberField label="Quantity" defaultValue={1} />);
    expect(minus().tabIndex).toBe(-1);
    expect(plus().tabIndex).toBe(-1);
  });

  it("names its buttons for another language", () => {
    render(<NumberField label="Quantity" decrementLabel="Minder" incrementLabel="Meer" />);
    expect(screen.getByRole("button", { name: /^Minder/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /^Meer/ })).toBeTruthy();
  });

  it("describes the field by its hint, and with an error marks it invalid and shows it", () => {
    render(<NumberField label="Quantity" hint="Up to ten" error="Too many" />);
    expect(
      screen.getByRole("textbox", { name: "Quantity", description: "Up to ten Too many" }),
    ).not.toBeNull();
    expect(field().getAttribute("aria-invalid")).toBe("true");
  });

  it("disables the field and both buttons", () => {
    render(<NumberField label="Quantity" defaultValue={1} disabled />);
    expect(field().disabled).toBe(true);
    expect(minus().disabled).toBe(true);
    expect(plus().disabled).toBe(true);
  });

  it("posts the number as plain digits under `name`", () => {
    render(
      <form aria-label="Order">
        <NumberField
          label="Price"
          name="price"
          defaultValue={1250}
          formatOptions={{ style: "currency", currency: "EUR" }}
        />
      </form>,
    );
    const form = screen.getByRole<HTMLFormElement>("form", { name: "Order" });
    expect(new FormData(form).get("price")).toBe("1250");
  });
});
