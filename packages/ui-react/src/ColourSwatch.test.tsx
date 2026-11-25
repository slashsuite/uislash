// @vitest-environment jsdom
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ColourSwatch } from "./ColourSwatch.js";
import { render, screen } from "./render.harness.js";

describe("ColourSwatch", () => {
  it("says the colour in text: its label and its hex value", () => {
    render(<ColourSwatch value="#1E293B" label="Background" data-testid="swatch" />);
    // A swatch has no role or name of its own; its pass-through test id finds it.
    expect(screen.getByTestId("swatch").textContent).toBe("Background#1e293b");
    expect(screen.getByText("Background")).toBeInstanceOf(HTMLElement);
    expect(screen.getByText("#1e293b")).toBeInstanceOf(HTMLElement);
  });

  it("hides the square itself from a screen reader", () => {
    const html = renderToStaticMarkup(<ColourSwatch value="#1e293b" label="Background" />); // markup read as data
    expect(html).toMatch(/^<span[^>]*><span aria-hidden="true"/);
  });

  // The paint is an inline style, which is the one thing to read here; the markup is read as data.
  it("paints a #rrggbb value", () => {
    const html = renderToStaticMarkup(<ColourSwatch value="#336699" label="Accent" />); // markup read as data
    expect(html).toContain("background-color:#336699");
  });

  it.each(["red", "#369", "#33669980", "url(x)", "#336699; color: red", "var(--x)"])(
    "draws an empty swatch and no value for %j, and injects no CSS",
    (value) => {
      const html = renderToStaticMarkup(<ColourSwatch value={value} label="Accent" />); // markup read as data
      expect(html).not.toContain("style=");
      render(<ColourSwatch value={value} label="Accent" data-testid="swatch" />);
      // A swatch has no role or name of its own; its pass-through test id finds it.
      expect(screen.getByTestId("swatch").textContent).toBe("Accent");
    },
  );
});
