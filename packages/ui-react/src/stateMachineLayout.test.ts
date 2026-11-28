import { describe, expect, it } from "vitest";
import role from "../../../apps/storybook/src/role-state-machine.json";
import { type FlowLayout, layoutFlow } from "./flowLayout.js";
import { boxContentSize, MACHINE_SPACING, slotsFor } from "./stateMachineGrid.js";
import { type SizedNode, uniformSizes } from "./useFlowLayout.js";

/**
 * A real role machine (20 states, 38 transitions), laid out as `StateMachine` lays it out before
 * it is measured: every box one size, the labels' lines guessed, the arrow labels at their guess.
 */
function roleLayout(): FlowLayout {
  const nodes: SizedNode[] = role.states.map((s) => ({
    id: s.id,
    label: s.label,
    content: "tags and dots",
    contentSize: boxContentSize(slotsFor(0, false)),
  }));
  const sizes = uniformSizes(nodes, {});
  return layoutFlow(
    nodes.map((n) => ({ id: n.id, ...sizes.get(n.id)! })),
    role.transitions.map((t) => ({
      from: t.from,
      to: t.to,
      label: { width: Math.ceil(t.label.length * 6.6) + 8, height: 16 },
    })),
    "down",
    MACHINE_SPACING,
  );
}

/** The empty space between each rank of boxes and the next, top to bottom. */
function rankGaps(layout: FlowLayout): number[] {
  const ranks = new Map<number, number>();
  for (const n of layout.nodes) ranks.set(n.y, Math.max(ranks.get(n.y) ?? 0, n.y + n.height));
  const sorted = [...ranks].toSorted(([a], [b]) => a - b);
  return sorted.slice(1).map(([top], i) => top - (sorted[i]?.[1] ?? top));
}

describe("StateMachine's layout", () => {
  it("draws every box one size, the longest label wrapped to it", () => {
    // Six dots' room under the tags, and one box's label on two lines: every box takes that height.
    const sizes = new Set(roleLayout().nodes.map((n) => `${n.width}x${n.height}`));
    expect([...sizes]).toEqual(["254x134"]);
  });

  // The area bound sits just above today's layout (1562 by 2588). The layout before (nine dots'
  // room, FlowDiagram's gaps) was 1631 by 2800, and fails it.
  it("keeps the role machine's area in bounds", () => {
    const layout = roleLayout();
    expect(layout.width * layout.height).toBeLessThanOrEqual(4_100_000);
  });

  // The rank separation is pinned (`MACHINE_SPACING.rank`), so a gap grows past it only by the
  // arrow tracks the router adds, 8px each. dagre 3.1.4 places some boxes differently, and the gap
  // before `reviewing` needs one more track (72 to 80); two gaps shrank and the whole is shorter.
  // A gap past 80 means more tracks than that, or a rank separation that moved.
  it("keeps the gap between adjacent ranks in bounds, and tightest at the start", () => {
    const gaps = rankGaps(roleLayout());
    expect(gaps).toHaveLength(13);
    expect(Math.max(...gaps)).toBeLessThanOrEqual(80);
    // The first ranks are one box each, joined by labelled arrows: no wide empty band before them.
    expect(gaps.slice(0, 3)).toEqual([48, 48, 48]);
  });
});
