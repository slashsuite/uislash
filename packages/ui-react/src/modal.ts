import { type RefObject, useLayoutEffect, useRef, useSyncExternalStore } from "react";

/** Resolves when the transitions running on the dialog (and its backdrop) have ended. */
async function exitTransitions(dialog: HTMLDialogElement): Promise<void> {
  // A browser without the Web Animations API (or jsdom) has nothing to wait for.
  if (typeof dialog.getAnimations !== "function") return;
  const running = dialog.getAnimations({ subtree: true }).filter((a) => "transitionProperty" in a);
  await Promise.allSettled(running.map((a) => a.finished));
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
 * Opens the `<dialog>` with `showModal()` on mount and closes it on unmount. Closing on unmount
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
    opened(1);
    return () => {
      mounted.current = false;
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
