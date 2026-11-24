/**
 * The layout behind `FlowDiagram`: dagre places the boxes and routes the arrows, then this file
 * turns its output into what the component draws. Internal: only the geometry types are exported
 * from the package, for `FlowDiagram`'s `overlay`.
 */
import { Graph, layout } from "@dagrejs/dagre";

/** A point in the diagram's own space, in CSS pixels from its top left corner. */
export type FlowPoint = { x: number; y: number };

/** Where a node or a group sits, its top left corner and its size, in CSS pixels. */
export type FlowBox = { x: number; y: number; width: number; height: number };

/**
 * A node as laid out: its `id` and its box. A group's box (`group`) is the frame round its nodes.
 */
export type FlowNodeBox = FlowBox & { id: string };

/**
 * An arrow as laid out: the `from` and `to` ids, its place in `edges` (`index`), the points dagre
 * routed it through, the SVG path drawn through them (it ends on the target's edge, at the
 * arrowhead's tip) and its label's centre when it has one.
 */
export type FlowEdgePath = {
  from: string;
  to: string;
  index: number;
  points: readonly FlowPoint[];
  path: string;
  labelAt: FlowPoint | null;
};

/**
 * The whole diagram as laid out, in one coordinate space: `width` and `height`, a box per node and
 * per group, and a path per arrow. `FlowDiagram` hands it to `overlay`.
 */
export type FlowLayout = {
  width: number;
  height: number;
  nodes: readonly FlowNodeBox[];
  groups: readonly (FlowBox & { name: string })[];
  edges: readonly FlowEdgePath[];
};

/** What the layout needs from a node: its id, its size and the group it sits in. */
export type LayoutNode = { id: string; width: number; height: number; group?: string | undefined };

/** What the layout needs from an arrow: its ends, and its label's size when it has one. */
export type LayoutEdge = {
  from: string;
  to: string;
  label?: { width: number; height: number } | undefined;
};

/** `down` reads from the top, `right` from the start edge. */
export type FlowDirection = "down" | "right";

/** Space round the drawing, between boxes in a rank, and between ranks. */
const MARGIN = 16;
const NODE_GAP = 32;
const RANK_GAP = 48;
const EDGE_GAP = 16;

/** A group's dagre id, kept apart from every node id. */
const groupKey = (name: string): string => `\u0000group:${name}`;

const round = (n: number): number => Math.round(n * 10) / 10;

/** What dagre is given and, after `layout`, fills in: a box's centre, an arrow's route. */
type GraphMeta = {
  rankdir?: string;
  nodesep?: number;
  ranksep?: number;
  edgesep?: number;
  marginx?: number;
  marginy?: number;
  width?: number;
  height?: number;
};
type NodeMeta = { width?: number; height?: number; x?: number; y?: number };
type EdgeMeta = {
  width?: number;
  height?: number;
  labelpos?: "c";
  points?: FlowPoint[];
  x?: number;
  y?: number;
};

/**
 * Lays the nodes and arrows out with dagre. An arrow whose end is not a node is left out, so a
 * typo draws no stray box. Pure: the same input gives the same layout.
 */
export function layoutFlow(
  nodes: readonly LayoutNode[],
  edges: readonly LayoutEdge[],
  direction: FlowDirection,
): FlowLayout {
  const groups = [...new Set(nodes.flatMap((n) => (n.group ? [n.group] : [])))];
  const g = new Graph<GraphMeta, NodeMeta, EdgeMeta>({
    multigraph: true,
    compound: groups.length > 0,
  });
  g.setGraph({
    rankdir: direction === "right" ? "LR" : "TB",
    nodesep: NODE_GAP,
    ranksep: RANK_GAP,
    edgesep: EDGE_GAP,
    marginx: MARGIN,
    marginy: MARGIN,
  });
  g.setDefaultEdgeLabel(() => ({}));
  for (const name of groups) g.setNode(groupKey(name), {});
  const ids = new Set<string>();
  for (const n of nodes) {
    ids.add(n.id);
    g.setNode(n.id, { width: n.width, height: n.height });
    if (n.group) g.setParent(n.id, groupKey(n.group));
  }
  const kept = edges.flatMap((e, index) =>
    ids.has(e.from) && ids.has(e.to) ? [{ e, index }] : [],
  );
  for (const { e, index } of kept) {
    g.setEdge(
      e.from,
      e.to,
      e.label ? { width: e.label.width, height: e.label.height, labelpos: "c" } : {},
      String(index),
    );
  }
  layout(g);

  const box = (key: string): FlowBox => {
    const { x = 0, y = 0, width = 0, height = 0 } = g.node(key);
    return {
      x: round(x - width / 2),
      y: round(y - height / 2),
      width: round(width),
      height: round(height),
    };
  };
  const graph = g.graph();
  return {
    width: Math.ceil(graph.width ?? 0),
    height: Math.ceil(graph.height ?? 0),
    nodes: [...ids].map((id) => ({ id, ...box(id) })),
    groups: groups.map((name) => ({ name, ...box(groupKey(name)) })),
    edges: kept.map(({ e, index }) => {
      const routed = g.edge(e.from, e.to, String(index));
      const points = (routed.points ?? []).map((p) => ({ x: round(p.x), y: round(p.y) }));
      return {
        from: e.from,
        to: e.to,
        index,
        points,
        path: basisPath(points),
        labelAt:
          e.label && routed.x !== undefined && routed.y !== undefined
            ? { x: round(routed.x), y: round(routed.y) }
            : null,
      };
    }),
  };
}

/**
 * A smooth path through dagre's route points: a uniform B-spline, pinned to the first and last
 * point (d3's `curveBasis`), so an arrow bends round the boxes and still ends on its target.
 */
export function basisPath(points: readonly FlowPoint[]): string {
  const [first] = points;
  if (!first) return "";
  if (points.length < 3) return `M${points.map((p) => `${p.x},${p.y}`).join("L")}`;
  const at = (i: number): FlowPoint => points[i] ?? first;
  const f = round;
  const second = at(1);
  let d = `M${first.x},${first.y}L${f((5 * first.x + second.x) / 6)},${f((5 * first.y + second.y) / 6)}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [a, b, c] = [at(i - 1), at(i), at(i + 1)];
    d += `C${f((2 * a.x + b.x) / 3)},${f((2 * a.y + b.y) / 3)} ${f((a.x + 2 * b.x) / 3)},${f((a.y + 2 * b.y) / 3)} ${f((a.x + 4 * b.x + c.x) / 6)},${f((a.y + 4 * b.y + c.y) / 6)}`;
  }
  const y = at(points.length - 2);
  const z = at(points.length - 1);
  d += `C${f((2 * y.x + z.x) / 3)},${f((2 * y.y + z.y) / 3)} ${f((y.x + 2 * z.x) / 3)},${f((y.y + 2 * z.y) / 3)} ${z.x},${z.y}`;
  return d;
}
