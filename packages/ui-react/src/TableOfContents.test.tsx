// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen, within } from "./render.harness.js";
import { TableOfContents } from "./TableOfContents.js";

const items = [
  { id: "install", label: "Install", level: 2 },
  { id: "bun", label: "With Bun", level: 3 },
  { id: "usage", label: "Usage", level: 2 },
] as const;

describe("TableOfContents", () => {
  it('is a nav named "On this page" by default, with a link to each heading in order', () => {
    render(<TableOfContents items={[...items]} />);
    const nav = screen.getByRole("navigation", { name: "On this page" });
    const links = within(within(nav).getByRole("list")).getAllByRole("link");
    expect(links.map((link) => [link.textContent, link.getAttribute("href")])).toEqual([
      ["Install", "#install"],
      ["With Bun", "#bun"],
      ["Usage", "#usage"],
    ]);
  });

  it("marks the current section's link as the current location, and only that one", () => {
    render(<TableOfContents items={[...items]} current="bun" />);
    expect(screen.getByRole("link", { name: "With Bun" }).getAttribute("aria-current")).toBe(
      "location",
    );
    expect(screen.getByRole("link", { name: "Install" }).hasAttribute("aria-current")).toBe(false);
  });

  it("takes its words as a prop", () => {
    render(<TableOfContents items={[...items]} label="Op hierdie bladsy" />);
    expect(screen.getByRole("navigation", { name: "Op hierdie bladsy" })).not.toBeNull();
    expect(screen.getByText("Op hierdie bladsy")).not.toBeNull();
  });
});
