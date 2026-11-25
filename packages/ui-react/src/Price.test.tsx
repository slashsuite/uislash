// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { Price } from "./Price.js";
import { render, screen } from "./render.harness.js";

describe("Price", () => {
  it("shows the price as given, formatting nothing", () => {
    render(<Price value="€12.50" data-testid="price" />);
    expect(screen.getByTestId("price").textContent).toBe("€12.50");
  });

  it("strikes the was price and says it out loud", () => {
    render(<Price value="R52" was="R65" data-testid="price" />);
    // The strike is silent, so the words a screen reader hears carry the "was".
    expect(screen.getByTestId("price").textContent).toBe("R52, was R65");
    expect(screen.getByText("R65").tagName).toBe("S");
  });

  it("draws nothing for no price when nothing is loading", () => {
    render(<Price value={undefined} data-testid="price" />);
    expect(screen.getByTestId("price").textContent).toBe("");
  });

  it("is a busy bone while loading with no price yet", () => {
    render(<Price value={undefined} loading data-testid="price" />);
    expect(screen.getByTestId("price").getAttribute("aria-busy")).toBe("true");
  });
});
