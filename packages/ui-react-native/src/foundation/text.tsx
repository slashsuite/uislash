/**
 * F2: text on native. React Native does not inherit a text style through a View, so a box hands its
 * text part down through `TextStyleContext`, and `renderText` wraps a bare string in a Text that
 * takes it. Line heights are px from the tables; the system's text size grows the text up to
 * `MAX_FONT_SCALE`, past which a control would outgrow its row.
 */
import type { NativeStyle } from "@slashsuite/core";
import {
  Children,
  createContext,
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useContext,
} from "react";
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

/** A `<>…</>`, whose children sit beside its siblings once rendered. */
function isFragment(node: ReactNode): node is ReactElement<{ children?: ReactNode }> {
  return isValidElement(node) && node.type === Fragment;
}

/** `children` as one flat list: nested arrays and fragments opened, null and booleans dropped. */
function flatten(children: ReactNode): ReactNode[] {
  return Children.toArray(children).flatMap((child) =>
    isFragment(child) ? flatten(child.props.children) : [child],
  );
}

/**
 * `children` with each run of bare strings and numbers wrapped in one `InheritedText`, so
 * `Delete {n} items` stays one run of text (one flex item, wrapping as a sentence); elements pass
 * as they are, and nested arrays and fragments are opened first (`flatten`).
 */
export function renderText(children: ReactNode): ReactNode {
  if (isBareText(children)) return <InheritedText>{children}</InheritedText>;
  if (!Array.isArray(children) && !isFragment(children)) return children;
  const out: ReactNode[] = [];
  let run: Array<string | number> = [];
  const flush = (): void => {
    if (run.length > 0)
      out.push(<InheritedText key={`text-${out.length}`}>{run.join("")}</InheritedText>);
    run = [];
  };
  for (const child of flatten(children)) {
    if (isBareText(child)) run.push(child);
    else {
      flush();
      out.push(child);
    }
  }
  flush();
  return out;
}
