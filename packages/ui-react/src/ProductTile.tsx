import type { ReactElement } from "react";
import { cx, focusRing } from "./cx.js";
import { Image } from "./Image.js";
import { renderLink } from "./link.js";
import { Price } from "./Price.js";
import type { Passthrough } from "./props.js";
import {
  BoneLines,
  BusyLabel,
  busy,
  type LoadingProps,
  LoadingScope,
  useLoading,
} from "./skeleton.js";

/** What a tile's corner says: the thing is on sale, or there are none left. */
export type ProductTileStatus = "sale" | "sold-out";

const STATUS_WORD: Record<ProductTileStatus, string> = { sale: "Sale", "sold-out": "Sold out" };

/** Sale is the danger tone's solid pair; sold out sits on the media scrim, as a `MediaTile` badge. */
const STATUS_LOOK: Record<ProductTileStatus, string> = {
  sale: "bg-red-600 text-red-50",
  "sold-out": "bg-black/90 text-white",
};

/**
 * One thing for sale in a shop's grid: its picture, its name and its `Price` (with the was price
 * on a sale), and a corner word for `sale` or `sold-out`. The whole tile is one link to the
 * product's page, named by what it says: "Linen shirt, R52, was R65, Sale". The picture is
 * decoration, since the name says what it is. It fills its column, so a set of them goes in a
 * `CardGrid`. While `loading` the picture, the name and the price that are not here yet are bones.
 */
export function ProductTile({
  href,
  name,
  src,
  price,
  was,
  status,
  statusLabel,
  aspect = "square",
  loading: ownLoading,
  loadingLabel,
  ...rest
}: {
  /** The product's page; an in-app path goes through `LinkProvider`. */
  href: string;
  /** The product's name, the tile's first words. While `loading`, none yet is a bone. */
  name: string | undefined;
  /** The product's picture. Left out, or if it fails to load, the picture's placeholder shows. */
  src?: string | undefined;
  /** The price, formatted by the app ("R52"), as `Price`'s `value`. */
  price: string | undefined;
  /** The price before the sale, struck through after `price`. */
  was?: string | undefined;
  /** A word on the picture's top-left corner: `sale`, or `sold-out` when there are none left. */
  status?: ProductTileStatus | undefined;
  /**
   * The corner's word, for an app in another language.
   * @default Sale, or Sold out
   */
  statusLabel?: string | undefined;
  /**
   * The picture's shape: `square` for most things, `3:4` for clothes on a person.
   * @default square
   */
  aspect?: "square" | "3:4" | undefined;
} & LoadingProps &
  Passthrough): ReactElement {
  const { loading, owner } = useLoading(ownLoading);
  const body = (
    <LoadingScope loading={loading}>
      <Image src={src} alt="" aspect={aspect} />
      <span className="mt-2 block text-sm/5 font-medium text-slate-900 group-hover:underline">
        {name === undefined || name === "" ? loading && <BoneLines count={1} width="3/4" /> : name}
      </span>
      <span className="mt-0.5 block">
        <span className="sr-only">, </span>
        <Price value={price} was={was} size="sm" />
      </span>
      {status && (
        <span
          className={cx(
            "absolute top-2 left-2 max-w-[calc(100%-1rem)] truncate rounded px-1.5 py-0.5 text-sm font-semibold",
            STATUS_LOOK[status],
          )}
        >
          <span className="sr-only">, </span>
          {statusLabel ?? STATUS_WORD[status]}
        </span>
      )}
      <BusyLabel owner={owner} loading={loading} label={loadingLabel} />
    </LoadingScope>
  );
  return renderLink({
    ...rest,
    ...busy(owner, loading),
    href,
    external: false,
    className: cx("group relative block min-w-0 rounded-lg", focusRing),
    children: body,
  });
}
