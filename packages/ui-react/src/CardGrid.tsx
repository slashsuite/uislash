import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { Card } from "./Card.js";
import { InRegions } from "./cardContext.js";
import { cx } from "./cx.js";
import { EmptySlot, hasNoChildren } from "./emptySlot.js";
import { useWait } from "./layoutWait.js";
import type { Passthrough } from "./props.js";
import { type LoadingProps, LoadingScope } from "./skeleton.js";

const COLUMNS = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
} as const;

/** `columns="auto"` fits as many cards per row as the width allows, none narrower than this. */
const AUTO_MIN_WIDTH = {
  sm: "grid-cols-[repeat(auto-fill,minmax(12rem,1fr))]",
  md: "grid-cols-[repeat(auto-fill,minmax(17rem,1fr))]",
} as const;

/** The same with `minColumns={2}`: a card narrows to half the row (less the `gap-4`) before the row drops to one. */
const AUTO_MIN_WIDTH_TWO = {
  sm: "grid-cols-[repeat(auto-fill,minmax(min(12rem,calc((100%_-_1rem)/2)),1fr))]",
  md: "grid-cols-[repeat(auto-fill,minmax(min(17rem,calc((100%_-_1rem)/2)),1fr))]",
} as const;

/** How the cards of a row meet: `regions` makes every cell a subgrid of three rows (header, body, footer). */
const ALIGN = {
  stretch: undefined,
  start: "items-start",
  regions: undefined,
} as const;

/** A list item's own layout: a grid, so its one card fills the item, or for `regions` a subgrid of the card's three rows. */
const ITEM = {
  stretch: "grid grid-cols-1",
  start: "grid grid-cols-1",
  regions: "row-span-3 grid grid-rows-subgrid",
} as const;

type CardGridProps = (
  | {
      /**
       * Cards per row from `lg` (one on a phone, two from `sm`), or `auto` for as many as fit.
       * @default 3
       */
      columns?: keyof typeof COLUMNS | undefined;
      /** With `columns="auto"`, the narrowest a card gets: `md` 17rem or `sm` 12rem. */
      minWidth?: undefined;
    }
  | {
      /**
       * Cards per row from `lg` (one on a phone, two from `sm`), or `auto` for as many as fit.
       * @default 3
       */
      columns: "auto";
      /**
       * With `columns="auto"`, the narrowest a card gets: `md` 17rem or `sm` 12rem.
       * @default md
       */
      minWidth?: keyof typeof AUTO_MIN_WIDTH | undefined;
    }
) & {
  /**
   * `start` keeps each card its own height; the default stretches every card to the tallest in its
   * row. `regions` stretches them too and lines up each card's header, body and footer with its
   * neighbours' across the row, so titles of different lengths do not push the bodies out of line.
   * @default stretch
   */
  align?: keyof typeof ALIGN | undefined;
  /**
   * The fewest cards in a row: `2` keeps two small tiles side by side on a phone (products in a
   * shop), where the default is one.
   * @default 1
   */
  minColumns?: 1 | 2 | undefined;
  /** `ul` makes the grid a list: each child is wrapped in an `<li>`. Default `div`. */
  as?: "div" | "ul" | undefined;
  /** Drawn in place of the grid when there are no children: an `EmptyState`. */
  empty?: ReactNode;
  children?: ReactNode;
} & LoadingProps &
  Passthrough;

function gridColumns(
  columns: keyof typeof COLUMNS | "auto",
  minWidth: keyof typeof AUTO_MIN_WIDTH,
  minColumns: 1 | 2,
): string {
  if (columns === "auto") return (minColumns === 2 ? AUTO_MIN_WIDTH_TWO : AUTO_MIN_WIDTH)[minWidth];
  return cx(minColumns === 2 ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2", COLUMNS[columns]);
}

/**
 * A responsive grid of tiles of one width: one column on a phone, two from `sm`, `columns` from `lg`.
 * A main area beside a narrower one is not a grid of tiles: it is `SideColumn` (`asideWidth="third"`
 * for two thirds and one). `columns="auto"` instead fits as many per row as the width allows, each at least `minWidth` wide:
 * `md` (17rem, the default) or `sm` (12rem). `align="start"` keeps each card its own height
 * instead of stretching it to the tallest in its row; `align="regions"` lines up each card's header,
 * body and footer across the row (CSS subgrid). `minColumns={2}` keeps two tiles to a row on a
 * phone. Every cell has `min-w-0`, so a truncating name inside a card cuts instead of widening its
 * column. A `CardGridRow` spans every column. `as="ul"` makes it a list of cards for a
 * screen reader: the grid is a `<ul>` and each child is wrapped in an `<li>`, still stretched.
 * With no children it draws `empty` (an `EmptyState`) in place of the grid. While `loading` with
 * none it draws one card of bones per column (three for `auto`), never `empty`.
 */
export function CardGrid({
  columns = 3,
  minWidth = "md",
  align = "stretch",
  minColumns = 1,
  as: Tag = "div",
  empty,
  children,
  loading,
  loadingLabel,
  ...rest
}: CardGridProps): ReactElement {
  const wait = useWait(loading, loadingLabel);
  const none = hasNoChildren(children);
  if (none && !wait.loading) {
    return <EmptySlot size="md">{empty}</EmptySlot>;
  }
  const cards = none ? gridBones(columns) : children;
  return (
    <LoadingScope loading={wait.loading}>
      <Tag
        {...rest}
        {...wait.attrs}
        {...(Tag === "ul" ? { role: "list" } : {})}
        className={cx(
          // A card title shrinks to its fixed-width cell and wraps there (its own break-words);
          // outside a grid it keeps its longest word's width, so a card sized by its content stays wide enough.
          "grid gap-4 *:min-w-0 [&_:is(h2,h3,h4,h5,h6)]:min-w-0",
          gridColumns(columns, minWidth, minColumns),
          ALIGN[align],
        )}
      >
        <InRegions value={align === "regions"}>
          <GridItems list={Tag === "ul"} item={ITEM[align]} owner={wait.owner} label={wait.label}>
            {cards}
          </GridItems>
        </InRegions>
      </Tag>
    </LoadingScope>
  );
}

/** A loading grid's cards when it has none yet: one card of bones per column, three for `auto`. */
function gridBones(columns: keyof typeof COLUMNS | "auto"): ReactElement[] {
  return Array.from({ length: columns === "auto" ? 3 : columns }, (_, i) => (
    <Card key={i}>{null}</Card>
  ));
}

/** The grid's cards, each in an `<li>` for a list, then the owner's hidden label (in an `<li>` too). */
function GridItems({
  list,
  item,
  owner,
  label,
  children,
}: {
  list: boolean;
  item: string;
  owner: boolean;
  label: ReactElement;
  children: ReactNode;
}): ReactElement {
  if (!list) {
    return (
      <>
        {children}
        {label}
      </>
    );
  }
  return (
    <>
      {Children.toArray(children).map((child, index) => {
        const row = isValidElement(child) && child.type === CardGridRow;
        return (
          // A grid, so the one child (a Card) fills the item's height as it does in a plain grid.
          <li key={isValidElement(child) ? child.key : index} className={row ? ROW : item}>
            {child}
          </li>
        );
      })}
      {owner && <li className="sr-only">{label}</li>}
    </>
  );
}

/** A row's span: every column, whatever the grid's count. */
const ROW = "col-span-full";

/**
 * One item that spans every column of a `CardGrid`: a heading over a group of cards, or one wide
 * card in the run (an announcement among products). In `as="ul"` its `<li>` spans the row. It takes
 * no `align="regions"` rows: what it holds keeps its own layout.
 */
export function CardGridRow({
  children,
  ...rest
}: { children: ReactNode } & Passthrough): ReactElement {
  return (
    <div {...rest} className={ROW}>
      <InRegions value={false}>{children}</InRegions>
    </div>
  );
}
