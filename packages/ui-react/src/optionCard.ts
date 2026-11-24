/** A choice's look: `plain` is the mark and its words; `card` puts them in a bordered box, the whole box the click target. */
export type ChoiceVariant = "plain" | "card";

/**
 * The box of a `card` choice (a `Checkbox`, a `Radio`): full width, padded, the control's border
 * colour, and the hover edge of a field. Its parent is `relative` (the touch target's), so the
 * chosen edge below sits on it.
 */
export const OPTION_CARD = "w-full rounded-lg border border-slate-300 bg-white p-3 transition";

/** A card's edge under the pointer, when it is enabled. */
export const OPTION_CARD_HOVER = "hover:border-violet-400";

/**
 * The chosen card's edge: a 2px accent border drawn over the card's own, so the words do not move.
 * It is shown by the caller (`visible` from the input's state), so a card that keeps its own state
 * changes with no re-render.
 */
export const OPTION_CARD_CHOSEN =
  "pointer-events-none absolute -inset-px rounded-lg border-2 border-violet-600";

/** The card's title: a step heavier than a plain choice's words, as a card's heading is. */
export const OPTION_CARD_TITLE = "font-medium text-slate-900";
