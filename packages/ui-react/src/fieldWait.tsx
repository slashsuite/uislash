import type { ReactElement, ReactNode } from "react";
import { cx } from "./cx.js";
import { controlHeight } from "./control.js";
import { useResponsiveDensity } from "./density.js";
import type { ResponsiveSize, Size } from "./size.js";
import { Bone, BusyLabel, busy, passthroughOf, useLoading } from "./skeleton.js";

/* The bones of a form part waiting for its value: the label is drawn, the control is a bone. */

/** A bone the height of a text control at `size`, else the density around it (a `sm` table or card). */
export function ControlBone({ size }: { size?: Size | ResponsiveSize | undefined }): ReactElement {
  return <Bone shape={cx("block w-full rounded-lg", controlHeight(useResponsiveDensity(size)))} />;
}

/**
 * A choice (a checkbox, a switch, a radio) waiting for its value: the mark a bone of its shape, the
 * label drawn beside it, then the owner's hidden label.
 */
export function WaitingChoice({
  own,
  loadingLabel,
  label,
  look,
  shape,
  attrs,
}: {
  own: boolean | undefined;
  loadingLabel: string | undefined;
  label: ReactNode;
  look: string;
  shape: string;
  attrs: object;
}): ReactElement {
  const { loading, owner } = useLoading(own);
  return (
    <span
      {...passthroughOf(attrs)}
      {...busy(owner, loading)}
      className={cx("inline-flex items-start text-slate-700", look)}
    >
      <Bone shape={cx("shrink-0", shape)} />
      {label != null && <span>{label}</span>}
      <BusyLabel owner={owner} loading={loading} label={loadingLabel} />
    </span>
  );
}

/**
 * A field with its own label (a date field) waiting for its value: the label drawn as `look` sets
 * it, the control a bone of its height, then the owner's hidden label.
 */
export function WaitingField({
  own,
  loadingLabel,
  label,
  look,
  size,
  attrs,
}: {
  own: boolean | undefined;
  loadingLabel: string | undefined;
  label: ReactNode;
  look: string;
  size: Size | ResponsiveSize | undefined;
  attrs: object;
}): ReactElement {
  const { loading, owner } = useLoading(own);
  return (
    <div {...passthroughOf(attrs)} {...busy(owner, loading)} className="flex flex-col gap-1.5">
      {label != null && <span className={look}>{label}</span>}
      <ControlBone size={size} />
      <BusyLabel owner={owner} loading={loading} label={loadingLabel} />
    </div>
  );
}
