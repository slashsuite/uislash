import { Children, type ReactElement, type ReactNode } from "react";
import type { Passthrough } from "./props.js";
import { cx } from "./cx.js";
import {
  Bone,
  BusyLabel,
  busy,
  isEmptySlot,
  LoadingScope,
  type LoadingProps,
  useLoading,
} from "./skeleton.js";
import { Caption } from "./typography.js";

/** The mark between MetaList items: `·`, `•`, or `none` for a gap alone. */
export type MetaListSeparator = "·" | "•" | "none";

/** The width of the slot before each item, and the list's start pulled back by it: a mark with room each side, or a gap alone. */
const SLOT = {
  mark: { slot: "w-7", list: "-ms-7" },
  none: { slot: "w-3", list: "-ms-3" },
} as const;

/**
 * A wrapping row of facts or links in muted small text, joined by a `·`: branch · SHA · date, or a
 * footer's Privacy · Terms · Email. An item is text, a `Code` or a `TextLink`. The separator is
 * `aria-hidden` and leads every item in a slot of its own; the list starts one slot before its box,
 * which clips it, so the separator of whichever item starts a line falls outside and no line starts
 * or ends with one, at any width. `separator` swaps it for a `•` or none. An item never breaks
 * inside itself: the row wraps between items. `mono` sets the whole row in the monospace face, for ids and paths.
 * While `loading` with no items it draws three word-sized bones.
 */
export function MetaList({
  mono = false,
  separator = "·",
  loading: ownLoading,
  loadingLabel,
  children,
  ...rest
}: {
  /** The whole row in the monospace face, for ids and paths. */
  mono?: boolean | undefined;
  /**
   * The mark between items: `·`, `•`, or `none` for a gap alone.
   * @default ·
   */
  separator?: MetaListSeparator | undefined;
  children?: ReactNode;
} & LoadingProps &
  Passthrough): ReactElement {
  const { loading, owner } = useLoading(ownLoading);
  const items =
    loading && isEmptySlot(children)
      ? [0, 1, 2].map((i) => (
          <Bone key={i} shape="inline-block h-[0.6lh] w-16 rounded align-middle" />
        ))
      : Children.toArray(children);
  const slot = SLOT[separator === "none" ? "none" : "mark"];
  // The box clips sideways only, with a little room at the start for a link's focus ring.
  return (
    <div className="-ms-1 overflow-x-clip ps-1">
      <ul
        {...rest}
        {...busy(owner, loading)}
        className={cx(
          "flex flex-wrap items-center gap-y-1 text-sm text-slate-500",
          slot.list,
          mono && "font-mono",
        )}
      >
        {items.map((child, index) => (
          <li key={index} className="inline-flex items-center whitespace-nowrap">
            <span aria-hidden="true" className={cx("inline-block text-center", slot.slot)}>
              {separator !== "none" && <Caption as="span">{separator}</Caption>}
            </span>
            <LoadingScope loading={loading}>{child}</LoadingScope>
          </li>
        ))}
        {owner && loading && (
          <li className="sr-only">
            <BusyLabel owner={owner} loading={loading} label={loadingLabel} />
          </li>
        )}
      </ul>
    </div>
  );
}
