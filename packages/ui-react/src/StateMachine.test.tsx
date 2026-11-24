// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen, user, within } from "./render.harness.js";
import {
  StateMachine,
  type StateMachineItem,
  type StateMachineState,
  type StateMachineTransition,
} from "./StateMachine.js";

const states: StateMachineState[] = [
  { id: "draft", label: "Draft", kind: "initial", owner: "writer" },
  { id: "review", label: "In review", kind: "human", owner: "editor" },
  { id: "published", label: "Published", kind: "terminal" },
  { id: "rejected", label: "Rejected", kind: "failed" },
];
const transitions: StateMachineTransition[] = [
  { from: "draft", to: "review", event: "submit" },
  { from: "review", to: "draft", event: "send back" },
  { from: "review", to: "published", event: "approve" },
  { from: "review", to: "rejected", event: "reject" },
];

const machine = (items: StateMachineItem[] = []) => (
  <StateMachine label="Articles" states={states} transitions={transitions} items={items} />
);

describe("StateMachine", () => {
  it("draws every state and every transition", () => {
    render(machine());
    const image = screen.getByRole("img", { name: "Articles: 4 boxes and 4 arrows" });
    for (const text of ["Draft", "In review", "Published", "Rejected"]) {
      expect(within(image).getByText(text)).toBeTruthy();
    }
    for (const text of ["submit", "send back", "approve", "reject"]) {
      expect(within(image).getByText(text)).toBeTruthy();
    }
  });

  it("draws with no items given", () => {
    render(<StateMachine label="Articles" states={states} transitions={transitions} />);
    expect(screen.getByRole("img", { name: "Articles: 4 boxes and 4 arrows" })).toBeTruthy();
  });

  it("keeps a dot in place when the items are a new array with the same places", () => {
    const item = { id: "A-12", label: "Spring launch post", state: "review" };
    const { rerender } = render(machine([item]));
    rerender(machine([{ ...item }]));
    const dot = screen.getByRole("img", { name: "Spring launch post, in In review" });
    expect(dot.hasAttribute("data-hc-sm-arrive")).toBe(false);
  });

  it("tags each state with its kind and its owner", () => {
    render(machine());
    const list = screen.getByRole("list", { name: "Articles" });
    expect(list.textContent).toContain("Draftstartwriter");
    expect(list.textContent).toContain("In reviewhumaneditor");
    expect(list.textContent).toContain("Publishedend");
    expect(list.textContent).toContain("Rejectedfailed");
  });

  it("puts an item's dot in its state, named by its label, and counts it there", () => {
    render(machine([{ id: "A-12", label: "Spring launch post", state: "review" }]));
    expect(screen.getByRole("img", { name: "Spring launch post, in In review" })).toBeTruthy();
    expect(screen.getByRole("list", { name: "Articles" }).textContent).toContain(
      "In reviewhumaneditor1 item",
    );
  });

  it("makes a dot with an href a link", () => {
    render(machine([{ id: "A-12", label: "Spring launch post", state: "review", href: "/a/12" }]));
    const link = screen.getByRole("link", { name: "Spring launch post, in In review" });
    expect(link.getAttribute("href")).toBe("/a/12");
  });

  it("puts an item whose state is unknown in the unplaced box, never dropping it", () => {
    render(machine([{ id: "A-9", label: "Archived interview", state: "archived" }]));
    expect(screen.getByRole("img", { name: "Articles: 5 boxes and 4 arrows" })).toBeTruthy();
    expect(
      screen.getByRole("img", { name: "Archived interview, in Not in any state" }),
    ).toBeTruthy();
  });

  it("draws no unplaced box when every item has a state", () => {
    render(machine([{ id: "A-12", label: "Spring launch post", state: "draft" }]));
    expect(screen.queryByText("Not in any state")).toBeNull();
  });

  it("moves an item's dot to its new state when its state changes", () => {
    const item = { id: "A-12", label: "Spring launch post", state: "review" };
    const { rerender } = render(machine([item]));
    rerender(machine([{ ...item, state: "published" }]));
    // The dot waits hidden at its new place while its run along the arrow plays.
    const dot = screen.getByRole("img", { name: "Spring launch post, in Published" });
    expect(dot.hasAttribute("data-hc-sm-arrive")).toBe(true);
    expect(screen.queryByRole("img", { name: "Spring launch post, in In review" })).toBeNull();
  });

  it("lands a dot without a run when the box it left is gone", () => {
    const item = { id: "A-9", label: "Archived interview", state: "archived" };
    const { rerender } = render(machine([item]));
    rerender(machine([{ ...item, state: "draft" }]));
    const dot = screen.getByRole("img", { name: "Archived interview, in Draft" });
    expect(dot.hasAttribute("data-hc-sm-arrive")).toBe(false);
  });

  it("shows nine dots in a box, then eight and a +N that shows the rest", async () => {
    const items = Array.from({ length: 12 }, (_, i) => ({
      id: `B-${i}`,
      label: `Build ${i}`,
      state: "draft",
    }));
    render(machine(items));
    expect(screen.getAllByRole("img", { name: /, in Draft$/ })).toHaveLength(8);
    await user().click(screen.getByRole("button", { name: "Show 4 more in Draft" }));
    expect(screen.getAllByRole("img", { name: /, in Draft$/ })).toHaveLength(12);
    await user().click(screen.getByRole("button", { name: "Show fewer in Draft" }));
    expect(screen.getAllByRole("img", { name: /, in Draft$/ })).toHaveLength(8);
  });

  it("rings the active state", () => {
    render(
      <StateMachine label="Articles" states={states} transitions={transitions} active="review" />,
    );
    expect(screen.getByRole("list", { name: "Articles" }).textContent).toContain(
      "In review, current",
    );
  });

  it("draws a bone while loading with no states", () => {
    render(<StateMachine label="Articles" states={[]} transitions={[]} loading />);
    expect(screen.getByRole("figure", { name: "Articles" }).getAttribute("aria-busy")).toBe("true");
  });
});
