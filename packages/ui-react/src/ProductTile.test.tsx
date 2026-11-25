// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { ProductTile } from "./ProductTile.js";
import { render, screen } from "./render.harness.js";

// The name a browser reads is "Linen shirt, R52, was R65, Sale". jsdom's name computation
// (dom-accessibility-api) trims each screen-reader-only span, so the spaces are optional here.
const spoken = (words: string) =>
  new RegExp(`^${words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replaceAll(" ", " ?")}$`);

describe("ProductTile", () => {
  it("is one link named by its name, price and was price", () => {
    render(<ProductTile href="/shirt" name="Linen shirt" price="R52" was="R65" status="sale" />);
    const link = screen.getByRole("link", { name: spoken("Linen shirt, R52, was R65, Sale") });
    expect(link.getAttribute("href")).toBe("/shirt");
    expect(link.textContent).toBe("Linen shirt, R52, was R65, Sale");
  });

  it("says sold out, in the app's own word when given one", () => {
    render(<ProductTile href="/a" name="Mug" price="R80" status="sold-out" />);
    expect(screen.getByRole("link", { name: spoken("Mug, R80, Sold out") })).toBeInstanceOf(HTMLElement);
    render(<ProductTile href="/b" name="Bowl" price="R90" status="sold-out" statusLabel="Uitverkoop" />);
    expect(screen.getByRole("link", { name: spoken("Bowl, R90, Uitverkoop") })).toBeInstanceOf(HTMLElement);
  });

  it("keeps the picture out of the name", () => {
    render(<ProductTile href="/a" name="Mug" src="/mug.jpg" price="R80" />);
    expect(screen.getByRole("link", { name: spoken("Mug, R80") })).toBeInstanceOf(HTMLElement);
  });

  it("is busy while loading with nothing yet", () => {
    render(<ProductTile href="/a" name={undefined} price={undefined} loading />);
    expect(screen.getByRole("link").getAttribute("aria-busy")).toBe("true");
  });
});
