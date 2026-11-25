import type { ImgHTMLAttributes, ReactElement } from "react";
import { cx, focusRing } from "./cx.js";
import { Icon } from "./Icon.js";
import { renderLink } from "./link.js";
import type { Passthrough } from "./props.js";
import { type LoadingProps, useLoading, WaitingBone } from "./skeleton.js";
import type { Size } from "./size.js";
import { useImageFailed } from "./useImageFailed.js";

/**
 * The shapes an image is cropped or letterboxed to, or `natural`: no shape of its own, so the
 * picture keeps its own proportions.
 */
export type ImageAspect = "square" | "4:3" | "3:2" | "16:10" | "16:9" | "3:4" | "9:16" | "natural";

/** How wide an image is: `full` fills its parent; the others are 96, 160, 256 or 448px, capped at the parent's width. */
export type ImageWidth = Size | "xl" | "full";

/** The class that reserves each shape. `Video` takes the same names, all but `natural`. */
export const ASPECT: Record<ImageAspect, string> = {
  square: "aspect-square",
  "4:3": "aspect-[4/3]",
  "3:2": "aspect-[3/2]",
  "16:10": "aspect-[16/10]",
  "16:9": "aspect-video",
  "3:4": "aspect-[3/4]",
  "9:16": "aspect-[9/16]",
  natural: "h-auto",
};

/** What stands in for a `natural` picture that has none (yet): it has no proportions to keep. */
const PLACEHOLDER_ASPECT = "aspect-[4/3]";

/**
 * `full` is the parent's width; a size is a real width that a narrower parent still caps. It is
 * a width and not a `max-width`, so it holds inside a shrink-to-fit parent, where a placeholder
 * has no intrinsic size of its own to give it one.
 */
export const IMAGE_WIDTH: Record<ImageWidth, string> = {
  sm: "w-24 max-w-full",
  md: "w-40 max-w-full",
  lg: "w-64 max-w-full",
  xl: "w-112 max-w-full",
  full: "w-full",
};

/** Every image sits on the inset surface with a hairline, so a letterbox or a pale picture has an edge. */
const FRAME = "block rounded-lg border border-slate-200";
const INSET = "bg-slate-100";

/** The mats a picture can sit on, padded, with the whole picture shown. */
type Mat = "white" | "page";

/**
 * `white` is `bg-white/100`, the palette's media-matte role: a plain `bg-white` is the surface,
 * which a dark theme darkens, and a scanner needs the code on white. Every theme keeps this one
 * white, as it keeps the Lightbox scrim black. `page` is `bg-zinc-50`, the media-mat role, which
 * each theme paints as a ground a step below its page: white in a light theme, dark in a dark one.
 */
const MAT: Record<Mat, string> = {
  white: "bg-white/100 p-3",
  page: "bg-zinc-50 p-3",
};

const PICTURE =
  "M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5Zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-2.69l-2.22-2.22a.75.75 0 0 0-1.06 0l-1.91 1.91.47.47a.75.75 0 1 1-1.06 1.06L6.53 8.09a.75.75 0 0 0-1.06 0l-2.97 2.97ZM12 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z";

export type ImageProps = {
  /**
   * The picture, a local path or a data URL. It is never loaded for you: this is the app's own
   * image. Left out, or if it fails to load, the picture is replaced by a placeholder.
   */
  src?: string | undefined;
  /** What the picture shows. An empty string marks it as decoration, hidden from a screen reader. */
  alt: string;
  /**
   * The shape it is cropped to: `square`, `4:3`, `3:2`, `16:9`, or the portrait `3:4` and `9:16`.
   * `natural` keeps the picture's own proportions instead, so nothing is cropped or letterboxed;
   * the space is not reserved before it loads.
   * @default 4:3
   */
  aspect?: ImageAspect | undefined;
  /**
   * `cover` fills the shape and crops what overflows; `contain` shows the whole picture, with the
   * rest of the shape left empty (a QR code, a logo).
   * @default cover
   */
  fit?: "cover" | "contain" | undefined;
  /**
   * `sm` 96px, `md` 160px, `lg` 256px and `xl` 448px set the width, capped at the parent's; `full`
   * fills the parent.
   * @default full
   */
  width?: ImageWidth | undefined;
  /**
   * Where `fit="cover"` crops from: `center` keeps the middle of the picture, `top` keeps its top
   * edge, for a screenshot whose header is the part to see.
   * @default center
   */
  crop?: "center" | "top" | undefined;
  /**
   * Sets the picture on a padded mat and shows the whole of it, as `fit="contain"`, whatever `fit`
   * says. `white` is white in every theme, dark ones included, so a QR code, a barcode or a logo
   * reads off a dark page. `page` is a ground a step below the page in each theme, for a
   * screenshot. Left out, there is no mat.
   */
  mat?: "white" | "page" | undefined;
  /**
   * Makes the picture a link to its full size, opened in a new tab (`target="_blank"`,
   * `rel="noreferrer"`), named by `alt`.
   */
  href?: string | undefined;
  /**
   * Marks the picture that is the page's largest one in the first view (its LCP): it loads at once
   * with a high fetch priority. Every other picture loads lazily, when it nears the viewport.
   * @default false
   */
  priority?: boolean | undefined;
} & LoadingProps &
  Passthrough;

/** The fill and the fit of a picture: a `mat` is padded around all of it. */
function pictureLook({
  fit = "cover",
  crop = "center",
  mat,
}: {
  fit: "cover" | "contain" | undefined;
  crop: "center" | "top" | undefined;
  mat: Mat | undefined;
}): string {
  if (mat) return cx(MAT[mat], "object-contain");
  if (fit === "contain") return cx(INSET, "object-contain");
  return cx(INSET, "object-cover", crop === "top" && "object-top");
}

/** The shape a picture's stand-in reserves: its aspect, or 4:3 for a `natural` one. */
const reservedAspect = (aspect: ImageAspect): string =>
  aspect === "natural" ? PLACEHOLDER_ASPECT : ASPECT[aspect];

/** A picture not here yet: a bone of the shape and width it will take. */
function ImageBone({
  own,
  label,
  aspect,
  width,
  alt,
  attrs,
}: {
  own: boolean | undefined;
  label: string | undefined;
  /** Names the bone as the picture it stands for; an empty `alt` leaves it decoration. */
  alt: string;
  aspect: ImageAspect;
  width: ImageWidth;
  attrs: object;
}): ReactElement {
  return (
    <WaitingBone
      own={own}
      label={label}
      shape={cx("block w-full rounded-lg", reservedAspect(aspect))}
      root={cx("block", IMAGE_WIDTH[width])}
      attrs={alt ? { ...attrs, role: "img", "aria-label": alt } : attrs}
    />
  );
}

/**
 * A picture in a fixed shape: `aspect` reserves the space before it loads, so the page does not
 * jump, and `fit` crops it to the shape or shows all of it. The corners are rounded and the frame
 * has a hairline. If the picture is missing or fails to load, a same-sized placeholder with a
 * picture mark stands in, still named by `alt`. `mat` sets it on a padded mat: `white` for a code
 * or a logo, `page` for a screenshot. `href` links it to its full size in a new tab. It loads
 * lazily unless it is the `priority` picture. A user's photo is an `Avatar`; a clickable
 * thumbnail with a label is a `MediaTile`. While `loading` with no `src` yet it is a bone of the same
 * shape, not the placeholder, which means there is no picture.
 */
export function Image({
  src,
  alt,
  aspect = "4:3",
  fit,
  width = "full",
  crop,
  mat,
  href,
  priority,
  loading,
  loadingLabel,
  ...rest
}: ImageProps): ReactElement {
  const { ref, failed, markFailed } = useImageFailed(src);
  const waiting = useLoading(loading).loading;
  if (waiting && !src) {
    return (
      <ImageBone
        own={loading}
        label={loadingLabel}
        aspect={aspect}
        width={width}
        alt={alt}
        attrs={rest}
      />
    );
  }
  if (src && !failed) {
    const [onLink, onImg] = href === undefined ? [{}, rest] : splitLinkAttrs(rest);
    const picture = (
      <img
        {...onImg}
        ref={ref}
        src={src}
        alt={alt}
        {...nativeLoading(priority)}
        className={cx(
          FRAME,
          href === undefined ? IMAGE_WIDTH[width] : "w-full",
          ASPECT[aspect],
          pictureLook({ fit, crop, mat }),
        )}
        onError={markFailed}
      />
    );
    return linkedPicture(href, width, picture, onLink);
  }
  return <ImagePlaceholder alt={alt} aspect={aspect} width={width} attrs={rest} />;
}

/** How the browser fetches the `<img>`: lazily, or at once and first for the `priority` picture. */
function nativeLoading(priority = false): ImgHTMLAttributes<HTMLImageElement> {
  return priority
    ? { loading: "eager", decoding: "async", fetchPriority: "high" }
    : { loading: "lazy", decoding: "async" };
}

/** A linked picture's `id`, `data-*` and `aria-*`, which belong on the link (its root), and the rest, for the `<img>`. */
function splitLinkAttrs(attrs: object): [Record<string, unknown>, Record<string, unknown>] {
  const link: Record<string, unknown> = {};
  const img: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(attrs)) {
    const onLink = key === "id" || key.startsWith("data-") || key.startsWith("aria-");
    (onLink ? link : img)[key] = value;
  }
  return [link, img];
}

/** A picture with `href`: a link to its full size in a new tab, carrying the width and the focus ring. Without one, the picture alone. */
function linkedPicture(
  href: string | undefined,
  width: ImageWidth,
  picture: ReactElement,
  attrs: Record<string, unknown>,
): ReactElement {
  if (href === undefined) return picture;
  return renderLink({
    ...attrs,
    href,
    external: true,
    className: cx("block rounded-lg", IMAGE_WIDTH[width], focusRing),
    children: picture,
  });
}

/** A picture that is missing or broken: a same-sized box with a picture mark, still named by `alt`. */
function ImagePlaceholder({
  alt,
  aspect,
  width,
  attrs,
}: {
  alt: string;
  aspect: ImageAspect;
  width: ImageWidth;
  attrs: object;
}): ReactElement {
  return (
    <span
      {...attrs}
      {...(alt ? { role: "img", "aria-label": alt } : { "aria-hidden": true })}
      className={cx(
        FRAME,
        IMAGE_WIDTH[width],
        reservedAspect(aspect),
        INSET,
        "grid place-items-center text-slate-400",
      )}
    >
      <Icon size="lg">
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path d={PICTURE} />
        </svg>
      </Icon>
    </span>
  );
}
