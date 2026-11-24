import { type MouseEvent, type ReactElement, type ReactNode, useId, useState } from "react";
import { Button } from "./Button.js";
import { DialogFrame } from "./Dialog.js";
import type { Passthrough } from "./props.js";

export type ConfirmDialogProps = {
  /** The question, naming the action: "Delete build?". It is the dialog's accessible name. */
  title: string;
  /** The consequence, in one sentence: "This removes the build and every snapshot in it." It describes the dialog. */
  description: ReactNode;
  /** The confirm button's text, the action as a verb: "Delete". */
  confirm: string;
  /**
   * `danger` for an action that destroys or cannot be undone, which draws the confirm button red.
   * @default danger
   */
  tone?: "danger" | "neutral";
  /** What the confirm button says while `onConfirm` runs, such as "Deleting…". */
  busyLabel?: string | undefined;
  /**
   * The cancel button's text, for an app in another language.
   * @default Cancel
   */
  cancel?: string | undefined;
  /**
   * Runs the action. A returned promise keeps the confirm button busy until it settles: resolving
   * closes the dialog, and a rejection shows its message in the dialog and keeps it open.
   */
  onConfirm: () => void | Promise<unknown>;
  /** Called when the dialog closes: Cancel, Esc, the backdrop, the close button, or a confirm that went through. */
  onClose: () => void;
  /**
   * The name of the close button in the top corner, for an app in another language.
   * @default Close
   */
  closeLabel?: string | undefined;
} & Passthrough;

/** The `<dialog>` a button is in, closed so it animates out before `onClose` unmounts it. */
const closeFrom = (event: MouseEvent<HTMLElement>) =>
  event.currentTarget.closest("dialog")?.close();

/** The confirm's in-flight state and its error; `run` is the confirm button's click handler. */
function useConfirm(onConfirm: () => void | Promise<unknown>) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = (event: MouseEvent<HTMLElement>) => {
    if (busy) return;
    // Kept before the await: the event's target is gone by the time it settles.
    const dialog = event.currentTarget.closest("dialog");
    setError(null);
    setBusy(true);
    void Promise.resolve()
      .then(() => onConfirm())
      .then(
        () => dialog?.close(),
        (e: unknown) => {
          setBusy(false);
          setError(e instanceof Error ? e.message : String(e));
        },
      );
  };
  return { busy, error, run };
}

/**
 * A `Dialog` that asks before an action: the question as its title, the consequence under it, and
 * Cancel beside the one action. It is an `alertdialog` and opens on Cancel, so a stray Enter cancels.
 * Render it only while it is open.
 */
export function ConfirmDialog({
  title,
  description,
  confirm,
  tone = "danger",
  busyLabel,
  cancel = "Cancel",
  onConfirm,
  onClose,
  closeLabel,
  ...rest
}: ConfirmDialogProps): ReactElement {
  const descriptionId = useId();
  const { busy, error, run } = useConfirm(onConfirm);
  return (
    <DialogFrame
      {...rest}
      role="alertdialog"
      // A description the caller passes is read first, then the consequence.
      aria-describedby={[rest["aria-describedby"], descriptionId].filter(Boolean).join(" ")}
      title={title}
      description={<span id={descriptionId}>{description}</span>}
      width="sm"
      error={error}
      onClose={onClose}
      closeLabel={closeLabel}
      footer={
        <>
          <Button variant="ghost" autoFocus onClick={closeFrom}>
            {cancel}
          </Button>
          <Button tone={tone} busy={busy && (busyLabel || true)} onClick={run}>
            {confirm}
          </Button>
        </>
      }
    />
  );
}
