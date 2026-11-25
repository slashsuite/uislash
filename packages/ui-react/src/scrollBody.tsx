import type { ReactElement, ReactNode } from "react";
import { cx, insetFocusRing } from "./cx.js";
import { scrollStopProps, useScrollStop } from "./scrollStop.js";

/**
 * A box that scrolls (a `Drawer`'s or a `BottomSheet`'s body, a filled `Card`'s body, a
 * `CodeExample`'s preview), with the keyboard side `useScrollStop` gives it: while it overflows and
 * holds nothing the keyboard can reach, it takes a tab stop, a group named by `label` or
 * `labelledBy`. Its ring is drawn inside it, since each of these sits in a frame that clips.
 * Internal: `className` is the library's own.
 */
export function ScrollBody({
  axis = "y",
  label,
  labelledBy,
  id,
  className,
  children,
}: {
  axis?: "x" | "y";
  label?: string | undefined;
  labelledBy?: string | undefined;
  id?: string | undefined;
  className: string;
  children: ReactNode;
}): ReactElement {
  const { attach, stop } = useScrollStop(axis);
  const { props } = scrollStopProps(stop, { label, labelledBy });
  return (
    <div ref={attach} id={id} {...props} className={cx(className, stop && insetFocusRing)}>
      {children}
    </div>
  );
}
