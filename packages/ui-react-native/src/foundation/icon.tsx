/**
 * F6: icons on native. An icon is an element the app brings (an SVG component); `Icon` hands it the
 * size and the colour in force, so it matches the text beside it, as `currentColor` does on the web.
 * `ToneContext` carries a tone's ink to the icons inside.
 */
import {
  cloneElement,
  createContext,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useContext,
} from "react";
import { useTextStyle } from "./text.js";

/** The icon sizes, in px: the web's `sm`, `md` and `lg`. */
export const ICON_PX = { sm: 16, md: 20, lg: 24 } as const;
export type IconSize = keyof typeof ICON_PX;

/** The ink a tone sets for the icons inside, over the text colour. */
export const ToneContext = createContext<string | null>(null);

export type IconProps = { size?: IconSize | undefined; children: ReactNode };

/** `children` (one icon element) given `width`, `height` and `color`. */
export function Icon({ size = "md", children }: IconProps): ReactElement | null {
  const tone = useContext(ToneContext);
  const text = useTextStyle();
  if (!isValidElement<{ width?: number; height?: number; color?: string }>(children)) return null;
  const px = ICON_PX[size];
  const color = tone ?? (text.color === undefined ? undefined : String(text.color));
  return cloneElement(children, {
    width: px,
    height: px,
    ...(color === undefined ? {} : { color }),
  });
}
