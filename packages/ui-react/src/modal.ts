import { type RefObject, useLayoutEffect, useRef, useSyncExternalStore } from "react";
import { TABBABLE } from "./scrollStop.js";

/** Resolves when the transitions running on the dialog (and its backdrop) have ended. */
async function exitTransitions(dialog: HTMLDialogElement): Promise<void> {
  // A browser without the Web Animations API (or jsdom) has nothing to wait for.
  if (typeof dialog.getAnimations !== "function") return;
  const running = dialog.getAnimations({ subtree: true }).filter((a) => "transitionProperty" in a);
  await Promise.allSettled(running.map((a) => a.finished));
}

/** The tab stops inside `dialog`, in tab order: shown (jsdom has no `checkVisibility`) and not inert. */
function tabStops(dialog: HTMLDialogElement): HTMLElement[] {
  return [...dialog.querySelectorAll<HTMLElement>(TABBABLE)].filter(
    (el) =>
      (typeof el.checkVisibility !== "function" || el.checkVisibility()) && !el.closest("[inert]"),
  );
}

/**
 * Keeps Tab and Shift+Tab inside an open modal, wrapping from the last tab stop to the first and
 * back (WAI-ARIA APG, dialog). The browser's own modal `<dialog>` lets Tab leave the page for the
 * browser's toolbar before it comes back.
 */
const plainTab = (event: KeyboardEvent) =>
  event.key === "Tab" &&
  !event.defaultPrevented &&
  !event.altKey &&
  !event.ctrlKey &&
  !event.metaKey;

function wrapTab(dialog: HTMLDialogElement) {
  return (event: KeyboardEvent) => {
    if (!plainTab(event)) return;
    const stops = tabStops(dialog);
    const first = stops[0];
    const last = stops.at(-1);
    const active = dialog.ownerDocument.activeElement;
    if (!first || !last) {
      event.preventDefault();
      return;
    }
    const leaving = event.shiftKey ? active === first || active === dialog : active === last;
    if (!leaving) return;
    event.preventDefault();
    (event.shiftKey ? last : first).focus();
  };
}

/** How many of the library's modals are open, and who wants to hear when that changes. */
let openModals = 0;
const watchers = new Set<() => void>();
const opened = (by: number) => {
  openModals += by;
  for (const watcher of watchers) watcher();
};

/**
 * Whether a `Dialog`, `Drawer` or `Lightbox` is open. `ToastRegion` holds its toasts back while one
 * is: the page behind a modal is inert, so a toast there could be neither read nor reached.
 */
export function useModalOpen(): boolean {
  return useSyncExternalStore(
    (watcher) => {
      watchers.add(watcher);
      return () => watchers.delete(watcher);
    },
    () => openModals > 0,
    () => false,
  );
}

/**
 * Opens the `<dialog>` with `showModal()` on mount and closes it on unmount, and keeps Tab inside it
 * while it is open (`wrapTab`). Closing on unmount
 * (not just on Esc or the backdrop) hands focus back to the opener and drops the inert page behind
 * when the parent unmounts the dialog, and keeps StrictMode's second mount from reopening an open one.
 *
 * Returns the handler for the dialog's `close` event. A closed `<dialog>` fades or slides out with
 * a transition, but only while it is still in the DOM, so the handler calls `onClose` once the exit
 * transition has ended and the parent can then unmount it without cutting the animation short.
 */
export function useModal(
  dialog: RefObject<HTMLDialogElement | null>,
  onClose: () => void,
): () => void {
  const mounted = useRef(false);

  useLayoutEffect(() => {
    const el = dialog.current;
    mounted.current = true;
    el?.showModal();
    const trap = el ? wrapTab(el) : undefined;
    if (el && trap) el.addEventListener("keydown", trap);
    opened(1);
    return () => {
      mounted.current = false;
      if (el && trap) el.removeEventListener("keydown", trap);
      el?.close();
      opened(-1);
    };
  }, [dialog]);

  return () => {
    const el = dialog.current;
    if (!el) return;
    void exitTransitions(el).then(() => {
      // Skip a close that an unmount caused, and the one StrictMode's remount leaves behind (the
      // dialog is open again by the time its event fires).
      if (mounted.current && !el.open) onClose();
    });
  };
}

/**
 * The backdrop press that closes a modal: a click whose press both began and ended on the
 * `<dialog>` element itself (its backdrop), not on its contents. A press that began on a control
 * inside does not count when its click lands on the `<dialog>`: a `Menu` opens on the press and
 * makes the rest of the dialog inert under it, so the browser hands that click to the `<dialog>`.
 */
export function useBackdropClose(dialog: RefObject<HTMLDialogElement | null>): {
  onPointerDown: (event: { target: EventTarget }) => void;
  onClick: (event: { target: EventTarget }) => void;
} {
  const pressedBackdrop = useRef(false);
  return {
    onPointerDown: (event) => {
      pressedBackdrop.current = event.target === dialog.current;
    },
    onClick: (event) => {
      const began = pressedBackdrop.current;
      pressedBackdrop.current = false;
      if (began && event.target === dialog.current) dialog.current?.close();
    },
  };
}
