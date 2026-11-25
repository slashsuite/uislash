/**
 * Button's tokens: the class tables `@slashsuite/ui-react` draws a Button from, and the sizes the
 * native renderer measures against. The tables are the web's (Tailwind utilities, remapped by every
 * theme); `parity.ts` reads the box sizes from them, so a change here moves both renderers.
 */

/** A Button's look: `primary` the one main action, `outline` and `ghost` the others, `link` text in running text, `dashed` the add-another row. */
export type ButtonVariant = "primary" | "outline" | "ghost" | "link" | "dashed";
/** A Button's height and text, on the library's one size scale. */
export type ButtonSize = "sm" | "md" | "lg";
/** A Button's tones: `neutral` (the accent fill, the default), `positive` and `danger`. */
export type ButtonTone = "neutral" | "positive" | "danger";

/** A colour and its hover, as two class strings. */
export type ButtonLook = { color: string; hover: string };

export const BUTTON_SHAPE =
  "inline-flex items-center justify-center rounded-lg border font-medium transition";
// Size sets the padding; the text is the renderer's control text, from the size and the type step.
// The link variant has no box, so it takes the text size only.
export const BUTTON_BOX: Record<ButtonSize, string> = {
  sm: "gap-1.5 px-2.5 py-1",
  md: "gap-2 px-4 py-2",
  lg: "gap-2 px-5 py-2.5",
};
// `BUTTON_BOX` from the `md` breakpoint up, for a responsive size, every class written out in full.
export const BUTTON_BOX_MD: Record<ButtonSize, string> = {
  sm: "md:gap-1.5 md:px-2.5 md:py-1",
  md: "md:gap-2 md:px-4 md:py-2",
  lg: "md:gap-2 md:px-5 md:py-2.5",
};
/** The gap of the link variant, which has no box. */
export const BUTTON_LINK_GAP = "gap-1.5";
/** The dashed variant fills its container. */
export const BUTTON_DASHED_BOX = "w-full border-dashed";
// A plain `disabled` washes out and ignores the pointer. A busy button is disabled too, but keeps
// pointer events (the cursor says why) and does not take this; a blocked one is `aria-disabled`.
export const BUTTON_DISABLED_PLAIN = "disabled:pointer-events-none disabled:opacity-50";

const LINK = "underline-offset-2";

export const BUTTON_TONE: Record<
  ButtonTone,
  Record<Exclude<ButtonVariant, "dashed">, ButtonLook>
> = {
  neutral: {
    primary: {
      color: "border-violet-600 bg-violet-600 text-violet-50",
      hover: "hover:bg-violet-700",
    },
    outline: { color: "border-violet-600 text-violet-600", hover: "hover:bg-violet-50" },
    ghost: { color: "border-transparent text-slate-600", hover: "hover:bg-slate-100" },
    link: {
      color: `border-transparent text-violet-600 ${LINK}`,
      hover: "hover:text-violet-700 hover:underline",
    },
  },
  positive: {
    primary: {
      color: "border-emerald-600 bg-emerald-600 text-emerald-50",
      hover: "hover:bg-emerald-700",
    },
    outline: { color: "border-emerald-200 text-emerald-700", hover: "hover:bg-emerald-50" },
    ghost: { color: "border-transparent text-emerald-700", hover: "hover:bg-emerald-50" },
    link: { color: `border-transparent text-emerald-700 ${LINK}`, hover: "hover:underline" },
  },
  danger: {
    primary: { color: "border-red-600 bg-red-600 text-red-50", hover: "hover:bg-red-700" },
    outline: { color: "border-red-200 text-red-700", hover: "hover:bg-red-50" },
    ghost: { color: "border-transparent text-red-700", hover: "hover:bg-red-50" },
    link: { color: `border-transparent text-red-700 ${LINK}`, hover: "hover:underline" },
  },
};

// The add row: Card dashed's outline and muted text, lit with the accent on hover. One look, so
// `tone` does not apply to it.
export const BUTTON_DASHED: ButtonLook = {
  color: "border-slate-300 text-slate-500",
  hover: "hover:border-violet-400 hover:text-violet-700",
};

// An outline or ghost Button with `pressed` set is a toggle, such as a filter chip: off is neutral
// (the surface, a hairline, muted text, lit with the accent on hover), on is the tone's primary
// fill, so the selected one stands out in every theme.
export const BUTTON_TOGGLE_OFF: ButtonLook = {
  color: "border-slate-200 bg-white text-slate-600",
  hover: "hover:border-violet-400",
};

// The count chip: a pill in the button's own text colour (a hairline of `currentColor`), so it reads
// on every variant and tone and needs no palette entry. The size is a Badge's: rem text and a
// min-height, so the chip grows with the reader's text size.
export const BUTTON_COUNT =
  "inline-flex min-h-4 min-w-4 items-center justify-center rounded-full border border-current px-1 text-[0.625rem]/[1.4] font-semibold tabular-nums";

// Blocked replaces the variant's colour and hover rather than overriding them, so no `!` is needed.
export const BUTTON_BLOCKED = "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400";
export const BUTTON_BLOCKED_BY_VARIANT: Partial<Record<ButtonVariant, string>> = {
  link: "cursor-not-allowed border-transparent text-slate-400",
  dashed: "cursor-not-allowed border-slate-200 text-slate-400",
};
export const BUTTON_BUSY = "cursor-progress opacity-85";

/** The look of an idle Button: the dashed look, a toggle's, or the tone's for the variant. */
export function buttonLook(
  variant: ButtonVariant,
  tone: ButtonTone,
  pressed?: boolean,
): ButtonLook {
  if (variant === "dashed") return BUTTON_DASHED;
  if (pressed !== undefined && (variant === "outline" || variant === "ghost")) {
    return pressed ? BUTTON_TONE[tone].primary : BUTTON_TOGGLE_OFF;
  }
  return BUTTON_TONE[tone][variant];
}
