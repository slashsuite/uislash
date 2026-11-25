import type { ReactElement, ReactNode } from "react";
import { cx } from "./cx.js";
import { Icon } from "./Icon.js";
import type { Passthrough } from "./props.js";
import { Display, Overline } from "./typography.js";

/** The one keyframes name the glow drifts on; a consumer's own CSS never needs it. */
export const HERO_DRIFT = "hc-hero-tide";

// What Tailwind classes cannot say: the soft fade at the layer's four edges (two masks, intersected,
// so no ribbon ends in a hard line where the layer clips it) and the drift. The drift is a slow
// sideways sway and stretch, like light on water, each ribbon on its own period so the three never
// line up; it runs only under `prefers-reduced-motion: no-preference`, so a visitor who asks for less
// motion sees the ribbons standing at their resting place. The pause control holds the ribbons where
// they are while it is checked, and is not drawn under reduced motion, where nothing moves. It sets
// no colour (the mask's black and transparent only set how much shows): the theme paints the ribbons.
const css = `[data-hero-glow]{mask-image:linear-gradient(to bottom,transparent,black 22%,black 78%,transparent),linear-gradient(to right,transparent,black 8%,black 92%,transparent);mask-composite:intersect}
@media (prefers-reduced-motion:no-preference){[data-hero-glow] span{animation:${HERO_DRIFT} 41s ease-in-out -7s infinite alternate}[data-hero-glow] span:nth-child(2){animation-duration:53s;animation-delay:-29s}[data-hero-glow] span:nth-child(3){animation-duration:67s;animation-delay:-43s;animation-direction:alternate-reverse}}
@media (prefers-reduced-motion:reduce){[data-hero-pause]{display:none}}
[data-hero-text]:has([data-hero-pause] input:checked) [data-hero-glow] span{animation-play-state:paused}
@keyframes ${HERO_DRIFT}{0%{translate:-7% 0;scale:1 1}50%{translate:5% 10%;scale:1.14 .86}100%{translate:12% -6%;scale:.92 1.1}}`;

/** Every ribbon: an ellipse, blurred soft. Its place, size, tilt and colour follow. */
const RIBBON = "absolute rounded-[50%] blur-[56px]";

/** The pause control: a round ghost button's look on a checkbox's label, so it works with no script. */
const PAUSE =
  "absolute top-0 right-0 inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-violet-600";

export type HeroProps = {
  /** The small label above the title, set in the monospace face. */
  overline?: ReactNode;
  /** The page's `h1`, at display size. */
  title: ReactNode;
  /** What follows the title: a `Lead`, and the page's first actions if it has any. */
  children?: ReactNode;
  /**
   * The name of the control that holds the glow still, for an app in another language.
   * @default Pause the background motion
   */
  pauseLabel?: string | undefined;
} & (
  | {
      /**
       * A picture beside the words from `md` up, and under them on a phone: an `Image` of the
       * product, at `width="full"`. The words keep the glow; the picture sits clear of it.
       */
      media: ReactNode;
      align?: "start" | undefined;
    }
  | {
      media?: undefined;
      /**
       * `center` sets the words in the middle of the page, under a centred glow: a landing page
       * with no picture whose actions are one or two buttons. Pass the actions' `Cluster`
       * `justify="center"` too.
       * @default start
       */
      align?: "start" | "center" | undefined;
    }
);

/**
 * A landing page's top block: an overline, the display title (the page's `h1`) and the lede under
 * it, over a soft glow of three tilted ribbons that drift slowly behind the text. The glow is always
 * there and its colours and strength are the theme's (the palette's `glow` role), so a paper theme
 * keeps it faint. It is anchored to the text's own column (`max-w-3xl`, at the parent's start edge,
 * or in its middle with `align="center"`), never the viewport, and clipped to it, so nothing scrolls
 * sideways on a phone. It is `aria-hidden`, and the text sits above it. `media` puts a picture
 * beside the words from `md` up. A small checkbox in the top corner holds the drift still, since it
 * never ends on its own; under `prefers-reduced-motion: reduce` the glow stands still and the
 * checkbox is not drawn. Pure markup and one inline stylesheet: it works rendered on the server with
 * no script. One per page, on a landing page; every other page opens with a `PageHeader`.
 */
export function Hero({
  overline,
  title,
  children,
  media,
  align = "start",
  pauseLabel = "Pause the background motion",
  ...rest
}: HeroProps & Passthrough): ReactElement {
  const centre = align === "center";
  const words = (
    <div
      data-hero-text=""
      className={cx("relative isolate max-w-3xl", centre && "mx-auto text-center")}
    >
      <div
        aria-hidden="true"
        data-hero-glow=""
        className="pointer-events-none absolute inset-x-0 -inset-y-14 -z-10 overflow-hidden"
      >
        <span
          className={`${RIBBON} top-[14%] left-[-6%] h-[34%] w-[78%] -rotate-[7deg] bg-indigo-400/25`}
        />
        <span
          className={`${RIBBON} top-[34%] left-[28%] h-[30%] w-[70%] rotate-[4deg] bg-teal-400/25`}
        />
        <span
          className={`${RIBBON} top-[56%] left-[6%] h-[26%] w-[58%] -rotate-[2deg] bg-rose-400/25`}
        />
      </div>
      <div className="relative flex flex-col gap-4">
        <header className={centre ? "px-10" : "pe-10"}>
          {overline != null && overline !== false && <Overline mono>{overline}</Overline>}
          <Display>{title}</Display>
        </header>
        {children}
      </div>
      <label data-hero-pause="" className={PAUSE}>
        <input type="checkbox" className="peer sr-only" />
        <span className="sr-only">{pauseLabel}</span>
        <span className="inline-flex peer-checked:hidden">
          <Icon name="pause" />
        </span>
        <span className="hidden peer-checked:inline-flex">
          <Icon name="play" />
        </span>
      </label>
    </div>
  );
  if (media === undefined) {
    return (
      <div {...rest}>
        <style>{css}</style>
        {words}
      </div>
    );
  }
  return (
    <div {...rest} className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
      <style>{css}</style>
      {words}
      <div className="min-w-0">{media}</div>
    </div>
  );
}
