import { type ReactElement, type ReactNode, useId } from "react";
import { TONE_SURFACE, TONE_TEXT } from "./Callout.js";
import { cx } from "./cx.js";
import type { FlowDirection, FlowLayout, FlowNodeBox } from "./flowLayout.js";
import type { Passthrough } from "./props.js";
import { Bone, BusyLabel, busy, type LoadingProps, useLoading } from "./skeleton.js";
import type { Tone } from "./tone.js";
import { edgeKey, nodeKey, useFlowLayout } from "./useFlowLayout.js";

/**
 * One box of a `FlowDiagram`: its `id` (what an arrow's `from` and `to` name), its `label`, a
 * `tone` that says what it means, the `group` it is framed in, and `content` drawn under the
 * label (a few `Pill`s, a short list).
 */
export type FlowNode = {
  /** Unique in the diagram; an arrow's `from` and `to` name it. */
  id: string;
  /** The box's title. The box is as wide as it, up to 18rem; a longer one wraps. */
  label: string;
  /**
   * What the box means: `neutral` (default) is a plain box, the others take the `Callout`'s fill
   * and ink. Say it in the label or the content too: colour alone tells a screen reader nothing.
   */
  tone?: Tone | undefined;
  /** Boxes with the same `group` are laid out together in a dashed frame named by it. */
  group?: string | undefined;
  /** Drawn under the label, inside the box, which grows to hold it: a few `Pill`s, a short list. Display only: no links or buttons. */
  content?: ReactNode;
};

/** One arrow of a `FlowDiagram`, from one node's `id` to another's, with an optional short `label` on it. */
export type FlowEdge = {
  from: string;
  to: string;
  /** A word or two on the arrow: the event or the action that moves along it. */
  label?: string | undefined;
};

/** A box's frame by tone: the Callout's soft surfaces, and a white box for `neutral`. */
const NODE_TONE: Record<Tone, string> = {
  ...TONE_SURFACE,
  neutral: "border-slate-300 bg-white",
};

/** A box's ink by tone; `neutral` is the primary ink. */
const NODE_INK: Record<Tone, string> = { ...TONE_TEXT, neutral: "text-slate-900" };

/**
 * Boxes joined by arrows, laid out for you: a flow, a pipeline, a state machine. Give it the
 * `nodes` and the `edges` between them and it places every box in ranks `direction` (`down` or
 * `right`) and routes every arrow round them, loops and arrows back up included (dagre's layered
 * layout). Each box is as wide as its label and its `content`, so no text spills; boxes with a
 * `group` share a dashed frame; `active` rings one box in the accent.
 *
 * The diagram is drawn at its own size and scrolls inside its own box when it is wider or taller
 * than the room it has, so it never makes the page scroll sideways. It is an image named by
 * `label`; every box and every arrow is also a visually hidden list after it.
 *
 * `overlay` draws on top of the diagram in its own coordinates: it is handed the laid-out
 * `FlowLayout` (each box's place and each arrow's SVG path), for a marker that follows an arrow.
 * It is not hit by the pointer, and it is hidden from a screen reader.
 *
 * While `loading` with no nodes it draws one bone the height of a small diagram.
 */
export function FlowDiagram({
  label,
  nodes,
  edges,
  direction = "down",
  active,
  overlay,
  loading,
  loadingLabel,
  ...rest
}: {
  /** What the diagram shows: its accessible name, and the name of its hidden list. */
  label: string;
  /** The boxes, each with a unique `id`. Their order is only a hint: the layout ranks them by the arrows. */
  nodes: readonly FlowNode[];
  /** The arrows. One whose `from` or `to` is not a node's `id` is not drawn. */
  edges: readonly FlowEdge[];
  /**
   * Where the arrows run: `down` (top to bottom) or `right` (start to end).
   * @default down
   */
  direction?: FlowDirection;
  /** The `id` of the one box to ring in the accent: the current step, the state a thing is in now. */
  active?: string | undefined;
  /** Draws on top of the diagram, in its coordinates, from the laid-out boxes and arrow paths. */
  overlay?: ((layout: FlowLayout) => ReactNode) | undefined;
} & LoadingProps &
  Passthrough): ReactElement {
  const { loading: waiting, owner } = useLoading(loading);
  const { canvas, drawn } = useFlowLayout(nodes, edges, direction);

  if (waiting && nodes.length === 0) {
    return (
      <div {...rest} {...busy(owner, waiting)} aria-label={label} className="flex flex-col">
        <Bone shape="block h-48 rounded-lg" />
        <BusyLabel owner={owner} loading={waiting} label={loadingLabel} />
      </div>
    );
  }

  const known = new Set(nodes.map((n) => n.id));
  const shown = edges.flatMap((edge, index) =>
    known.has(edge.from) && known.has(edge.to) ? [{ edge, index }] : [],
  );
  return (
    <div {...rest} className="flex min-w-0 flex-col">
      <div
        role="img"
        aria-label={`${label}: ${known.size} boxes and ${shown.length} arrows`}
        // A diagram wider than its room scrolls, so it takes the focus for the arrow keys.
        tabIndex={0}
        className="max-w-full overflow-auto rounded-lg outline-offset-2 focus-visible:outline-2 focus-visible:outline-violet-600"
      >
        <div
          ref={canvas}
          className="relative mx-auto"
          style={{ width: drawn.width, height: drawn.height }}
        >
          <FlowCanvas drawn={drawn} nodes={nodes} edges={shown} active={active} />
          {overlay && (
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              {overlay(drawn)}
            </div>
          )}
        </div>
      </div>
      <FlowList label={label} nodes={nodes} edges={shown} active={active} />
    </div>
  );
}

/** The drawing itself: the group frames, the arrows, their labels and the boxes. */
function FlowCanvas({
  drawn,
  nodes,
  edges,
  active,
}: {
  drawn: FlowLayout;
  nodes: readonly FlowNode[];
  edges: readonly { edge: FlowEdge; index: number }[];
  active: string | undefined;
}): ReactElement {
  const marker = `flow-arrow-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const paths = new Map(drawn.edges.map((e) => [e.index, e]));
  return (
    <>
      {drawn.groups.map((g) => (
        <div
          key={g.name}
          className="absolute rounded-xl border border-dashed border-slate-300"
          style={{ left: g.x, top: g.y, width: g.width, height: g.height }}
        >
          <span className="absolute left-3 top-1 text-xs font-medium text-slate-500">{g.name}</span>
        </div>
      ))}
      <FlowArrows drawn={drawn} marker={marker} />
      {edges.map(({ edge, index }) => {
        const at = paths.get(index)?.labelAt;
        return edge.label && at ? (
          <span
            key={index}
            data-measure={edgeKey(index)}
            className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded bg-white px-1 text-xs text-slate-600"
            style={{ left: at.x, top: at.y }}
          >
            {edge.label}
          </span>
        ) : null;
      })}
      {drawn.nodes.map((b) => {
        const node = byId.get(b.id);
        return node ? (
          <FlowBoxView key={b.id} box={b} node={node} active={active === b.id} />
        ) : null;
      })}
    </>
  );
}

/** Every arrow as an SVG path, with its arrowhead. */
function FlowArrows({ drawn, marker }: { drawn: FlowLayout; marker: string }): ReactElement {
  return (
    <svg
      width={drawn.width}
      height={drawn.height}
      className="absolute inset-0 overflow-visible text-slate-400"
    >
      <defs>
        <marker
          id={marker}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          markerUnits="userSpaceOnUse"
          orient="auto-start-reverse"
        >
          <path d="M0,0L10,5L0,10z" fill="currentColor" />
        </marker>
      </defs>
      {drawn.edges.map((e) => (
        <path
          key={e.index}
          d={e.path}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          markerEnd={`url(#${marker})`}
        />
      ))}
    </svg>
  );
}

/** One box, placed: its label and content, sized by them, centred in the slot the layout gave it. */
function FlowBoxView({
  box,
  node,
  active,
}: {
  box: FlowNodeBox;
  node: FlowNode;
  active: boolean;
}): ReactElement {
  const tone = node.tone ?? "neutral";
  return (
    <div
      className="absolute flex items-center justify-center"
      style={{ left: box.x, top: box.y, width: box.width, height: box.height }}
    >
      <div
        data-measure={nodeKey(box.id)}
        className={cx(
          "w-max max-w-72 shrink-0 rounded-lg border px-3 py-2 text-sm",
          NODE_TONE[tone],
          NODE_INK[tone],
          active && "outline-2 outline-offset-2 outline-violet-600",
        )}
      >
        <div className="font-medium">{node.label}</div>
        {node.content != null && <div className="mt-2">{node.content}</div>}
      </div>
    </div>
  );
}

/** The diagram as text for a screen reader: each box, its content, and the arrows out of it. */
function FlowList({
  label,
  nodes,
  edges,
  active,
}: {
  label: string;
  nodes: readonly FlowNode[];
  edges: readonly { edge: FlowEdge; index: number }[];
  active: string | undefined;
}): ReactElement {
  const names = new Map(nodes.map((n) => [n.id, n.label]));
  return (
    <ul aria-label={label} className="sr-only">
      {nodes.map((n) => {
        const out = edges.filter(({ edge }) => edge.from === n.id);
        return (
          <li key={n.id}>
            {n.label}
            {active === n.id && ", current"}
            {n.group && `, in ${n.group}`}
            {n.content != null && <div>{n.content}</div>}
            {out.length > 0 && (
              <ul>
                {out.map(({ edge, index }) => (
                  <li key={index}>
                    {`to ${names.get(edge.to) ?? edge.to}`}
                    {edge.label && `, on ${edge.label}`}
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}
