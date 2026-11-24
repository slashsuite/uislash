/**
 * Hit areas bigger than what is drawn, made with an invisible `::before` centred on the element: it
 * covers the element and grows to the minimum, so a click or tap on it lands on the element (a
 * label's area toggles its input). Nothing moves: the pseudo-element is absolutely placed.
 */

/** At least 24px square for every pointer (WCAG 2.5.8), for a control drawn smaller (a `sm` Switch). */
export const MIN_TARGET =
  "relative before:absolute before:top-1/2 before:left-1/2 before:size-full before:min-h-6 before:min-w-6 before:-translate-x-1/2 before:-translate-y-1/2";

/**
 * At least 44px square under a coarse pointer (a finger), for a small choice (a `Checkbox`, a
 * `Radio`). A mouse keeps the drawn size, so stacked choices do not overlap.
 */
export const TOUCH_TARGET =
  "relative pointer-coarse:before:absolute pointer-coarse:before:top-1/2 pointer-coarse:before:left-1/2 pointer-coarse:before:size-full pointer-coarse:before:min-h-11 pointer-coarse:before:min-w-11 pointer-coarse:before:-translate-x-1/2 pointer-coarse:before:-translate-y-1/2";
