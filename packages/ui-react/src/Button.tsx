import {
  BUTTON_BLOCKED,
  BUTTON_BLOCKED_BY_VARIANT,
  BUTTON_BOX,
  BUTTON_BOX_MD,
  BUTTON_BUSY,
  BUTTON_COUNT,
  BUTTON_DASHED_BOX,
  BUTTON_DISABLED_PLAIN,
  BUTTON_LINK_GAP,
  BUTTON_SHAPE,
  buttonLook,
} from "@slashsuite/core";
import type { ComponentPropsWithoutRef, ReactElement, ReactNode, Ref } from "react";
import { cx, focusRing } from "./cx.js";
import { controlText, type TypeStep, useResponsiveDensity, useTypeStep } from "./density.js";
import { Icon } from "./Icon.js";
import type { IconName } from "./icons.js";
import { hasReason, useBlocked } from "./blocked.js";
import { renderLink } from "./link.js";
import type { Unstyled } from "./props.js";
import { type ResponsiveSize, type Size, sizeClass } from "./size.js";
import type { Tone } from "./tone.js";

/** A Button's look: `primary` the one main action, `outline` and `ghost` the others, `link` text in running text, `dashed` the add-another row. */
export type ButtonVariant = "primary" | "outline" | "ghost" | "link" | "dashed";
/** A Button's height and text, on the library's one `Size` scale. */
export type ButtonSize = Size;
/** A Button's tones: `neutral` (the accent fill, the default), `positive` and `danger`. */
export type ButtonTone = Extract<Tone, "neutral" | "positive" | "danger">;

/** The padding table and its `md:` twin, for the data test. */
export const buttonSizeTables = { box: BUTTON_BOX, boxMd: BUTTON_BOX_MD };

/** The count chip's classes (a Badge's size, in the button's own text colour). */
export const COUNT = BUTTON_COUNT;

/** The label, then the count chip. The comma is for a screen reader only, so the name reads "Splits, 3". */
function withCount(children: ReactNode, count: number | undefined): ReactNode {
  if (count === undefined) return children;
  return (
    <>
      {children}
      <span className="sr-only">, </span>
      <span className={COUNT}>{count}</span>
    </>
  );
}

/** Size, tone and variant: the look of a button, apart from its state. */
type ButtonLook = {
  /**
   * `primary` is filled, for the one main action; `outline` and `ghost` are quieter; `link` is
   * text with an underline on hover; `dashed` is an "add another" row that fills its container.
   * @default primary
   */
  variant?: ButtonVariant | undefined;
  /**
   * `sm` is compact, for table rows and toolbars; `lg` is larger, for a hero call to action. Left
   * out, a Button takes the size of the `Card`, `ListRow` or `Table` it sits in, else `md`.
   * `{ base: "md", md: "lg" }` changes size at the `md` breakpoint (48rem), in CSS: `md` on a phone,
   * `lg` from 48rem up.
   *
   * The first load paints the right size. Give every control in the row the same value, so it stays
   * aligned.
   * @default md
   */
  size?: ButtonSize | ResponsiveSize | undefined;
  /**
   * `positive` is green, for accept and approve; `danger` is red, for delete and clear. Not for
   * `dashed`, which has the one look.
   * @default neutral
   */
  tone?: ButtonTone | undefined;
  /** An icon from the `Icon` set before the label, decorative, at the button's size. */
  icon?: IconName | undefined;
};

function shape(
  variant: ButtonVariant,
  size: ButtonSize | ResponsiveSize,
  step: TypeStep | undefined,
): string {
  return cx(
    BUTTON_SHAPE,
    variant !== "link" && sizeClass(BUTTON_BOX, BUTTON_BOX_MD, size),
    variant === "link" && BUTTON_LINK_GAP,
    variant === "dashed" && BUTTON_DASHED_BOX,
    controlText(size, step, false),
    focusRing,
  );
}

/** The classes of an idle Button: what `href` draws, and what the tests compare against. */
export function buttonClass(
  variant: ButtonVariant = "primary",
  { size = "md", tone = "neutral" }: Omit<ButtonLook, "variant" | "icon"> = {},
  step?: TypeStep,
): string {
  return idleClass(variant, size, tone, { step });
}

/**
 * The classes of a blocked Button, for an element that is not a button: a pager's Previous on the
 * first page, drawn as text in the same box so the row does not jump.
 */
export function blockedButtonClass(
  variant: ButtonVariant = "primary",
  { size = "md" }: Pick<ButtonLook, "size"> = {},
  step?: TypeStep,
): string {
  return stateClass({ variant, size }, "blocked", undefined, step);
}

function idleClass(
  variant: ButtonVariant,
  size: ButtonSize | ResponsiveSize,
  tone: ButtonTone,
  { step, pressed }: { step: TypeStep | undefined; pressed?: boolean | undefined },
): string {
  const look = buttonLook(variant, tone, pressed);
  return cx(
    shape(variant, size, step),
    "cursor-pointer",
    BUTTON_DISABLED_PLAIN,
    look.color,
    look.hover,
  );
}

type ButtonAsButton = ButtonLook & {
  /**
   * Why the button cannot be pressed: greys it flat and blocks it (`aria-disabled`, its click,
   * Enter and Space do nothing) while it stays in the tab order, and shows the reason as its
   * tooltip on hover, keyboard focus and a tap, read out as its description.
   */
  disabledReason?: string | undefined;
  /**
   * The work is in flight: disabled, `aria-busy`, keeps its colour. Wins over `disabledReason`. A
   * string is also the label while busy, in place of the children: `busy={saving && "Saving"}`.
   */
  busy?: boolean | string | undefined;
  /**
   * A toggle: sets `aria-pressed`. On `outline` and `ghost`, `false` draws the neutral off look
   * and `true` the tone's primary fill, so a row of filter chips shows the selected one plainly.
   * Left out, the button is not a toggle, has no `aria-pressed` and keeps its variant's look.
   */
  pressed?: boolean | undefined;
  /**
   * A small number in a chip after the label: how many are behind the button (the splits a row
   * has, the comments on a thread). It is part of the button's name, "Splits, 3", and `0` is
   * shown. For a button that opens something, also pass `aria-expanded`.
   *
   * Pass `aria-controls` for what it opens too; the caller owns that state.
   */
  count?: number | undefined;
  href?: undefined;
  external?: undefined;
  /** Reaches the `<button>`, or the `<a>` of a link button, to focus it or measure it. */
  ref?: Ref<HTMLButtonElement> | undefined;
} & Unstyled<ComponentPropsWithoutRef<"button">>;

type ButtonAsLink = ButtonLook & {
  /** Opens in a new tab: adds `target="_blank"` and `rel="noreferrer"`. */
  external?: boolean | undefined;
  disabledReason?: undefined;
  busy?: undefined;
  pressed?: undefined;
  /**
   * A small number in a chip after the label: how many are behind the button (the splits a row
   * has, the comments on a thread). It is part of the button's name, "Splits, 3", and `0` is
   * shown. For a button that opens something, also pass `aria-expanded`.
   *
   * Pass `aria-controls` for what it opens too; the caller owns that state.
   */
  count?: number | undefined;
  /** Makes the button a link to this URL; an in-app path goes through the app's `LinkProvider`. */
  href: string;
  /** Reaches the `<button>`, or the `<a>` of a link button, to focus it or measure it. */
  ref?: Ref<HTMLAnchorElement> | undefined;
} & Unstyled<Omit<ComponentPropsWithoutRef<"a">, "href">>;

type ButtonProps = ButtonAsButton | ButtonAsLink;

function isLink(props: ButtonProps): props is ButtonAsLink {
  return props.href !== undefined;
}

type State = "blocked" | "busy" | "idle";

/** Busy wins over blocked. */
function stateOf(busy: boolean, disabledReason: string | undefined): State {
  if (busy) return "busy";
  return hasReason(disabledReason) ? "blocked" : "idle";
}

/** The classes of a Button in a given state: blocked swaps the colour out, busy keeps it. */
function stateClass(
  { variant = "primary", size = "md", tone = "neutral" }: ButtonLook,
  state: State,
  pressed: boolean | undefined,
  step: TypeStep | undefined,
): string {
  if (state === "blocked") {
    return cx(shape(variant, size, step), BUTTON_BLOCKED_BY_VARIANT[variant] ?? BUTTON_BLOCKED);
  }
  if (state === "busy") {
    return cx(shape(variant, size, step), buttonLook(variant, tone, pressed).color, BUTTON_BUSY);
  }
  return idleClass(variant, size, tone, { step, pressed });
}

/**
 * A button in the primary, outline, ghost, link or dashed style (the link has no box: text with an
 * underline on hover, for an in-line action; `dashed` is the full-width "add" row, a dashed
 * outline with muted text that fills its container). `icon` puts an `Icon` before the label.
 * `size="sm"` is compact and `size="lg"` larger, `size={{ base: "md", md: "lg" }}` changes at 48rem,
 * and with no `size` it takes its container's;
 * `tone="positive"` is green and `tone="danger"` is red;
 * `pressed` makes it a toggle: neutral when off, the tone's fill when on. `count` puts a small
 * number chip after the label; the chip is part of the name, and a button that opens something
 * also takes `aria-expanded`.
 * Defaults to `type="button"`. `disabledReason` and `busy` are the two disabled states that say
 * more than a plain `disabled`, which keeps its half-opacity look; `busy="Saving"` also swaps the
 * label. `ref` reaches the `<button>` or the `<a>`. `href` makes it a link instead,
 * with the same look (the app's router link through `LinkProvider` for an in-app path, else a plain
 * `<a>`; `external` opens a new tab).
 */
export function Button(props: ButtonProps): ReactElement {
  return isLink(props) ? <LinkButton {...props} /> : <PlainButton {...props} />;
}

/** The icon, the label and the count chip: what a Button holds. */
function content(
  icon: IconName | undefined,
  size: Size | ResponsiveSize,
  label: ReactNode,
): ReactNode {
  if (icon === undefined) return label;
  return (
    <>
      <Icon name={icon} size={size} />
      {label}
    </>
  );
}

function LinkButton({
  variant = "primary",
  size,
  tone = "neutral",
  icon,
  href,
  external = false,
  count,
  children,
  ...rest
}: ButtonAsLink): ReactElement {
  const drawn = useResponsiveDensity(size);
  const step = useTypeStep();
  return renderLink({
    ...rest,
    href,
    external,
    className: buttonClass(variant, { size: drawn, tone }, step),
    children: content(icon, drawn, withCount(children, count)),
  });
}

function PlainButton({
  variant,
  size,
  tone,
  icon,
  disabledReason,
  busy = false,
  pressed,
  count,
  children,
  title,
  disabled,
  ...rest
}: ButtonAsButton): ReactElement {
  const drawn = useResponsiveDensity(size);
  const step = useTypeStep();
  const working = Boolean(busy);
  const state = stateOf(working, disabledReason);
  const blocked = state === "blocked";
  const label = working && typeof busy === "string" ? busy : withCount(children, count);
  const { props: guard, tooltip } = useBlocked(blocked ? disabledReason : undefined, {
    ...rest,
    title,
  });
  return (
    <>
      <button
        type="button"
        className={stateClass({ variant, size: drawn, tone }, state, pressed, step)}
        disabled={disabled || working}
        aria-busy={working || undefined}
        aria-pressed={pressed}
        {...rest}
        {...guard}
      >
        {content(icon, drawn, label)}
      </button>
      {tooltip}
    </>
  );
}
