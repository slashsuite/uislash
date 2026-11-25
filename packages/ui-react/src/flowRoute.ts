/**
 * How `FlowDiagram`'s arrows are drawn round its boxes, after dagre has placed them. Internal.
 *
 * dagre ranks the boxes and gives each arrow a route: a point on the source, one point in every
 * rank it passes (each clear of the boxes in that rank) and a point on the target. Drawn as square
 * steps that turn halfway between two points, an arrow can turn inside a rank of tall boxes and run
 * through one, and an arrow that leaves a box's side runs along its border. So this routes every
 * arrow again, in the rank direction:
 *
 * - it leaves its source through the side facing its next point and enters its target through the
 *   side facing its last one, at ports spread along that side, so no two arrows share a port and
 *   none runs along a border;
 * - it runs along the rank direction through each of dagre's points, and turns only in a gap
 *   between ranks, where no box and no arrow label is;
 * - the turns in one gap are spread over tracks, so two runs across the same gap never lie on one
 *   line, and a gap too narrow for its tracks is widened, moving everything past it along.
 *
 * Every function here works in rank-down space (ranks stacked along y); a diagram ranked right is
 * turned into it and back.
 */

import type { FlowBox as Rect, FlowPoint as Point } from "./flowLayout.js";

/** One arrow to route: its ends, and dagre's points from the source to the target. */
type RouteEdge = { from: string; to: string; points: readonly Point[] };

/** The routed diagram: every arrow as a square path's corners, and how to move a y past widened gaps. */
type Routed = { lines: Point[][]; shift: (y: number) => number; grow: number };

/** The space between two runs across one gap, and between a run and the gap's edges. */
const TRACK = 8;
/** How far a port keeps from a box's corner, and the least space between two ports. */
const PORT_INSET = 12;
/** How far a self loop reaches past its box. */
const LOOP_REACH = 16;

const round = (n: number): number => Math.round(n * 10) / 10;

/** A y range between ranks that no box or label covers. */
type Gap = { top: number; bottom: number };

/** The y ranges no box or label covers, between the first and the last. */
function gapsBetween(obstacles: readonly Rect[]): Gap[] {
  const spans = obstacles
    .map((r) => ({ top: r.y, bottom: r.y + r.height }))
    .toSorted((a, b) => a.top - b.top);
  const gaps: Gap[] = [];
  let reach = Number.NEGATIVE_INFINITY;
  for (const s of spans) {
    if (s.top > reach && reach > Number.NEGATIVE_INFINITY) gaps.push({ top: reach, bottom: s.top });
    reach = Math.max(reach, s.bottom);
  }
  return gaps;
}

/** Which end of a box an arrow uses: its top, or its bottom. */
type Side = "top" | "bottom";
type Port = { edge: number; end: "from" | "to"; box: string; side: Side; toward: number };

/** Whether a point lies past a box's middle, in the rank direction. */
const below = (box: Rect, p: Point): boolean => p.y > box.y + box.height / 2;

/**
 * Where each arrow leaves and enters its boxes: on the side facing the next point along it,
 * spread evenly over that side in the order of where the arrows head, so they do not cross there.
 */
function placePorts(boxes: ReadonlyMap<string, Rect>, edges: readonly RouteEdge[]): Point[][] {
  const ports: Port[] = [];
  edges.forEach((e, edge) => {
    const first = e.points[1] ?? e.points[0];
    const last = e.points.at(-2) ?? e.points.at(-1);
    const from = boxes.get(e.from);
    const to = boxes.get(e.to);
    if (e.from === e.to || !first || !last || !from || !to) return;
    ports.push(
      {
        edge,
        end: "from",
        box: e.from,
        side: below(from, first) ? "bottom" : "top",
        toward: first.x,
      },
      { edge, end: "to", box: e.to, side: below(to, last) ? "bottom" : "top", toward: last.x },
    );
  });
  const ends = edges.map((): Point[] => []);
  const bySide = new Map<string, Port[]>();
  for (const p of ports) {
    const key = `${p.box}\u0000${p.side}`;
    bySide.set(key, [...(bySide.get(key) ?? []), p]);
  }
  for (const group of bySide.values()) {
    const [head] = group;
    const box = head && boxes.get(head.box);
    if (!head || !box) continue;
    const sorted = group.toSorted((a, b) => a.toward - b.toward || a.edge - b.edge);
    const room = Math.max(0, box.width - 2 * PORT_INSET);
    const step = sorted.length > 1 ? room / (sorted.length - 1) : 0;
    sorted.forEach((p, i) => {
      const x =
        sorted.length === 1
          ? Math.min(Math.max(p.toward, box.x + PORT_INSET), box.x + box.width - PORT_INSET)
          : box.x + PORT_INSET + i * step;
      const y = p.side === "top" ? box.y : box.y + box.height;
      const at = ends[p.edge];
      if (at) at[p.end === "from" ? 0 : 1] = { x: round(x), y };
    });
  }
  return ends;
}

/** One run across a gap, and the track it was given. */
type Run = { gap: number; lo: number; hi: number; track: number };

/** Gives each run in a gap the lowest track whose runs it does not overlap, and counts the tracks. */
function assignTracks(runs: Run[], gaps: number): number[] {
  const counts = Array.from({ length: gaps }, () => 0);
  const ends: number[][] = Array.from({ length: gaps }, () => []);
  for (const run of runs.toSorted((a, b) => a.lo - b.lo)) {
    const lanes = ends[run.gap] ?? [];
    let track = lanes.findIndex((end) => end + TRACK <= run.lo);
    if (track === -1) track = lanes.length;
    lanes[track] = run.hi;
    ends[run.gap] = lanes;
    run.track = track;
    counts[run.gap] = Math.max(counts[run.gap] ?? 0, track + 1);
  }
  return counts;
}

/** The corners of a square loop out of a box's far side and back. */
function loop(box: Rect, points: readonly Point[]): Point[] {
  const ys = points.map((p) => p.y);
  const reach = Math.max(box.x + box.width + LOOP_REACH, ...points.map((p) => p.x));
  const cy = box.y + box.height / 2;
  const half = Math.min(box.height / 2 - 4, Math.max(8, (Math.max(...ys) - Math.min(...ys)) / 2));
  const side = box.x + box.width;
  return [
    { x: side, y: cy - half },
    { x: reach, y: cy - half },
    { x: reach, y: cy + half },
    { x: side, y: cy + half },
  ];
}

/** Whether three corners lie on one straight line across or along. */
const inLine = (a: Point, b: Point, c: Point): boolean =>
  (a.x === b.x && b.x === c.x) || (a.y === b.y && b.y === c.y);

/** Drops a corner that does not turn: a repeat, or one in line with its neighbours. */
function tidy(points: readonly Point[]): Point[] {
  const out: Point[] = [];
  for (const p of points) {
    const last = out.at(-1);
    const before = out.at(-2);
    if (last && last.x === p.x && last.y === p.y) continue;
    if (last && before && inLine(before, last, p)) out[out.length - 1] = p;
    else out.push(p);
  }
  return out;
}

/** A corner of an arrow before its turns are placed: a point, or a turn on a run's track. */
type Draft = Point | { run: number; a: Point; b: Point };

/** The gap a step between two points turns in: the one it overlaps most, if any. */
function gapFor(gaps: readonly Gap[], a: Point, b: Point): number | undefined {
  const lo = Math.min(a.y, b.y);
  const hi = Math.max(a.y, b.y);
  return gaps
    .map((g, index) => ({ index, size: Math.min(g.bottom, hi) - Math.max(g.top, lo) }))
    .filter((g) => g.size > 0)
    .toSorted((p, q) => q.size - p.size)[0]?.index;
}

/**
 * An arrow's draft corners through `via`: a step that moves across turns on a run in the gap it
 * overlaps most (added to `runs`), or halfway along when no gap lies between its points.
 */
function draftSteps(via: readonly Point[], gaps: readonly Gap[], runs: Run[]): Draft[] {
  const [start] = via;
  const out: Draft[] = start ? [start] : [];
  for (let k = 1; k < via.length; k++) {
    const a = via[k - 1];
    const b = via[k];
    if (!a || !b) continue;
    const gap = a.x === b.x ? undefined : gapFor(gaps, a, b);
    if (a.x === b.x) out.push(b);
    else if (gap === undefined)
      out.push({ x: a.x, y: (a.y + b.y) / 2 }, { x: b.x, y: (a.y + b.y) / 2 }, b);
    else {
      runs.push({ gap, lo: Math.min(a.x, b.x), hi: Math.max(a.x, b.x), track: 0 });
      out.push({ run: runs.length - 1, a, b }, b);
    }
  }
  return out;
}

/**
 * Routes every arrow round the boxes and labels (rank-down space): see the file's comment. The
 * lines come back in `edges`' order, in the space after the gaps are widened; `shift` moves a y
 * from before into it, and `grow` is how much taller the diagram became.
 */
export function routeEdges(
  boxes: ReadonlyMap<string, Rect>,
  labels: readonly Rect[],
  edges: readonly RouteEdge[],
): Routed {
  const gaps = gapsBetween([...boxes.values(), ...labels]);
  const ends = placePorts(boxes, edges);
  const runs: Run[] = [];
  /**
   * Whether one of dagre's points lies beside a box or a label rather than in a gap. A point in a
   * gap (a group's border rank) has nothing to clear, and passing through it would make the arrow
   * turn on a track elsewhere in that gap and double back.
   */
  const inRank = (p: Point): boolean => !gaps.some((g) => p.y > g.top && p.y < g.bottom);
  /** Each arrow's corners, with a run's index in place of the y it turns at. */
  const drafts = edges.map((e, i): Draft[] => {
    const box = boxes.get(e.from);
    if (e.from === e.to) return box ? loop(box, e.points) : [];
    const [start, end] = ends[i] ?? [];
    if (!start || !end) return [...e.points];
    return draftSteps([start, ...e.points.slice(1, -1).filter(inRank), end], gaps, runs);
  });

  const tracks = assignTracks(runs, gaps.length);
  const widen = gaps.map((g, i) =>
    Math.max(0, ((tracks[i] ?? 0) + 1) * TRACK - (g.bottom - g.top)),
  );
  const shift = (y: number): number =>
    y + gaps.reduce((sum, g, i) => sum + (y > g.top + 0.01 ? (widen[i] ?? 0) : 0), 0);
  const trackY = (run: Run): number => {
    const g = gaps[run.gap];
    if (!g) return 0;
    const top = shift(g.top);
    const height = g.bottom - g.top + (widen[run.gap] ?? 0);
    return round(top + ((run.track + 1) * height) / ((tracks[run.gap] ?? 0) + 1));
  };

  /** A draft corner's points: a turn becomes its two corners on its run's track. */
  const corners = (c: Draft): Point[] => {
    if (!("run" in c)) return [{ x: c.x, y: round(shift(c.y)) }];
    const run = runs[c.run];
    if (!run) return [];
    const y = trackY(run);
    return [
      { x: c.a.x, y },
      { x: c.b.x, y },
    ];
  };
  const lines = drafts.map((draft) => tidy(draft.flatMap(corners)));
  return { lines, shift, grow: widen.reduce((a, b) => a + b, 0) };
}

/** The SVG path through square corners: a move, then one straight run to each next corner. */
export function squarePath(points: readonly Point[]): string {
  const [first, ...rest] = points;
  if (!first) return "";
  let d = `M${first.x},${first.y}`;
  let at = first;
  for (const p of rest) {
    if (p.x !== at.x && p.y !== at.y) d += `V${p.y}H${p.x}`;
    else d += p.x === at.x ? `V${p.y}` : `H${p.x}`;
    at = p;
  }
  return d;
}
