/**
 * The layout behind `FlowDiagram`: dagre places the boxes and gives each arrow a route,
 * `flowRoute` draws the arrows round the boxes along it, and this file turns the result into what
 * the component draws. Internal: only the geometry types are exported
 * from the package, for `FlowDiagram`'s `overlay`.
 */
import { Graph, layout } from "@dagrejs/dagre";
import { routeEdges, squarePath } from "./flowRoute.js";

/** A point in the diagram's own space, in CSS pixels from its top left corner. */
export type FlowPoint = { x: number; y: number };

/** Where a node or a group sits, its top left corner and its size, in CSS pixels. */
export type FlowBox = { x: number; y: number; width: number; height: number };

/**
 * A node as laid out: its `id` and its box. A group's box (`group`) is the frame round its nodes.
 */
export type FlowNodeBox = FlowBox & { id: string };

/**
 * An arrow as laid out: the `from` and `to` ids, its place in `edges` (`index`), the corners of its
 * square route (it leaves the source's side facing the way it goes, turns only between ranks, and
 * ends on the target's edge, at the arrowhead's tip), the SVG path through them and its label's
 * centre when it has one.
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

/** The gaps dagre keeps: between boxes in a rank, between ranks, and between arrows in a rank. */
export type FlowSpacing = { node: number; rank: number; edge: number };
const LOOSE: FlowSpacing = { node: NODE_GAP, rank: RANK_GAP, edge: EDGE_GAP };

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
  spacing: FlowSpacing = LOOSE,
): FlowLayout {
  const groups = [...new Set(nodes.flatMap((n) => (n.group ? [n.group] : [])))];
  const g = new Graph<GraphMeta, NodeMeta, EdgeMeta>({
    multigraph: true,
    compound: groups.length > 0,
  });
  g.setGraph({
    rankdir: direction === "right" ? "LR" : "TB",
    nodesep: spacing.node,
    ranksep: spacing.rank,
    edgesep: spacing.edge,
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
  return routeLayout(g, { ids, groups, kept }, direction === "right");
}

type FlowGraph = Graph<GraphMeta, NodeMeta, EdgeMeta>;
type Laid = { ids: Set<string>; groups: string[]; kept: { e: LayoutEdge; index: number }[] };

/**
 * Routes dagre's laid-out graph round its boxes and labels (`flowRoute`) and reads it back in the
 * diagram's own space, rounded. `across` is true when the diagram is ranked right.
 */
function routeLayout(g: FlowGraph, { ids, groups, kept }: Laid, across: boolean): FlowLayout {
  /** Turns a point or box into rank-down space, and back: ranked right, x and y swap. */
  const turn = (p: FlowPoint): FlowPoint => (across ? { x: p.y, y: p.x } : p);
  const turnBox = (b: FlowBox): FlowBox =>
    across ? { x: b.y, y: b.x, width: b.height, height: b.width } : b;
  const raw = (key: string): FlowBox => {
    const { x = 0, y = 0, width = 0, height = 0 } = g.node(key);
    return turnBox({ x: x - width / 2, y: y - height / 2, width, height });
  };
  const routes = kept.map(({ e, index }) => ({
    e,
    index,
    routed: g.edge(e.from, e.to, String(index)),
  }));
  const labelAt = routes.map(({ e, routed }) =>
    e.label && routed.x !== undefined && routed.y !== undefined
      ? turn({ x: routed.x, y: routed.y })
      : null,
  );
  const labels = routes.flatMap(({ e }, i) => {
    const at = labelAt[i];
    if (!e.label || !at) return [];
    const size = turnBox({ x: 0, y: 0, width: e.label.width, height: e.label.height });
    return [
      {
        x: at.x - size.width / 2,
        y: at.y - size.height / 2,
        width: size.width,
        height: size.height,
      },
    ];
  });
  const { lines, shift, grow } = routeEdges(
    new Map([...ids].map((id) => [id, raw(id)])),
    labels,
    routes.map(({ e, routed }) => ({
      from: e.from,
      to: e.to,
      points: (routed.points ?? []).map(turn),
    })),
  );
  /** A box from rank-down space, moved past any widened gap, back in the diagram's space. */
  const place = (b: FlowBox): FlowBox => {
    const top = shift(b.y);
    const bottom = shift(b.y + b.height);
    const out = turnBox({ x: b.x, y: top, width: b.width, height: bottom - top });
    return { x: round(out.x), y: round(out.y), width: round(out.width), height: round(out.height) };
  };
  const graph = g.graph();
  const size = turn({ x: graph.width ?? 0, y: graph.height ?? 0 });
  const grown = turn({ x: size.x, y: size.y + grow });
  return {
    width: Math.ceil(grown.x),
    height: Math.ceil(grown.y),
    nodes: [...ids].map((id) => ({ id, ...place(raw(id)) })),
    groups: groups.map((name) => ({ name, ...place(raw(groupKey(name))) })),
    edges: routes.map(({ e, index }, i) => {
      const points = (lines[i] ?? []).map((p) => {
        const out = turn(p);
        return { x: round(out.x), y: round(out.y) };
      });
      const at = labelAt[i];
      return {
        from: e.from,
        to: e.to,
        index,
        points,
        path: squarePath(points),
        labelAt: at
          ? (({ x, y }) => ({ x: round(x), y: round(y) }))(turn({ x: at.x, y: shift(at.y) }))
          : null,
      };
    }),
  };
}
