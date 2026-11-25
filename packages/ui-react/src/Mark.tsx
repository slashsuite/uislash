import type { ReactElement, ReactNode } from "react";
import type { Passthrough } from "./props.js";

/**
 * A highlighted run inside text: a `<mark>`, on the warn tint, such as the words a search matched
 * in a result. It takes the surrounding size and weight. Mark the words that matter to what the
 * reader is doing, not emphasis: that is `Text strong`.
 */
export function Mark({ children, ...rest }: { children: ReactNode } & Passthrough): ReactElement {
  return (
    <mark {...rest} className="rounded-sm bg-amber-50 px-0.5 text-amber-800">
      {children}
    </mark>
  );
}
