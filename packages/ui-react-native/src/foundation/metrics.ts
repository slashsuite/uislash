/**
 * F9: a control's size comes from its line height, padding and hairline, never an explicit height,
 * as on the web; `parity.json` holds what each size must come to (sm, md and lg are 26, 38 and 46
 * logical px). A drawn box matches within one physical pixel, and a control under 44pt gets a
 * hitSlop that makes its touch target 44pt, without growing what is drawn.
 */
import type { Insets } from "react-native";

/** The smallest touch target, in points (Apple's HIG; Android's 48dp is close enough at 1x). */
export const MIN_TARGET = 44;

/** Whether `actual` is within one physical pixel of `expected`, both in logical px. */
export function withinPixel(actual: number, expected: number, pixelRatio: number): boolean {
  return Math.abs(actual - expected) * pixelRatio <= 1 + 1e-9;
}

/** The hitSlop that brings a `width` by `height` box to the minimum target; undefined when it is big enough. */
export function hitSlopFor(width: number, height: number): Insets | undefined {
  const x = Math.max(0, Math.ceil((MIN_TARGET - width) / 2));
  const y = Math.max(0, Math.ceil((MIN_TARGET - height) / 2));
  if (x === 0 && y === 0) return undefined;
  return { top: y, bottom: y, left: x, right: x };
}
