import {
  type ReactElement,
  type ReactNode,
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import type { Passthrough } from "./props.js";

// Keeps letters and digits and writes every other character, `-` and `_` included, as
// `_<hex code point>_`, so two different pairs never give one name and no character can end the
// attribute selector or the rule.
const enc = (value: string): string =>
  Array.from(value, (ch) =>
    /[A-Za-z0-9]/.test(ch) ? ch : `_${(ch.codePointAt(0) ?? 0).toString(16)}_`,
  ).join("");

const morphName = (name: string, item: string | number): string =>
  `hc-morph-${enc(name)}-${enc(String(item))}`;

// As in PageFade: the one place the View Transitions pseudo-elements can be styled is a stylesheet.
// The browser's own group animation moves and resizes the box and cross-fades its content; this
// names the element and gives the group and both images the library's one morph timing, 450 ms on
// an ease that starts quick and settles gently (the browser's default 250 ms is too quick to see),
// so the cross-fade lasts as long as the move. Under reduced motion the later rule switches the
// animations off so it swaps. No colour in it. Where the API is missing the rules are never matched.
// The name applies only while the element carries `data-morph-near` (within a screen of the
// viewport): a named element is captured whole before a transition, so naming every card of a long
// list makes the browser (WebKit worst) capture pixels nobody sees.
const css = (n: string): string =>
  `[data-morph="${n}"][data-morph-near]{view-transition-name:${n}}
::view-transition-group(${n}),::view-transition-old(${n}),::view-transition-new(${n}){animation-duration:450ms;animation-timing-function:cubic-bezier(0.2,0,0,1)}
@media (prefers-reduced-motion:reduce){::view-transition-group(${n}),::view-transition-old(${n}),::view-transition-new(${n}){animation:none}}`;

// Every mounted Morph's re-measure, for refreshMorphs. A Morph registers only where it measures at
// all (in the browser, with an IntersectionObserver), so on the server or without one the set is
// empty and refreshMorphs does nothing.
const remeasures = new Set<() => void>();

// How many mounted, active Morphs carry each transition name, so a second one with the same name
// and item warns in development: the browser skips a morph whose name appears twice on a page.
const mounted = new Map<string, number>();

/** Whether this is a development build. Bundlers replace `process.env.NODE_ENV`; with no `process` at all, it is not. */
declare const process: { env: { NODE_ENV?: string } };
function isDev(): boolean {
  try {
    return process.env.NODE_ENV !== "production";
  } catch {
    return false;
  }
}

/** Counts a mounted name, warning once when a second element takes it; returns the release. */
function claim(n: string, name: string, item: string | number): () => void {
  const count = (mounted.get(n) ?? 0) + 1;
  mounted.set(n, count);
  if (count === 2 && isDev()) {
    // oxlint-disable-next-line no-console -- the one development warning the component gives
    console.warn(
      `Morph: two mounted Morphs share name "${name}" and item "${String(item)}", so the browser skips the morph. Give each its own item, or pass active={false} to all but one.`,
    );
  }
  return () => {
    const left = (mounted.get(n) ?? 1) - 1;
    if (left === 0) mounted.delete(n);
    else mounted.set(n, left);
  };
}

/**
 * Measures every mounted Morph again, at once, so a card a router has just scrolled on screen
 * carries its transition name before the browser captures the new page. Call it right after the
 * router restores scroll, when that happens after the render: TanStack Router restores scroll on
 * `onRendered`, a few microtasks after the commit, which is too late for Morph to see on its own.
 *
 * ```ts
 * const router = createRouter({ routeTree, defaultViewTransition: true, scrollRestoration: true });
 * router.subscribe("onRendered", () => refreshMorphs());
 * ```
 *
 * Subscribe after the router is created, so its own scroll restore runs first. A restore in a
 * layout effect, during the commit, needs no call. It takes no arguments and does nothing on the
 * server or where there is no IntersectionObserver.
 */
export function refreshMorphs(): void {
  if (remeasures.size === 0) return;
  flushSync(() => {
    for (const remeasure of remeasures) remeasure();
  });
}

/** Whether the element in `ref` is within a screen of the viewport, measured as it scrolls. */
function useNear(ref: RefObject<HTMLElement | null>): boolean {
  // Named until measured, so the server render and an engine with no IntersectionObserver keep the
  // name. The layout effect's update is flushed with the render, so inside a view transition's
  // update the new page's far cards are already unnamed when the browser captures it. A parent's
  // layout effect runs after this one and may scroll this element on screen (a router restoring
  // the list's scroll on Back), so a microtask measures again once the whole commit is done and
  // flushes the result, before the browser's next rendering step, where it captures the new state.
  // A restore later than that microtask (TanStack Router's, several awaits after the commit) is
  // not seen here: neither `updateCallbackDone` nor a scroll event reliably comes before the
  // capture in Chromium, so the router calls `refreshMorphs` after it restores.
  const [near, setNear] = useState(true);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver !== "function") return undefined;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      const h = window.innerHeight;
      return rect.bottom >= -h && rect.top <= 2 * h;
    };
    setNear(measure());
    let live = true;
    queueMicrotask(() => {
      if (live) flushSync(() => setNear(measure()));
    });
    const remeasure = () => setNear(measure());
    remeasures.add(remeasure);
    const observer = new IntersectionObserver(
      (entries) => {
        const last = entries.at(-1);
        if (last) setNear(last.isIntersecting);
      },
      { rootMargin: "100% 0px" },
    );
    observer.observe(el);
    return () => {
      live = false;
      remeasures.delete(remeasure);
      observer.disconnect();
    };
  }, [ref]);
  return near;
}

/**
 * An element that grows into its counterpart on the next page, and shrinks back on Back, through
 * the View Transitions API. Wrap the card in the list and the element on the detail page, each with
 * the same `name` and the record's id as `item`: the browser morphs one into the other over 450 ms. The same
 * `name` and `item` may appear only once on a page; two on one page and the browser skips the
 * morph, so a list passes each record's own id. The morph runs only when the change is wrapped in a
 * view transition: `startPageTransition`, or a router's own option (TanStack Router
 * `defaultViewTransition: true` on `createRouter`, or `viewTransition` on a `Link`; React Router's
 * `viewTransition`, Astro's `ClientRouter`). Otherwise, or where the browser has no View
 * Transitions, it renders and behaves as a plain `<div>`. Inside a `PageFade` the page fades while
 * this element morphs. While it is named (near the screen) the div is a stacking context, so a
 * dropdown inside it cannot rise above a sticky header outside it: portal overlays to the body. Under
 * `prefers-reduced-motion: reduce` it swaps with no animation; a router's own transition of the
 * rest of the page is the router's to quiet. A Morph more than a screen above or below the viewport
 * carries no transition name until it scrolls near, so a long list costs only what is on screen.
 * In a list, `as="li"` makes it the list's item. When one record shows twice on a page, pass
 * `active={false}` to the copy that should not morph; in development two active Morphs with the
 * same `name` and `item` log a console warning.
 */
export function Morph({
  name,
  item,
  as = "div",
  active = true,
  children,
  ...rest
}: {
  /** What the element is, shared by the card and its detail: `"shop"`, `"product"`. Any text. */
  name: string;
  /** Which one, usually the record's id. Any text or number; unique on the page for one `name`. */
  item: string | number;
  /**
   * The element it renders: `"div"` (the default), or `"li"` for a card that is an item of a list,
   * so the list stays a `ul` of `li`.
   */
  as?: "div" | "li" | undefined;
  /**
   * Whether it carries its transition name; `true` by default. Pass `false` to every copy but one
   * when the same record shows twice on a page (a featured card and the same card in the list), so
   * only the one that should grow into the detail is named.
   */
  active?: boolean | undefined;
  children: ReactNode;
} & Passthrough): ReactElement {
  const n = morphName(name, item);
  const ref = useRef<HTMLElement>(null);
  // In development, two active Morphs with one name and item warn: the browser would skip the morph.
  useEffect(() => (active ? claim(n, name, item) : undefined), [active, n, name, item]);
  const near = useNear(ref);
  const named = active && near;
  const style = <style>{css(n)}</style>;
  // A grid, so the one child (a Card in a CardGrid) still fills the row's height.
  if (as === "li") {
    // A list holds only `li`, so the stylesheet goes inside the item; a <style> is never a grid item.
    return (
      <li
        {...rest}
        ref={(el) => {
          ref.current = el;
        }}
        data-morph={n}
        data-morph-near={named ? "" : undefined}
        className="grid"
      >
        {style}
        {children}
      </li>
    );
  }
  return (
    <>
      {style}
      <div
        {...rest}
        ref={(el) => {
          ref.current = el;
        }}
        data-morph={n}
        data-morph-near={named ? "" : undefined}
        className="grid"
      >
        {children}
      </div>
    </>
  );
}
