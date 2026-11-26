import type { FlowNodeBox, FlowSpacing } from "./flowLayout.js";
import type { StateMachineItem } from "./StateMachine.js";

// A StateMachine box's fixed grid of dot slots, and which box each item sits in.

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
export const LIMIT = 6;
/** From a box's bottom edge to its dots' bottom: its border and its bottom padding. */
const BOX_INSET = 9;
/** From a slot's left edge to its dot's centre: the chip's inset, its padding and half the dot. */
export const DOT_X = 2 + 4 + 5;

/** Which box each item sits in: its state's, else the unplaced box. */
export function placeOf(
  items: readonly StateMachineItem[],
  known: ReadonlySet<string>,
): Map<string, string> {
  return new Map(items.map((i) => [i.id, known.has(i.state) ? i.state : UNPLACED]));
}

/** How many slots a box with `count` items draws: all of them, or the first few and a `+N`; one more for "fewer" when open. */
export function slotsFor(count: number, open: boolean): number {
  if (count <= LIMIT) return count;
  return open ? count + 1 : LIMIT;
}

/**
 * The rows a box reserves for its dots, whatever its count: the six it shows (the `+N` included),
 * or the rows of an open box's full list. A box with few or no items reserves the same rows, so
 * its size does not depend on how many items it holds.
 */
export function rowsFor(slots: number): number {
  return Math.ceil(Math.max(LIMIT, slots) / COLS);
}

/**
 * The room a box reserves under its tags for `slots` dots: the full grid's width and `rowsFor`'s
 * height, so it is the same at 0, 1, 6 or 12 items (closed) and grows only when a box is opened.
 */
export function dotArea(slots: number): { width: number; height: number } {
  return { width: COLS * SLOT_W, height: rowsFor(slots) * SLOT_H };
}

/**
 * A machine's gaps, closer than `FlowDiagram`'s: its boxes are all one size, and every gap between
 * two ranks also holds a rank of arrow labels, so the loose gaps leave wide empty bands.
 */
export const MACHINE_SPACING: FlowSpacing = { node: 24, rank: 32, edge: 8 };

/** A box's tag row: one small pill's height. */
export const TAG_ROW = 20;
/** The gap between the tag row and the dot area (`mt-1`). */
export const TAG_GAP = 4;

/**
 * The size of what a box holds under its label: its tag row, then its dot area. The layout takes
 * it before the box can be measured (a server render), so the dots, placed up from the box's
 * bottom, already sit under the tags and never on them.
 */
export function boxContentSize(slots: number): { width: number; height: number } {
  const area = dotArea(slots);
  return { width: area.width, height: TAG_ROW + TAG_GAP + area.height };
}

/** Where slot `i` of `slots` sits in `box`: its left edge and its vertical centre, on the box's fixed grid. */
export function slotAt(box: FlowNodeBox, i: number, slots: number): { left: number; y: number } {
  const top = box.y + box.height - BOX_INSET - rowsFor(slots) * SLOT_H;
  return {
    left: box.x + box.width / 2 - (COLS * SLOT_W) / 2 + (i % COLS) * SLOT_W,
    y: top + Math.floor(i / COLS) * SLOT_H + SLOT_H / 2,
  };
}
