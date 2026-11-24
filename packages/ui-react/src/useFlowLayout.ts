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

function guessNode(node: FlowNode): Size {
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

/** Reads the drawn size of every box and arrow label under `root`, keyed by `data-measure`. */
function measure(root: HTMLElement): Record<string, Size> {
  const out: Record<string, Size> = {};
  for (const el of root.querySelectorAll<HTMLElement>("[data-measure]")) {
    const rect = el.getBoundingClientRect();
    const key = el.dataset["measure"];
    if (key && rect.width > 0 && rect.height > 0) {
      out[key] = { width: Math.ceil(rect.width), height: Math.ceil(rect.height) };
    }
  }
  return out;
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
  nodes: readonly FlowNode[],
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
