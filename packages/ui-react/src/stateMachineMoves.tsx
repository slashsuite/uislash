import { type ReactElement, useState } from "react";
import { cx } from "./cx.js";
import type { FlowLayout } from "./flowLayout.js";
import type { StateMachineItem } from "./StateMachine.js";
import {
  COLS,
  DOT_X,
  LIMIT,
  placeOf,
  SLOT_H,
  SLOT_W,
  slotAt,
  slotsFor,
} from "./stateMachineGrid.js";

// Every move is CSS. A dot runs along the arrow's path (`offset-path`) in 600ms while the dot at
// its new place waits hidden for the same time; a dot that stays in its box but changes slot (one
// before it left, or one came in) slides from its old slot to its new one (`translate`, from the
// `--hc-sm-dx` and `--hc-sm-dy` it is given), under two keyframe names taken in turn so a second
// slide restarts. Nothing is timed in script: each ends on its own `animationend`. With reduced
// motion the run is hidden and over at once (so it still ends), and every dot is in its new place
// at once.
export const moveCss = `[data-hc-sm-travel]{offset-anchor:center;offset-rotate:0deg;animation:hc-sm-travel .6s ease-in-out forwards}[data-hc-sm-arrive]{animation:hc-sm-arrive .6s linear}[data-hc-sm-shift="a"]{animation:hc-sm-shift-a .6s ease-in-out}[data-hc-sm-shift="b"]{animation:hc-sm-shift-b .6s ease-in-out}@keyframes hc-sm-travel{from{offset-distance:0%}to{offset-distance:100%}}@keyframes hc-sm-arrive{from,to{visibility:hidden}}@keyframes hc-sm-shift-a{from{translate:var(--hc-sm-dx) var(--hc-sm-dy)}}@keyframes hc-sm-shift-b{from{translate:var(--hc-sm-dx) var(--hc-sm-dy)}}@media (prefers-reduced-motion:reduce){[data-hc-sm-travel]{visibility:hidden;animation-duration:1ms}[data-hc-sm-arrive],[data-hc-sm-shift]{animation:none}}`;

/**
 * Where an item's dot sits: its box, its slot there (`null` when it is one of the dots a full box
 * hides behind its `+N`), and the number of slots the box draws.
 */
type Seat = { box: string; slot: number | null; slots: number };

/**
 * An item's move, `seq` restarting its animation when it moves again: a run from its old box
 * (`from`, from its old `slot` of `slots` there) to its new one (`to`), or a slide inside its box
 * by `dx` and `dy` pixels, from its old slot to its new one.
 */
export type Move =
  | { kind: "travel"; from: string; to: string; slot: number; slots: number; seq: number }
  | { kind: "shift"; dx: number; dy: number; seq: number };

/** The slot of the `i`th of `count` items in a box: its own, or `null` when the `+N` hides it. */
function slotOf(i: number, count: number, open: boolean): number | null {
  return count <= LIMIT || open || i < LIMIT - 1 ? i : null;
}

/** Every item's seat: its box, in item order, and its slot there. */
export function seatsOf(
  items: readonly StateMachineItem[],
  known: ReadonlySet<string>,
  open: ReadonlySet<string>,
): Map<string, Seat> {
  const placed = placeOf(items, known);
  const counts = new Map<string, number>();
  for (const box of placed.values()) counts.set(box, (counts.get(box) ?? 0) + 1);
  const taken = new Map<string, number>();
  const seats = new Map<string, Seat>();
  for (const [id, box] of placed) {
    const i = taken.get(box) ?? 0;
    taken.set(box, i + 1);
    const count = counts.get(box) ?? 0;
    const isOpen = open.has(box);
    seats.set(id, { box, slot: slotOf(i, count, isOpen), slots: slotsFor(count, isOpen) });
  }
  return seats;
}

/**
 * The move from `was` to `now`, if the item moved: a run between boxes, or a slide between two
 * shown slots of one. A run starts from its old slot in the grid its old box draws now
 * (`fromSlots`), since the run is drawn on the new layout.
 */
export function moveOf(was: Seat, now: Seat, seq: number, fromSlots: number): Move | null {
  if (was.box !== now.box) {
    const slot = was.slot ?? LIMIT - 1;
    return { kind: "travel", from: was.box, to: now.box, slot, slots: fromSlots, seq };
  }
  if (was.slot === null || now.slot === null || was.slot === now.slot) return null;
  const dx = ((was.slot % COLS) - (now.slot % COLS)) * SLOT_W;
  const dy = (Math.floor(was.slot / COLS) - Math.floor(now.slot / COLS)) * SLOT_H;
  return { kind: "shift", dx, dy, seq };
}

/**
 * Remembers where every dot sat, and when the seats change records each dot's move, during render
 * (React's "adjust state when a prop changes"), so the re-render that measures the boxes does not
 * lose it. A move ends on its animation's `animationend` (`done`). A change of seats records its own
 * moves and keeps the ones under way whose dot kept its seat (opening a box records none).
 */
export function useMoves(
  items: readonly StateMachineItem[],
  known: ReadonlySet<string>,
  open: ReadonlySet<string>,
): {
  moves: ReadonlyMap<string, Move>;
  done: (id: string, seq: number) => void;
} {
  const now = seatsOf(items, known, open);
  const key = JSON.stringify([...now]);
  const [seen, setSeen] = useState({ key, seats: now });
  const [moves, setMoves] = useState<ReadonlyMap<string, Move>>(new Map());
  // Compared by value: a caller's `items` is often a new array on every render.
  if (seen.key !== key) {
    const slotsNow = new Map([...now.values()].map((seat) => [seat.box, seat.slots]));
    const next = new Map<string, Move>();
    for (const [id, seat] of now) {
      const was = seen.seats.get(id);
      if (!was) continue;
      const going = moves.get(id);
      const move = moveOf(was, seat, (going?.seq ?? 0) + 1, slotsNow.get(was.box) ?? 0);
      if (move) next.set(id, move);
      else if (going && was.box === seat.box && was.slot === seat.slot) next.set(id, going);
    }
    setSeen({ key, seats: now });
    setMoves(next);
  }
  const done = (id: string, seq: number) =>
    setMoves((current) => {
      if (current.get(id)?.seq !== seq) return current;
      const next = new Map(current);
      next.delete(id);
      return next;
    });
  return { moves, done };
}

/**
 * The dot that runs from an item's old slot to its new one: out of its old box, along the arrow
 * between the two boxes (straight across when there is none), and into its slot, in `colour`.
 */
export function Travel({
  move,
  drawn,
  to,
  colour,
  done,
}: {
  move: Extract<Move, { kind: "travel" }>;
  drawn: FlowLayout;
  to: { x: number; y: number };
  colour: string;
  done: () => void;
}): ReactElement | null {
  const d = runPath(drawn, move, to);
  if (d === null) return null;
  return (
    <span
      aria-hidden="true"
      data-hc-sm-travel=""
      onAnimationEnd={done}
      className={cx("absolute left-0 top-0 size-2.5 rounded-full bg-current", colour)}
      style={{ offsetPath: `path("${d}")` }}
    />
  );
}

/**
 * The SVG path of a run: from the item's old slot in the box it left, along the drawn arrow from
 * that box to the new one (every bend of it) when there is one, else straight, to `to`, the centre
 * of its new dot. `null` when the box it left is not drawn.
 */
export function runPath(
  drawn: FlowLayout,
  move: { from: string; to: string; slot: number; slots: number },
  to: { x: number; y: number },
): string | null {
  const from = drawn.nodes.find((n) => n.id === move.from);
  if (!from) return null;
  const start = slotAt(from, move.slot, move.slots);
  const edge = drawn.edges.find((e) => e.from === move.from && e.to === move.to)?.path;
  const via = edge ? ` L${edge.slice(1)}` : "";
  return `M${start.left + DOT_X},${start.y}${via} L${to.x},${to.y}`;
}
