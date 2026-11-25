/**
 * Button on native, drawn from core's tables: the same box, look, tone and text as the web's, resolved
 * against the theme in force. `onClick` is the press; `disabledReason` and `busy` are the two disabled
 * states that say more than a plain `disabled`, read out as the hint and as busy.
 */
import {
  BUTTON_BLOCKED,
  BUTTON_BLOCKED_BY_VARIANT,
  BUTTON_BOX,
  BUTTON_BUSY,
  BUTTON_DASHED_BOX,
  BUTTON_DISABLED_PLAIN,
  BUTTON_LINK_GAP,
  BUTTON_SHAPE,
  type ButtonSize,
  type ButtonTone,
  type ButtonVariant,
  buttonLook,
  CONTROL_LEADING,
  CONTROL_TEXT,
  type ControlTypeStep,
  FOCUS_RING,
} from "@slashsuite/core";
import { type ReactElement, type ReactNode, useState } from "react";
import { type GestureResponderEvent, Pressable, type ViewStyle } from "react-native";
import { TextStyleProvider, renderText } from "../foundation/text.js";
import { pick } from "../theme/resolve.js";
import { useStyles } from "../theme/ThemeProvider.js";

export type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant | undefined;
  size?: ButtonSize | undefined;
  tone?: ButtonTone | undefined;
  /** An outline or ghost Button with `pressed` set is a toggle. */
  pressed?: boolean | undefined;
  disabled?: boolean | undefined;
  /** Why the action is blocked: the Button is disabled and the reason is its hint. */
  disabledReason?: string | undefined;
  /** What it is doing (`Saving`): the label swaps to it and the Button is disabled and busy. */
  busy?: string | undefined;
  /** The type step of an app's chrome. */
  step?: ControlTypeStep | undefined;
  onClick?: ((event: GestureResponderEvent) => void) | undefined;
  "aria-label"?: string | undefined;
  "data-testid"?: string | undefined;
};

type State = "idle" | "blocked" | "busy";

/** The classes of a Button, as the web draws them at one size (no responsive size on native). */
export function nativeButtonClass(
  variant: ButtonVariant,
  size: ButtonSize,
  tone: ButtonTone,
  state: State,
  { pressed, step = "default" }: { pressed?: boolean | undefined; step?: ControlTypeStep } = {},
): string {
  const shape = [
    BUTTON_SHAPE,
    variant === "link" ? BUTTON_LINK_GAP : BUTTON_BOX[size],
    variant === "dashed" ? BUTTON_DASHED_BOX : "",
    CONTROL_TEXT[step][size],
    CONTROL_LEADING[size],
    FOCUS_RING,
  ];
  const look = buttonLook(variant, tone, pressed);
  const rest: Record<State, string[]> = {
    blocked: [BUTTON_BLOCKED_BY_VARIANT[variant] ?? BUTTON_BLOCKED],
    busy: [look.color, BUTTON_BUSY],
    idle: [BUTTON_DISABLED_PLAIN, look.color, look.hover],
  };
  return [...shape, ...rest[state]].filter(Boolean).join(" ");
}

/** A Button: a Pressable box with its label in the variant's text. */
export function Button({
  children,
  variant = "primary",
  size = "md",
  tone = "neutral",
  pressed,
  disabled = false,
  disabledReason,
  busy,
  step = "default",
  onClick,
  "aria-label": label,
  "data-testid": testID,
}: ButtonProps): ReactElement {
  const state: State =
    disabledReason !== undefined ? "blocked" : busy !== undefined ? "busy" : "idle";
  const styles = useStyles(nativeButtonClass(variant, size, tone, state, { pressed, step }));
  const [focused, setFocused] = useState(false);
  const off = disabled || state !== "idle";
  const toggle = pressed !== undefined && (variant === "outline" || variant === "ghost");
  return (
    <Pressable
      accessibilityRole="button"
      {...(label === undefined ? {} : { accessibilityLabel: label })}
      {...(disabledReason === undefined ? {} : { accessibilityHint: disabledReason })}
      accessibilityState={{
        disabled: off,
        busy: state === "busy",
        ...(toggle ? { checked: pressed } : {}),
      }}
      {...(testID === undefined ? {} : { testID })}
      disabled={off}
      {...(onClick === undefined ? {} : { onPress: onClick })}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={({ pressed: down }) =>
        pick(styles, { pressed: down, focused, disabled: disabled && state === "idle" })
          .box as ViewStyle
      }
    >
      {({ pressed: down }) => (
        <TextStyleProvider
          style={
            pick(styles, { pressed: down, focused, disabled: disabled && state === "idle" }).text
          }
        >
          {renderText(busy ?? children)}
        </TextStyleProvider>
      )}
    </Pressable>
  );
}
