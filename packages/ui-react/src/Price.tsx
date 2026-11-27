import type { ReactElement } from "react";
import { cx } from "./cx.js";
import type { Passthrough } from "./props.js";
import { BusyLabel, busy, type LoadingProps, useLoading, WaitingBone } from "./skeleton.js";
import type { Size } from "./size.js";

const SIZE: Record<Size, string> = {
  sm: "text-sm/5",
  md: "text-base/6",
  lg: "text-2xl/8",
};

/** The was price is a step smaller than the price it sits beside, except at `sm`, where both are 14px: no text is smaller. */
const WAS_SIZE: Record<Size, string> = {
  sm: "text-sm/5",
  md: "text-sm/6",
  lg: "text-base/8",
};

const BONE: Record<Size, string> = {
  sm: "inline-block h-[0.6lh] w-12 rounded align-middle",
  md: "inline-block h-[0.6lh] w-14 rounded align-middle",
  lg: "inline-block h-[0.6lh] w-20 rounded align-middle",
};

/**
 * A price as the page already formatted it ("R52"), in tabular figures so a column of prices lines
 * up. With `was` the old price follows it struck through, and a screen reader hears "R52, was R65",
 * since a strike says nothing out loud. It formats nothing: the app owns the currency and the
 * locale. While `loading` with no `value` yet it is a bone of its size.
 */
export function Price({
  value,
  was,
  size = "md",
  loading: ownLoading,
  loadingLabel,
  ...rest
}: {
  /** The price, formatted for the reader ("R52", "€12.50"). While `loading`, none yet is a bone. */
  value: string | undefined;
  /** The price before a sale, struck through after `value`. */
  was?: string | undefined;
  /**
   * `sm` for a dense row, `md` for a tile, `lg` for a product's own page.
   * @default md
   */
  size?: Size | undefined;
} & LoadingProps &
  Passthrough): ReactElement {
  const { loading, owner } = useLoading(ownLoading);
  if (value === undefined || value === "") {
    if (!loading) return <span {...rest} />;
    return (
      <WaitingBone
        own={ownLoading}
        label={loadingLabel}
        attrs={rest}
        root={cx("inline-flex", SIZE[size])}
        shape={BONE[size]}
      />
    );
  }
  return (
    <span
      {...rest}
      {...busy(owner, loading)}
      className={cx("inline-flex flex-wrap items-baseline gap-x-2 tabular-nums", SIZE[size])}
    >
      <span className="font-semibold text-slate-900">{value}</span>
      {was !== undefined && was !== "" && (
        <>
          <span className="sr-only">, was </span>
          <s className={cx("text-slate-600", WAS_SIZE[size])}>{was}</s>
        </>
      )}
      <BusyLabel owner={owner} loading={loading} label={loadingLabel} />
    </span>
  );
}
