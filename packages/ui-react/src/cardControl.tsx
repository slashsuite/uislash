import type { ReactElement } from "react";
import { cx, insetFocusRing } from "./cx.js";
import { renderLink } from "./link.js";

/** What names or marks the control itself: these stay on the overlay; `id`, `data-*` and every other `aria-*` go on the card. */
const CONTROL_OWN = new Set(["aria-label", "aria-labelledby", "aria-current", "aria-pressed"]);

/** Splits a link or button card's props into the attributes for the root and the rest, for the control. Internal. */
export function splitRootAttrs(props: object): [Record<string, unknown>, Record<string, unknown>] {
  const root: Record<string, unknown> = {};
  const control: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    const onRoot =
      key === "id" || key.startsWith("data-") || (key.startsWith("aria-") && !CONTROL_OWN.has(key));
    (onRoot ? root : control)[key] = value;
  }
  return [root, control];
}

/** The overlay that makes the whole card one control: empty, stretched over the card, its ring drawn inside, since a clipped card cuts anything outside it. */
const STRETCH = cx("link-stretch absolute inset-0 rounded-xl", insetFocusRing);

/** What the control does: a button's press, or a link's address. */
export type CardAction =
  | { onPress: () => void; href?: undefined; external?: undefined }
  | { onPress?: undefined; href: string; external?: boolean | undefined };

/** The link or button stretched over the card, named by `nameId` unless the caller named it. Internal. */
export function cardControl(
  action: CardAction,
  control: Record<string, unknown>,
  nameId: string,
): ReactElement {
  const name = control["aria-label"] === undefined ? { "aria-labelledby": nameId } : {};
  if (action.onPress !== undefined) {
    return (
      <button
        type="button"
        {...name}
        {...control}
        onClick={action.onPress}
        className={cx(STRETCH, "cursor-pointer")}
      />
    );
  }
  return renderLink({
    ...name,
    ...control,
    href: action.href,
    external: action.external ?? false,
    className: STRETCH,
    children: null,
  });
}
