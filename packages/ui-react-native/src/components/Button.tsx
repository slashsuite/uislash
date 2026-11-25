/**
 * Button on native, drawn from core's tables: the same box, look, tone and text as the web's, resolved
 * against the theme in force. `onClick` is the press; `disabledReason` and `busy` are the two disabled
 * states that say more than a plain `disabled`, read out as the hint and as busy; busy wins, as on
 * the web. A size under 44pt tall gets a hitSlop to a 44pt target, without growing what is drawn.
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
  parityManifest,
} from "@slashsuite/core";
import { type ReactElement, type ReactNode, useState } from "react";
import { type GestureResponderEvent, Pressable } from "react-native";
import { a11y } from "../foundation/a11y.js";
import { pressProps } from "../foundation/events.js";
import { hitSlopFor, MIN_TARGET } from "../foundation/metrics.js";
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
  /** The work is in flight: disabled and busy. A string is also the label while busy (`Saving`). Wins over `disabledReason`. */
  busy?: boolean | string | undefined;
  /** The type step of an app's chrome. */
  step?: ControlTypeStep | undefined;
  onClick?: ((event: GestureResponderEvent) => void) | undefined;
  "aria-label"?: string | undefined;
  "data-testid"?: string | undefined;
};

type State = "idle" | "blocked" | "busy";

/** A Button's look: the three props that pick its classes. */
export type ButtonLook = { variant: ButtonVariant; size: ButtonSize; tone: ButtonTone };

/** The classes of a Button, as the web draws them at one size (no responsive size on native). */
export function nativeButtonClass(
  { variant, size, tone }: ButtonLook,
  state: State = "idle",
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

/** Busy wins over a reason, and an empty reason is none, as on the web. */
function stateOf(busy: boolean, disabledReason: string | undefined): State {
  if (busy) return "busy";
  return disabledReason !== undefined && disabledReason !== "" ? "blocked" : "idle";
}

/** What a reader hears: the label, the reason while blocked, and the disabled, busy and toggle state. */
function buttonA11y(
  state: State,
  off: boolean,
  toggled: boolean | undefined,
  { "aria-label": label, disabledReason, "data-testid": testID }: ButtonProps,
) {
  return a11y({
    role: "button",
    "aria-label": label,
    "aria-description": state === "blocked" ? disabledReason : undefined,
    "aria-disabled": off,
    "aria-busy": state === "busy",
    "aria-pressed": toggled,
    "data-testid": testID,
  });
}

/** The touch target of each size: the drawn height from the parity manifest, slopped to 44pt. */
const HIT_SLOP = Object.fromEntries(
  Object.entries(parityManifest().components["Button"] ?? {}).map(([size, box]) => [
    size,
    hitSlopFor(MIN_TARGET, box.height),
  ]),
);

/** The props a Button reads with their defaults filled in. */
function withDefaults(props: ButtonProps) {
  return {
    variant: props.variant ?? "primary",
    size: props.size ?? "md",
    tone: props.tone ?? "neutral",
    step: props.step ?? "default",
    disabled: props.disabled ?? false,
    busy: props.busy ?? false,
  };
}

/** A Button: a Pressable box with its label in the variant's text. */
export function Button(props: ButtonProps): ReactElement {
  const { children, pressed, onClick } = props;
  const { variant, size, tone, step, disabled, busy } = withDefaults(props);
  const state = stateOf(Boolean(busy), props.disabledReason);
  const styles = useStyles(nativeButtonClass({ variant, size, tone }, state, { pressed, step }));
  const [focused, setFocused] = useState(false);
  const off = disabled || state !== "idle";
  const toggle = pressed !== undefined && (variant === "outline" || variant === "ghost");
  const slot = (down: boolean) =>
    pick(styles, { pressed: down, focused, disabled: disabled && state === "idle" });
  const hitSlop = HIT_SLOP[size];
  return (
    <Pressable
      {...buttonA11y(state, off, toggle ? pressed : undefined, props)}
      {...pressProps({ onClick })}
      {...(hitSlop === undefined ? {} : { hitSlop })}
      disabled={off}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={({ pressed: down }) => slot(down).box}
    >
      {({ pressed: down }) => (
        <TextStyleProvider style={slot(down).text}>
          {renderText(state === "busy" && typeof busy === "string" ? busy : children)}
        </TextStyleProvider>
      )}
    </Pressable>
  );
}
