import { type ReactElement, useState } from "react";
import { cx, focusRing } from "./cx.js";
import type { FlowLayout, FlowNodeBox } from "./flowLayout.js";
import { renderLink } from "./link.js";
import { type CategoryTone, VIZ_TONE } from "./StackedBar.js";
import type { StateMachineItem } from "./StateMachine.js";
import { useTooltip } from "./Tooltip.js";

/**
 * The box items whose `state` is no state of the machine go in. Printable, since it reaches the DOM
 * (a box's `data-measure`), where a server render would turn a control character into U+FFFD.
 */
export const UNPLACED = "hc-sm:unplaced";

/** A dot's slot in its box: three to a row, each wide enough for a short ref. */
export const SLOT_W = 76;
export const SLOT_H = 22;
export const COLS = 3;
/** Up to this many dots show in a box; past it, one fewer and a `+N` that shows the rest. */
const LIMIT = 9;
/** From a box's bottom edge to its dots' bottom: its border and its bottom padding. */
const BOX_INSET = 9;
/** From a slot's left edge to its dot's centre: the chip's inset, its padding and half the dot. */
const DOT_X = 2 + 4 + 5;

const CATEGORIES: readonly CategoryTone[] = [
  "cat1",
  "cat2",
  "cat3",
  "cat4",
  "cat5",
  "cat6",
  "cat7",
  "cat8",
];

/** An item's colour, the same for its id wherever it is drawn. */
function colourOf(id: string): string {
  let sum = 0;
  for (const ch of id) sum = (sum * 31 + (ch.codePointAt(0) ?? 0)) % 997;
  return VIZ_TONE[CATEGORIES[sum % CATEGORIES.length] ?? "cat1"];
}

// The move is CSS: a dot runs along the arrow's path (`offset-path`) in 600ms while the dot at
// its new place waits hidden for the same time. Nothing is timed in script: the run ends on its
// own `animationend`. With reduced motion the run is hidden and over at once (so it still ends),
// and the dot is in its new place at once.
const css = `[data-hc-sm-travel]{offset-anchor:center;offset-rotate:0deg;animation:hc-sm-travel .6s ease-in-out forwards}[data-hc-sm-arrive]{animation:hc-sm-arrive .6s linear}@keyframes hc-sm-travel{from{offset-distance:0%}to{offset-distance:100%}}@keyframes hc-sm-arrive{from,to{visibility:hidden}}@media (prefers-reduced-motion:reduce){[data-hc-sm-travel]{visibility:hidden;animation-duration:1ms}[data-hc-sm-arrive]{animation:none}}`;

/** An item on its way from one state to another; `seq` restarts the run when it moves again. */
type Move = { from: string; to: string; seq: number };

/** Which box each item sits in: its state's, else the unplaced box. */
export function placeOf(
  items: readonly StateMachineItem[],
  known: ReadonlySet<string>,
): Map<string, string> {
  return new Map(items.map((i) => [i.id, known.has(i.state) ? i.state : UNPLACED]));
}

/**
 * Remembers where every item was, and when one's place changes records the move, during render
 * (React's "adjust state when a prop changes"), so the re-render that measures the boxes does not
 * lose it. A move ends on its run's `animationend` (`done`), at the next change of places (which
 * records only its own moves), or on `clear` (a box opened, which would start a run long over).
 */
export function useMoves(
  items: readonly StateMachineItem[],
  known: ReadonlySet<string>,
): {
  moves: ReadonlyMap<string, Move>;
  done: (id: string, seq: number) => void;
  clear: () => void;
} {
  const now = placeOf(items, known);
  const key = JSON.stringify([...now]);
  const [seen, setSeen] = useState({ key, places: now });
  const [moves, setMoves] = useState<ReadonlyMap<string, Move>>(new Map());
  // Compared by value: a caller's `items` is often a new array on every render.
  if (seen.key !== key) {
    const next = new Map<string, Move>();
    for (const [id, to] of now) {
      const from = seen.places.get(id);
      if (from !== undefined && from !== to) {
        next.set(id, { from, to, seq: (moves.get(id)?.seq ?? 0) + 1 });
      }
    }
    setSeen({ key, places: now });
    setMoves(next);
  }
  const done = (id: string, seq: number) =>
    setMoves((current) => {
      if (current.get(id)?.seq !== seq) return current;
      const next = new Map(current);
      next.delete(id);
      return next;
    });
  return { moves, done, clear: () => setMoves(new Map()) };
}

/** How many slots a box with `count` items draws: all of them, or the first few and a `+N`; one more for "fewer" when open. */
export function slotsFor(count: number, open: boolean): number {
  if (count <= LIMIT) return count;
  return open ? count + 1 : LIMIT;
}

/**
 * The rows a box reserves for its dots, whatever its count: the nine it shows (the `+N` included),
 * or the rows of an open box's full list. A box with few or no items reserves the same rows, so
 * its size does not depend on how many items it holds.
 */
export function rowsFor(slots: number): number {
  return Math.ceil(Math.max(LIMIT, slots) / COLS);
}

/** Where slot `i` of `slots` sits in `box`: its left edge and its vertical centre, on the box's fixed grid. */
function slotAt(box: FlowNodeBox, i: number, slots: number): { left: number; y: number } {
  const top = box.y + box.height - BOX_INSET - rowsFor(slots) * SLOT_H;
  return {
    left: box.x + box.width / 2 - (COLS * SLOT_W) / 2 + (i % COLS) * SLOT_W,
    y: top + Math.floor(i / COLS) * SLOT_H + SLOT_H / 2,
  };
}

/** One dot: its colour, its short ref, its full label as name and tooltip, a link when it has `href`. */
function Dot({
  item,
  where,
  left,
  y,
  arriving,
}: {
  item: StateMachineItem;
  where: string;
  left: number;
  y: number;
  arriving: boolean;
}): ReactElement {
  const { props, tooltip } = useTooltip<HTMLElement>(
    item.label,
    { describes: false, tap: item.href === undefined },
    {},
  );
  const className = cx(
    "pointer-events-auto absolute flex h-5 items-center gap-1 rounded px-1 text-xs text-slate-700",
    focusRing,
  );
  const position = { ...props.style, left: left + 2, top: y - 10, width: SLOT_W - 4 };
  const body = (
    <>
      <span
        aria-hidden="true"
        className={cx("size-2.5 shrink-0 rounded-full bg-current", colourOf(item.id))}
      />
      <span aria-hidden="true" className="truncate">
        {item.id}
      </span>
    </>
  );
  const own = {
    ...props,
    style: position,
    "aria-label": `${item.label}, in ${where}`,
    ...(arriving ? { "data-hc-sm-arrive": "" } : {}),
  };
  return (
    <>
      {item.href === undefined ? (
        <span {...own} role="img" tabIndex={0} className={className}>
          {body}
        </span>
      ) : (
        renderLink({
          ...own,
          href: item.href,
          className: cx(className, "hover:underline"),
          children: body,
        })
      )}
      {tooltip}
    </>
  );
}

/** The dot that runs from an item's old box to its new one: along the arrow between them, else straight. */
function Travel({
  item,
  move,
  drawn,
  to,
  done,
}: {
  item: StateMachineItem;
  move: Move;
  drawn: FlowLayout;
  to: { x: number; y: number };
  done: () => void;
}): ReactElement | null {
  const from = drawn.nodes.find((n) => n.id === move.from);
  if (!from) return null;
  const start = slotAt(from, 0, 1);
  const x0 = start.left + DOT_X;
  const edge = drawn.edges.find((e) => e.from === move.from && e.to === move.to);
  const via = edge ? ` L${edge.path.slice(1)}` : "";
  const d = `M${x0},${start.y}${via} L${to.x},${to.y}`;
  return (
    <span
      aria-hidden="true"
      data-hc-sm-travel=""
      onAnimationEnd={done}
      className={cx("absolute left-0 top-0 size-2.5 rounded-full bg-current", colourOf(item.id))}
      style={{ offsetPath: `path("${d}")` }}
    />
  );
}

/** The `+N` (or "fewer") switch in a full box's last slot. */
function MoreToggle({
  hidden,
  open,
  where,
  left,
  y,
  toggle,
}: {
  hidden: number;
  open: boolean;
  where: string;
  left: number;
  y: number;
  toggle: () => void;
}): ReactElement {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-label={open ? `Show fewer in ${where}` : `Show ${hidden} more in ${where}`}
      onClick={toggle}
      className={cx(
        "pointer-events-auto absolute flex h-5 cursor-pointer items-center rounded px-1 text-xs font-medium text-violet-600 hover:text-violet-700",
        focusRing,
      )}
      style={{ left: left + 2, top: y - 10 }}
    >
      {open ? "fewer" : `+${hidden}`}
    </button>
  );
}

/** What the dot layer draws from: the items in each box, the boxes' names, which boxes are open, and the moves. */
type DotPlaces = {
  inBox: ReadonlyMap<string, readonly StateMachineItem[]>;
  names: ReadonlyMap<string, string>;
  open: ReadonlySet<string>;
  toggle: (id: string) => void;
  moves: ReadonlyMap<string, Move>;
  done: (id: string, seq: number) => void;
};

/** The drawn diagram, with what the dot layer draws over it. */
type DotScene = DotPlaces & { layout: FlowLayout };

/** One item's dot in `box`, and its run there when it has just moved in. */
function placeDot(
  item: StateMachineItem,
  at: { left: number; y: number },
  box: FlowNodeBox,
  places: DotScene,
): ReactElement[] {
  const move = places.moves.get(item.id);
  // A run needs the box it leaves; with that box gone (the last unplaced item placed) it just lands.
  const arriving = move?.to === box.id && places.layout.nodes.some((n) => n.id === move.from);
  const dot = (
    <Dot
      key={`${item.id}:${box.id}`}
      item={item}
      where={places.names.get(box.id) ?? box.id}
      left={at.left}
      y={at.y}
      arriving={arriving}
    />
  );
  if (!move || !arriving) return [dot];
  return [
    dot,
    <Travel
      key={`${item.id}:${move.seq}`}
      item={item}
      move={move}
      drawn={places.layout}
      to={{ x: at.left + DOT_X, y: at.y }}
      done={() => places.done(item.id, move.seq)}
    />,
  ];
}

/** A box's dots: every item, or the first few and the `+N` that shows the rest. */
function boxDots(box: FlowNodeBox, places: DotScene): ReactElement[] {
  const here = places.inBox.get(box.id) ?? [];
  const open = places.open.has(box.id);
  const count = slotsFor(here.length, open);
  const shown = here.length <= LIMIT || open ? here : here.slice(0, LIMIT - 1);
  const dots = shown.flatMap((item, i) => placeDot(item, slotAt(box, i, count), box, places));
  if (here.length <= LIMIT) return dots;
  const at = slotAt(box, count - 1, count);
  return [
    ...dots,
    <MoreToggle
      key={`more:${box.id}`}
      hidden={here.length - shown.length}
      open={open}
      where={places.names.get(box.id) ?? box.id}
      left={at.left}
      y={at.y}
      toggle={() => places.toggle(box.id)}
    />,
  ];
}

/** Every box's dots, over the drawn diagram. */
export function dotLayer(layout: FlowLayout, places: DotPlaces): ReactElement {
  return (
    <>
      <style>{css}</style>
      {layout.nodes.flatMap((box) => boxDots(box, { ...places, layout }))}
    </>
  );
}
