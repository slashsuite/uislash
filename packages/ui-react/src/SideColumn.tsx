import type { ReactElement, ReactNode } from "react";
import { cx } from "./cx.js";
import { FoldedColumn } from "./foldedColumn.js";
import type { Passthrough } from "./props.js";
import { useScrollEdges } from "./scrollEdges.js";
import { scrollStopProps, useScrollStop } from "./scrollStop.js";
import { STICKY_ASIDE_LG, STICKY_FADE_LG, STICKY_SCROLL_LG } from "./stickyColumn.js";

/** How wide a `SideColumn`'s aside is from `lg`: `xs` 12rem, `sm` 18rem, `md` 24rem, or `third` a third of the row. */
export type SideColumnWidth = "xs" | "sm" | "md" | "third";

/** Which side of the main area a `SideColumn`'s aside sits on from `lg`: `end` (the right) or `start` (the left). */
export type SideColumnSide = "end" | "start";

/**
 * The grid from `lg`, and the main area's share of it, for each side: `xs`, `sm` and `md` give the
 * aside exactly that width and the main area the room left; `third` gives the aside one third and
 * the main area two.
 */
const COLUMNS: Record<SideColumnSide, Record<SideColumnWidth, { grid: string; main: string }>> = {
  end: {
    xs: { grid: "lg:grid-cols-[minmax(0,1fr)_12rem]", main: "" },
    sm: { grid: "lg:grid-cols-[minmax(0,1fr)_18rem]", main: "" },
    md: { grid: "lg:grid-cols-[minmax(0,1fr)_24rem]", main: "" },
    third: { grid: "lg:grid-cols-3", main: "lg:col-span-2" },
  },
  start: {
    xs: { grid: "lg:grid-cols-[12rem_minmax(0,1fr)]", main: "" },
    sm: { grid: "lg:grid-cols-[18rem_minmax(0,1fr)]", main: "" },
    md: { grid: "lg:grid-cols-[24rem_minmax(0,1fr)]", main: "" },
    third: { grid: "lg:grid-cols-3", main: "lg:col-span-2" },
  },
};

/**
 * A main area beside a side column, in the Container the page already has: from `lg` the `aside`
 * is `asideWidth` on the right and `children` take the room left; below `lg` the aside stacks under
 * `children`. It sets no page width, padding or header of its own, so it sits inside a layout, a
 * `Card` or a panel. `asideWidth` is `xs` (12rem), `sm` (18rem), `md` (24rem) or `third` (one
 * third of the row, the main area two thirds: the split `DetailLayout` draws). A rail of links on
 * the left is `SidebarLayout`.
 *
 * `side="start"` puts the aside on the left from `lg`, and first in reading order, so below `lg`
 * it stacks above `children`.
 *
 * `asideLabel` names the `<aside>` landmark. `fold` is for an aside that should not take the
 * phone's screen: below `lg` it folds, closed, behind a native disclosure named by `asideLabel`,
 * and from `lg` it is the same column, always shown. The aside stays mounted while folded, so a
 * conversation or a draft inside it is kept.
 *
 * `sticky` keeps the aside in view from `lg` as a long page scrolls: it sticks under AppShell's
 * header and, if it is taller than the room left, scrolls itself (a tab stop named by `asideLabel`)
 * so its end stays reachable.
 */
export function SideColumn({
  asideLabel,
  fold = false,
  ...props
}: {
  /** The side column: `asideWidth` wide on `side` from `lg`, stacked with `children` below it. */
  aside: ReactNode;
  /**
   * The aside's width from `lg`: `xs` 12rem, `sm` 18rem, `md` 24rem, or `third`, one third of the row.
   * @default md
   */
  asideWidth?: SideColumnWidth | undefined;
  /**
   * The aside's side from `lg`: `end` (the right) or `start` (the left, and first in reading order).
   * @default end
   */
  side?: SideColumnSide | undefined;
  /**
   * From `lg`, keeps the aside in view under the header as the page scrolls; an aside taller than
   * the screen scrolls inside itself.
   * @default false
   */
  sticky?: boolean | undefined;
  children: ReactNode;
} & SideColumnFold &
  Passthrough): ReactElement {
  return <SplitColumns {...props} label={asideLabel} fold={fold} />;
}

/**
 * A `SideColumn`'s name and fold: `asideLabel` names the `<aside>` landmark, and `fold` folds the
 * aside below `lg` behind a disclosure of that name, so `fold` needs `asideLabel`.
 */
type SideColumnFold =
  | {
      /** Names the `<aside>` landmark, and the disclosure when `fold` is set. Left out, the aside is unnamed. */
      asideLabel?: string | undefined;
      /**
       * Folds the aside, closed, behind a disclosure named by `asideLabel` below `lg`.
       * @default false
       */
      fold?: false | undefined;
    }
  | {
      asideLabel: string;
      fold: true;
    };

/** The aside's content: folded behind a disclosure below `lg` when `fold` and a label are set. */
function AsideContent({
  aside,
  label,
  fold,
}: {
  aside: ReactNode;
  label: string | undefined;
  fold: boolean;
}): ReactNode {
  if (!fold || label === undefined) return aside;
  return (
    <FoldedColumn from="lg" label={label}>
      {aside}
    </FoldedColumn>
  );
}

/** The `<aside>`: when `sticky`, it stays under the header from `lg` and scrolls itself, with a scroll stop when it overflows. */
function Aside({
  label,
  sticky,
  children,
}: {
  label: string | undefined;
  sticky: boolean;
  children: ReactNode;
}): ReactElement {
  const { element, attach, stop } = useScrollStop();
  useScrollEdges(element, "y");
  const { props, ring } = scrollStopProps(sticky && stop, { label });
  return (
    <aside className={cx("min-w-0", sticky && STICKY_ASIDE_LG)} aria-label={label}>
      <div
        ref={sticky ? attach : undefined}
        {...props}
        className={sticky ? cx(STICKY_SCROLL_LG, STICKY_FADE_LG, ring) : undefined}
      >
        {children}
      </div>
    </aside>
  );
}

/**
 * The one two-column split: `SideColumn`, and `DetailLayout`'s columns, whose `asideLabel` names
 * the aside without folding it. Internal.
 */
export function SplitColumns({
  aside,
  asideWidth = "md",
  side = "end",
  label,
  fold,
  sticky = false,
  children,
  ...rest
}: {
  aside: ReactNode;
  asideWidth?: SideColumnWidth | undefined;
  side?: SideColumnSide | undefined;
  label: string | undefined;
  fold: boolean;
  sticky?: boolean | undefined;
  children: ReactNode;
} & Passthrough): ReactElement {
  const columns = COLUMNS[side][asideWidth];
  const main = <div className={cx("min-w-0", columns.main)}>{children}</div>;
  const column = (
    <Aside label={label} sticky={sticky}>
      <AsideContent aside={aside} label={label} fold={fold} />
    </Aside>
  );
  return (
    <div {...rest} className={cx("grid grid-cols-1 gap-6", columns.grid)}>
      {side === "start" ? column : null}
      {main}
      {side === "end" ? column : null}
    </div>
  );
}
