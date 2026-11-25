// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { Cluster, ClusterGrow } from "./Cluster.js";
import { render, screen, within } from "./render.harness.js";

describe("Cluster", () => {
  it("is a div by default and a span with as=span, for phrasing content", () => {
    render(
      <>
        <Cluster>block</Cluster>
        <p>
          <Cluster as="span">inline</Cluster>
        </p>
      </>,
    );
    expect(screen.getByText("block").tagName).toBe("DIV");
    expect(screen.getByText("inline").tagName).toBe("SPAN");
  });

  it("keeps its items in the order given", () => {
    render(
      <Cluster justify="between">
        <span>first</span>
        <ClusterGrow>middle</ClusterGrow>
        <span>last</span>
      </Cluster>,
    );
    const first = screen.getByText("first");
    const middle = screen.getByText("middle");
    const last = screen.getByText("last");
    expect(first.compareDocumentPosition(middle) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(middle.compareDocumentPosition(last) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });
});

describe("Cluster as a list", () => {
  it.each(["ul", "ol"] as const)(
    "as=%s is a list named by aria-label, each child in its own item",
    (as) => {
      render(
        <Cluster as={as} aria-label="Tags">
          <span>Vintage</span>
          <span>Books</span>
          <span>Vinyl</span>
        </Cluster>,
      );
      const list = screen.getByRole("list", { name: "Tags" });
      expect(
        within(list)
          .getAllByRole("listitem")
          .map((item) => item.textContent),
      ).toEqual(["Vintage", "Books", "Vinyl"]);
    },
  );
});

describe("Cluster as a nav", () => {
  it("is a nav named by aria-label, around a list with each link in its own item", () => {
    render(
      <Cluster as="nav" aria-label="Footer">
        <a href="#terms">Terms</a>
        <a href="#privacy">Privacy</a>
      </Cluster>,
    );
    const nav = screen.getByRole("navigation", { name: "Footer" });
    const items = within(within(nav).getByRole("list")).getAllByRole("listitem");
    expect(items.map((item) => within(item).getByRole("link").textContent)).toEqual([
      "Terms",
      "Privacy",
    ]);
  });

  it("asks for aria-label", () => {
    // @ts-expect-error a nav needs a name
    const view = <Cluster as="nav">x</Cluster>;
    expect(view).not.toBeNull();
  });
});
