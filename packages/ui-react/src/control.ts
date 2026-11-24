import { focusRing } from "./cx.js";
import { controlText, type TypeStep } from "./density.js";
import { type ResponsiveSize, type Size, sizeClass } from "./size.js";

/** A control's size: the library's one `Size` scale. */
export type ControlSize = Size;

/** `full` fills the parent (the default); `fill` grows to the space left in a flex row; `auto` adds no width class, so the control is as wide as the browser makes it; the rest are fixed. */
export type ControlWidth = "full" | "fill" | "auto" | "xs" | "sm" | "md" | "lg";

/** The props `Input`, `Select` and `Textarea` share. They replace the native `size` and `width`. */
export type ControlProps = {
  /**
   * `sm` is compact, `text-sm` with less padding, for dense forms and table rows; `md` is `text-base`;
   * `lg` is `text-lg` with more padding, for a hero form. Under an `AppShell density="compact"` each
   * is one type step down, and on a touch screen a field is never under 16px.
   * `{ base: "md", md: "lg" }` changes size at the `md` breakpoint (48rem), in CSS, as a `Button`'s
   * does: give the field and the buttons in its row the same value, so the row stays aligned.
   * @default md
   */
  size?: ControlSize | ResponsiveSize | undefined;
  /** `full` (default) fills the parent; `fill` grows to fill the room left in a row beside other items (it can shrink to nothing, so buttons stay on the line); `xs`, `sm`, `md`, `lg` are fixed; `auto` adds no width class, so the control is as wide as the browser makes it. */
  width?: ControlWidth | undefined;
};

/** The vertical padding of a control; its type size is `controlText`'s, from the size and the type step. */
const CONTROL_PAD_Y: Record<ControlSize, string> = {
  sm: "py-1",
  md: "py-2",
  lg: "py-2.5",
};

/** `CONTROL_PAD_Y` from the `md` breakpoint up, for a responsive size, every class written out in full. */
const CONTROL_PAD_Y_MD: Record<ControlSize, string> = {
  sm: "md:py-1",
  md: "md:py-2",
  lg: "md:py-2.5",
};

/** One width class per control, so a fixed width never fights `w-full`. `auto` has none. */
export const CONTROL_WIDTH: Record<ControlWidth, string | undefined> = {
  full: "w-full",
  fill: "w-full min-w-0 flex-1",
  auto: undefined,
  xs: "w-20",
  sm: "w-28",
  md: "w-36",
  lg: "w-48",
};

/** A `numeric` `Input`'s figures: right-aligned and tabular, as a `numeric` table cell's. */
export const NUMERIC_VALUE = "text-right tabular-nums";

/** The horizontal padding of a control. */
const CONTROL_PAD_X: Record<ControlSize, string> = { sm: "px-2", md: "px-3", lg: "px-4" };

/** `CONTROL_PAD_X` from the `md` breakpoint up. */
const CONTROL_PAD_X_MD: Record<ControlSize, string> = {
  sm: "md:px-2",
  md: "md:px-3",
  lg: "md:px-4",
};

/** The horizontal padding of an `Input` with a leading icon: the icon's gutter. */
const CONTROL_PAD_ICON: Record<ControlSize, string> = {
  sm: "pr-2 pl-7",
  md: "pr-3 pl-9",
  lg: "pr-4 pl-11",
};

/** `CONTROL_PAD_ICON` from the `md` breakpoint up. */
const CONTROL_PAD_ICON_MD: Record<ControlSize, string> = {
  sm: "md:pr-2 md:pl-7",
  md: "md:pr-3 md:pl-9",
  lg: "md:pr-4 md:pl-11",
};

/** A text control's height by `size`: its padding, line height and border, 26, 38 and 46px. */
const CONTROL_HEIGHT: Record<ControlSize, string> = { sm: "h-6.5", md: "h-9.5", lg: "h-11.5" };

/** `CONTROL_HEIGHT` from the `md` breakpoint up. */
const CONTROL_HEIGHT_MD: Record<ControlSize, string> = {
  sm: "md:h-6.5",
  md: "md:h-9.5",
  lg: "md:h-11.5",
};

/** The height of a text control at `size`, set outright: for a `Select` and a field's loading bone. */
export function controlHeight(size: ControlSize | ResponsiveSize): string {
  return sizeClass(CONTROL_HEIGHT, CONTROL_HEIGHT_MD, size);
}

/** The control size tables and their `md:` twins, for the data test. */
export const controlSizeTables = {
  padY: CONTROL_PAD_Y,
  padYMd: CONTROL_PAD_Y_MD,
  padX: CONTROL_PAD_X,
  padXMd: CONTROL_PAD_X_MD,
  padIcon: CONTROL_PAD_ICON,
  padIconMd: CONTROL_PAD_ICON_MD,
  height: CONTROL_HEIGHT,
  heightMd: CONTROL_HEIGHT_MD,
};

/** The horizontal padding of a control at `size`: plain, or with the gutter of a leading icon. */
export function controlPad(size: ControlSize | ResponsiveSize, icon = false): string {
  return icon
    ? sizeClass(CONTROL_PAD_ICON, CONTROL_PAD_ICON_MD, size)
    : sizeClass(CONTROL_PAD_X, CONTROL_PAD_X_MD, size);
}

/**
 * The edge of a control the browser itself finds invalid once the person has left it (`:user-invalid`:
 * a `required` one left empty, an `email` with no @), the same red as an `aria-invalid` one, and the
 * mark of a value the browser autofilled: a bar of the text colour inside the start edge, so
 * autofill is told by a shape and not only by the browser's own tint.
 */
export const CONTROL_STATES =
  "user-invalid:border-red-200 autofill:shadow-[inset_3px_0_0_0_currentColor]";

/** Shared look of text controls; `size` and the type `step` set the height and type, `width` the one width class. */
export function controlClass(
  size: ControlSize | ResponsiveSize = "md",
  width: ControlWidth = "full",
  step?: TypeStep,
): string {
  return [
    CONTROL_WIDTH[width],
    sizeClass(CONTROL_PAD_Y, CONTROL_PAD_Y_MD, size),
    controlText(size, step, true),
    `rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-ellipsis transition hover:border-violet-400 aria-invalid:border-red-200 disabled:opacity-50 ${focusRing}`,
    CONTROL_STATES,
  ]
    .filter(Boolean)
    .join(" ");
}
