import {
  type ReactElement,
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { cx, focusRing } from "./cx.js";
import { useTooltip } from "./Tooltip.js";

// A one-line run cut with an ellipsis shows its whole text in the library's tooltip on hover,
// keyboard focus and a tap, not only in a native `title` (which the keyboard and touch never reach).
// The tooltip shows only while the text is cut: a ResizeObserver compares the run's scroll width
// with its box, so a run that fits says nothing twice. The tooltip repeats the run's own words, so it
// is hidden from assistive tech, which reads the whole text from the page already.

/** What can take focus inside a run: a link or a control. A run with none is made a stop itself. */
const FOCUSABLE = "a[href], button, input, select, textarea, [tabindex]";

type Cut = { cut: boolean; inner: boolean };

/**
 * Whether the run in `ref` is cut by its box, and whether it holds its own focusable. Measured on
 * each resize and when `text` changes. jsdom (a consumer's own tests) has no ResizeObserver, so
 * there it reads never cut.
 */
export function useCut(ref: RefObject<HTMLElement | null>, text: string | undefined): Cut {
  const [state, setState] = useState<Cut>({ cut: false, inner: false });
  useEffect(() => {
    const run = ref.current;
    if (!run || text === undefined || typeof ResizeObserver === "undefined") {
      setState((last) => (last.cut || last.inner ? { cut: false, inner: false } : last));
      return undefined;
    }
    const measure = () => {
      const cut = run.scrollWidth > run.clientWidth;
      const inner = run.querySelector(FOCUSABLE) !== null;
      setState((last) => (last.cut === cut && last.inner === inner ? last : { cut, inner }));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(run);
    return () => observer.disconnect();
  }, [ref, text]);
  return state;
}

/**
 * A one-line truncated run (`truncate` plus the caller's width) that shows its whole `text` in a
 * tooltip while it is cut. A run that holds a link takes the link's focus; a plain one becomes a
 * focus stop only while it is cut and the tooltip is the library's own, so the keyboard can reach
 * it. Internal.
 */
export function Truncated({
  text,
  as: Tag = "div",
  attrs,
  className,
  children,
}: {
  /** The run's element: a block `div`, or inline `code`. */
  as?: "div" | "code" | undefined;
  /** The caller's own attributes for the run (`id`, `data-*`, `aria-*`). */
  attrs?: { "aria-describedby"?: string | undefined } | undefined;
  /** The run's whole text; left out (the run is not plain text), it truncates with no tooltip. */
  text: string | undefined;
  /** The run's width and placement, added to `truncate`. */
  className?: string | undefined;
  children: ReactNode;
}): ReactElement {
  const ref = useRef<HTMLElement>(null);
  const { cut, inner } = useCut(ref, text);
  const { props, tooltip, enhanced } = useTooltip<HTMLElement>(
    cut ? text : undefined,
    { describes: false, tap: true },
    { "aria-describedby": attrs?.["aria-describedby"] },
  );
  // A focus stop only where focus shows the tooltip: a native title never shows on focus.
  const stop = cut && !inner && enhanced;
  return (
    <>
      <Tag
        {...attrs}
        ref={(run: HTMLElement | null) => {
          ref.current = run;
        }}
        {...props}
        tabIndex={stop ? 0 : undefined}
        className={cx("truncate", className, stop && cx("rounded-sm", focusRing))}
      >
        {children}
      </Tag>
      {tooltip}
    </>
  );
}
