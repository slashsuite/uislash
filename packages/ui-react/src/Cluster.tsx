import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { cx } from "./cx.js";
import type { Passthrough } from "./props.js";
import { STACK_GAP, type StackGap } from "./Stack.js";

/** The first three steps of `Stack`'s scale: `xs` between items in a line, `sm` inside a group, `md` between blocks. */
export type ClusterGap = Extract<StackGap, "xs" | "sm" | "md">;
/** Where a `Cluster`'s items sit across the row: `center`, `baseline` for mixed text sizes, `start` or `end`. */
export type ClusterAlign = "center" | "baseline" | "start" | "end";
/** Where a `Cluster`'s items sit along the row: `start`, `center`, `end`, or `between` to spread them to both ends. */
export type ClusterJustify = "start" | "center" | "between" | "end";

const ALIGN: Record<ClusterAlign, string> = {
  center: "items-center",
  baseline: "items-baseline",
  start: "items-start",
  end: "items-end",
};

const JUSTIFY: Record<ClusterJustify, string> = {
  start: "justify-start",
  center: "justify-center",
  between: "justify-between",
  end: "justify-end",
};

/** A Cluster that is a `ul`, `ol` or `nav` is a list: its role, and each child in its own `<li>`. */
function listOf(tag: string, children: ReactNode): { role?: "list"; items: ReactNode } {
  if (tag !== "ul" && tag !== "ol" && tag !== "nav") return { items: children };
  const items = Children.toArray(children).map((child, index) => (
    <li key={isValidElement(child) ? child.key : index} className="flex">
      {child}
    </li>
  ));
  return { role: "list", items };
}

/**
 * A horizontal row of items a fixed `gap` apart (`sm` by default): the row counterpart of `Stack`. `align` is the
 * cross axis (`center` default, `baseline` for mixed text sizes, `start`, `end`) and `justify` the
 * main one (`start` default, `between` to push the first and last items to the two ends, `end`).
 * The items flow onto further lines when the row runs out of room; `wrap={false}` keeps them on one
 * line.
 *
 * Put one `ClusterGrow` around the item that takes the room left over, an input beside its
 * buttons, say. An empty `ClusterGrow` is a spacer that pushes what follows it to the end.
 * `ButtonGroup` is the row for buttons; use `Cluster` for any other row. `as="span"` is for a row
 * inside phrasing content, such as a `PageHeader` description (a `<p>`): its items must be phrasing
 * content too, so no `ClusterGrow`. `as="ul"` or `as="ol"` is a wrapping list with no markers
 * (tags, chips), as in `CardGrid`: the Cluster wraps each child in its own `<li>`, so the caller
 * writes the items (`Pill`s) and never an `<li>`. `as="nav"` is a row of links (a footer's or a
 * section's): a `<nav>` named by its required `aria-label`, holding a list with each link in its
 * own `<li>`.
 */
export function Cluster({
  as = "div",
  gap = "sm",
  align = "center",
  justify = "start",
  wrap = true,
  children,
  ...rest
}: ClusterElement & {
  /**
   * The space between items: the first steps of the gap scale. Its default is one of those the
   * `Size` type lists as not `md`.
   * @default sm
   */
  gap?: ClusterGap | undefined;
  /**
   * The cross axis: `center`, `baseline` (for mixed text sizes), `start` or `end`.
   * @default center
   */
  align?: ClusterAlign | undefined;
  /**
   * The main axis: `start`, `center`, `between` (the first and last items at the two ends) or `end`.
   * @default start
   */
  justify?: ClusterJustify | undefined;
  /**
   * Let the items flow onto further lines when the row runs out of room. `false` keeps them on one line.
   * @default true
   */
  wrap?: boolean | undefined;
  children?: ReactNode;
} & Passthrough): ReactElement {
  const { role, items } = listOf(as, children);
  const className = cx(
    "flex",
    role && "list-none",
    STACK_GAP[gap],
    ALIGN[align],
    JUSTIFY[justify],
    wrap && "flex-wrap",
  );
  if (as === "nav") {
    return (
      <nav {...rest}>
        {/* `list-none` drops the list role in Safari; the role puts it back. */}
        <ul role="list" className={className}>
          {items}
        </ul>
      </nav>
    );
  }
  const Tag = as;
  return (
    // `list-none` drops the list role in Safari; the role puts it back.
    <Tag role={role} {...rest} className={className}>
      {items}
    </Tag>
  );
}

/** A `Cluster`'s element, and the name a `nav` needs. */
type ClusterElement =
  | {
      /**
       * The element: `div`, `span` for a row inside a `<p>` or other phrasing content, `ul` or `ol`
       * for a list (no markers; the Cluster wraps each child in an `<li>`), or `nav` for a row of
       * links (a `<nav>` named by `aria-label`, around such a list).
       *
       * In a `span` the items must be phrasing content, so no `ClusterGrow`.
       * @default div
       */
      as?: "div" | "span" | "ul" | "ol" | undefined;
      /** The accessible name; required with `as="nav"`, where it names the landmark, such as "Footer". */
      "aria-label"?: string | undefined;
    }
  | {
      as: "nav";
      /** The accessible name; required with `as="nav"`, where it names the landmark, such as "Footer". */
      "aria-label": string;
    };

/** The narrowest a `ClusterGrow` gets before the row wraps: `sm` or `md`. */
export type ClusterGrowMinWidth = "sm" | "md";

/** The narrowest a `ClusterGrow` gets before it wraps under, the same two steps as `CardGrid`'s `minWidth`. */
const GROW_MIN_WIDTH: Record<ClusterGrowMinWidth, string> = {
  sm: "min-w-0 flex-[1_1_12rem]",
  md: "min-w-0 flex-[1_1_17rem]",
};

/**
 * The one child of a `Cluster` (or of a `Stack` with `rowFrom`) that grows to the room left in the
 * row. By default it can shrink to nothing (`min-w-0`), so the items beside it stay on the line and
 * a long value truncates instead of pushing them out. With `minWidth` it instead keeps that width
 * (`sm` 12rem, `md` 17rem) and, in a `Cluster` with `wrap`, drops onto the next line when the room
 * left is narrower, rather than being squashed. Empty, it is a spacer.
 */
export function ClusterGrow({
  minWidth,
  children,
  ...rest
}: {
  /** The narrowest it gets: `sm` 12rem or `md` 17rem. In a `Cluster` with `wrap` it wraps under the other items below this width. Left out, it shrinks to nothing. */
  minWidth?: ClusterGrowMinWidth | undefined;
  children?: ReactNode;
} & Passthrough): ReactElement {
  return (
    <div {...rest} className={minWidth ? GROW_MIN_WIDTH[minWidth] : "min-w-0 flex-1"}>
      {children}
    </div>
  );
}
