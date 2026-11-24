import { type ReactElement, type ReactNode, useId } from "react";
import { cx } from "./cx.js";
import { FieldContext, type FieldControlContext } from "./fieldControl.js";
import type { Passthrough } from "./props.js";
import { ControlBone } from "./fieldWait.js";
import { useErrorAnnouncement } from "./fieldAnnounce.js";
import { Icon } from "./Icon.js";
import { BusyLabel, busy, type LoadingProps, useLoading } from "./skeleton.js";

/**
 * The error line: an alert icon (so the error is not told by colour alone) and the text in red. It
 * carries no `role="alert"`: the text is announced once through the page's (or its dialog's) one polite live region.
 */
export function ErrorLine({
  id,
  error,
}: {
  id?: string | undefined;
  error: ReactNode;
}): ReactElement {
  const { anchor, announcement } = useErrorAnnouncement(error);
  return (
    <span ref={anchor} id={id} className="flex items-start gap-1 text-xs text-red-700">
      <span className="flex h-4 shrink-0 items-center">
        <Icon name="alert" size="sm" />
      </span>
      <span className="min-w-0">{error}</span>
      {announcement}
    </span>
  );
}

/**
 * The lines under a control or a row: the muted hint, and under it the error when there is one.
 * The hint stays while an error shows, so the rule is still in view while the value is fixed.
 * Neither draws nothing.
 */
export function fieldNote(
  hint: ReactNode,
  error: ReactNode,
  ids?: { hint: string; error: string },
): ReactElement | null {
  if (!hint && !error) return null;
  return (
    <div className="flex flex-col gap-0.5">
      {hint ? (
        <p id={ids?.hint} className="text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
      {error ? <ErrorLine id={ids?.error} error={error} /> : null}
    </div>
  );
}

/** The ids a control's `aria-describedby` names for its note: the hint's, then the error's. */
export function noteDescribedBy(
  hint: ReactNode,
  error: ReactNode,
  ids: { hint: string; error: string },
): string | undefined {
  const named = [hint ? ids.hint : undefined, error ? ids.error : undefined].filter(Boolean);
  return named.length > 0 ? named.join(" ") : undefined;
}

/** The control's id, the note's ids and the note itself: the hint, the error under it, or nothing. */
function useFieldNote(
  htmlFor: string | undefined,
  hint: ReactNode,
  error: ReactNode,
  required: boolean,
): { control: FieldControlContext; note: ReactElement | null } {
  const generatedId = useId();
  const ids = { hint: useId(), error: useId() };
  return {
    control: {
      id: htmlFor ?? generatedId,
      describedBy: noteDescribedBy(hint, error, ids),
      invalid: Boolean(error),
      required,
    },
    note: fieldNote(hint, error, ids),
  };
}

/**
 * The marker after a required field's label: a red asterisk, hidden from assistive tech, since the
 * control itself carries `required` and is read as required.
 */
export function RequiredMark({ required }: { required: boolean | undefined }): ReactNode {
  if (!required) return null;
  return (
    <span aria-hidden="true" className="text-red-700">
      {" *"}
    </span>
  );
}

/** A field's label: hidden, or drawn, and free to wrap anywhere beside a control in a row. */
function labelLook(hidden: boolean, row: boolean): string {
  return hidden
    ? "sr-only"
    : cx("text-sm font-medium text-slate-700", row && "min-w-0 wrap-anywhere");
}

/**
 * A label above a control, with a hint line under it and, when set, an error line under the hint
 * (an alert icon and red text, announced politely). The hint stays while the error shows.
 * `required` marks the label with a red asterisk and makes the control inside `required`.
 * Inside a `FormGrid`, `span="full"` runs the field across both columns. The `Input`, `Select`,
 * `Textarea` or `FileDrop` inside takes the label, the note (`aria-describedby`) and, with an error,
 * `aria-invalid` and a red edge by itself: give it no `id` and the Field no `htmlFor`. While
 * `loading` the label is drawn and the control is a bone of its height, read from the density
 * around it (`sm` in a `sm` card or table).
 */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  required = false,
  span,
  layout = "column",
  labelHidden = false,
  loading,
  loadingLabel,
  children,
  ...rest
}: {
  /** The text above the control. */
  label: ReactNode;
  /** A fixed id for the control inside, only when something else must name it. Unset, the Field makes one. */
  htmlFor?: string | undefined;
  /** A muted line under the control that says more. */
  hint?: ReactNode;
  /** A red line under the hint, with an alert icon; the control is `aria-invalid` while it shows. */
  error?: ReactNode;
  /**
   * The control must be filled: a red asterisk after the label (hidden from assistive tech) and
   * `required` on the `Input`, `Select`, `Textarea` or `FileDrop` inside.
   * @default false
   */
  required?: boolean | undefined;
  /** `full` spans every column of a `FormGrid`; unset takes one. It does nothing outside a `FormGrid`. */
  span?: "full" | undefined;
  /**
   * `row` puts the label beside the control, for a compact setting or a drawer row; the hint or
   * error sits under the control. Every row label takes the same fixed column, so stacked rows line
   * their controls up; a long label wraps inside it. `column` puts the label above it.
   * @default column
   */
  layout?: "column" | "row" | undefined;
  /**
   * Keeps the `label` in the page for assistive tech and draws no text, for a control whose purpose
   * is plain from what surrounds it (a search box in a toolbar). `label` stays required, so the
   * control always has a name. With `layout="row"` the field draws as a column: an empty label
   * column helps nobody.
   * @default false
   */
  labelHidden?: boolean | undefined;
  children: ReactNode;
} & LoadingProps &
  Passthrough): ReactElement {
  const row = layout === "row" && !labelHidden;
  const { control, note } = useFieldNote(htmlFor, hint, error, required);
  const { loading: waiting, owner } = useLoading(loading);
  return (
    <div
      {...rest}
      {...busy(owner, waiting)}
      className={cx(
        row ? "grid grid-cols-[8rem_1fr] items-center gap-x-3 gap-y-1.5" : "flex flex-col gap-1.5",
        span === "full" && "col-span-full",
      )}
    >
      <label htmlFor={control.id} className={labelLook(labelHidden, row)}>
        {label}
        <RequiredMark required={required} />
      </label>
      <FieldContext.Provider value={control}>
        {waiting ? <ControlBone /> : children}
      </FieldContext.Provider>
      {note && row ? <div className="col-start-2">{note}</div> : note}
      <BusyLabel owner={owner} loading={waiting} label={loadingLabel} />
    </div>
  );
}
