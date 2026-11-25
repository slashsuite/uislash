/**
 * F2: text on native. React Native does not inherit a text style through a View, so a box hands its
 * text part down through `TextStyleContext`, and `renderText` wraps a bare string in a Text that
 * takes it. Line heights are px from the tables; the system's text size grows the text up to
 * `MAX_FONT_SCALE`, past which a control would outgrow its row.
 */
import type { NativeStyle } from "@slashsuite/core";
import { createContext, type ReactElement, type ReactNode, useContext } from "react";
import { Text } from "react-native";

/** The most the system's text size may grow a control's text. */
export const MAX_FONT_SCALE = 1.3;

const TextStyleContext = createContext<NativeStyle>({});

/** The text style in force here: the nearest box's text part, over the theme's base. */
export function useTextStyle(): NativeStyle {
  return useContext(TextStyleContext);
}

export type TextStyleProviderProps = { style: NativeStyle; children?: ReactNode };

/** Hands `style` down to the text inside, over the style already in force. */
export function TextStyleProvider({ style, children }: TextStyleProviderProps): ReactElement {
  const outer = useContext(TextStyleContext);
  return (
    <TextStyleContext.Provider value={{ ...outer, ...style }}>{children}</TextStyleContext.Provider>
  );
}

/** Whether a child is text React Native needs inside a Text. */
export const isBareText = (child: ReactNode): child is string | number =>
  typeof child === "string" || typeof child === "number";

/** A Text in the style in force. */
export function InheritedText({ children }: { children?: ReactNode }): ReactElement {
  const style = useTextStyle();
  return (
    <Text style={style} maxFontSizeMultiplier={MAX_FONT_SCALE}>
      {children}
    </Text>
  );
}

/** `children` with each bare string or number wrapped in an `InheritedText`; elements pass as they are. */
export function renderText(children: ReactNode): ReactNode {
  if (isBareText(children)) return <InheritedText>{children}</InheritedText>;
  if (!Array.isArray(children)) return children;
  return children.map((child: ReactNode, index) =>
    isBareText(child) ? <InheritedText key={index}>{child}</InheritedText> : child,
  );
}
