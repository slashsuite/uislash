import { type ReactElement, useEffect, useRef, useState } from "react";
import { useTooltip } from "./Tooltip.js";
import { useCut } from "./truncated.js";

/** Whether the element has the focus ring's focus (the keyboard's); a browser without `:focus-visible` counts every focus. */
function ringed(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  try {
    return target.matches(":focus-visible");
  } catch {
    return true;
  }
}

/**
 * A `SortableItem`'s one-line title. Cut, it shows in full in a tooltip: on the pointer over it, a
 * tap, or the keyboard's focus on the row or its handle. react-aria renders an item's own hooks
 * outside the page, so the title is its own part, and it listens for focus on the row it lands in.
 * Internal.
 */
export function ItemTitle({ title }: { title: string }): ReactElement {
  const line = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const { cut } = useCut(line, title);
  const { props: tip, tooltip } = useTooltip<HTMLDivElement>(
    cut ? title : undefined,
    { describes: false, tap: true, focused },
    {},
  );
  useEffect(() => {
    const row = line.current?.closest<HTMLElement>('[role="row"]');
    if (!row) return undefined;
    const focus = (event: FocusEvent) => setFocused(ringed(event.target));
    const blur = () => setFocused(false);
    // Dismissed where it stands (WCAG 1.4.13); the key goes on to the list.
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFocused(false);
    };
    row.addEventListener("focusin", focus);
    row.addEventListener("focusout", blur);
    row.addEventListener("keydown", key);
    return () => {
      row.removeEventListener("focusin", focus);
      row.removeEventListener("focusout", blur);
      row.removeEventListener("keydown", key);
    };
  }, []);
  return (
    <>
      <div
        ref={line}
        className="truncate"
        style={tip.style}
        onPointerEnter={tip.onPointerEnter}
        onPointerLeave={tip.onPointerLeave}
        onPointerDown={tip.onPointerDown}
        title={tip.title}
      >
        {title}
      </div>
      {tooltip}
    </>
  );
}
