/**
 * F7: the web's ARIA props to React Native's accessibility props, so a component takes the same
 * props on both renderers and a test finds it by the same id (`testID` from `data-testid`).
 */
import type { AccessibilityRole, AccessibilityState } from "react-native";

export type AriaProps = {
  role?: AccessibilityRole | undefined;
  "aria-label"?: string | undefined;
  "aria-description"?: string | undefined;
  "aria-disabled"?: boolean | undefined;
  "aria-busy"?: boolean | undefined;
  "aria-pressed"?: boolean | undefined;
  "aria-expanded"?: boolean | undefined;
  "aria-selected"?: boolean | undefined;
  "aria-checked"?: boolean | "mixed" | undefined;
  "aria-hidden"?: boolean | undefined;
  "data-testid"?: string | undefined;
};

export type NativeA11y = {
  accessible?: boolean;
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityState?: AccessibilityState;
  accessibilityElementsHidden?: boolean;
  importantForAccessibility?: "no-hide-descendants";
  testID?: string;
};

/** The accessibility state from the ARIA states given; undefined when none is. */
function state(props: AriaProps): AccessibilityState | undefined {
  const out: AccessibilityState = {};
  if (props["aria-disabled"] !== undefined) out.disabled = props["aria-disabled"];
  if (props["aria-busy"] !== undefined) out.busy = props["aria-busy"];
  if (props["aria-pressed"] !== undefined) out.checked = props["aria-pressed"];
  if (props["aria-checked"] !== undefined) out.checked = props["aria-checked"];
  if (props["aria-expanded"] !== undefined) out.expanded = props["aria-expanded"];
  if (props["aria-selected"] !== undefined) out.selected = props["aria-selected"];
  return Object.keys(out).length === 0 ? undefined : out;
}

/** The native accessibility props for the ARIA props given, leaving out what is unset. */
export function a11y(props: AriaProps): NativeA11y {
  const out: NativeA11y = {};
  if (props.role !== undefined) out.accessibilityRole = props.role;
  if (props["aria-label"] !== undefined) out.accessibilityLabel = props["aria-label"];
  if (props["aria-description"] !== undefined) out.accessibilityHint = props["aria-description"];
  const accessibilityState = state(props);
  if (accessibilityState !== undefined) out.accessibilityState = accessibilityState;
  if (props["aria-hidden"] === true) {
    out.accessibilityElementsHidden = true;
    out.importantForAccessibility = "no-hide-descendants";
  }
  if (props["data-testid"] !== undefined) out.testID = props["data-testid"];
  return out;
}
