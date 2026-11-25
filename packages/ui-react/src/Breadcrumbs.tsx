import { isValidElement, type ReactElement, type ReactNode } from "react";
import { cx, focusRing } from "./cx.js";
import { renderLink } from "./link.js";
import type { Passthrough } from "./props.js";

/** The classes of a crumb that links somewhere, for a router's own <Link>. */
export const crumbLinkClass = cx("rounded hover:underline", focusRing);

/**
 * A crumb that links: `href`, drawn by the app's router link through `LinkProvider` for an in-app
 * path, else a plain `<a>`. `external` opens in a new tab. The last crumb is the current page: given
 * an `href` it is a link to this page with `aria-current="page"`.
 */
export type Crumb = {
  label: ReactNode;
  href: string;
  external?: boolean;
};

function isCrumb(crumb: Crumb | ReactNode): crumb is Crumb {
  return typeof crumb === "object" && crumb !== null && !isValidElement(crumb) && "label" in crumb;
}

function CrumbContent({
  crumb,
  current,
}: {
  crumb: Crumb | ReactNode;
  current: boolean;
}): ReactNode {
  if (!isCrumb(crumb)) return crumb;
  return renderLink({
    href: crumb.href,
    external: crumb.external,
    className: crumbLinkClass,
    "aria-current": current ? "page" : undefined,
    children: crumb.label,
  });
}

/**
 * `org / project / build / snapshot`: the last crumb is the current page. A crumb is a node, or a
 * `Crumb` object when it links. A trail too long for its row wraps onto the next line; a long parent
 * truncates, and the current page is never cut: its words wrap instead.
 */
export function Breadcrumbs({
  items,
  label = "Breadcrumb",
  ...rest
}: {
  /** The trail, first to current: a node, or a `Crumb` (`{ label, href, external? }`) for one that links. The last is the current page; a `Crumb` there links to it with `aria-current="page"`. */
  items: Array<Crumb | ReactNode>;
  /**
   * The trail's accessible name, on its `<nav>`, for an app in another language.
   * @default Breadcrumb
   */
  label?: string | undefined;
} & Passthrough): ReactElement {
  const last = items.length - 1;
  return (
    <nav {...rest} aria-label={label} className="min-w-0">
      <ol className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        {items.map((crumb, index) => {
          const current = index === last;
          return (
            <li
              key={index}
              // A link crumb carries `aria-current` itself; a plain one marks its item.
              aria-current={current && !isCrumb(crumb) ? "page" : undefined}
              className="flex min-w-0 items-center gap-2"
            >
              {index > 0 && (
                <span aria-hidden="true" className="text-slate-400">
                  /
                </span>
              )}
              <span
                className={
                  current
                    ? "min-w-0 font-medium [overflow-wrap:anywhere] text-slate-900"
                    : "max-w-48 min-w-0 truncate text-slate-500"
                }
              >
                <CrumbContent crumb={crumb} current={current} />
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
