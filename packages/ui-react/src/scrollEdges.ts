import { useEffect } from "react";

/**
 * Observes each child of `box` that draws a box. A ResizeObserver never fires for a
 * `display: contents` element (it has no box), so such a child is looked through and its own
 * children are observed instead, down any depth. A hidden child is skipped.
 */
export function observeItems(observer: ResizeObserver, box: Element): void {
  for (const child of box.children) {
    const display = getComputedStyle(child).display;
    if (display === "none") continue;
    if (display === "contents") observeItems(observer, child);
    else observer.observe(child);
  }
}

/**
 * Marks a box that scrolls with which of its edges still has content past it, so the layout can fade
 * them: `data-more-start` (scrolled away from the start), `data-more-end` (more to scroll to) and
 * `data-more` for either. `axis` is the way it scrolls: `x` (a row) or `y` (a column). A box that
 * fits carries none. The attributes only carry state; a class turns them into a `mask-image`, so the
 * fade follows any theme. `element` is the box once it is mounted (null before, and then nothing
 * happens).
 *
 * The effect runs after every render on purpose: the box's children may have changed, and each one
 * needs observing so a change in its size is noticed.
 */
export function useScrollEdges(element: HTMLElement | null, axis: "x" | "y"): void {
  useEffect(() => {
    if (!element) return undefined;
    const el = element;
    const update = () => {
      const [position, scrollSize, clientSize] =
        axis === "x"
          ? // Right to left, scrollLeft runs from 0 at the start to negative at the end.
            [Math.abs(el.scrollLeft), el.scrollWidth, el.clientWidth]
          : [el.scrollTop, el.scrollHeight, el.clientHeight];
      const start = position > 1;
      const end = scrollSize - clientSize - position > 1;
      el.toggleAttribute("data-more-start", start);
      el.toggleAttribute("data-more-end", end);
      el.toggleAttribute("data-more", start || end);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    // jsdom (a consumer's own tests) has no ResizeObserver.
    const resize = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(update);
    if (resize) {
      resize.observe(el);
      observeItems(resize, el);
    }
    return () => {
      el.removeEventListener("scroll", update);
      resize?.disconnect();
    };
  });
}
