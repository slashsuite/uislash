import type { AudioHTMLAttributes, ReactElement, ReactNode } from "react";
import type { Unstyled } from "./props.js";
import { LAZY_MEDIA } from "./Video.js";

/**
 * An `<audio>` with the browser's own controls, at one fixed size: 20rem wide, narrower only when its column is. It loads
 * metadata only, and lazily where the browser can, so the page does not pull the file until it is
 * played. A voice note or a clip has no visible title, so `label` names the player. `src` is the
 * app's own file; `children` is the fallback for a browser that cannot play it.
 */
export function Audio({
  src,
  label,
  children,
  ...rest
}: {
  /** The audio file, the app's own. */
  src: string;
  /** Names the player for a screen reader, as "Voice note from Anna": audio has no visible title. */
  label: string;
  /** The text for a browser that cannot play it. */
  children?: ReactNode;
} & Unstyled<
  Omit<AudioHTMLAttributes<HTMLAudioElement>, "src" | "controls" | "children">
>): ReactElement {
  return (
    <audio
      controls
      preload="metadata"
      {...LAZY_MEDIA}
      src={src}
      {...rest}
      aria-label={label}
      className="block h-10 w-xs max-w-full"
    >
      {children}
    </audio>
  );
}
