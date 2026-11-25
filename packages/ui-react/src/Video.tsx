import type { ReactElement, VideoHTMLAttributes } from "react";
import { cx } from "./cx.js";
import { ASPECT, type ImageAspect } from "./Image.js";
import type { Unstyled } from "./props.js";

/**
 * `loading="lazy"` on a media element: the browser holds back even the metadata of one far below
 * the fold. React passes the attribute through, but its types know it only on `<img>` and
 * `<iframe>`, so it is spread from here; a browser without it ignores it and loads as before.
 */
export const LAZY_MEDIA: Record<string, string> = { loading: "lazy" };

/**
 * A `<video>` with controls, full width and rounded, in a fixed shape: `aspect` reserves its space
 * before it loads, so the page does not jump, and the video fits inside it whole. It loads metadata
 * only, and lazily where the browser can, so the page does not pull the file until it is played.
 * `src` is the app's own video; `captions` is a WebVTT file, offered as the default track.
 * `children` is the fallback for a browser that cannot play it.
 */
export function Video({
  src,
  captions,
  aspect = "16:9",
  children,
  ...rest
}: {
  /** The video file, the app's own. */
  src: string;
  /** A WebVTT file, offered as the default captions track. */
  captions?: string | undefined;
  /**
   * The shape it reserves, as `Image`'s `aspect`: `16:9`, `16:10`, `4:3`, `3:2`, `square`, or the
   * portrait `3:4` and `9:16`. A video of another shape fits inside it, letterboxed.
   * @default 16:9
   */
  aspect?: Exclude<ImageAspect, "natural"> | undefined;
} & Unstyled<Omit<VideoHTMLAttributes<HTMLVideoElement>, "src" | "controls">>): ReactElement {
  return (
    <video
      controls
      preload="metadata"
      {...LAZY_MEDIA}
      src={src}
      {...rest}
      className={cx("block w-full rounded-lg bg-black/90 object-contain", ASPECT[aspect])}
    >
      {captions && <track kind="captions" src={captions} default />}
      {children}
    </video>
  );
}
