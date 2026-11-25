import type { ReactNode } from "react";
import { TONE_SURFACE } from "./Callout.js";
import { BODY_PAD } from "./CardBody.js";
import { cx, liftInteractive } from "./cx.js";
import type { IconName } from "./icons.js";
import type { Size } from "./size.js";
import type { Tone } from "./tone.js";

/** The peer hues a set of cards can take, one each: green is the palette's emerald and yellow its amber. */
export type CardHue = "orange" | "violet" | "sky" | "green" | "yellow" | "blue";

/** A peer hue's fill and edge, remapped by every theme (the `peer` role in `palette.json`). */
const HUE_SURFACE: Record<CardHue, string> = {
  orange: "border-orange-300 bg-orange-100",
  violet: "border-violet-300 bg-violet-100",
  sky: "border-sky-300 bg-sky-100",
  green: "border-emerald-300 bg-emerald-100",
  yellow: "border-amber-300 bg-amber-100",
  blue: "border-blue-300 bg-blue-100",
};

/** What a caller asks of a card's look. Internal. */
export type CardAsk = {
  flush?: boolean | undefined;
  bar?: boolean | undefined;
  dashed?: boolean | undefined;
  tone?: Tone | undefined;
  hue?: CardHue | undefined;
  attention?: boolean | undefined;
  icon?: IconName | undefined;
  fill?: boolean | undefined;
  width?: "sm" | undefined;
  size: Size;
};

/** A mark needs the padded body above a heading, so it has no place in a strip or a flush card. */
function paddedIcon(asked: CardAsk, bar: boolean) {
  return bar || asked.flush ? undefined : asked.icon;
}

/** The card's surface: `bar` has no tone, and a hue gives way to `tone`, `bar` and `dashed`. */
function cardSurface(asked: CardAsk, bar: boolean) {
  const dashed = asked.dashed ?? false;
  const tone = bar ? undefined : asked.tone;
  return { dashed, tone, hue: bar || dashed || tone ? undefined : asked.hue };
}

/** `bar` needs a title or actions to fill it. Internal. */
export function cardForm(asked: CardAsk, hasHeader: boolean, regions: boolean) {
  const bar = (asked.bar ?? false) && hasHeader;
  const fill = asked.fill ?? false;
  return {
    flush: asked.flush ?? false,
    bar,
    ...cardSurface(asked, bar),
    attention: asked.attention ?? false,
    icon: paddedIcon(asked, bar),
    fill,
    width: asked.width,
    // A filled card takes its parent's height, so it has no rows to share.
    regions: regions && !fill,
    size: asked.size,
    footer: false,
  };
}

export type CardForm = ReturnType<typeof cardForm>;

/** A card with a `footer`. Internal. */
export function withFooter(form: CardForm, footer: ReactNode): CardForm {
  return { ...form, footer: Boolean(footer) };
}

function surfaceOf(form: CardForm): string {
  if (form.tone) return TONE_SURFACE[form.tone];
  if (form.hue) return HUE_SURFACE[form.hue];
  return "border-slate-200/70 bg-white";
}

function cardBorder(form: CardForm): string {
  const surface = surfaceOf(form);
  if (!form.attention) return surface;
  // The warn tone's strong edge in place of the border colour; the fill stays.
  const fill = surface.split(" ").filter((c) => c.startsWith("bg-"));
  return cx("border-amber-600", ...fill);
}

function cardPadding(form: CardForm): string | false {
  return (
    !form.flush && !form.bar && !form.footer && !form.fill && !form.regions && BODY_PAD[form.size]
  );
}

/** In a `CardGrid align="regions"` the card is a subgrid of three rows (header, body, footer), so each lines up with its neighbours'. */
const REGION_ROWS = "row-span-3 grid grid-rows-subgrid gap-0";

function cardLayout(form: CardForm): string | false {
  if (form.regions) return REGION_ROWS;
  return form.fill ? "flex h-full min-h-0 flex-col" : form.footer && "flex flex-col";
}

/** A dashed edge, and a shadow only on the plain white card. */
function cardEdge(form: CardForm): string {
  return cx(form.dashed && "border-dashed", !form.tone && !form.hue && !form.dashed && "shadow-sm");
}

/** A card whose parts run to its edge clips them to its radius. */
function cardClip(form: CardForm): string | false {
  return (form.flush || form.bar || form.footer || form.fill || form.regions) && "overflow-hidden";
}

/** The card root's classes. Internal. */
export function cardClass(form: CardForm): string {
  return cx(
    "relative scroll-mt-[calc(var(--app-header,0px)+1rem)] rounded-xl border target:outline-2 target:outline-violet-600",
    liftInteractive,
    cardBorder(form),
    cardEdge(form),
    cardPadding(form),
    cardClip(form),
    cardLayout(form),
    form.width === "sm" && "w-full max-w-sm",
  );
}
