import type { DropTarget, Key } from "react-aria-components";

// Where a pointer drops in a `SortableList`, and the move a drop makes.

/** A move the user made: which item, the section it lands in, and the item it lands next to. */
export type SortableMove = {
  /** The `id` of the item that moved. */
  id: string;
  /** The `id` of the `SortableSection` the item lands in. Set whenever the list has sections. */
  section?: string;
  /**
   * The item it was dropped before or after. Absent only for a drop into an empty section, where
   * there is no item to land next to.
   */
  target?: { id: string; position: "before" | "after" };
};

/** A marker on every row a pointer can drop next to: the items and each section's tail row. */
export const ROW_MARK = "data-sortable-row";

/**
 * The key of a section's tail row. Every section ends with one: in an empty section it is the "Drop
 * here" row, in one with items it is an empty row of no height. A drop before it is a drop at the
 * end of the section. react-aria's keyboard drop moves cannot step from "after the last item" of a
 * section into the next one (it wraps to the top), but they do step from "before" a row to "before"
 * the next row across sections, so with a tail row the end of each section is a "before" target.
 */
export function tailKey(section: string): string {
  return `hackcove-sortable-end:${section}`;
}

/** A row's section and title; a tail row also lists its section's items, in order. */
export type Place = { section?: string; title: string; tail?: string[] };

/**
 * Where a pointer drops: before or after the row it is over, by which half it is in. Over a section
 * heading, or in a gap, it is before the next row below (the first item of that section, or its
 * "Drop here" row), and below every row it is after the last. Never "on" a row.
 */
function dropTargetAt(list: HTMLElement | null, y: number): DropTarget | null {
  if (!list) return null;
  const top = y + list.getBoundingClientRect().top;
  const rows = [...list.querySelectorAll<HTMLElement>(`[${ROW_MARK}]`)];
  for (const row of rows) {
    const key = row.dataset.key;
    if (key == null) continue;
    const box = row.getBoundingClientRect();
    if (top < box.top) return { type: "item", key, dropPosition: "before" };
    if (top <= box.bottom) {
      return {
        type: "item",
        key,
        dropPosition: top < box.top + box.height / 2 ? "before" : "after",
      };
    }
  }
  const last = rows.at(-1)?.dataset.key;
  return last == null ? null : { type: "item", key: last, dropPosition: "after" };
}

/** react-aria's pointer drop delegate, aware of sections (the stock one sees only top-level items). */
export function sectionDelegate(listId: string) {
  return {
    getDropTargetFromPoint: (_x: number, y: number) =>
      dropTargetAt(document.getElementById(listId), y),
  };
}

/** Only a drop between two rows is a move; a drop on a row's centre, or on the list itself, is not. */
export function dropOperation(target: DropTarget): "move" | "cancel" {
  return target.type === "item" && target.dropPosition !== "on" ? "move" : "cancel";
}

/**
 * The move react-aria reported, as the app's `SortableMove`, or nothing when it is not one (a drop
 * on a row's centre, or next to the item itself). A drop at a section's tail lands after the
 * section's last other item, or with no target when it has none.
 */
export function moveOf(
  places: Map<string, Place>,
  keys: Iterable<Key>,
  target: DropTarget,
): SortableMove | null {
  const [key] = keys;
  if (key == null || target.type !== "item" || target.dropPosition === "on") return null;
  const place = places.get(String(target.key));
  if (!place) return null;
  const id = String(key);
  if (String(target.key) === id) return null;
  const section = place.section === undefined ? {} : { section: place.section };
  if (place.tail) {
    const last = place.tail.filter((item) => item !== id).at(-1);
    return last === undefined
      ? { id, ...section }
      : { id, ...section, target: { id: last, position: "after" } };
  }
  return {
    id,
    ...section,
    target: { id: String(target.key), position: target.dropPosition },
  };
}
