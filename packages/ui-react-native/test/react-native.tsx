/**
 * A DOM stand-in for `react-native`, for the unit tests under jsdom: each primitive renders an
 * element that carries its props as data, so a test reads what a component handed React Native.
 * The device runs (Hermes, RNTL, Maestro) are where the real one is checked.
 */
import { createElement, type ReactNode, useState } from "react";

type Props = Record<string, unknown> & { children?: ReactNode };
type Style = Record<string, unknown> | undefined;

const styleOf = (style: unknown): string | undefined =>
  style === undefined ? undefined : JSON.stringify(style);

const host =
  (tag: string, kind: string) =>
  ({
    children,
    style,
    testID,
    accessibilityLabel,
    accessibilityHint,
    accessibilityRole,
    accessibilityState,
  }: Props) =>
    createElement(
      tag,
      {
        "data-rn": kind,
        "data-style": styleOf(style),
        "data-testid": testID,
        "aria-label": accessibilityLabel,
        "data-hint": accessibilityHint,
        "data-role": accessibilityRole,
        "data-state": styleOf(accessibilityState),
      },
      children,
    );

export const View = host("div", "View");
export const Text = ({ children, style, maxFontSizeMultiplier }: Props) =>
  createElement(
    "span",
    { "data-rn": "Text", "data-style": styleOf(style), "data-max-scale": maxFontSizeMultiplier },
    children,
  );

type PressableProps = Props & {
  style?: Style | ((state: { pressed: boolean }) => Style);
  children?: ReactNode | ((state: { pressed: boolean }) => ReactNode);
  onPress?: () => void;
  disabled?: boolean;
};

/** A button; pointer down holds `pressed`, so a test can read the pressed style. */
export function Pressable({ style, children, onPress, disabled, ...rest }: PressableProps) {
  const [pressed, setPressed] = useState(false);
  const resolvedStyle = typeof style === "function" ? style({ pressed }) : style;
  const content = typeof children === "function" ? children({ pressed }) : children;
  return createElement(
    "button",
    {
      "data-rn": "Pressable",
      "data-style": styleOf(resolvedStyle),
      "data-testid": rest.testID,
      "aria-label": rest.accessibilityLabel,
      "data-hint": rest.accessibilityHint,
      "data-role": rest.accessibilityRole,
      "data-state": styleOf(rest.accessibilityState),
      disabled,
      onClick: onPress,
      onPointerDown: () => setPressed(true),
      onPointerUp: () => setPressed(false),
    },
    content,
  );
}

export function Modal({ visible, children }: Props & { visible: boolean }) {
  return visible ? createElement("div", { "data-rn": "Modal" }, children) : null;
}

export const Linking = {
  opened: [] as string[],
  openURL(url: string): Promise<void> {
    Linking.opened.push(url);
    return Promise.resolve();
  },
};

export const device = { width: 390, height: 844, scheme: "light" as "light" | "dark" | null };
export const useWindowDimensions = () => ({
  width: device.width,
  height: device.height,
  scale: 3,
  fontScale: 1,
});
export const useColorScheme = () => device.scheme;
export const PixelRatio = { get: () => 3 };
