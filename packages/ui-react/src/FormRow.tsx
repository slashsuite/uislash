import type { ReactElement, ReactNode } from "react";
import { cx } from "./cx.js";
import { fieldNote } from "./Field.js";
import type { Passthrough } from "./props.js";
import { ControlBone } from "./fieldWait.js";
import { BusyLabel, busy, type LoadingProps, useLoading } from "./skeleton.js";

/** Relative widths in a `FormRow`: a field of `span` 2 is twice as wide as one of `span` 1. */
export type FormRowSpan = 1 | 2 | 3 | 4;

const SPAN: Record<FormRowSpan, string> = {
  1: "@xl:flex-1",
  2: "@xl:flex-2",
  3: "@xl:flex-3",
  4: "@xl:flex-4",
};

/**
 * Two columns of `Field`s once the grid is 36rem wide, one below that. It folds by its own width,
 * not the viewport's, so it stays one column in a `Dialog` or a side column. A `Field` takes one
 * column; `span="full"` runs it across both, and a `FormRow` is always full width.
 */
export function FormGrid({
  children,
  ...rest
}: { children: ReactNode } & Passthrough): ReactElement {
  return (
    // A container query needs an element around the grid; the attributes go on it.
    <div {...rest} className="@container w-full">
      <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2">{children}</div>
    </div>
  );
}

/**
 * An inline-edit row: several controls side by side with proportional widths (`FormRowField`
 * `span` 1 to 4), optional `actions` after them (a save button), and one `hint` or `error` line
 * under the whole row. Every control sits on the bottom edge, so the actions line up with them
 * whatever the labels do. Narrower than 36rem (the row's own width, not the viewport's) the fields
 * and the actions stack.
 *
 * The row owns the note, so the fields beside each other keep their height: a `FormRowField` has
 * no `hint` or `error` of its own.
 */
export function FormRow({
  actions,
  hint,
  error,
  children,
  ...rest
}: {
  /** A button or two after the last field. It keeps its own width. */
  actions?: ReactNode;
  /** One muted line under the whole row. */
  hint?: ReactNode;
  /** A red line under the hint, announced politely, as `Field`'s is. */
  error?: ReactNode;
  children: ReactNode;
} & Passthrough): ReactElement {
  const note = fieldNote(hint, error);
  return (
    <div {...rest} className="@container col-span-full flex flex-col gap-1.5">
      <div className="flex flex-col gap-3 @xl:flex-row @xl:items-end">
        {children}
        {actions && <div className="flex items-center gap-2 @xl:shrink-0">{actions}</div>}
      </div>
      {note}
    </div>
  );
}

/**
 * A compact label over one control, for a `FormRow`. `span` is its share of the row (1 default).
 * While `loading` the label is drawn and the control is a bone of its height, as in a `Field`.
 */
export function FormRowField({
  label,
  htmlFor,
  span = 1,
  loading,
  loadingLabel,
  children,
  ...rest
}: {
  /** The small label above the control. */
  label: ReactNode;
  /** The id of the control inside; the label's htmlFor. */
  htmlFor: string;
  /**
   * The field's share of the row, 1 to 4: a `span` of 2 is twice as wide as a 1.
   * @default 1
   */
  span?: FormRowSpan | undefined;
  children: ReactNode;
} & LoadingProps &
  Passthrough): ReactElement {
  const { loading: waiting, owner } = useLoading(loading);
  return (
    <div
      {...rest}
      {...busy(owner, waiting)}
      className={cx("flex min-w-0 flex-col gap-1", SPAN[span])}
    >
      <label htmlFor={htmlFor} className="text-xs font-medium text-slate-700">
        {label}
      </label>
      {waiting ? <ControlBone /> : children}
      <BusyLabel owner={owner} loading={waiting} label={loadingLabel} />
    </div>
  );
}
