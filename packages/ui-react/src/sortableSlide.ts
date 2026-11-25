import { useEffect, useLayoutEffect, useRef } from "react";

// How a `SortableList` row slides to its new place after a move.

/** How long a row takes to slide to its new place after a move. */
const SLIDE = { duration: 200, easing: "ease-out" } as const;

/** Where the rows are: their keys in order, and each row's top from the top of the list. */
type Places = { order: string; tops: Map<string, number> };

/** The rows' keys in order, read without measuring anything. */
function orderOf(list: HTMLElement, mark: string): string {
  return [...list.querySelectorAll<HTMLElement>(`[${mark}][data-key]`)]
    .map((row) => row.dataset.key ?? "")
    .join("\n");
}

function places(list: HTMLElement, mark: string): Places {
  const top = list.getBoundingClientRect().top;
  const tops = new Map<string, number>();
  for (const row of list.querySelectorAll<HTMLElement>(`[${mark}][data-key]`)) {
    const key = row.dataset.key ?? "";
    tops.set(key, row.getBoundingClientRect().top - top);
  }
  return { order: [...tops.keys()].join("\n"), tops };
}

/** Whether rows may slide: only where the Web Animations API is, and not under `prefers-reduced-motion`. */
function maySlide(list: HTMLElement): boolean {
  if (typeof list.animate !== "function") return false;
  return !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/** Slides each row that moved from where it was (`before`) to where it is (`after`). */
function slide(list: HTMLElement, mark: string, before: Places, after: Places): void {
  for (const row of list.querySelectorAll<HTMLElement>(`[${mark}][data-key]`)) {
    const key = row.dataset.key ?? "";
    const was = before.tops.get(key);
    const now = after.tops.get(key);
    if (was === undefined || now === undefined || was === now) continue;
    row.animate([{ translate: `0 ${was - now}px` }, { translate: "0 0" }], SLIDE);
  }
}

/**
 * After the app applies a move, every row (an element carrying `mark`) that changed place slides
 * from where it was to where it is (a FLIP step through the Web Animations API), so the eye can
 * follow the move. The list records where its rows are each time the app renders it; react-aria
 * then puts the rows in their new order in a later commit, and an observer slides them before the
 * next paint. Only a change of order slides anything (a drop indicator coming and going does not),
 * and nothing slides under `prefers-reduced-motion` or on a first render.
 */
export function useSlide(listId: string, mark: string): void {
  const last = useRef<Places | null>(null);
  // Each render of the list: where the rows are before its new order lands.
  useLayoutEffect(() => {
    const list = document.getElementById(listId);
    if (list) last.current = places(list, mark);
  });
  useEffect(() => {
    const list = document.getElementById(listId);
    if (!list || typeof MutationObserver !== "function") return undefined;
    const observer = new MutationObserver(() => {
      const before = last.current;
      // A drop indicator coming and going changes no order: leave it without measuring a row.
      if (before?.order === orderOf(list, mark)) return;
      const after = places(list, mark);
      last.current = after;
      if (before && maySlide(list)) slide(list, mark, before, after);
    });
    observer.observe(list, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [listId, mark]);
}
