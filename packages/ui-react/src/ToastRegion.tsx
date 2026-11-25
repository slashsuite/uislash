import {
  type AnimationEvent,
  type FocusEvent,
  type ReactElement,
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { TONE_SURFACE, TONE_TEXT } from "./Callout.js";
import { cx } from "./cx.js";
import { IconButton } from "./IconButton.js";
import { useModalOpen } from "./modal.js";
import type { Passthrough } from "./props.js";
import type { Tone } from "./tone.js";

/** One notice in a `ToastRegion`. The caller holds the list; the region draws it. */
export type Toast = {
  /** The React key, and what `onDismiss` hands back. */
  id: string;
  /** The bold line: the whole message for a short one ("Saved"). */
  title: string;
  /** A line of detail under the title. */
  description?: ReactNode;
  /**
   * What the notice means, with `Callout`'s surfaces. A `warn` or `danger` toast never hides itself.
   * @default neutral
   */
  tone?: Tone | undefined;
  /** One `Button size="sm"`, as on a `Callout`. A toast with `actions` never hides itself. */
  actions?: ReactNode;
};

// The hide is CSS, not a timer. A toast that may leave on its own carries `data-toast-hide`: it is
// shown for eight seconds, then fades for 200ms, and the animation's end calls `onDismiss`, so the
// caller drops it from the list. Hovering the region or focusing anything in it pauses the run.
// Under reduced motion the same run holds a discrete `visibility` keyframe instead of the fade, so
// the toast still leaves at the same moment.
const css = `[data-toast-hide]{animation:hc-toast-hide .2s ease-in 8s forwards}[data-hc-toasts]:hover [data-toast-hide],[data-hc-toasts]:focus-within [data-toast-hide]{animation-play-state:paused}@keyframes hc-toast-hide{to{opacity:0}}@media (prefers-reduced-motion:reduce){[data-toast-hide]{animation-name:hc-toast-cut}}@keyframes hc-toast-cut{from,to{visibility:visible}}`;

/** Only a plain confirmation leaves on its own: no action to reach, nothing that must be read. */
function hides(toast: Toast): boolean {
  const tone = toast.tone ?? "neutral";
  return toast.actions == null && (tone === "neutral" || tone === "info" || tone === "positive");
}

/**
 * Puts the toast's words in the live region once, when it first shows, and takes them out when it
 * goes: the title, the description's text, and `actionsLabel` when it has actions. The buttons themselves
 * are never read out as part of the notice.
 */
function useAnnounce(
  live: RefObject<HTMLDivElement | null>,
  title: string,
  actionsLabel: string | null,
): RefObject<HTMLDivElement | null> {
  const body = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const line = document.createElement("p");
    line.textContent = [title, body.current?.textContent, actionsLabel].filter(Boolean).join(". ");
    live.current?.append(line);
    return () => line.remove();
  }, [live, title, actionsLabel]);
  return body;
}

/**
 * Where focus goes when the toast holding it is dismissed: the next toast's dismiss button, else the
 * one before, else back where it was before it came into the region.
 */
function focusAfter(toast: Element, back: RefObject<HTMLElement | null>): void {
  if (!toast.contains(document.activeElement)) return;
  const sibling = toast.nextElementSibling ?? toast.previousElementSibling;
  const next = sibling?.querySelector<HTMLElement>("[data-toast-dismiss]");
  if (next) return next.focus();
  if (back.current?.isConnected) back.current.focus();
  back.current = null;
}

function ToastItem({
  toast,
  dismissLabel,
  actionsLabel,
  live,
  alert,
  back,
  onDismiss,
}: {
  toast: Toast;
  dismissLabel: string;
  actionsLabel: string;
  live: RefObject<HTMLDivElement | null>;
  alert: RefObject<HTMLDivElement | null>;
  back: RefObject<HTMLElement | null>;
  onDismiss: (id: string) => void;
}): ReactElement {
  const tone = toast.tone ?? "neutral";
  const hide = hides(toast);
  const body = useAnnounce(
    tone === "danger" ? alert : live,
    toast.title,
    toast.actions == null ? null : actionsLabel,
  );
  return (
    <div
      data-toast=""
      data-toast-hide={hide ? "" : undefined}
      onAnimationEnd={(event: AnimationEvent<HTMLDivElement>) => {
        // A child's animation (a busy Button's spinner) bubbles here too: only the toast's own
        // animation, which is the hide, counts.
        if (hide && event.target === event.currentTarget) onDismiss(toast.id);
      }}
      className={cx(
        "pointer-events-auto flex items-start gap-3 rounded-xl border p-3 pl-4 text-sm shadow-lg",
        TONE_SURFACE[tone],
        TONE_TEXT[tone],
      )}
    >
      <div className="min-w-0 flex-1 py-0.5">
        <p className="font-semibold">{toast.title}</p>
        {toast.description != null && (
          <div ref={body} className="mt-1">
            {toast.description}
          </div>
        )}
      </div>
      {toast.actions != null && (
        <div className="flex shrink-0 items-center gap-2">{toast.actions}</div>
      )}
      <IconButton
        size="sm"
        variant="ghost"
        icon="close"
        label={dismissLabel}
        data-toast-dismiss=""
        onClick={(event) => {
          const box = event.currentTarget.closest("[data-toast]");
          if (box) focusAfter(box, back);
          onDismiss(toast.id);
        }}
      />
    </div>
  );
}

/**
 * The page's toasts: short notices fixed to the bottom of the viewport, from a list the app holds.
 * Mount it once, at the root beside `AppShell`; add a toast to `items` to show it, and drop it in
 * `onDismiss` to remove it. A `neutral`, `info` or `positive` toast with no `actions` leaves on its
 * own after eight seconds (paused while the pointer is over it or focus is in it); a `warn` or
 * `danger` toast, or one with `actions`, stays until dismissed. The region is a named landmark with
 * a polite `role="status"` kept in the page while empty, which reads each new toast's text once,
 * followed by "Actions available" when it has actions; its buttons are not read out. A `danger`
 * toast is read through a `role="alert"` beside it instead, so it interrupts. Dismissing the
 * toast that holds focus moves focus to the next toast, or back where it was. A toast raised while a
 * `Dialog`, `Drawer` or `Lightbox` is open is held back (those already shown stay), shown and read once the modal has closed.
 */
export function ToastRegion({
  items,
  onDismiss,
  label = "Notifications",
  dismissLabel = "Dismiss",
  actionsLabel = "Actions available",
  ...rest
}: {
  /** What is shown, oldest first. `[]` shows nothing and keeps the live region in the page. */
  items: readonly Toast[];
  /** Called by a toast's close button and when a self-hiding toast's time is up: drop it from `items`. */
  onDismiss: (id: string) => void;
  /**
   * The region's accessible name.
   * @default Notifications
   */
  label?: string | undefined;
  /**
   * The close button's name.
   * @default Dismiss
   */
  dismissLabel?: string | undefined;
  /**
   * Read after a toast that has `actions`, so a screen reader user knows to go and find them.
   * @default Actions available
   */
  actionsLabel?: string | undefined;
} & Passthrough): ReactElement {
  const live = useRef<HTMLDivElement>(null);
  const alert = useRef<HTMLDivElement>(null);
  /** What had focus before it came into the region, to hand it back when the last toast goes. */
  const back = useRef<HTMLElement | null>(null);
  const held = useModalOpen();
  // The toasts on screen when a modal opened stay; only newer ones are held back. The ids shown
  // are kept from the last render with no modal open, adjusted during render rather than in an effect.
  const [kept, setKept] = useState<readonly string[]>([]);
  const ids = items.map((toast) => toast.id);
  if (!held && ids.join("\n") !== kept.join("\n")) setKept(ids);
  const visible = held ? items.filter((toast) => kept.includes(toast.id)) : items;
  return (
    <section
      aria-label={label}
      {...rest}
      data-hc-toasts=""
      onFocus={(event: FocusEvent<HTMLElement>) => {
        const from = event.relatedTarget;
        if (from instanceof HTMLElement && !event.currentTarget.contains(from)) back.current = from;
      }}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
    >
      <style>{css}</style>
      {/* The live regions hold only words, put there by each toast (`useAnnounce`). */}
      <div ref={live} role="status" aria-live="polite" aria-atomic="false" className="sr-only" />
      <div ref={alert} role="alert" aria-atomic="false" className="sr-only" />
      <div className="flex w-full max-w-sm flex-col gap-2">
        {visible.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            dismissLabel={dismissLabel}
            actionsLabel={actionsLabel}
            live={live}
            alert={alert}
            back={back}
            onDismiss={onDismiss}
          />
        ))}
      </div>
    </section>
  );
}
