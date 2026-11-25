// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { Breadcrumbs } from "./Breadcrumbs.js";
import { render, screen, user, within } from "./render.harness.js";
import { everyRunCut } from "./truncated.harness.js";

const trail = () => screen.getByRole("navigation", { name: "Breadcrumb" });

describe("Breadcrumbs", () => {
  it("names the nav landmark Breadcrumb over an ordered list of the crumbs, in order", () => {
    render(<Breadcrumbs items={["Org", "Project"]} />);
    const list = within(trail()).getByRole("list");
    const items = within(list).getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual(["Org", "/Project"]);
  });

  it("marks only the last crumb as the current page", () => {
    render(<Breadcrumbs items={["Org", "Project", "Build"]} />);
    const items = within(trail()).getAllByRole("listitem");
    expect(items.map((item) => item.getAttribute("aria-current"))).toEqual([null, null, "page"]);
    expect(items[2]?.textContent).toBe("/Build");
  });

  it("puts one separator between each pair of crumbs, hidden from assistive tech", () => {
    render(<Breadcrumbs items={["Org", "Project", "Build", "Snap"]} />);
    const separators = screen.getAllByText("/");
    expect(separators).toHaveLength(3);
    for (const separator of separators) {
      expect(separator.getAttribute("aria-hidden")).toBe("true");
    }
    expect(within(trail()).getAllByRole("listitem")).toHaveLength(4);
  });
});

// A stand-in for a router's <Link>: it takes `to` and spreads the props it is handed.

describe("Breadcrumbs link crumbs", () => {
  it("draws a crumb object with href as a link to it", () => {
    render(<Breadcrumbs items={[{ label: "Org", href: "/org" }, "Project"]} />);
    expect(screen.getByRole("link", { name: "Org" }).getAttribute("href")).toBe("/org");
  });

  it("links the last crumb to the current page with aria-current when it is given a href", () => {
    render(
      <Breadcrumbs
        items={[
          { label: "Org", href: "/org" },
          { label: "Here", href: "/here" },
        ]}
      />,
    );
    const here = screen.getByRole("link", { name: "Here" });
    expect(here.getAttribute("href")).toBe("/here");
    expect(here.getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: "Org" }).hasAttribute("aria-current")).toBe(false);
    expect(
      within(trail())
        .getAllByRole("listitem")
        .map((item) => item.getAttribute("aria-current")),
    ).toEqual([null, null]);
  });

  it("external opens in a new tab", () => {
    render(
      <Breadcrumbs
        items={[{ label: "Docs", href: "https://d.example", external: true }, "Page"]}
      />,
    );
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noreferrer");
  });

  it("still takes an element as a crumb", () => {
    render(
      <Breadcrumbs
        items={[
          <a key="a" href="/a">
            A
          </a>,
          "B",
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "A" }).getAttribute("href")).toBe("/a");
  });
});

describe("Breadcrumbs, a cut parent", () => {
  everyRunCut();

  // jsdom has no anchor positioning, so the tooltip falls back to the native title, which focus
  // never shows: a plain parent is no focus stop there.
  it("shows a cut parent's whole label in the title", async () => {
    render(<Breadcrumbs items={["A very long organisation name", "Project"]} />);
    expect(screen.getByTitle("A very long organisation name")).not.toBeNull();
    await user().tab();
    expect(document.activeElement).toBe(document.body);
  });

  it("takes the focus of a cut link crumb on the link, not a stop of its own", async () => {
    render(
      <Breadcrumbs items={[{ label: "A very long organisation name", href: "/org" }, "Project"]} />,
    );
    expect(screen.getByTitle("A very long organisation name")).not.toBeNull();
    await user().tab();
    expect(document.activeElement).toBe(
      screen.getByRole("link", { name: "A very long organisation name" }),
    );
  });

  it("never cuts the current page", () => {
    render(<Breadcrumbs items={["Org", "A very long current page"]} />);
    expect(screen.queryByTitle("A very long current page")).toBeNull();
  });
});
