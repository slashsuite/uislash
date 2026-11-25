// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen, within } from "./render.harness.js";
import { Stepper } from "./Stepper.js";

const STEPS = ["Cart", "Shipping", "Payment", "Review"];
const steps = () => within(screen.getByRole("list", { name: "Checkout" })).getAllByRole("listitem");

describe("Stepper", () => {
  it("is an ordered list named by label, one item per step in order", () => {
    render(<Stepper steps={STEPS} current={2} label="Checkout" />);
    expect(screen.getByRole("list", { name: "Checkout" }).tagName).toBe("OL");
    expect(steps().map((step) => step.textContent)).toEqual([
      "Cart (done)",
      "2Shipping",
      "3Payment",
      "4Review",
    ]);
  });

  it("marks only the current step with aria-current=step", () => {
    render(<Stepper steps={STEPS} current={3} label="Checkout" />);
    expect(steps().map((step) => step.getAttribute("aria-current"))).toEqual([
      null,
      null,
      "step",
      null,
    ]);
  });

  it("says a step is done in words, not only by its tick", () => {
    render(<Stepper steps={STEPS} current={3} label="Checkout" doneLabel="fait" />);
    expect(steps().map((step) => step.textContent?.endsWith("(fait)"))).toEqual([
      true,
      true,
      false,
      false,
    ]);
  });

  it("marks every step done past the last, and none current", () => {
    render(<Stepper steps={STEPS} current={5} label="Checkout" />);
    expect(steps().every((step) => step.textContent?.endsWith("(done)"))).toBe(true);
    expect(steps().some((step) => step.hasAttribute("aria-current"))).toBe(false);
  });
});
