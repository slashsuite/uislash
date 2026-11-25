import type { ReactElement } from "react";
import { CopyButton } from "./CopyButton.js";
import type { Passthrough } from "./props.js";

const BOX =
  "flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-2.5 py-2 font-mono text-[0.78125rem] leading-normal text-slate-900";

/** One line of mono text in a box, with a `CopyButton`: a command or a token to paste elsewhere. `label` says what the line is, and the button is named "Copy <label>" (it still reads "Copy"), so several lines on a page can be told apart. `disabled` disables the button, e.g. until hydration. An `id`, `data-*` and `aria-*` go on the root `<div>`, so `data-testid` lands there; the `<code>` holds only `text`. */
export function CopyLine({
  text,
  label,
  disabled,
  ...rest
}: {
  /** The line shown, and what the button copies. */
  text: string;
  /** What the line is, in a few lower-case words ("install command", "API token"): the copy button's accessible name is "Copy " and this. */
  label: string;
  /** Disables the copy button, e.g. until hydration. */
  disabled?: boolean;
} & Passthrough): ReactElement {
  return (
    <div {...rest} className={BOX}>
      <code className="min-w-0 break-words">{text}</code>
      <CopyButton text={text} disabled={disabled} aria-label={`Copy ${label}`} />
    </div>
  );
}
