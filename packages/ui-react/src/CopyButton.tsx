import { type ComponentPropsWithoutRef, type MouseEvent, type ReactElement } from "react";
import { focusRing } from "./cx.js";
import type { Unstyled } from "./props.js";

const BASE = `min-h-6 min-w-6 shrink-0 cursor-pointer rounded px-1.5 py-0.5 font-sans text-xs text-slate-400 hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 ${focusRing}`;

/** The labels share one grid cell, centred, so the button is as wide as the longest and never resizes. */
const CELL = "col-start-1 row-start-1";

/** How long the copied or failed label shows, in milliseconds. */
const SHOWN = 2000;

/** The clipboard, which an insecure page or an old browser does not have, whatever the DOM types say. */
const clipboardOf = (from: { clipboard?: Clipboard }) => from.clipboard;

/**
 * Shows the `done` or `failed` label for two seconds and puts it in the status region beside the
 * button, then empties the region. No timer and no stylesheet: two Web Animations hold `visibility`
 * for the run (a stylesheet's `<style>` element is blocked by a nonce-based CSP; an animation is
 * not), and the run's own end clears the region. A second copy cancels the run in progress and starts
 * again. `copyScript` does the same on a page that is never hydrated.
 */
function flash(button: HTMLButtonElement, outcome: "done" | "failed"): void {
  const shown = button.querySelector(`[data-copy-${outcome}]`);
  const idle = button.querySelector("[data-copy-idle]");
  const status = button.nextElementSibling;
  const region = status?.matches("[data-copy-status]") ? status : null;
  // A new text node each time, so a second copy is announced too.
  region?.replaceChildren(shown?.textContent ?? "");
  if (!shown?.animate || !idle) return;
  for (const run of button.getAnimations({ subtree: true })) run.cancel();
  idle.animate({ visibility: ["hidden", "hidden"] }, SHOWN);
  const run = shown.animate({ visibility: ["visible", "visible"] }, SHOWN);
  run.onfinish = () => region?.replaceChildren();
}

/** Writes `text` to the clipboard and shows `copiedLabel` for two seconds, then `label` again; a refused or missing clipboard shows `failedLabel` instead. Defaults to `type="button"` and is at least 24px square. Its accessible name stays `label`; a polite status region beside it announces `copiedLabel` or `failedLabel` on each press and empties again when the label goes back. Every other button prop, `disabled` included, goes on the `<button>`. Nothing is styled by a `<style>` element, so it works under a strict CSP. On a page rendered to static HTML without hydration, inline `copyScript` and the button works there too. */
export function CopyButton({
  text,
  label = "Copy",
  copiedLabel = "Copied",
  failedLabel = "Failed",
  onClick,
  ...rest
}: {
  /** What goes on the clipboard. */
  text: string;
  /**
   * The button's text, and its accessible name.
   * @default Copy
   */
  label?: string;
  /**
   * The text shown for two seconds once the copy has gone through, and announced.
   * @default Copied
   */
  copiedLabel?: string;
  /**
   * The text shown for two seconds when the browser refuses the copy or has no clipboard, and
   * announced. Keep it about as long as `copiedLabel`, since the button is as wide as the longest.
   * @default Failed
   */
  failedLabel?: string;
} & Unstyled<Omit<ComponentPropsWithoutRef<"button">, "children">>): ReactElement {
  return (
    <>
      <button
        type="button"
        aria-label={label}
        {...rest}
        // What `copyScript` reads on a page that is never hydrated.
        data-copy-text={text}
        className={BASE}
        onClick={(event: MouseEvent<HTMLButtonElement>) => {
          onClick?.(event);
          // `copyScript` hears this same click on `document`. Whichever of the two runs first copies
          // and flags the event, so the other skips it.
          const native: Event & { copyHandled?: true } = event.nativeEvent;
          if (native.copyHandled) return;
          native.copyHandled = true;
          const target = event.currentTarget;
          const clipboard = clipboardOf(navigator);
          if (!clipboard) return flash(target, "failed");
          clipboard.writeText(text).then(
            () => flash(target, "done"),
            () => flash(target, "failed"),
          );
        }}
      >
        <span className="grid justify-items-center">
          <span data-copy-idle="" className={CELL}>
            {label}
          </span>
          <span data-copy-done="" aria-hidden="true" className={`invisible ${CELL}`}>
            {copiedLabel}
          </span>
          <span data-copy-failed="" aria-hidden="true" className={`invisible ${CELL}`}>
            {failedLabel}
          </span>
        </span>
      </button>
      {/* `sr-only` is absolute, so the region takes no room in the row the button sits in. Its text
          is never rendered (the empty string keeps React from hydrating children it does not own). */}
      <span role="status" data-copy-status="" className="sr-only" suppressHydrationWarning>
        {""}
      </span>
    </>
  );
}
