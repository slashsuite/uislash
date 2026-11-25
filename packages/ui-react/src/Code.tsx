import { Children, type ReactElement, type ReactNode } from "react";
import { cx } from "./cx.js";
import type { Passthrough } from "./props.js";
import { layoutClass } from "./textBox.js";
import { Truncated } from "./truncated.js";

/**
 * Inline code: mono, on a subtle inset background. It takes the surrounding text colour and size (a
 * touch smaller, for the mono face). `lines={1}` keeps a long value (a hash, a path) on one line,
 * cut with an ellipsis, and shows its whole text in a tooltip while it is cut; `breakWords` instead breaks a long unbroken
 * value at the edge of its box, as `Text` does.
 */
export function Code({
  lines,
  breakWords = false,
  children,
  ...rest
}: {
  children: ReactNode;
  /** `1` keeps it on one line, cut with an ellipsis; while it is cut, its whole text shows in a tooltip. */
  lines?: 1 | undefined;
  /**
   * Breaks a long unbroken value (a URL, a hash) at the edge of its box.
   * @default false
   */
  breakWords?: boolean | undefined;
} & Passthrough): ReactElement {
  const look = cx(
    "rounded bg-slate-100 px-1 py-0.5 font-mono text-[0.9em]",
    layoutClass(undefined, lines),
    breakWords && "break-words",
  );
  if (lines === 1) {
    return (
      <Truncated as="code" attrs={rest} text={plainText(children)} className={look}>
        {children}
      </Truncated>
    );
  }
  return (
    <code {...rest} className={look}>
      {children}
    </code>
  );
}

/** The whole text of children made only of strings and numbers (`sha256:{hash}`), else undefined. */
function plainText(children: ReactNode): string | undefined {
  const parts = Children.toArray(children);
  return parts.every((part) => typeof part === "string" || typeof part === "number")
    ? parts.join("")
    : undefined;
}
