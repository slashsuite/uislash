import type { MouseEventHandler, ReactElement, ReactNode } from "react";
import { cx, insetFocusRing } from "./cx.js";
import { renderLink } from "./link.js";
import type { Passthrough } from "./props.js";

/** The action: a small surface pill on the accent strip, its focus ring drawn inside it so it shows on the fill. */
const ACTION = cx(
  "inline-flex shrink-0 items-center rounded-md bg-white px-3 py-1 text-sm font-medium text-violet-700 hover:bg-violet-50",
  insetFocusRing,
);

export type PromoBannerProps = {
  /** The offer, one short line: "Refills from R390 this week". */
  children: ReactNode;
  /** The action's words: "Shop refills". */
  action: string;
} & Passthrough &
  (
    | {
        /** Where the action goes; an in-app path goes through `LinkProvider`. */
        href: string;
        onClick?: undefined;
      }
    | {
        href?: undefined;
        /** The action as a button instead of a link: it opens a dialog, say. */
        onClick: MouseEventHandler<HTMLButtonElement>;
      }
  );

/**
 * A slim full-width strip that carries one offer and one action: "Refills from R390 this week",
 * then "Shop refills". It is the theme's accent fill with its label colour, and the action is a
 * small surface pill on it, so both hold AA contrast in every theme. Put it above the `AppShell`'s
 * header or as the first block of the page; one per page. The words wrap and stay centred on a
 * phone. With `href` the action is a link (an in-app path goes through `LinkProvider`), with
 * `onClick` a button.
 */
export function PromoBanner({
  children,
  action,
  href,
  onClick,
  ...rest
}: PromoBannerProps): ReactElement {
  return (
    <div
      {...rest}
      className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 bg-violet-600 px-4 py-2 text-center text-sm text-violet-50"
    >
      <p>{children}</p>
      {href !== undefined ? (
        renderLink({ href, external: false, className: ACTION, children: action })
      ) : (
        <button type="button" onClick={onClick} className={cx(ACTION, "cursor-pointer")}>
          {action}
        </button>
      )}
    </div>
  );
}
