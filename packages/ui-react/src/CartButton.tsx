import type { MouseEventHandler, ReactElement } from "react";
import { Button, COUNT } from "./Button.js";
import type { Passthrough } from "./props.js";

const itemsOf = (count: number): string => (count === 1 ? "1 item" : `${count} items`);

/**
 * The header's cart: the bag icon, how many things are in it and, with `total`, what they come to.
 * It is one ghost button that opens the cart (a `Drawer`), so pass `aria-expanded` and
 * `aria-controls` with the drawer's state; with `href` it is a link to the cart page instead. A
 * screen reader hears it as "Cart, 2 items, R480": the label, the count in words and the total.
 * The count is drawn whatever it is, `0` included, so the header does not shift as things go in.
 */
export function CartButton({
  count,
  total,
  label = "Cart",
  itemsLabel = itemsOf,
  onClick,
  href,
  ...rest
}: {
  /** How many things are in the cart; `0` is shown. */
  count: number;
  /** What they come to, formatted by the app ("R480"). Left out, only the count shows. */
  total?: string | undefined;
  /**
   * The button's name before the count.
   * @default Cart
   */
  label?: string | undefined;
  /**
   * The count in words, for a screen reader, in an app's own language.
   * @default 1 item, or n items
   */
  itemsLabel?: ((count: number) => string) | undefined;
} & Passthrough &
  (
    | {
        /** Opens the cart; pass `aria-expanded` and `aria-controls` for the drawer it opens. */
        onClick: MouseEventHandler<HTMLButtonElement>;
        href?: undefined;
      }
    | {
        onClick?: undefined;
        /** The cart's own page, in place of a drawer; an in-app path goes through `LinkProvider`. */
        href: string;
      }
  )): ReactElement {
  const words = `${label}, ${itemsLabel(count)}${total ? `, ${total}` : ""}`;
  const body = (
    <>
      <span className="sr-only">{words}</span>
      <span aria-hidden="true" className={COUNT}>
        {count}
      </span>
      {total && (
        <span aria-hidden="true" className="tabular-nums">
          {total}
        </span>
      )}
    </>
  );
  if (href !== undefined) {
    return (
      <Button {...rest} variant="ghost" icon="cart" href={href}>
        {body}
      </Button>
    );
  }
  return (
    <Button {...rest} variant="ghost" icon="cart" onClick={onClick}>
      {body}
    </Button>
  );
}
