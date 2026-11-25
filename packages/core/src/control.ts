/**
 * A control's text: its type size by `size` at each type step, and its line height by `size`. A
 * Button, a field and a pill take their text from here on every renderer, so a control's height
 * (line height, padding and hairline) is the same on the web and on a phone.
 */
import type { ButtonSize } from "./button.js";

/** The type step an app may set once: `compact` is one step down, for an app's chrome. */
export type ControlTypeStep = "default" | "compact";

/** A control's type size at each step: `md` is 16px at the default step, and `compact` is one step down. */
export const CONTROL_TEXT: Record<ControlTypeStep, Record<ButtonSize, string>> = {
  default: { sm: "text-sm", md: "text-base", lg: "text-lg" },
  compact: { sm: "text-xs", md: "text-sm", lg: "text-base" },
};

/**
 * A control's line height by `size`, whatever its type step: 16, 20 and 24px, so with its padding
 * every control is 26, 38 and 46px tall at both steps.
 */
export const CONTROL_LEADING: Record<ButtonSize, string> = {
  sm: "leading-4",
  md: "leading-5",
  lg: "leading-6",
};
