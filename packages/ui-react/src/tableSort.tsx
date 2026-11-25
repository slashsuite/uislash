import { type ReactElement, type ReactNode, useContext } from "react";
import { cx, insetFocusRing } from "./cx.js";
import { TableContext } from "./tableColumns.js";
import type { CellAlign } from "./tableRow.js";

/** Where a sortable column stands: ARIA's own words. `none` is a column the table is not sorted by. */
export type TableSort = "ascending" | "descending" | "none";

/** The props of a sortable `TableHeaderCell`: the column's `sort` and what a click asks for. */
export type SortProps = {
  /**
   * Where this column stands: `ascending`, `descending`, or `none` when the table is sorted by
   * another column. The app sorts its rows and passes it back; one sorted column at a time.
   *
   * With `onSort` the title becomes a button that asks for the next direction. The table never
   * sorts, filters or pages.
   */
  sort: TableSort;
  /** Called with the next direction on a click: `none` goes to `ascending`, then each click flips it. */
  onSort: (next: "ascending" | "descending") => void;
};

/** The direction a click asks for: `ascending` first, then it flips. */
function nextSort(sort: TableSort): "ascending" | "descending" {
  return sort === "ascending" ? "descending" : "ascending";
}

const JUSTIFY: Record<CellAlign, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
};

/** The arrow beside a sortable title: up, down, or both, faint, on a column not sorted by. */
function SortArrow({ sort }: { sort: TableSort }): ReactElement {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className={cx("size-3 shrink-0", sort === "none" ? "text-slate-300" : "text-slate-600")}
      fill="currentColor"
    >
      {sort !== "descending" && <path d="M6 1.5 9 5H3z" />}
      {sort !== "ascending" && <path d="M6 10.5 3 7h6z" />}
    </svg>
  );
}

/**
 * A sortable column's title: a native button that fills the cell, padding and all, so the whole
 * cell is its target (never under 24px tall), named by the title. A click asks for the next
 * direction and has the table say the new sort aloud.
 */
export function SortButton({
  sort,
  onSort,
  align,
  pad,
  children,
}: SortProps & { align: CellAlign; pad: string; children: ReactNode }): ReactElement {
  const { announce } = useContext(TableContext);
  return (
    <button
      type="button"
      onClick={(event) => {
        const next = nextSort(sort);
        onSort(next);
        announce(event.currentTarget.textContent.trim(), next);
      }}
      className={cx(
        "flex min-h-6 w-full cursor-pointer items-center gap-1 uppercase tracking-wide hover:text-violet-700",
        pad,
        JUSTIFY[align],
        insetFocusRing,
      )}
    >
      {children}
      <SortArrow sort={sort} />
    </button>
  );
}
