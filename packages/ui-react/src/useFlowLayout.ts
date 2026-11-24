import { type RefObject, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { FlowEdge, FlowNode } from "./FlowDiagram.js";
import {
  type FlowDirection,
  type FlowLayout,
  type LayoutEdge,
  type LayoutNode,
  layoutFlow,
} from "./flowLayout.js";

/**
 * The size a box or a label is drawn at before it can be measured (the server render, and a
 * test's DOM, which has no layout): the label's characters at an average width, inside the
 * padding and the border, wrapping at the 18rem cap. The browser then measures every box and lays
 * the diagram out again at the real sizes.
 */
const NODE_MAX = 288;
const NODE_CHAR = 7.4;
const NODE_PAD_X = 26;
const NODE_PAD_Y = 18;
const NODE_LINE = 20;
const CONTENT_GUESS = 32;
const EDGE_CHAR = 6.6;
const EDGE_PAD = 8;
const EDGE_LINE = 16;

type Size = { width: number; height: number };

/** What the layout reads from a node. */
type SizedNode = Pick<FlowNode, "id" | "label" | "group" | "content">;

function guessNode(node: SizedNode): Size {
  const text = Math.ceil(node.label.length * NODE_CHAR);
  const lines = Math.max(1, Math.ceil(text / (NODE_MAX - NODE_PAD_X)));
  return {
    width: Math.min(NODE_MAX, text + NODE_PAD_X),
    height: lines * NODE_LINE + NODE_PAD_Y + (node.content == null ? 0 : CONTENT_GUESS),
  };
}

const guessLabel = (label: string): Size => ({
  width: Math.ceil(label.length * EDGE_CHAR) + EDGE_PAD,
  height: EDGE_LINE,
});

export const nodeKey = (id: string): string => `n:${id}`;
export const edgeKey = (index: number): string => `e:${index}`;

/**
 * Reads the drawn size of every box and arrow label under `root`, keyed by `data-measure`, in the
 * diagram's own space: a canvas scaled to fit (`useFit`) is drawn smaller, so its sizes are read
 * back at full scale. The small allowance keeps a rounding error from adding a pixel.
 */
function measure(root: HTMLElement): Record<string, Size> {
  const out: Record<string, Size> = {};
  const drawnWidth = root.getBoundingClientRect().width;
  const scale = root.offsetWidth > 0 && drawnWidth > 0 ? drawnWidth / root.offsetWidth : 1;
  const full = (n: number): number => Math.ceil(scale === 1 ? n : n / scale - 0.01);
  for (const el of root.querySelectorAll<HTMLElement>("[data-measure]")) {
    const rect = el.getBoundingClientRect();
    const key = el.dataset["measure"];
    if (key && rect.width > 0 && rect.height > 0) {
      out[key] = { width: full(rect.width), height: full(rect.height) };
    }
  }
  return out;
}

/**
 * How far to shrink a diagram `width` wide so it fits the box `frame` refers to: 1 when it fits
 * or the room is not known yet (the server render, a test's DOM), else the room over the width.
 * The observer follows the room as it changes.
 */
export function useFit(width: number): {
  frame: RefObject<HTMLDivElement | null>;
  scale: number;
} {
  const frame = useRef<HTMLDivElement>(null);
  const [room, setRoom] = useState(0);
  useLayoutEffect(() => {
    const box = frame.current;
    if (!box) return undefined;
    const update = () => setRoom(box.clientWidth);
    update();
    if (typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(update);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);
  const scale = room > 0 && width > room ? room / width : 1;
  return { frame, scale };
}

const sameSizes = (a: Record<string, Size>, b: Record<string, Size>): boolean => {
  const keys = Object.keys(a);
  return (
    keys.length === Object.keys(b).length &&
    keys.every((k) => a[k]?.width === b[k]?.width && a[k]?.height === b[k]?.height)
  );
};

/**
 * Lays the diagram out, first at guessed sizes, then at the sizes the browser draws each box and
 * arrow label at: every render measures them, and lays out again when one's size is not the one
 * the layout used. A box's size never depends on where it is placed, so this settles after one
 * pass; the observer catches a later change (a web font arriving).
 */
export function useFlowLayout(
  nodes: readonly SizedNode[],
  edges: readonly FlowEdge[],
  direction: FlowDirection,
): { canvas: RefObject<HTMLDivElement | null>; drawn: FlowLayout } {
  const canvas = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState<Record<string, Size>>({});
  const layoutNodes: LayoutNode[] = nodes.map((n) => ({
    id: n.id,
    group: n.group,
    ...(measured[nodeKey(n.id)] ?? guessNode(n)),
  }));
  const layoutEdges: LayoutEdge[] = edges.map((e, index) => ({
    from: e.from,
    to: e.to,
    label: e.label ? (measured[edgeKey(index)] ?? guessLabel(e.label)) : undefined,
  }));
  const key = JSON.stringify([direction, layoutNodes, layoutEdges]);
  // The key holds every input the layout reads, so the layout reruns only when one changes.
  // oxlint-disable-next-line react-hooks/exhaustive-deps -- keyed on the serialised input above
  const drawn = useMemo(() => layoutFlow(layoutNodes, layoutEdges, direction), [key]);

  useLayoutEffect(() => {
    const root = canvas.current;
    if (!root) return undefined;
    const update = () => {
      const next = measure(root);
      setMeasured((prev) => (sameSizes(prev, next) ? prev : next));
    };
    update();
    if (typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(update);
    for (const el of root.querySelectorAll("[data-measure]")) observer.observe(el);
    return () => observer.disconnect();
  });
  return { canvas, drawn };
}
