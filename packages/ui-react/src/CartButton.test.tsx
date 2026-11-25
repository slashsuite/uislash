// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { CartButton } from "./CartButton.js";
import { fireEvent, render, screen } from "./render.harness.js";

describe("CartButton", () => {
  it("is named by its label, the count in words and the total", () => {
    render(<CartButton count={2} total="R480" onClick={() => {}} />);
    expect(screen.getByRole("button", { name: "Cart, 2 items, R480" })).toBeInstanceOf(HTMLElement);
  });

  it("counts one item, and shows an empty cart's 0", () => {
    render(<CartButton count={1} onClick={() => {}} />);
    expect(screen.getByRole("button", { name: "Cart, 1 item" })).toBeInstanceOf(HTMLElement);
    render(<CartButton count={0} onClick={() => {}} data-testid="empty" />);
    expect(screen.getByTestId("empty").textContent).toContain("0");
  });

  it("takes an app's own words", () => {
    render(
      <CartButton
        count={3}
        label="Mandjie"
        itemsLabel={(n) => `${n} items in die mandjie`}
        onClick={() => {}}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Mandjie, 3 items in die mandjie" }),
    ).toBeInstanceOf(HTMLElement);
  });

  it("opens the cart and carries its drawer's state", () => {
    const open = vi.fn();
    render(<CartButton count={2} onClick={open} aria-expanded={false} aria-controls="cart" />);
    const button = screen.getByRole("button");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(button);
    expect(open).toHaveBeenCalledOnce();
  });

  it("is a link to the cart page with href", () => {
    render(<CartButton count={2} href="/cart" />);
    expect(screen.getByRole("link", { name: "Cart, 2 items" }).getAttribute("href")).toBe("/cart");
  });
});
