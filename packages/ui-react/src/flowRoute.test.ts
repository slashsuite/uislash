import { describe, expect, it } from "vitest";
import { type FlowBox, type FlowEdgePath, type FlowLayout, layoutFlow } from "./flowLayout.js";
import { squarePath } from "./flowRoute.js";
import { boxContentSize } from "./stateMachineGrid.js";
import { guessNode } from "./useFlowLayout.js";

/**
 * A machine of twenty states and forty moves, with long arrows down and back up the ranks: the
 * shape that sent arrows through boxes and labels onto their borders.
 */
const STATES = [
  "exploring",
  "confirm_complete",
  "parked_idea",
  "drilling",
  "checking",
  "owner_plan_call",
  "spike",
  "queued",
  "launching",
  "building",
  "reviewing",
  "pr_ci",
  "owner_call",
  "partial",
  "handed_off",
  "gating",
  "updating_pr",
  "owner_merge_call",
  "closed",
  "failed",
] as const;
const MOVES: readonly [string, string, string][] = [
  ["exploring", "confirm_complete", "looks whole"],
  ["confirm_complete", "exploring", "no, keep going"],
  ["confirm_complete", "drilling", "yes, ticket it"],
  ["exploring", "parked_idea", "note a raw idea"],
  ["parked_idea", "confirm_complete", "picks it up"],
  ["drilling", "checking", "seal score, run checker"],
  ["checking", "queued", "go, ob spinoff"],
  ["checking", "drilling", "no-go, change ticket"],
  ["drilling", "owner_plan_call", "owner's call"],
  ["owner_plan_call", "drilling", "answer"],
  ["drilling", "spike", "only by trying"],
  ["spike", "drilling", "answers on parent"],
  ["spike", "closed", "spike closed"],
  ["drilling", "queued", "no-check with reason"],
  ["queued", "launching", "claim"],
  ["launching", "building", "thread opened"],
  ["launching", "queued", "retry launch"],
  ["launching", "failed", "attempt cap hit"],
  ["queued", "failed", "abandon"],
  ["building", "failed", "abandon or lost trial"],
  ["building", "reviewing", "review legs run"],
  ["reviewing", "building", "open finding, fix"],
  ["reviewing", "pr_ci", "0 open, open PR"],
  ["pr_ci", "building", "CI fails, fix"],
  ["pr_ci", "handed_off", "handoff, CI green"],
  ["pr_ci", "owner_call", "verdict needs-human"],
  ["owner_call", "handed_off", "owner hands off"],
  ["owner_call", "building", "owner answers"],
  ["building", "owner_call", "verdict blocked"],
  ["building", "partial", "verdict partial"],
  ["partial", "building", "redispatch"],
  ["handed_off", "gating", "read inbox"],
  ["gating", "building", "sendback"],
  ["gating", "updating_pr", "conflict or overlap"],
  ["updating_pr", "gating", "pushed, re-gate"],
  ["gating", "owner_merge_call", "taste, waiver or flake"],
  ["owner_merge_call", "gating", "owner answers"],
  ["gating", "closed", "merge, deploy, close"],
  ["closed", "building", "reopen"],
];

/** Each state a box the size `StateMachine` gives it: its label over a tag row and nine dot slots. */
const machine = STATES.map((id) => ({
  id,
  ...guessNode({
    id,
    label: id.replaceAll("_", " "),
    content: "x",
    contentSize: boxContentSize(0),
  }),
}));
const moves = MOVES.map(([from, to, label]) => ({
  from,
  to,
  label: { width: Math.ceil(label.length * 6.6) + 8, height: 16 },
}));

const ids = Array.from({ length: 26 }, (_, i) => `n${i}`);
/** 26 boxes in a ring, each with a second arrow seven on: self loops, and arrows back up the ranks. */
const ring = ids.flatMap((id, i) => [
  { from: id, to: `n${(i + 1) % ids.length}` },
  { from: id, to: `n${(i * 7) % ids.length}`, label: { width: 40, height: 16 } },
]);
const ringBoxes = ids.map((id, i) => ({ id, width: 120, height: 40 + (i % 3) * 30 }));
/** The ring with its boxes in four groups, which dagre gives border ranks of their own. */
const grouped = ringBoxes.map((b, i) => ({ ...b, group: `g${i % 4}` }));

type Segment = { a: { x: number; y: number }; b: { x: number; y: number } };
const segments = (edge: FlowEdgePath): Segment[] =>
  edge.points.slice(1).flatMap((b, i) => {
    const a = edge.points[i];
    return a ? [{ a, b }] : [];
  });

/** Whether a segment comes within `pad` of a box (a negative `pad` asks for its inside only). */
const near = (box: FlowBox, { a, b }: Segment, pad: number): boolean =>
  Math.max(a.x, b.x) > box.x - pad &&
  Math.min(a.x, b.x) < box.x + box.width + pad &&
  Math.max(a.y, b.y) > box.y - pad &&
  Math.min(a.y, b.y) < box.y + box.height + pad;

const labelBox = (
  edge: FlowEdgePath,
  size: { width: number; height: number } | undefined,
): FlowBox | null =>
  edge.labelAt && size
    ? {
        x: edge.labelAt.x - size.width / 2,
        y: edge.labelAt.y - size.height / 2,
        width: size.width,
        height: size.height,
      }
    : null;

/**
 * Every way an arrow or a label lands where it must not: an arrow through a box, or within 3px of
 * one it does not start or end on; an arrow through another arrow's label; a label within 6px of a
 * box; a run that is not straight across or down.
 */
function clashes(
  out: FlowLayout,
  sizes: readonly ({ width: number; height: number } | undefined)[],
): string[] {
  const found: string[] = [];
  const labels = out.edges.map((e) => labelBox(e, sizes[e.index]));
  for (const edge of out.edges) {
    const name = `${edge.from}->${edge.to}`;
    const runs = segments(edge);
    runs.forEach((run, i) => {
      if (run.a.x !== run.b.x && run.a.y !== run.b.y) found.push(`${name} runs aslant`);
      for (const box of out.nodes) {
        const own =
          (i === 0 && box.id === edge.from) || (i === runs.length - 1 && box.id === edge.to);
        if (near(box, run, own ? -0.5 : 3)) found.push(`${name} runs on ${box.id}`);
      }
      labels.forEach((label, j) => {
        if (label && j !== edge.index && near(label, run, -0.5))
          found.push(`${name} crosses label ${j}`);
      });
    });
    const label = labels[edge.index];
    for (const box of out.nodes) {
      if (
        label &&
        near(box, { a: label, b: { x: label.x + label.width, y: label.y + label.height } }, 6)
      ) {
        found.push(`${name}'s label sits on ${box.id}`);
      }
    }
  }
  return found;
}

/** Every arrow end, ranked down, that does not sit on its box's top or bottom. */
function sideEnds(out: FlowLayout): string[] {
  const box = (id: string) => out.nodes.find((n) => n.id === id);
  return out.edges.flatMap((edge) => {
    const ends = [
      { p: edge.points[0], b: box(edge.from), end: "from" },
      { p: edge.points.at(-1), b: box(edge.to), end: "to" },
    ];
    return ends
      .filter(({ p, b }) => !p || !b || (p.y !== b.y && p.y !== b.y + b.height))
      .map(({ end }) => `${edge.from}->${edge.to} ${end}`);
  });
}

/** Every box and corner that falls outside the canvas. */
function outside(out: FlowLayout): string[] {
  const corners = out.edges.flatMap((e) =>
    e.points
      .filter((p) => p.x < 0 || p.y < 0 || p.x > out.width || p.y > out.height)
      .map((p) => `${e.from}->${e.to} at ${p.x},${p.y}`),
  );
  const boxes = out.nodes
    .filter((n) => n.x < 0 || n.y < 0 || n.x + n.width > out.width || n.y + n.height > out.height)
    .map((n) => n.id);
  return [...corners, ...boxes];
}

/** Every run across a gap that lies on one line with another arrow's run. */
function sharedRuns(out: FlowLayout): string[] {
  const across = out.edges.flatMap((e) =>
    segments(e)
      .filter(({ a, b }) => a.y === b.y)
      .map(({ a, b }) => ({ y: a.y, lo: Math.min(a.x, b.x), hi: Math.max(a.x, b.x), e })),
  );
  return across
    .filter((r) => across.some((s) => s.e !== r.e && s.y === r.y && s.lo < r.hi && r.lo < s.hi))
    .map((r) => `${r.e.from}->${r.e.to} at y ${r.y}`);
}

/** Every arrow, bar a self loop, whose runs along the rank direction do not all head one way. */
function doublesBack(out: FlowLayout, along: "x" | "y"): string[] {
  return out.edges
    .filter((e) => e.from !== e.to)
    .filter((e) => {
      const ways = new Set(
        segments(e)
          .map(({ a, b }) => Math.sign(b[along] - a[along]))
          .filter((way) => way !== 0),
      );
      return ways.size > 1;
    })
    .map((e) => `${e.from}->${e.to}`);
}

describe("routed arrows", () => {
  for (const direction of ["down", "right"] as const) {
    it(`keep off every box and label in a large machine, ranked ${direction}`, () => {
      const out = layoutFlow(machine, moves, direction);
      expect(out.edges).toHaveLength(MOVES.length);
      expect(
        clashes(
          out,
          moves.map((m) => m.label),
        ),
      ).toEqual([]);
    });

    it(`keep off every box and label round a ring with loops, ranked ${direction}`, () => {
      const out = layoutFlow(ringBoxes, ring, direction);
      expect(
        clashes(
          out,
          ring.map((e) => e.label),
        ),
      ).toEqual([]);
    });

    it(`keep off every box and label when the boxes are grouped, ranked ${direction}`, () => {
      const out = layoutFlow(grouped, ring, direction);
      expect(
        clashes(
          out,
          ring.map((e) => e.label),
        ),
      ).toEqual([]);
    });
  }

  it("never double back along the ranks, grouped or not", () => {
    expect(doublesBack(layoutFlow(machine, moves, "down"), "y")).toEqual([]);
    expect(doublesBack(layoutFlow(grouped, ring, "down"), "y")).toEqual([]);
    expect(doublesBack(layoutFlow(grouped, ring, "right"), "x")).toEqual([]);
  });

  it("leave and enter a box through its ends, never its sides, ranked down", () => {
    expect(sideEnds(layoutFlow(machine, moves, "down"))).toEqual([]);
  });

  it("keeps every box and every corner inside the canvas, loops included", () => {
    for (const direction of ["down", "right"] as const) {
      expect(outside(layoutFlow(machine, moves, direction))).toEqual([]);
      expect(outside(layoutFlow(ringBoxes, ring, direction))).toEqual([]);
    }
  });

  it("never lays two runs across one gap on the same line", () => {
    expect(sharedRuns(layoutFlow(machine, moves, "down"))).toEqual([]);
  });
});

describe("squarePath", () => {
  it("draws a straight run to each corner", () => {
    const corners = [
      { x: 0, y: 0 },
      { x: 0, y: 20 },
      { x: 60, y: 20 },
      { x: 60, y: 40 },
    ];
    expect(squarePath(corners)).toBe("M0,0V20H60V40");
  });

  it("draws nothing for no corners", () => {
    expect(squarePath([])).toBe("");
  });
});
