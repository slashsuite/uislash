import { useCallback, useContext, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { useInCard } from "./cardContext.js";
import { cx } from "./cx.js";
import { DensityProvider } from "./density.js";
import type { Size } from "./size.js";
import { hasNoChildren } from "./emptySlot.js";
import { scrollStopProps, useScrollStop } from "./scrollStop.js";
import {
  columnCount,
  columnTitles,
  numericColumns,
  TableContext,
  withColumns,
} from "./tableColumns.js";
import {
  type Rest,
  type RowMark,
  rowClass,
  SectionContext,
  SELECTED,
  BODY_LINE,
  PAD,
  STACK,
  stackRole,
} from "./tableRow.js";
export { TableCell, TableHeaderCell, type CellTone } from "./TableCells.js";
export { TableExpandCell } from "./TableExpandCell.js";
export type { TableSort } from "./tableSort.js";
import { BoneRows, EmptyRow } from "./tableEmpty.js";
import { BusyLabel, busy, type LoadingProps, LoadingScope, useLoading } from "./skeleton.js";

/**
 * A list of records in a rounded, bordered card. Compose it
 * from `TableHead`, `TableBody`, `TableFoot`, `TableRow`, `TableHeaderCell` and `TableCell`. `label`
 * names the table for assistive tech and is not drawn. Inside a `Card` it is plain: no card of its
 * own (border, fill and shadow), no tinted head strip and no row hover, only the row dividers. A
 * column of figures says so once, with `numeric` on its `TableHeaderCell`: its cells then take end
 * alignment and tabular figures. `size` is the row padding, and the buttons and pills in the rows follow it
 * (`sm` by default); a field keeps its own `size`. Other props (`id`, `data-*`, `aria-*`) go on the `<table>`. While `loading`, a
 * body with no rows draws five rows of bones, one per column, and an empty cell draws a bone; the
 * table keeps its role and its name. A table that fits its box keeps its head row in view (under
 * the `AppShell` header) while the page scrolls past its rows; one wider than its box scrolls
 * sideways instead, and takes a tab stop when nothing in it can take focus. `narrow="stack"` draws
 * each row as a card on a screen narrower than `sm` (a phone), the cells as lines labelled by their column's
 * title. A click on a sortable title has the table say the new sort aloud, in `sortedLabel`'s words.
 */
export function Table({
  label,
  size = "sm",
  narrow = "scroll",
  sortedLabel = englishSorted,
  loading,
  loadingLabel,
  children,
  ...rest
}: {
  /** Names the table for assistive tech; it is not drawn. */
  label: string;
  /**
   * The row padding; the buttons and fields in the rows take the same size.
   * @default sm
   */
  size?: Size | undefined;
  /**
   * What the table does on a screen narrower than `sm` (a phone): `scroll` sideways, or `stack` each row into
   * a card, the first cell its title and every other cell a line labelled by its column's title.
   * Stack a table whose rows a person reads one at a time; keep `scroll` for one they compare
   * down a column.
   * @default scroll
   */
  narrow?: "scroll" | "stack" | undefined;
  /**
   * What a screen reader hears after a click on a sortable title, from the column's title and the
   * new direction.
   * @default `Sorted by Name, ascending`
   */
  sortedLabel?: ((column: string, sort: "ascending" | "descending") => string) | undefined;
  children: ReactNode;
} & LoadingProps &
  Rest<"table">): ReactElement {
  const plain = useInCard();
  const { loading: waiting, owner } = useLoading(loading);
  const numeric = numericColumns(children, TableHead, TableRow);
  const columns = columnCount(children, TableHead, TableRow);
  const stack = narrow === "stack";
  const titles = stack ? columnTitles(children, TableHead, TableRow) : [];
  const [said, setSaid] = useState("");
  const announce = useCallback(
    (column: string, sort: "ascending" | "descending") => setSaid(sortedLabel(column, sort)),
    [sortedLabel],
  );
  const { attach, stop, measured, overflows } = useScrollStop("x", tableWider);
  const { props: stopProps, ring } = scrollStopProps(stop, { label });
  // Until measured (a page rendered on the server) and while too wide, the box scrolls sideways.
  // Once it fits, it clips instead: a clipping box is no scroll container, so the head can stick.
  const fits = measured && !overflows;
  return (
    <TableContext.Provider value={{ plain, fits, size, numeric, columns, announce, stack, titles }}>
      <DensityProvider size={size}>
        <div
          ref={attach}
          {...stopProps}
          className={cx(
            fits ? "overflow-clip" : "overflow-x-auto",
            ring,
            !plain && "rounded-xl border border-slate-200/70 bg-white shadow-sm",
          )}
        >
          <table
            {...rest}
            {...stackRole(stack, "table")}
            {...busy(owner, waiting)}
            className={cx("w-full text-left text-sm", stack && STACK.table)}
          >
            <caption className="sr-only">{label}</caption>
            <LoadingScope loading={waiting}>{children}</LoadingScope>
          </table>
          <BusyLabel owner={owner} loading={waiting} label={loadingLabel} />
          <div role="status" className="sr-only">
            {said}
          </div>
        </div>
      </DensityProvider>
    </TableContext.Provider>
  );
}

/** The default `sortedLabel`. */
function englishSorted(column: string, sort: "ascending" | "descending"): string {
  return `Sorted by ${column}, ${sort}`;
}

/** Whether the table is wider than its box: measured from the table, since a clipping box does not scroll. */
function tableWider(box: HTMLElement): boolean {
  const table = box.querySelector(":scope > table");
  return table instanceof HTMLElement && table.offsetWidth > box.clientWidth;
}

/**
 * The `<thead>`: small uppercase column titles, on a tinted strip unless the table is in a card.
 * Holds one `TableRow` of `TableHeaderCell`s. Unless the table is in a card, it stays in view under
 * the `AppShell` header while the page scrolls past the rows, once the table is measured and fits
 * its box; before that, and while the table is wider than its box, it stays at the top of the table.
 */
export function TableHead({
  children,
  ...rest
}: { children: ReactNode } & Rest<"thead">): ReactElement {
  const { plain, fits, stack } = useContext(TableContext);
  return (
    <thead
      {...rest}
      {...stackRole(stack, "rowgroup")}
      className={cx(
        "text-sm uppercase tracking-wide text-slate-500",
        !plain && "bg-slate-50",
        !plain && fits && "sticky top-[var(--app-header,0px)] z-1",
        stack && STACK.head,
      )}
    >
      <SectionContext.Provider value="head">{children}</SectionContext.Provider>
    </thead>
  );
}

/**
 * The `<tbody>`: the rows, each with a line above it and, unless the table is in a card, a fill on
 * hover. With no rows it draws `empty` (an `EmptyState`, one muted line here) in one cell that spans
 * every column the head declares; the head stays drawn, so the reader sees what the table holds.
 * In a loading `Table` a body with no rows draws five rows of bones instead, never `empty`.
 */
export function TableBody({
  empty,
  children,
  ...rest
}: {
  /** Shown in one full-width cell when there are no rows: an `EmptyState`. */
  empty?: ReactNode;
  children?: ReactNode;
} & Rest<"tbody">): ReactElement {
  const waiting = useLoading(undefined).loading;
  const { stack } = useContext(TableContext);
  return (
    <tbody
      {...rest}
      {...stackRole(stack, "rowgroup")}
      className={stack ? STACK.section : undefined}
    >
      <SectionContext.Provider value="body">
        <BodyRows waiting={waiting} empty={empty}>
          {children}
        </BodyRows>
      </SectionContext.Provider>
    </tbody>
  );
}

/** What a body holds: its rows; with none, bones while loading (loading beats empty), else `empty`. */
function BodyRows({
  waiting,
  empty,
  children,
}: {
  waiting: boolean;
  empty: ReactNode;
  children: ReactNode;
}): ReactNode {
  if (!hasNoChildren(children)) return children;
  if (waiting) return <BoneRows />;
  return empty != null && <EmptyRow>{empty}</EmptyRow>;
}

/**
 * The `<tfoot>`: totals and subtotals. Its cells are strong by default and each row has a firmer
 * line above it, alone and in a card alike. Put it after `TableBody`; a row of it takes
 * no `tone`.
 */
export function TableFoot({
  children,
  ...rest
}: { children: ReactNode } & Rest<"tfoot">): ReactElement {
  const { stack } = useContext(TableContext);
  return (
    <tfoot
      {...rest}
      {...stackRole(stack, "rowgroup")}
      className={stack ? STACK.section : undefined}
    >
      <SectionContext.Provider value="foot">{children}</SectionContext.Provider>
    </tfoot>
  );
}

/**
 * A `<tr>`, `relative`: the anchor a `TextLink stretch` (with `href`) stretches to. Any other link, button or
 * control in the row (a `TextLink`, a `Button`, a `Checkbox`) sits above that link and is clickable
 * on its own, with no class from the caller. Use it in the head and the
 * body. In the body it also draws the line above the row and, unless the table is in a card, the hover
 * fill. `selected` marks the current row (the one open beside the table, the one being edited): the
 * `ListRow` selected fill and `aria-current`, the row whose detail is open, not a multi-select; it wins over `tone` and `stripe`. `tone` marks the row's status (see `RowTone`): a stripe on the leading edge and a soft fill,
 * or `muted` to fade it. A toned row keeps its fill on hover (the status stays readable), so a
 * linked row's link, not a hover fill, says it is clickable. `stripe` is the stripe alone, in the
 * `TextTone` colours (the first five names of a `StackedBar` segment's `VizTone`), with no fill: the row keeps its hover
 * and its own look. Give `tone` or `stripe`, not both. Body rows only; colour alone does not say it,
 * so name the status in a cell too (a `Pill`). A bold subtotal is not a tone: a total of the whole
 * table is a `TableFoot` row, and a subtotal among the body's rows is `emphasis`, the same look.
 */
export function TableRow({
  tone,
  stripe,
  emphasis = false,
  selected = false,
  children,
  ...rest
}: RowMark & {
  /**
   * The row in view (its detail open beside the table): the selected fill and `aria-current`. Body
   * rows only.
   *
   * As on a `ListRow`, it is not a multi-select, and a selected row takes no `tone`.
   */
  selected?: boolean | undefined;
  children: ReactNode;
} & Rest<"tr">): ReactElement {
  const outer = useContext(SectionContext);
  const { plain, stack } = useContext(TableContext);
  const section = emphasis && outer === "body" ? "foot" : outer;
  const current = selected && section === "body";
  return (
    <SectionContext.Provider value={section}>
      <tr
        {...rest}
        {...stackRole(stack, "row")}
        {...(current ? { "aria-current": true } : {})}
        className={cx(
          current ? cx(BODY_LINE, SELECTED) : rowClass(section, plain, tone, stripe),
          stack && STACK.row,
        )}
      >
        {withColumns(children)}
      </tr>
    </SectionContext.Provider>
  );
}

/**
 * A full-width group header in the body: a tinted row with a `label` that spans every column the
 * head declares (or `colSpan` columns), and optional `trailing` text at the far end: the group's
 * count or subtotal, muted. The group's rows follow it. The row is a `<th>`, a heading for the
 * group, so an action on the group goes in its rows or above the table, not here. For a panel of other content across the
 * whole row, use a `TableCell span="full"` instead.
 */
export function TableGroupRow({
  label,
  trailing,
  colSpan,
  ...rest
}: {
  /** The group's name, at the start of the row. */
  label: ReactNode;
  /** The group's count or subtotal, muted at the far end of the row. */
  trailing?: ReactNode;
  /**
   * How many columns the header spans.
   * @default every column the `TableHead` declares
   */
  colSpan?: number | undefined;
} & Rest<"tr">): ReactElement {
  const { size, columns, stack } = useContext(TableContext);
  return (
    <tr
      {...rest}
      {...stackRole(stack, "row")}
      className={cx("relative border-t border-slate-200/70 bg-slate-50", stack && STACK.section)}
    >
      <th
        scope="rowgroup"
        {...stackRole(stack, "rowheader")}
        colSpan={colSpan ?? columns}
        className={cx(PAD[size].group, "text-left text-sm", stack && STACK.section)}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium text-slate-900">{label}</span>
          {trailing != null && trailing !== false && (
            <span className="shrink-0 font-normal text-slate-500">{trailing}</span>
          )}
        </div>
      </th>
    </tr>
  );
}
