// @vitest-environment jsdom
import { isInaccessible } from "@testing-library/dom";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import { FlowDiagram, type FlowEdge, type FlowNode } from "./FlowDiagram.js";
import { type FlowBox, type FlowLayout, type FlowNodeBox, layoutFlow } from "./flowLayout.js";
import { render, screen, within } from "./render.harness.js";

const nodes: FlowNode[] = [
  { id: "draft", label: "Draft" },
  { id: "review", label: "In review", tone: "info" },
  { id: "changes", label: "Changes asked", tone: "warn" },
  { id: "done", label: "Published", tone: "positive" },
];
const edges: FlowEdge[] = [
  { from: "draft", to: "review", label: "submit" },
  { from: "review", to: "changes", label: "reject" },
  { from: "changes", to: "review" },
  { from: "review", to: "done", label: "approve" },
];

/** Renders the diagram and returns the layout it drew, as `overlay` is handed it. */
function laidOut(props: Omit<ComponentProps<typeof FlowDiagram>, "overlay">): FlowLayout {
  const seen: FlowLayout[] = [];
  render(
    <FlowDiagram
      {...props}
      overlay={(layout) => {
        seen.push(layout);
        return null;
      }}
    />,
  );
  const last = seen.at(-1);
  if (!last) throw new Error("the overlay was never drawn");
  return last;
}

function boxOf(layout: FlowLayout, id: string): FlowNodeBox {
  const box = layout.nodes.find((n) => n.id === id);
  if (!box) throw new Error(`no box for ${id}`);
  return box;
}

function groupOf(layout: FlowLayout, name: string): FlowBox {
  const box = layout.groups.find((g) => g.name === name);
  if (!box) throw new Error(`no group ${name}`);
  return box;
}

/** The boxes that reach past the canvas on any side. */
const outside = (layout: FlowLayout): FlowNodeBox[] =>
  layout.nodes.filter(
    (n) => n.x < 0 || n.y < 0 || n.x + n.width > layout.width || n.y + n.height > layout.height,
  );

describe("FlowDiagram", () => {
  it("lays out every node and every edge, each edge with a path", () => {
    const layout = laidOut({ label: "Article flow", nodes, edges });
    expect(layout.nodes.map((n) => n.id)).toEqual(nodes.map((n) => n.id));
    expect(layout.edges.map((e) => [e.from, e.to, e.index])).toEqual(
      edges.map((e, i) => [e.from, e.to, i]),
    );
    expect(layout.edges.every((e) => e.path.startsWith("M"))).toBe(true);
  });

  it("draws every box's label and every arrow's label", () => {
    render(<FlowDiagram label="Article flow" nodes={nodes} edges={edges} />);
    const image = screen.getByRole("img", { name: "Article flow: 4 boxes and 4 arrows" });
    for (const text of ["Draft", "In review", "Changes asked", "Published"]) {
      expect(within(image).getByText(text)).toBeTruthy();
    }
    for (const text of ["submit", "reject", "approve"]) {
      expect(within(image).getByText(text)).toBeTruthy();
    }
  });

  it("lists every box and the arrows out of it for a screen reader", () => {
    render(<FlowDiagram label="Article flow" nodes={nodes} edges={edges} active="review" />);
    const list = screen.getByRole("list", { name: "Article flow" });
    expect(list.textContent).toBe(
      [
        "Draft",
        "to In review, on submit",
        "In review, current",
        "to Changes asked, on reject",
        "to Published, on approve",
        "Changes asked",
        "to In review",
        "Published",
      ].join(""),
    );
  });

  it("widens a box for a long label", () => {
    const short = laidOut({ label: "a", nodes: [{ id: "x", label: "Go" }], edges: [] });
    const long = laidOut({
      label: "b",
      nodes: [{ id: "x", label: "Waiting on the reviewer's sign off" }],
      edges: [],
    });
    expect(boxOf(long, "x").width).toBeGreaterThan(boxOf(short, "x").width);
  });

  it("grows a box that has content, and draws the content in it", () => {
    const plain = laidOut({ label: "a", nodes: [{ id: "x", label: "Queue" }], edges: [] });
    const full = laidOut({
      label: "b",
      nodes: [{ id: "x", label: "Queue", content: <span>three items</span> }],
      edges: [],
    });
    expect(boxOf(full, "x").height).toBeGreaterThan(boxOf(plain, "x").height);
    const image = screen.getByRole("img", { name: "b: 1 box and 0 arrows" });
    expect(within(image).getByText("three items")).toBeTruthy();
  });

  it("leaves out an arrow whose end is not a node", () => {
    const layout = laidOut({
      label: "Flow",
      nodes,
      edges: [...edges, { from: "draft", to: "nowhere", label: "lost" }],
    });
    expect(layout.edges).toHaveLength(edges.length);
    expect(screen.queryByText("lost")).toBeNull();
    expect(screen.getByRole("img", { name: "Flow: 4 boxes and 4 arrows" })).toBeTruthy();
  });

  it("frames the boxes of a group, named, and says the group in the list", () => {
    const layout = laidOut({
      label: "Lanes",
      nodes: [
        { id: "a", label: "Ask", group: "Customer" },
        { id: "b", label: "Answer", group: "Support" },
        { id: "c", label: "Close", group: "Support" },
      ],
      edges: [
        { from: "a", to: "b" },
        { from: "b", to: "c" },
      ],
    });
    expect(layout.groups.map((g) => g.name)).toEqual(["Customer", "Support"]);
    expect(boxOf(layout, "b").x).toBeGreaterThanOrEqual(groupOf(layout, "Support").x);
    expect(within(screen.getByRole("img")).getByText("Support")).toBeTruthy();
    expect(screen.getByRole("list", { name: "Lanes" }).textContent).toContain("Answer, in Support");
  });

  it("draws `overlay` over the diagram, hidden from assistive tech", () => {
    render(
      <FlowDiagram label="Flow" nodes={nodes} edges={edges} overlay={() => <span>marker</span>} />,
    );
    expect(isInaccessible(screen.getByText("marker"))).toBe(true);
  });

  it("draws a bone while loading with no nodes", () => {
    render(<FlowDiagram label="Flow" nodes={[]} edges={[]} loading />);
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByRole("figure", { name: "Flow" }).getAttribute("aria-busy")).toBe("true");
  });
});

const pair = [
  { id: "a", width: 80, height: 40 },
  { id: "b", width: 80, height: 40 },
];
const ids = Array.from({ length: 26 }, (_, i) => `n${i}`);
/** 26 boxes in a ring, each with a second arrow seven on: loops, and arrows back up the ranks. */
const ring = ids.flatMap((id, i) => [
  { from: id, to: `n${(i + 1) % ids.length}` },
  { from: id, to: `n${(i * 7) % ids.length}`, label: { width: 40, height: 16 } },
]);

describe("layoutFlow", () => {
  it("ranks down by default", () => {
    const out = layoutFlow(pair, [{ from: "a", to: "b" }], "down");
    expect(boxOf(out, "b").y).toBeGreaterThan(boxOf(out, "a").y);
  });

  it("ranks right on request", () => {
    const out = layoutFlow(pair, [{ from: "a", to: "b" }], "right");
    expect(boxOf(out, "b").x).toBeGreaterThan(boxOf(out, "a").x);
  });

  it("keeps every box inside the canvas, loops included", () => {
    const out = layoutFlow(
      ids.map((id) => ({ id, width: 120, height: 40 })),
      ring,
      "down",
    );
    expect(out.nodes).toHaveLength(26);
    expect(out.edges).toHaveLength(52);
    expect(outside(out)).toEqual([]);
  });
});
