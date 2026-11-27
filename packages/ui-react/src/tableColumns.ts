import {
  Children,
  createContext,
  createElement,
  Fragment,
  isValidElement,
  type ReactNode,
  useContext,
} from "react";
import type { Size } from "./size.js";

/**
 * What a `Table` tells the rows and cells inside it: whether it sits in a card (plain), its row
 * density, and which columns its head declares numeric. Internal: not exported from the package.
 */
type TableSetting = {
  plain: boolean;
  /**
   * Whether the table was measured and fits its box. Only then does the box clip instead of
   * scroll, so only then can the head stick to the page: inside a box that scrolls sideways a
   * sticky head sticks to that box, pushed down over the rows by the app header's height.
   */
  fits: boolean;
  size: Size;
  numeric: readonly boolean[];
  /** How many columns the head declares, or `undefined` with no `TableHead`. */
  columns: number | undefined;
  /** Says a new sort aloud, through the table's status region: the column's title and its direction. */
  announce: (column: string, sort: "ascending" | "descending") => void;
  /** Whether the table stacks its rows into cards in a narrow box (`narrow="stack"`). */
  stack: boolean;
  /** Each column's visible title from the head, for a stacked cell's label; `undefined` for a column with none. */
  titles: readonly ReactNode[];
};

export const TableContext = createContext<TableSetting>({
  plain: false,
  fits: false,
  size: "sm",
  numeric: [],
  columns: undefined,
  announce: () => undefined,
  stack: false,
  titles: [],
});

/** The column a cell starts at, set by its `TableRow`. */
const ColumnContext = createContext<number | undefined>(undefined);

type CellProps = { children?: ReactNode; colSpan?: unknown; numeric?: unknown; label?: unknown };

/** The children as one flat list: arrays and fragments are opened, so a mapped or grouped list counts as its items. */
function flat(children: ReactNode): ReactNode[] {
  return Children.toArray(children).flatMap((child) =>
    isValidElement<CellProps>(child) && child.type === Fragment
      ? flat(child.props.children)
      : [child],
  );
}

/** How many columns an element takes: its `colSpan`, else one. */
function span(props: CellProps): number {
  return typeof props.colSpan === "number" && props.colSpan > 0 ? props.colSpan : 1;
}

/** The first child of the given component type. */
function first(children: ReactNode, type: unknown) {
  return flat(children).find((child) => isValidElement<CellProps>(child) && child.type === type);
}

/**
 * Which columns the head declares numeric, read from the element props of the table's first head
 * row (`head` and `row` are the `TableHead` and `TableRow` components). A head row drawn by an app's
 * own component is not seen; its body cells then say `numeric` themselves.
 */
export function numericColumns(children: ReactNode, head: unknown, row: unknown): boolean[] {
  return headCells(children, head, row).flatMap((cell) =>
    isValidElement<CellProps>(cell)
      ? Array.from({ length: span(cell.props) }, () => cell.props.numeric === true)
      : [],
  );
}

/** The cells of the table's first head row, read from their element props, or none. */
function headCells(children: ReactNode, head: unknown, row: unknown): ReactNode[] {
  const headElement = first(children, head);
  if (!isValidElement<CellProps>(headElement)) return [];
  const rowElement = first(headElement.props.children, row);
  if (!isValidElement<CellProps>(rowElement)) return [];
  return flat(rowElement.props.children);
}

/**
 * Each column's visible title, read from the first head row like `numericColumns`: the head cell's
 * children, or `undefined` for a column whose title is a hidden `label` (a row's actions) and for
 * the later columns a spanning title covers.
 */
export function columnTitles(children: ReactNode, head: unknown, row: unknown): ReactNode[] {
  return headCells(children, head, row).flatMap((cell) =>
    isValidElement<CellProps>(cell)
      ? Array.from({ length: span(cell.props) }, (_, i) =>
          i === 0 && cell.props.label === undefined ? cell.props.children : undefined,
        )
      : [],
  );
}

/**
 * How many columns the table has: the largest total of `colSpan`s (one each when unset) over the
 * rows of its `TableHead`, read through arrays and fragments. `undefined` when there is no head;
 * a head drawn by an app's own component is not seen either.
 */
export function columnCount(children: ReactNode, head: unknown, row: unknown): number | undefined {
  const headElement = first(children, head);
  if (!isValidElement<CellProps>(headElement)) return undefined;
  const totals = flat(headElement.props.children)
    .filter((child) => isValidElement<CellProps>(child) && child.type === row)
    .map((rowElement) =>
      isValidElement<CellProps>(rowElement)
        ? flat(rowElement.props.children).reduce<number>(
            (sum, cell) => sum + (isValidElement<CellProps>(cell) ? span(cell.props) : 0),
            0,
          )
        : 0,
    );
  return totals.length === 0 ? undefined : Math.max(...totals);
}

/** A row's cells, each told the column it starts at (counting `colSpan`). */
export function withColumns(children: ReactNode): ReactNode[] {
  let column = 0;
  return flat(children).map((child) => {
    if (!isValidElement<CellProps>(child)) return child;
    const at = column;
    column += span(child.props);
    return createElement(ColumnContext.Provider, { key: at, value: at }, child);
  });
}

/** Whether the head declared this cell's column numeric. */
export function useNumericColumn(): boolean {
  const at = useContext(ColumnContext);
  const { numeric } = useContext(TableContext);
  return at !== undefined && numeric[at] === true;
}

/**
 * A stacked cell's label: its column's title from the head. None for the first column (the card's
 * title), for a cell that spans columns, and outside a stacking table.
 */
export function useStackLabel(spans: boolean): ReactNode {
  const at = useContext(ColumnContext);
  const { stack, titles } = useContext(TableContext);
  if (!stack || spans || at === undefined || at === 0) return undefined;
  return titles[at];
}
