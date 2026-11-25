/**
 * F8: the web's event props on native. A press is `onClick` on both renderers, a text field's change
 * hands over the value (`onChange(value)`), never an event, so a handler is the same function on both.
 */
import type { GestureResponderEvent } from "react-native";

export type PressProps = { onClick?: ((event: GestureResponderEvent) => void) | undefined };

/** `onClick` as `onPress`, left out when unset. */
export function pressProps(props: PressProps): {
  onPress?: (event: GestureResponderEvent) => void;
} {
  return props.onClick === undefined ? {} : { onPress: props.onClick };
}

export type ValueProps = {
  value?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
};

/** A field's `value` and `onChange(value)` as a TextInput's `value` and `onChangeText`. */
export function valueProps(props: ValueProps): {
  value?: string;
  onChangeText?: (value: string) => void;
} {
  const out: { value?: string; onChangeText?: (value: string) => void } = {};
  if (props.value !== undefined) out.value = props.value;
  if (props.onChange !== undefined) out.onChangeText = props.onChange;
  return out;
}
