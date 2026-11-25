// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { PromoBanner } from "./PromoBanner.js";
import { render, screen, user } from "./render.harness.js";

describe("PromoBanner", () => {
  it("says its offer and links its action", () => {
    render(
      <PromoBanner action="Shop refills" href="/refills">
        Refills from R390 this week
      </PromoBanner>,
    );
    expect(screen.getByText("Refills from R390 this week").tagName).toBe("P");
    expect(screen.getByRole("link", { name: "Shop refills" }).getAttribute("href")).toBe(
      "/refills",
    );
  });

  it("makes its action a button with onClick", async () => {
    const onClick = vi.fn();
    render(
      <PromoBanner action="Get the code" onClick={onClick}>
        10% off your first order
      </PromoBanner>,
    );
    await user().click(screen.getByRole("button", { name: "Get the code" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
