import {
  type JSX,
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useId,
  useMemo,
  useRef,
} from "react";
import {
  Button,
  DropIndicator,
  GridList,
  GridListHeader,
  GridListItem,
  GridListSection,
  useDragAndDrop,
} from "react-aria-components";
import {
  dropOperation,
  moveOf,
  type Place,
  ROW_MARK,
  type SortableMove,
  sectionDelegate,
  tailKey,
} from "./sortableDrop.js";
import { useSlide } from "./sortableSlide.js";
import { cx, focusRing } from "./cx.js";
import { dataAttributes } from "./link.js";
import type { Passthrough } from "./props.js";

export type { SortableMove };

/** The list's box: the Card's border, fill and shadow, clipped to its radius. */
const FRAME =
  "w-full overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-sm outline-none";

/**
 * A hairline above every row that follows another row (an item, a heading, a drop line), so the
 * first row of the list sits flush under the frame's own border. The line's colour is set apart.
 */
const AFTER_ROW = "border-slate-200/70 [[role=row]+&]:border-t";

/** A section after another section gets the same hairline above its heading. */
const AFTER_SECTION = "border-slate-200/70 [[role=rowgroup]+&]:border-t";

const HEADING =
  "flex items-center justify-between gap-3 bg-slate-50 px-4 py-2 text-xs font-medium tracking-wide text-slate-600 uppercase";

const ITEM =
  "flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-900 outline-none hover:bg-slate-50";

/** The keyboard cursor: the focus ring, drawn inside the row. */
const ITEM_FOCUSED = "outline-2 -outline-offset-2 outline-violet-600";

/** An empty section's "Drop here" row. */
const PLACEHOLDER = "px-4 py-3 text-sm text-slate-500 outline-none";

/** The tail row of a section with items: takes no room and shows nothing but the drop line. */
const TAIL = "h-0 overflow-hidden outline-none";

/** The handle a pointer drags a row by (the grip and the box over it): only a press that starts on it starts a drag. */
const GRIP_MARK = "data-sortable-grip";

/** What a part takes through to its element: `id`, `data-*` and `aria-*`, as every component does. */
type Through = Passthrough;

/**
 * react-aria drops an `aria-describedby` or `aria-details` it is handed on a row or a section, and
 * sets its own describedby on a row. This draws the element with both: its own ids and the app's.
 */
function describedBy(
  { "aria-describedby": described, "aria-details": details, id: _own, ...through }: Through,
  id?: string,
) {
  // react-aria passes `data-*` on; every other `aria-*` goes on the element it draws.
  const aria = Object.fromEntries(
    Object.entries(through).filter(([key]) => key.startsWith("aria-")),
  );
  return {
    ...dataAttributes(through),
    render: (props: JSX.IntrinsicElements["div"]) => (
      <div
        {...props}
        {...aria}
        id={id ?? props.id}
        aria-describedby={
          [props["aria-describedby"], described].filter(Boolean).join(" ") || undefined
        }
        aria-details={details ?? props["aria-details"]}
      />
    ),
  };
}

/** The `SortableItem` children of a section, the ones its count counts. */
function itemsOf(children: ReactNode): ReactElement<SortableItemProps>[] {
  return Children.toArray(children).filter(
    (child): child is ReactElement<SortableItemProps> =>
      isValidElement(child) && child.type === SortableItem,
  );
}

/** Every row's key mapped to its section (and, for a tail row, the section's items), read from the children. */
function placesOf(children: ReactNode): Map<string, Place> {
  const places = new Map<string, Place>();
  for (const child of Children.toArray(children)) {
    if (isValidElement<SortableItemProps>(child) && child.type === SortableItem) {
      const { id, title } = child.props;
      places.set(id, { title });
    } else if (isValidElement<SortableSectionProps>(child) && child.type === SortableSection) {
      const { id: section, children: items } = child.props;
      const own = itemsOf(items);
      for (const item of own) places.set(item.props.id, { section, title: item.props.title });
      places.set(tailKey(section), { section, title: "", tail: own.map((item) => item.props.id) });
    }
  }
  return places;
}

/**
 * A list the user puts in order: items under section headings, moved by dragging a row or from the
 * keyboard (each row's grip handle, Enter, the arrow keys, Enter to drop, Escape to cancel). A drop
 * reports `onReorder` with the item, the section it lands in and the item it lands next to; the app
 * applies it to its own data. The list never reorders itself: it shows what its children say.
 *
 * Its children are `SortableSection`s, or `SortableItem`s directly for a list with no sections, each
 * a direct child (map your data straight to them). Moving an item into another section is how the
 * app changes its group, such as a ticket's priority. Two lists on one page never take each other's
 * items.
 */
export function SortableList({
  label,
  onReorder,
  children,
  ...rest
}: {
  /** The list's accessible name, read by a screen reader. */
  label: string;
  /** Called once per drop with the move; apply it to your data. */
  onReorder: (move: SortableMove) => void;
  /** `SortableSection`s, or `SortableItem`s for a list with no sections. */
  children: ReactNode;
} & Through): ReactElement {
  const ownId = useId();
  const { id, ...through } = rest;
  const listId = id ?? ownId;
  const dragType = `application/x-hackcove-sortable-${useId()
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase()}`;
  const places = placesOf(children);
  const delegate = useMemo(() => sectionDelegate(listId), [listId]);
  useSlide(listId, ROW_MARK);
  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) =>
      [...keys].map((key) => ({
        "text/plain": places.get(String(key))?.title ?? String(key),
        [dragType]: String(key),
      })),
    acceptedDragTypes: [dragType],
    getDropOperation: dropOperation,
    dropTargetDelegate: delegate,
    onMove: (e) => {
      const move = moveOf(places, e.keys, e.target);
      if (move) onReorder(move);
    },
    renderDropIndicator: (target) => (
      <DropIndicator target={target} className="relative h-0 outline-none">
        {({ isDropTarget }) => (
          <span
            aria-hidden="true"
            className={cx(
              "absolute inset-x-0 -top-px z-10 block h-0.5",
              isDropTarget && "bg-violet-600",
            )}
          />
        )}
      </DropIndicator>
    ),
  });
  return (
    <GridList
      {...describedBy(through, listId)}
      id={listId}
      aria-label={label}
      dragAndDropHooks={dragAndDropHooks}
      disabledBehavior="all"
      className={FRAME}
    >
      {children}
    </GridList>
  );
}

type SortableSectionProps = {
  /** The section's id, reported as `section` in a move that lands in it. */
  id: string;
  /** The heading over its items. */
  title: string;
  /** Its `SortableItem`s, each a direct child. With none it shows a quiet `emptyLabel` row. */
  children?: ReactNode;
  /**
   * The quiet row an empty section shows, where a drop lands.
   * @default Drop here
   */
  emptyLabel?: string | undefined;
  /**
   * The word before `title` in the name of the section's last drop place, which a screen reader
   * announces while a move lands there: "End of Doing".
   * @default End of
   */
  endLabel?: string | undefined;
};

/**
 * One group of a `SortableList` under a heading that shows its title and how many items it holds.
 * An empty section still takes a drop: it shows a quiet "Drop here" row in place of items.
 */
export function SortableSection({
  id,
  title,
  children,
  emptyLabel = "Drop here",
  endLabel = "End of",
  ...rest
}: SortableSectionProps & Through): ReactElement {
  const count = itemsOf(children).length;
  return (
    <GridListSection
      {...describedBy(rest)}
      // Sections and items share react-aria's key space; this keeps a section id from colliding with an item's.
      id={`hackcove-sortable-section:${id}`}
      aria-label={title}
      className={AFTER_SECTION}
    >
      <GridListHeader className={HEADING}>
        <span>{title}</span>
        <span className="tabular-nums text-slate-500">{count}</span>
      </GridListHeader>
      {children}
      <GridListItem
        id={tailKey(id)}
        textValue={count > 0 ? `${endLabel} ${title}` : emptyLabel}
        isDisabled
        {...{ [ROW_MARK]: "" }}
        className={count > 0 ? TAIL : cx(PLACEHOLDER, AFTER_ROW)}
      >
        {/* react-aria wants a drag slot in every row; this one is never shown or used. */}
        <Button slot="drag" className="hidden" />
        {count === 0 && emptyLabel}
      </GridListItem>
    </GridListSection>
  );
}

type SortableItemProps = {
  /** The item's id, reported in a move. */
  id: string;
  /** Its one line; also what a screen reader announces while it is dragged. */
  title: string;
  /** A meta line under the title: `Pill`s, an `Avatar`. */
  children?: ReactNode;
  /**
   * The word before `title` in the handle's accessible name: "Reorder Write the brief".
   * @default Reorder
   */
  reorderLabel?: string | undefined;
};

/** The six-dot grip on each row's handle. */
const GRIP = (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="h-4 w-4">
    <circle cx="6" cy="4" r="1.25" />
    <circle cx="10" cy="4" r="1.25" />
    <circle cx="6" cy="8" r="1.25" />
    <circle cx="10" cy="8" r="1.25" />
    <circle cx="6" cy="12" r="1.25" />
    <circle cx="10" cy="12" r="1.25" />
  </svg>
);

/**
 * One row of a `SortableList`: a grip handle, the title, and an optional meta line under it. A
 * pointer drags the row by its handle only (a drag that starts anywhere else on the row is no
 * drag); the handle (`reorderLabel` and the title, "Reorder <title>") is also how a keyboard or
 * screen reader starts a move.
 */
export function SortableItem({
  id,
  title,
  children,
  reorderLabel = "Reorder",
  ...rest
}: SortableItemProps & Through): ReactElement {
  const { render, ...data } = describedBy(rest);
  // Where the last press on the row started: a native drag starts from the row, so only this says whether it began on the handle.
  const onGrip = useRef(false);
  return (
    <GridListItem
      {...data}
      render={(props) =>
        render({
          ...props,
          onPointerDownCapture: (event) => {
            onGrip.current =
              event.target instanceof Element && event.target.closest(`[${GRIP_MARK}]`) !== null;
            props.onPointerDownCapture?.(event);
          },
          onDragStartCapture: (event) => {
            if (!onGrip.current) {
              event.preventDefault();
              event.stopPropagation();
              return;
            }
            props.onDragStartCapture?.(event);
          },
        })
      }
      id={id}
      textValue={title}
      {...{ [ROW_MARK]: "" }}
      className={({ isFocusVisible, isDragging }) =>
        cx(ITEM, AFTER_ROW, isFocusVisible && ITEM_FOCUSED, isDragging && "opacity-50")
      }
    >
      <span {...{ [GRIP_MARK]: "" }} className="relative flex shrink-0">
        <Button
          slot="drag"
          aria-label={`${reorderLabel} ${title}`}
          className={cx("rounded p-0.5 text-slate-400", focusRing)}
        >
          {GRIP}
        </Button>
        {/* react-aria leaves its drag button to the keyboard (no pointer events), so this takes the press and shows the grab cursor. */}
        <span aria-hidden="true" className="absolute inset-0 cursor-grab" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate">{title}</div>
        {children != null && (
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            {children}
          </div>
        )}
      </div>
    </GridListItem>
  );
}
