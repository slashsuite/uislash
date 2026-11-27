import type { ImgHTMLAttributes, ReactElement, ReactNode } from "react";
import { cx } from "./cx.js";
import { IMAGE_WIDTH, type ImageAspect, type ImageWidth } from "./Image.js";
import type { Passthrough } from "./props.js";
import type { Tone } from "./tone.js";
import { type LoadingProps, passthroughOf, useLoading, WaitingBone } from "./skeleton.js";

/** A box in a picture's own units (an image's pixels): its top-left corner and its size. */
export type RegionRect = { x: number; y: number; width: number; height: number };

/** Thin accent stripes, drawn in the box's own colour, for an area that is left out. */
const HATCH =
  "absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,currentColor_0_1px,transparent_1px_6px)]";

/**
 * An `OutlineRegion`'s colour: `accent` (the default), or the shared `Tone`s that have a strong
 * edge, `positive`, `warn` and `danger`. `neutral` and `info` are left out: their edges are pale
 * lines that would not stand out on a picture.
 */
export type OutlineRegionTone = "accent" | Extract<Tone, "positive" | "warn" | "danger">;

/** Each tone's outline (with the hatch's colour) and its tag. */
const REGION_TONE: Record<OutlineRegionTone, { box: string; tag: string }> = {
  accent: { box: "border-violet-600 text-violet-600", tag: "bg-violet-600 text-violet-50" },
  positive: { box: "border-emerald-600 text-emerald-700", tag: "bg-emerald-600 text-emerald-50" },
  warn: { box: "border-amber-600 text-amber-700", tag: "bg-amber-50 text-amber-800" },
  danger: { box: "border-red-600 text-red-700", tag: "bg-red-600 text-red-50" },
};

/**
 * An accent outline over one area of a picture, such as a screenshot's ignored or flagged region.
 * `rect` is in the picture's own units and `within` is the picture's full size in the same units;
 * the box is placed in percent of them, so it sits right at any scale. Put it in a `RegionFrame`,
 * over the picture. `label` is a small tag in its top-left
 * corner; `hatched` stripes the inside, for an area that is left out. It takes no pointer events,
 * so it never blocks the picture or a layer drawn over it.
 *
 * `tone` colours it by what the area is (`positive`, `warn`, `danger`; `accent` by default),
 * `dashed` draws the edge dashed, for an area that is proposed or approximate, and `active` draws a
 * thicker edge, for the one region the app has picked (the one hovered in a list beside the
 * picture, say). The app sets `active`; the region has no hover state of its own.
 */
export function OutlineRegion({
  rect,
  within,
  label,
  hatched = false,
  tone = "accent",
  dashed = false,
  active = false,
  ...rest
}: {
  /** The area, in the picture's own units. */
  rect: RegionRect;
  /** The picture's full size, in the same units as `rect`. */
  within: { width: number; height: number };
  /** A short tag in the top-left corner: where the area came from, or what it is. */
  label?: ReactNode;
  /** Stripes the inside, for an area left out (ignored, masked). */
  hatched?: boolean | undefined;
  /**
   * The colour: `accent`, `positive`, `warn` or `danger`.
   * @default accent
   */
  tone?: OutlineRegionTone | undefined;
  /**
   * Draws the edge dashed, for an area that is proposed or approximate.
   * @default false
   */
  dashed?: boolean | undefined;
  /**
   * Draws a thicker edge, for the region the app has picked. The app sets it; there is no hover state.
   * @default false
   */
  active?: boolean | undefined;
} & Passthrough): ReactElement {
  const colour = REGION_TONE[tone];
  return (
    <div
      {...rest}
      className={cx(
        "pointer-events-none absolute",
        active ? "border-4" : "border-2",
        dashed && "border-dashed",
        colour.box,
      )}
      style={{
        left: `${(rect.x / within.width) * 100}%`,
        top: `${(rect.y / within.height) * 100}%`,
        width: `${(rect.width / within.width) * 100}%`,
        height: `${(rect.height / within.height) * 100}%`,
      }}
    >
      {hatched && <span aria-hidden="true" className={HATCH} />}
      {label != null && (
        <span className={cx("absolute top-0 left-0 px-1 text-sm leading-tight", colour.tag)}>
          {label}
        </span>
      )}
    </div>
  );
}

/** The shapes `RegionFrame` letterboxes a picture into, as `Image`'s `aspect`, or `natural` (its own). */
const FRAME_ASPECT: Record<ImageAspect, string> = {
  square: "aspect-square",
  "4:3": "aspect-[4/3]",
  "3:2": "aspect-[3/2]",
  "16:10": "aspect-[16/10]",
  "16:9": "aspect-video",
  "3:4": "aspect-[3/4]",
  "9:16": "aspect-[9/16]",
  natural: "",
};

/**
 * A picture with a hairline edge, and `children` laid over it: the `OutlineRegion`s that mark its
 * areas. `onLoad`, `id`, `data-*` and `aria-*` go to the `<img>`, so the app can read the picture's
 * own size for `within`. While `loading` with no `src` yet it is a bone of the frame's shape (4:3
 * for a `natural` one), as an `Image` is.
 *
 * It sizes as `Image` does. `width` is `full` (the parent's width) or 96, 160 or 256px. `aspect`
 * `natural` keeps the picture's own proportions; any other shape letterboxes it (contain, never a
 * crop) on the inset surface, centred and never scaled up, and the regions are laid over the
 * picture itself, not the box, so each stays on its spot. A letterboxed picture needs its own size:
 * a screenshot has one; an SVG needs `width` and `height` on its root, not only a `viewBox`.
 */
export function RegionFrame({
  src,
  alt,
  aspect = "natural",
  width = "full",
  loading,
  loadingLabel,
  children,
  ...rest
}: {
  /** The picture; left out while it is not known yet, with `loading`. */
  src?: string | undefined;
  /** What the picture shows; `""` for one that only decorates. */
  alt: string;
  /**
   * The box's shape: `natural` is the picture's own; any other letterboxes the picture inside it.
   * @default natural
   */
  aspect?: ImageAspect | undefined;
  /**
   * How wide the frame is: `full` fills its parent; `sm`, `md` and `lg` are 96, 160 and 256px, capped at the parent's width.
   * @default full
   */
  width?: ImageWidth | undefined;
  /** The `OutlineRegion`s over the picture. */
  children?: ReactNode;
} & LoadingProps &
  Passthrough &
  /** Fires once the picture is in, so the app can read its own size for `within`. */
  Pick<ImgHTMLAttributes<HTMLImageElement>, "onLoad">): ReactElement {
  const waiting = useLoading(loading).loading;
  if (!src) {
    // No picture yet: a bone while it is on its way, else the empty frame of its shape.
    const shape = aspect === "natural" ? "aspect-[4/3]" : FRAME_ASPECT[aspect];
    if (waiting) {
      return (
        <WaitingBone
          own={loading}
          label={loadingLabel}
          shape={cx("block w-full", shape)}
          root={cx("block", IMAGE_WIDTH[width])}
          attrs={
            alt ? { ...passthroughOf(rest), role: "img", "aria-label": alt } : passthroughOf(rest)
          }
        />
      );
    }
    return (
      <div
        {...passthroughOf(rest)}
        {...(alt ? { role: "img", "aria-label": alt } : {})}
        className={cx("relative border border-slate-200 bg-slate-100", shape, IMAGE_WIDTH[width])}
      >
        {children}
      </div>
    );
  }
  if (aspect === "natural") {
    return (
      <div className={cx("relative border border-slate-200", IMAGE_WIDTH[width])}>
        <img {...rest} src={src} alt={alt} className="block w-full" />
        {children}
      </div>
    );
  }
  // The box is a size container, so the picture is capped by its width and height in `cq` units
  // (a percentage height would not resolve), and the inner box shrinks to the picture: the
  // regions are placed in percent of the picture, wherever the letterbox puts it.
  return (
    <div
      className={cx(
        "grid place-items-center overflow-hidden border border-slate-200 bg-slate-100 [container-type:size]",
        FRAME_ASPECT[aspect],
        IMAGE_WIDTH[width],
      )}
    >
      <div className="relative">
        <img {...rest} src={src} alt={alt} className="block max-h-[100cqh] max-w-[100cqw]" />
        {children}
      </div>
    </div>
  );
}
