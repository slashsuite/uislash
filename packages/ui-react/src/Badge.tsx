import type { ReactElement } from "react";
import { cx } from "./cx.js";
import type { Passthrough } from "./props.js";
import { type LoadingProps, useLoading, WaitingBone } from "./skeleton.js";

/**
 * A small red count, 10px, for sitting on an icon. Its size is in rem and its height grows with
 * its line, so it scales with the reader's text size instead of clipping. An icon with a count is an `IconButton` with
 * its `count`, which pins the Badge to its corner and puts the count in the button's name. A
 * count above 99 reads `99+`. While `loading` it is
 * a bone of its size: a count is a number, so 0 is a value and not a gap.
 */
export function Badge({
  count,
  corner = false,
  loading: ownLoading,
  loadingLabel,
  ...rest
}: {
  /** The number shown; above 99 it reads `99+`. */
  count: number;
  /** Pin it to the top corner at the end edge of its `relative` parent, over the icon. */
  corner?: boolean;
} & LoadingProps &
  Passthrough): ReactElement {
  if (useLoading(ownLoading).loading) {
    return (
      <WaitingBone
        own={ownLoading}
        label={loadingLabel}
        attrs={rest}
        root={cx("inline-flex", corner && "absolute -end-2 -top-2")}
        shape="inline-block h-5 w-6 rounded-full"
      />
    );
  }
  return (
    <span
      {...rest}
      className={cx(
        "inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-sm/5 font-semibold text-red-50",
        corner && "absolute -end-2 -top-2",
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
