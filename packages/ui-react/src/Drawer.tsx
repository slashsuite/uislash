import {
  type FormEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  type RefObject,
  useId,
  useRef,
  useState,
} from "react";
import { cx } from "./cx.js";
import { BodyContext, FormColumn, FormError, ModalScope } from "./Dialog.js";
import { IconButton } from "./IconButton.js";
import { useBackdropClose, useModal } from "./modal.js";
import type { Passthrough } from "./props.js";
import { ScrollBody } from "./scrollBody.js";
import { FLING, releaseVelocity, type SheetSample } from "./sheetSnap.js";
import type { Size } from "./size.js";
import { HeaderText, SectionHeading } from "./typography.js";

const PANEL =
  "fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none max-w-full flex-col overflow-hidden overscroll-contain border-l border-slate-200 bg-white p-0 text-slate-900 shadow-2xl translate-x-full transition-[translate,overlay,display] transition-discrete duration-200 touch-pan-y data-swiping:transition-none open:flex open:translate-x-0 starting:open:translate-x-full backdrop:bg-slate-900/35 backdrop:opacity-0 backdrop:transition-[opacity,overlay,display] backdrop:transition-discrete backdrop:duration-200 open:backdrop:opacity-100 starting:open:backdrop:opacity-0 motion-reduce:transition-none motion-reduce:backdrop:transition-none";
const WIDTH: Record<Size, string> = { sm: "w-80", md: "w-110", lg: "w-160" };

/** Where a horizontal drag is the control's own, not the drawer's. */
const OWN_DRAG = "input, textarea, select, [contenteditable], [role=slider], .overflow-x-auto";

/** Finger travel (px) before a touch is read as a swipe or a scroll. */
const SLOP = 8;

type Swipe = {
  pointer: number;
  x: number;
  y: number;
  width: number;
  /** `null` until the travel passes `SLOP`: then whether it is a swipe to the right. */
  across: boolean | null;
  samples: SheetSample[];
};

/** Whether a released swipe closes: a flick to the right, or a travel past a third of the width. */
const swipedOff = (s: Swipe, at: number) =>
  releaseVelocity(s.samples, at) >= FLING || (s.samples.at(-1)?.height ?? 0) > s.width / 3;

/**
 * Swipe to dismiss on touch: a finger that moves right more than it moves down drags the panel
 * with it, and a release past a third of its width, or a quick flick to the right, closes it. A
 * shorter, slower swipe springs back. A vertical move is the body's scroll and is left alone
 * (`touch-action: pan-y`). A mouse or a pen does nothing here. The offset while dragging is
 * `null` at rest.
 */
function useSwipeClose(dialog: RefObject<HTMLDialogElement | null>) {
  const swipe = useRef<Swipe | null>(null);
  const [offset, setOffset] = useState<number | null>(null);

  const onPointerDown = (event: PointerEvent<HTMLDialogElement>) => {
    if (event.pointerType !== "touch" || swipe.current || event.target === dialog.current) return;
    // A field, a slider or a horizontally scrolling area keeps its own horizontal drag, and a dialog
    // opened from inside the drawer (React portals its events up through it) is not the drawer.
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest(OWN_DRAG) || target?.closest("dialog") !== dialog.current) return;
    swipe.current = {
      pointer: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      width: event.currentTarget.getBoundingClientRect().width,
      across: null,
      samples: [{ height: 0, t: event.timeStamp }],
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLDialogElement>) => {
    const s = swipe.current;
    if (!s || s.pointer !== event.pointerId) return;
    const dx = event.clientX - s.x;
    const dy = event.clientY - s.y;
    if (s.across === null) {
      if (Math.abs(dx) < SLOP && Math.abs(dy) < SLOP) return;
      s.across = dx > Math.abs(dy);
    }
    if (!s.across) return;
    const travel = Math.max(0, dx);
    s.samples = [...s.samples.slice(-1), { height: travel, t: event.timeStamp }];
    setOffset(travel);
  };

  const release = (event: PointerEvent<HTMLDialogElement>, cancelled: boolean) => {
    const s = swipe.current;
    if (!s || s.pointer !== event.pointerId) return;
    swipe.current = null;
    if (!s.across) return;
    // Dropping the offset and closing in the same event, so the exit slides on from where the
    // finger let go.
    setOffset(null);
    if (!cancelled && swipedOff(s, event.timeStamp)) dialog.current?.close();
  };

  return {
    offset,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: (event: PointerEvent<HTMLDialogElement>) => release(event, false),
      onPointerCancel: (event: PointerEvent<HTMLDialogElement>) => release(event, true),
    },
  };
}

export type DrawerProps = {
  /** The drawer's accessible name, shown as its heading. */
  title: ReactNode;
  /** A muted line under the title, as on a `Dialog`. */
  description?: ReactNode;
  children?: ReactNode;
  /** Actions pinned under the scrolling body, right-aligned: Cancel (`variant="ghost"`), then the one main action. */
  footer?: ReactNode;
  /**
   * Makes the drawer a form, as on a `Dialog`: one `<form noValidate>` holds the body, the `error`
   * and the footer, so a `Button type="submit"` in the footer or Enter in a field submits it. The
   * default is prevented before this runs, and a rejection is yours to catch and show as `error`.
   * Once the submit settles, the focus moves to the first field marked invalid
   * (`aria-invalid="true"`), if any.
   */
  onSubmit?: ((event: FormEvent<HTMLFormElement>) => void | Promise<unknown>) | undefined;
  /**
   * What went wrong with the whole submit, as on a `Dialog`: a danger `Callout`, announced as an
   * alert, pinned between the body and the footer. An error about one field is that `Field`'s `error`.
   */
  error?: ReactNode;
  /**
   * The panel's width: `md` holds a form or a record; `sm` (320px) is narrower and `lg` (640px) wider.
   * @default md
   */
  width?: Size | undefined;
  /** Called when the drawer closes: Esc, a click on the scrim, the close button or a swipe to the right on touch. */
  onClose: () => void;
  /** The accessible name of the close button. */
  closeLabel?: string;
} & Passthrough;

/**
 * A modal slide-over anchored to the right edge, on the browser's own `<dialog>`: it is opened
 * with `showModal()` on mount, so render it only while it is open. The page behind goes inert, Esc
 * closes it and Tab wraps inside it; a click on the scrim (the `<dialog>` element itself, not its
 * contents) closes it too, and on touch a swipe to the right drags it off (a short one springs
 * back). The header holds the title, an optional `description` under it and a close button; the
 * body scrolls between it and an optional pinned `footer`, and a scroll in it never carries on to
 * the page behind. `onSubmit` makes it a form and `error` shows what went wrong with the submit, as
 * on a `Dialog`.
 */
export function Drawer({
  title,
  description,
  children,
  footer,
  onSubmit,
  error,
  width = "md",
  onClose,
  closeLabel = "Close",
  ...rest
}: DrawerProps): ReactElement {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  const closed = useModal(dialog, onClose);
  const backdrop = useBackdropClose(dialog);
  const { offset, handlers } = useSwipeClose(dialog);

  return (
    <ModalScope>
      <dialog
        {...rest}
        ref={dialog}
        aria-labelledby={titleId}
        onClose={closed}
        {...handlers}
        onPointerDown={(event) => {
          backdrop.onPointerDown(event);
          handlers.onPointerDown(event);
        }}
        onClick={backdrop.onClick}
        data-swiping={offset === null ? undefined : ""}
        style={offset === null ? undefined : { translate: `${offset}px 0` }}
        className={cx(PANEL, WIDTH[width])}
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-5.5 py-3.5">
          <div className="min-w-0">
            <SectionHeading id={titleId}>{title}</SectionHeading>
            {description && (
              <div className="mt-1">
                <HeaderText>{description}</HeaderText>
              </div>
            )}
          </div>
          <IconButton label={closeLabel} onClick={() => dialog.current?.close()} icon="close" />
        </header>
        <FormColumn onSubmit={onSubmit}>
          <ScrollBody
            labelledBy={titleId}
            className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain px-5.5 py-4"
          >
            <BodyContext>{children}</BodyContext>
          </ScrollBody>
          <FormError error={error} space="px-5.5 pb-4" />
          {footer && (
            <footer className="flex shrink-0 justify-end gap-2 border-t border-slate-200 px-5.5 py-3.5">
              {footer}
            </footer>
          )}
        </FormColumn>
      </dialog>
    </ModalScope>
  );
}
