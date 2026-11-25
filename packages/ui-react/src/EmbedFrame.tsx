import type { ReactElement, ReactNode } from "react";
import { cx } from "./cx.js";
import type { Passthrough } from "./props.js";
import { Bone } from "./skeleton.js";

/** How tall the frame is: `sm` 18rem, `md` 24rem, or `viewport`, 55% of the small viewport. */
const HEIGHT: Record<"sm" | "md" | "viewport", string> = {
  sm: "h-72",
  md: "h-96",
  viewport: "h-[55svh]",
};

/**
 * A rounded, clipped frame with a hairline, at a fixed height, for a map or an `<iframe>`: the
 * embed in `children` fills it. `status` lays a centred overlay over the embed while it loads or
 * after it failed; the embed stays mounted under it, so it can finish loading. The frame is a
 * region named by `label`.
 */
export function EmbedFrame({
  label,
  height = "md",
  status = "ready",
  loadingLabel = "Loading",
  errorLabel = "Could not load.",
  children,
  ...rest
}: {
  /** Names the frame's region: what the embed shows, as "Map of the shops". */
  label: string;
  /**
   * `sm` 18rem, `md` 24rem, or `viewport`, 55% of the small viewport's height, for a map that is
   * the page's main content.
   * @default md
   */
  height?: "sm" | "md" | "viewport" | undefined;
  /**
   * `loading` lays a pulsing cover over the embed and marks the region busy; `error` lays
   * `errorLabel` over it, announced. Set it from the embed's own load and error events.
   * @default ready
   */
  status?: "ready" | "loading" | "error" | undefined;
  /**
   * What a screen reader hears while `status` is `loading`.
   * @default Loading
   */
  loadingLabel?: string | undefined;
  /**
   * The words over the embed when `status` is `error`: say what failed and what to do.
   * @default Could not load.
   */
  errorLabel?: string | undefined;
  /** The embed: an `<iframe>` or a map's container. It fills the frame. */
  children: ReactNode;
} & Passthrough): ReactElement {
  return (
    <section
      {...rest}
      aria-label={label}
      {...(status === "loading" ? { "aria-busy": true } : {})}
      className={cx(
        "relative isolate overflow-hidden rounded-lg border border-slate-200 bg-slate-100",
        HEIGHT[height],
      )}
    >
      <div
        {...(status === "ready" ? {} : { inert: true })}
        className="isolate size-full *:block *:size-full *:border-0"
      >
        {children}
      </div>
      {status === "loading" && (
        <div className="absolute inset-0 z-10">
          <Bone shape="block size-full" />
          <span className="sr-only">{loadingLabel}</span>
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-slate-100 p-4">
          <p role="alert" className="max-w-prose text-center text-sm text-slate-600">
            {errorLabel}
          </p>
        </div>
      )}
    </section>
  );
}
