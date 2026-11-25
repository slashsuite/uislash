import { Children, type ReactElement, type ReactNode, useContext } from "react";
import { cx } from "./cx.js";
import type { Size } from "./size.js";
import { TableContext, useNumericColumn, useStackLabel } from "./tableColumns.js";
import {
  ALIGN,
  type CellAlign,
  PAD,
  type Rest,
  SectionContext,
  STACK,
  stackRole,
} from "./tableRow.js";
import { SortButton, type SortProps } from "./tableSort.js";
import { Bone, BusyLabel, busy, isEmptySlot, type LoadingProps, useLoading } from "./skeleton.js";
import { CELL_BONE } from "./tableEmpty.js";
import type { Tone } from "./tone.js";
import { TEXT_TONE } from "./typography.js";

/* The head and body cells of a `Table`, exported from `Table.tsx`. */

/**
 * The text of a cell: its weight and colour. `neutral` (the default), `strong` and `muted` are the
 * plain ones; the rest are the shared tones, for an amount that carries a meaning (a gain, an
 * overspend). Colour alone does not say it, so a signed figure or a word says it too.
 */
export type CellTone = "strong" | "muted" | Tone;

const TONE: Record<CellTone, string> = {
  strong: "font-medium text-slate-900",
  neutral: "text-slate-700",
  ...TEXT_TONE,
};

/** A plain column title, or the hidden `label` of a column with none. */
function HeadTitle({ label, children }: { label: string | undefined; children: ReactNode }) {
  return label === undefined ? children : <span className="sr-only">{label}</span>;
}

/**
 * A header cell. In the `TableHead` it is a column title, `<th scope="col">`. `numeric` declares a
 * column of figures, once: the title and every cell under it take end alignment and tabular figures.
 * A column with nothing to show in its head (a row's actions) takes `label` instead of `children`:
 * the name a screen reader hears ("Actions"), visually hidden so the head keeps its column. `sort`
 * and `onSort` make the column sortable: the title becomes a button that fills the cell and asks for
 * the next direction, the column says where it stands with `aria-sort`, and the table says the new
 * sort aloud. The app sorts its rows; the table never does. In a body or foot row it is the row's
 * header, `<th scope="row">`: the cell that names the row (a name, a date), drawn like a `strong`
 * cell, so a screen reader reads it before each of the row's values.
 */
export function TableHeaderCell({
  numeric = false,
  align = numeric ? "end" : "start",
  children,
  label,
  sort,
  onSort,
  ...rest
}: {
  /** A column of figures: this title and the cells under it are end aligned, the cells in tabular figures. */
  numeric?: boolean | undefined;
  /**
   * The title's horizontal alignment; `end` over a column of buttons, `center` over a centred column.
   * @default end for a numeric column, else start
   */
  align?: CellAlign | undefined;
} & (
  | { children?: ReactNode; label?: undefined }
  | {
      children?: undefined;
      /** The column's name for a screen reader, visually hidden, for a column with no visible title (a row's actions). */
      label: string;
    }
) &
  (
    | { sort?: undefined; onSort?: undefined }
    | (SortProps & { children: ReactNode; label?: undefined })
  ) &
  Rest<"th", "align" | "scope" | "aria-sort">): ReactElement {
  const { size, stack } = useContext(TableContext);
  const section = useContext(SectionContext);
  const inHead = section !== "body" && section !== "foot";
  const sortable = inHead && sort !== undefined && onSort !== undefined;
  if (!inHead) {
    return (
      <RowHeader {...rest} align={align} label={label}>
        {children}
      </RowHeader>
    );
  }
  return (
    <th
      {...rest}
      scope="col"
      {...stackRole(stack, "columnheader")}
      {...ariaSort(sort)}
      className={cx("whitespace-nowrap font-medium", !sortable && PAD[size].head, ALIGN[align])}
    >
      {sortable ? (
        <SortButton sort={sort} onSort={onSort} align={align} pad={PAD[size].head}>
          {children}
        </SortButton>
      ) : (
        <HeadTitle label={label}>{children}</HeadTitle>
      )}
    </th>
  );
}

/** A sorted column's `aria-sort`; a column sorted by another one says nothing. */
function ariaSort(sort: SortProps["sort"] | undefined): {
  "aria-sort"?: "ascending" | "descending";
} {
  return sort === "ascending" || sort === "descending" ? { "aria-sort": sort } : {};
}

/** A body or foot row's header cell, `<th scope="row">`, drawn like a `strong` cell. */
function RowHeader({
  align,
  label,
  children,
  ...rest
}: {
  align: CellAlign;
  label: string | undefined;
  children: ReactNode;
} & Rest<"th", "align" | "scope" | "aria-sort">): ReactElement {
  const { size, stack } = useContext(TableContext);
  const stackLabel = useStackLabel(false);
  return (
    <th
      {...rest}
      scope="row"
      {...stackRole(stack, "rowheader")}
      className={cx(
        PAD[size].cell,
        ALIGN[align],
        TONE.strong,
        figureClass(false, false, isProse(children)),
        stackClass(stack, stackLabel),
      )}
    >
      <Stacked label={stackLabel}>
        <HeadTitle label={label}>{children}</HeadTitle>
      </Stacked>
    </th>
  );
}

/** A stacking table's cell: a labelled line, or a block when it has no column title. */
function stackClass(stack: boolean, label: ReactNode): string | false {
  return stack && (label === undefined ? STACK.block : STACK.cell);
}

/** Whether a cell spans more than one column (it then takes no column title when stacked). */
function spansColumns(span: "full" | undefined, colSpan: number | undefined): boolean {
  return span === "full" || (colSpan !== undefined && colSpan > 1);
}

/**
 * The wrapping rule, one for every cell: prose (plain text and nothing else) wraps, down to
 * `min-w-48`; everything else stays on one line at its content's width: a figure, a code, and a cell
 * that holds an element (a link, a `Pill`, a `Switch`, a `Button`). So a column of short controls is
 * only as wide as they are, and a link's words never break one per line on a phone: the table
 * scrolls instead.
 */
function figureClass(numeric: boolean, mono: boolean, prose: boolean): string {
  if (!numeric && !mono) return prose ? "min-w-48" : "whitespace-nowrap";
  return cx("whitespace-nowrap", numeric && "tabular-nums", mono && "font-mono text-xs");
}

/** The widest a `lines={1}` cell grows. */
const TRUNCATE_WIDTH = "max-w-xs";

/** Where a `lines={1}` cell's capped box sits, so it follows the cell's alignment. */
const TRUNCATE_ALIGN: Record<CellAlign, string | undefined> = {
  start: undefined,
  center: "mx-auto",
  end: "ml-auto",
};

/** A step of a hierarchy under a row: the cell's own start padding plus 1rem a level. */
type Indent = 1 | 2 | 3;

const INDENT: Record<Size, Record<Indent, string>> = {
  sm: { 1: "pl-8", 2: "pl-12", 3: "pl-16" },
  md: { 1: "pl-9", 2: "pl-13", 3: "pl-17" },
  lg: { 1: "pl-10", 2: "pl-14", 3: "pl-18" },
};

/**
 * A `<td>`. `tone` is the text weight and colour (see `CellTone`; in a `TableFoot` it defaults to
 * `strong`); `numeric` sets end alignment and tabular figures (a cell under a `numeric` head cell is
 * numeric already), `mono` a small mono face. `secondary` is a second,
 * muted line under the content. One rule for wrapping: prose (a cell of plain text) wraps onto more
 * lines (never narrower than `min-w-48`, so it scrolls the table before it becomes a sliver); any
 * other cell stays on one line at its content's width: one that holds a control or a link, and a
 * `numeric` or `mono` cell (a figure, a code, a type). `lines={1}` caps a long value's width, cuts it with
 * an ellipsis on one line and puts the full text in a `title`; the content is then plain text (strings and
 * numbers), since that is what the title shows. `colSpan` passes through: a cell that
 * spans the row is a full-width panel (a note under a group), and `align="center"` centres it. A
 * table with no rows takes `TableBody empty`, not a cell built by hand. `span="full"` spans every
 * column the head declares, so a panel under a row needs no count. `indent` sets a start-aligned cell in by 1 to 3 levels, for a line under a parent row.
 * While `loading` an empty cell draws one bone, the width of a short value.
 */
export function TableCell({
  span,
  colSpan,
  align,
  tone,
  numeric,
  mono = false,
  lines,
  indent,
  secondary,
  loading,
  loadingLabel,
  children,
  ...rest
}: {
  /**
   * The cell's horizontal alignment; `center` for a full-width note.
   * @default end for a numeric cell, else start
   */
  align?: CellAlign | undefined;
  /** Sets the cell in by this many levels (1 to 3), for a line under a parent row. Start-aligned cells only. */
  indent?: Indent | undefined;
  /** The text weight and colour (see `CellTone`). In a `TableFoot` it defaults to `strong`. */
  tone?: CellTone | undefined;
  /**
   * A figure: end aligned, tabular figures, and the cell never wraps.
   * @default the column's, from a `numeric` head cell
   */
  numeric?: boolean | undefined;
  /** A small monospace face for a code or a type, and the cell never wraps. */
  mono?: boolean | undefined;
  /**
   * `1` caps the width and cuts a long value with an ellipsis on one line, the full text in a
   * `title`, as `lines={1}` does on `Text`. Plain text content only.
   *
   * Without it, a prose cell wraps down to a floor so it never becomes a sliver, and any other cell
   * (a `Pill`, a `Switch`, a `Button`, a `TextLink`, a `numeric` or `mono` value) stays on one line
   * at its content's width.
   */
  lines?: 1 | undefined;
  /** A second, muted line under the content. */
  secondary?: ReactNode;
  children?: ReactNode;
} & (
  | {
      span?: undefined;
      /** How many columns the cell spans; `span="full"` spans them all without a count. */
      colSpan?: number | undefined;
    }
  | {
      /** `full` spans every column the head declares: a panel under a row, an open row's detail. */
      span: "full";
      colSpan?: undefined;
    }
) &
  LoadingProps &
  Rest<"td", "align" | "colSpan">): ReactElement {
  const { loading: waiting, owner } = useLoading(loading);
  const bone = waiting && isEmptySlot(children);
  const foot = useContext(SectionContext) === "foot";
  const { size, columns, stack } = useContext(TableContext);
  const stackLabel = useStackLabel(spansColumns(span, colSpan));
  const column = useNumericColumn();
  const figure = numeric ?? column;
  const side = align ?? (figure ? "end" : "start");
  return (
    <td
      {...rest}
      {...stackRole(stack, "cell")}
      {...busy(owner, waiting)}
      colSpan={span === "full" ? columns : colSpan}
      className={cx(
        cellClass({
          align: side,
          size,
          indent,
          tone,
          foot,
          numeric: figure,
          mono,
          prose: isProse(children),
        }),
        stackClass(stack, stackLabel),
      )}
    >
      <Stacked label={stackLabel}>
        <CellBody align={side} truncate={lines === 1} secondary={secondary}>
          {bone ? <Bone shape={CELL_BONE} /> : children}
        </CellBody>
      </Stacked>
      <BusyLabel owner={owner} loading={waiting} label={loadingLabel} />
    </td>
  );
}

/** The classes of a cell: the tone (`strong` by default in a foot, and a foot's cells are medium whatever the tone), then the wrapping rule. */
function cellClass({
  align,
  size,
  indent,
  tone,
  foot,
  numeric,
  mono,
  prose,
}: {
  align: CellAlign;
  size: Size;
  indent: Indent | undefined;
  tone: CellTone | undefined;
  foot: boolean;
  numeric: boolean;
  mono: boolean;
  prose: boolean;
}): string {
  const resolved = tone ?? (foot ? "strong" : "neutral");
  return cx(
    PAD[size].cell,
    align === "start" && indent !== undefined && INDENT[size][indent],
    ALIGN[align],
    TONE[resolved],
    foot && resolved !== "strong" && "font-medium",
    figureClass(numeric, mono, prose),
  );
}

/**
 * A cell's content in a stacking table: its column's title (hidden from assistive tech, which has
 * the head) at the start of the line, shown only while stacked, and the value at the end. Outside
 * a stacking table, or with no title, the content as it is.
 */
function Stacked({ label, children }: { label: ReactNode; children: ReactNode }): ReactNode {
  if (label === undefined || label === null) return children;
  return (
    <>
      <span aria-hidden="true" className={STACK.label}>
        {label}
      </span>
      <div className={STACK.value}>{children}</div>
    </>
  );
}

const isText = (node: unknown): node is string | number =>
  typeof node === "string" || typeof node === "number";

/** Prose: at least one part, every one text. An empty cell (a bone) is not prose and keeps no width. */
function isProse(children: ReactNode): boolean {
  const parts = Children.toArray(children);
  return parts.length > 0 && parts.every(isText);
}

/** What a cell holds: the content, cut to one line with its full text in a `title` when `truncate`, then the `secondary` line. */
function CellBody({
  align,
  truncate,
  secondary,
  children,
}: {
  align: CellAlign;
  truncate: boolean;
  secondary: ReactNode;
  children: ReactNode;
}): ReactElement {
  const parts = Children.toArray(children);
  const text = parts.every(isText) ? parts.join("") : undefined;
  return (
    <>
      {truncate ? (
        <div className={cx(TRUNCATE_WIDTH, "truncate", TRUNCATE_ALIGN[align])} title={text}>
          {children}
        </div>
      ) : (
        children
      )}
      {secondary != null && secondary !== false && (
        <div className="text-xs font-normal text-slate-500">{secondary}</div>
      )}
    </>
  );
}
