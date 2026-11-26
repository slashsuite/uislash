// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen, user } from "./render.harness.js";
import { StateMachine, type StateMachineItem } from "./StateMachine.js";
import { SLOT_H, SLOT_W, slotAt } from "./stateMachineGrid.js";
import { moveOf, runPath, seatsOf } from "./stateMachineMoves.js";

const states = [
  { id: "draft", label: "Draft" },
  { id: "review", label: "In review" },
  { id: "published", label: "Published" },
  { id: "rejected", label: "Rejected" },
];
const transitions = [
  { from: "draft", to: "review", event: "submit" },
  { from: "review", to: "draft", event: "send back" },
  { from: "review", to: "published", event: "approve" },
  { from: "review", to: "rejected", event: "reject" },
];
const known = new Set(states.map((s) => s.id));

const machine = (items: StateMachineItem[]) => (
  <StateMachine label="Articles" states={states} transitions={transitions} items={items} />
);

const dot = (name: string) => screen.getByRole("img", { name });
const box = (id: string, y: number) => ({ id, x: 0, y, width: 240, height: 100 });
const item = (id: string, state: string) => ({ id, label: id, state });

/** A layout drawn by hand: review above draft, and one arrow between them. */
const drawn = {
  width: 400,
  height: 400,
  nodes: [box("review", 0), box("draft", 250)],
  groups: [],
  // An arrow with two bends: down, across, down.
  edges: [
    {
      from: "review",
      to: "draft",
      index: 0,
      points: [],
      path: "M120,100V150H300V250",
      labelAt: null,
    },
  ],
};

/** Each item's move from the `before` items to the `after` ones, in the order of `ids`. */
function movesOf(before: StateMachineItem[], after: StateMachineItem[], ids: string[]) {
  const was = seatsOf(before, known, new Set());
  const now = seatsOf(after, known, new Set());
  return ids.map((id) => {
    const from = was.get(id);
    const to = now.get(id);
    return from && to ? moveOf(from, to, 1) : undefined;
  });
}

describe("a run's path", () => {
  it("runs a dot from its old slot along every bend of the arrow into its new slot", () => {
    const start = slotAt(box("review", 0), 1, 2);
    const d = runPath(drawn, { from: "review", to: "draft", slot: 1, slots: 2 }, { x: 50, y: 300 });
    expect(d).toBe(`M${start.left + 11},${start.y} L120,100V150H300V250 L50,300`);
  });

  it("runs a dot straight across when no arrow joins the two states", () => {
    const start = slotAt(box("draft", 250), 0, 1);
    const d = runPath(drawn, { from: "draft", to: "review", slot: 0, slots: 1 }, { x: 20, y: 40 });
    expect(d).toBe(`M${start.left + 11},${start.y} L20,40`);
  });

  it("has no run from a box that is not drawn", () => {
    expect(runPath(drawn, { from: "gone", to: "draft", slot: 0, slots: 1 }, { x: 0, y: 0 })).toBe(
      null,
    );
  });
});

describe("moves", () => {
  it("slides the dots that stay into the slot a leaving dot frees, never a jump", () => {
    const ids = ["A", "B", "C", "D"];
    expect(
      movesOf(
        ids.map((id) => item(id, "review")),
        [item("A", "draft"), ...ids.slice(1).map((id) => item(id, "review"))],
        ids,
      ),
    ).toEqual([
      { kind: "travel", from: "review", to: "draft", slot: 0, slots: 4, seq: 1 },
      { kind: "shift", dx: SLOT_W, dy: 0, seq: 1 },
      { kind: "shift", dx: SLOT_W, dy: 0, seq: 1 },
      // From the second row's first slot to the first row's last.
      { kind: "shift", dx: -2 * SLOT_W, dy: SLOT_H, seq: 1 },
    ]);
  });

  it("runs a dot hidden behind a full box's +N from the +N's slot", () => {
    const items = Array.from({ length: 8 }, (_, i) => item(`B-${i}`, "review"));
    const after = [...items.slice(0, 7), item("B-7", "draft")];
    expect(movesOf(items, after, ["B-7"])).toEqual([
      { kind: "travel", from: "review", to: "draft", slot: 5, slots: 6, seq: 1 },
    ]);
  });

  it("moves no dot when a box is opened", async () => {
    const items = Array.from({ length: 8 }, (_, i) => item(`B-${i}`, "draft"));
    render(machine(items));
    await user().click(screen.getByRole("button", { name: "Show 3 more in Draft" }));
    for (const shown of screen.getAllByRole("img", { name: /, in Draft$/ })) {
      expect(shown.hasAttribute("data-hc-sm-shift")).toBe(false);
      expect(shown.hasAttribute("data-hc-sm-arrive")).toBe(false);
    }
  });

  it("runs every dot that moves at once, and slides the one left behind", () => {
    const items = [item("First", "review"), item("Second", "review"), item("Third", "review")];
    const { rerender } = render(machine(items));
    rerender(
      machine([item("First", "published"), item("Second", "rejected"), item("Third", "review")]),
    );
    expect(dot("First, in Published").hasAttribute("data-hc-sm-arrive")).toBe(true);
    expect(dot("Second, in Rejected").hasAttribute("data-hc-sm-arrive")).toBe(true);
    expect(dot("Third, in In review").hasAttribute("data-hc-sm-shift")).toBe(true);
  });
});
