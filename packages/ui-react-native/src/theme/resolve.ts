/**
 * A class string from core's token tables to React Native styles, for one theme. The tables are the
 * web's Tailwind utilities, so a theme reskins native as it reskins the web: by remapping the same
 * utility, read from the theme's generated `<id>.native.json`.
 *
 * - A colour utility comes from the theme (`utilities`, or `states` for a variant), and one inside a
 *   tinted surface from `within` (the `on` option).
 * - Layout and type utilities come from Tailwind's fixed scale, here; no theme changes them.
 * - `hover:` is the pressed slot, `focus-visible:` focused, `disabled:` disabled, and
 *   `placeholder:` the placeholder text colour.
 * - Each slot is split into a box part (the View) and a text part (the Text) by property, which
 *   stands in for CSS inheritance: a button's `text-sm` reaches its label.
 * - A class that is neither resolved nor web-only throws, so the set of classes is closed.
 */
import { STATE_OF_VARIANT, type NativeStyle, type NativeTheme } from "@slashsuite/core";

export const SLOTS = ["idle", "pressed", "focused", "disabled"] as const;
export type Slot = (typeof SLOTS)[number];
export type Resolved = {
  box: Record<Slot, NativeStyle>;
  text: Record<Slot, NativeStyle>;
  placeholderTextColor: string | undefined;
  /** The classes dropped as web-only. */
  dropped: string[];
};

const SLOT_OF_VARIANT: Record<string, Slot | "placeholder"> = {
  hover: "pressed",
  "focus-visible": "focused",
  disabled: "disabled",
  placeholder: "placeholder",
};

/** Web-only: transitions, cursors, scrolling, layering, arbitrary descendant variants. */
const DROP = [
  /^transition/,
  /^cursor-/,
  /^scroll-mt-/,
  /^target:/,
  /^\[&/,
  /^\*:/,
  /^relative$/,
  /^z-\d+$/,
  /^disabled:pointer-events-none$/,
  /^underline-offset-\d+$/,
  /^max-w-\[\d+ch\]$/,
];

const TEXT_PROPS = new Set([
  "color",
  "fontSize",
  "lineHeight",
  "fontWeight",
  "letterSpacing",
  "textTransform",
  "textAlign",
  "textDecorationLine",
  "fontFamily",
  "fontStyle",
  "fontVariant",
]);

const SPACE_PX = 4;
const ROOT_PX = 16;
const space = (n: string): number => Number(n) * SPACE_PX;

/** Tailwind v4's type scale: size and line height in px. */
const FONT: Record<string, [number, number]> = {
  xs: [12, 16],
  sm: [14, 20],
  base: [16, 24],
  lg: [18, 28],
  xl: [20, 28],
  "2xl": [24, 32],
  "3xl": [30, 36],
};
const WEIGHT: Record<string, string> = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
};
/** Letter spacing in em; the px is worked out from the font size of the same slot. */
const TRACKING: Record<string, number> = { tight: -0.025, normal: 0, wide: 0.025 };
const RADIUS: Record<string, number> = {
  "": 4,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  "2xl": 16,
  full: 9999,
};
const SPACING_PROP: Record<string, string[]> = {
  p: ["padding"],
  px: ["paddingHorizontal"],
  py: ["paddingVertical"],
  pt: ["paddingTop"],
  pb: ["paddingBottom"],
  pl: ["paddingLeft"],
  pr: ["paddingRight"],
  m: ["margin"],
  mx: ["marginHorizontal"],
  my: ["marginVertical"],
  mt: ["marginTop"],
  mb: ["marginBottom"],
  gap: ["gap"],
};
const ALIGN: Record<string, string> = {
  center: "center",
  start: "flex-start",
  end: "flex-end",
  baseline: "baseline",
  stretch: "stretch",
  between: "space-between",
};
/** Tailwind v4's `shadow-sm`, which the New Architecture takes as a CSS box-shadow string. */
const SHADOW: Record<string, string> = {
  "shadow-sm": "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
};

/** One class to a style by an exact name: flex and borders, which take no value. */
const EXACT: Record<string, NativeStyle> = {
  // CSS flex is a row, where React Native's default is a column.
  flex: { display: "flex", flexDirection: "row" },
  // Every RN parent is a flex container, so an inline-flex item only needs its own row.
  "inline-flex": { flexDirection: "row" },
  "flex-col": { flexDirection: "column" },
  "flex-wrap": { flexWrap: "wrap" },
  "w-full": { alignSelf: "stretch" },
  border: { borderWidth: 1, borderStyle: "solid" },
  "border-b": { borderBottomWidth: 1 },
  "border-dashed": { borderStyle: "dashed" },
  uppercase: { textTransform: "uppercase" },
  underline: { textDecorationLine: "underline" },
  "tabular-nums": { fontVariant: "tabular-nums" },
  ...Object.fromEntries(
    Object.entries(SHADOW).map(([name, value]) => [name, { boxShadow: value }]),
  ),
};

type Rule = [RegExp, (match: RegExpExecArray) => NativeStyle];
const at = (match: RegExpExecArray, index: number): string => match[index] ?? "";

/** The utilities with a value: Tailwind's fixed scale, the same in every theme. */
const RULES: Rule[] = [
  [/^items-(center|start|end|baseline|stretch)$/, (m) => ({ alignItems: ALIGN[at(m, 1)] ?? "" })],
  [/^justify-(center|start|end|between)$/, (m) => ({ justifyContent: ALIGN[at(m, 1)] ?? "" })],
  [
    /^(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|gap)-(\d+(?:\.\d+)?)$/,
    (m) => Object.fromEntries((SPACING_PROP[at(m, 1)] ?? []).map((p) => [p, space(at(m, 2))])),
  ],
  [
    /^min-(h|w)-(\d+(?:\.\d+)?)$/,
    (m) => ({ [at(m, 1) === "h" ? "minHeight" : "minWidth"]: space(at(m, 2)) }),
  ],
  [/^rounded(?:-(sm|md|lg|xl|2xl|full))?$/, (m) => ({ borderRadius: RADIUS[at(m, 1)] ?? 0 })],
  [
    /^text-(xs|sm|base|lg|xl|2xl|3xl)(?:\/(\d+))?$/,
    (m) => {
      const [size, line] = FONT[at(m, 1)] ?? [16, 24];
      return { fontSize: size, lineHeight: m[2] === undefined ? line : space(m[2]) };
    },
  ],
  // An arbitrary rem size with a unitless line height: `text-[0.625rem]/[1.4]`.
  [
    /^text-\[(\d+(?:\.\d+)?)rem\]\/\[(\d+(?:\.\d+)?)\]$/,
    (m) => {
      const size = Number(at(m, 1)) * ROOT_PX;
      return { fontSize: size, lineHeight: Math.round(size * Number(at(m, 2))) };
    },
  ],
  [/^leading-(\d+)$/, (m) => ({ lineHeight: space(at(m, 1)) })],
  [/^font-(normal|medium|semibold|bold)$/, (m) => ({ fontWeight: WEIGHT[at(m, 1)] ?? "400" })],
  [/^tracking-(tight|normal|wide)$/, (m) => ({ letterSpacingEm: TRACKING[at(m, 1)] ?? 0 })],
  [/^opacity-(\d+)$/, (m) => ({ opacity: Number(at(m, 1)) / 100 })],
  [/^outline-(\d)$/, (m) => ({ outlineWidth: Number(at(m, 1)), outlineStyle: "solid" })],
  [/^outline-offset-(\d)$/, (m) => ({ outlineOffset: Number(at(m, 1)) })],
];

/** A layout, type or effect utility, or null when it is none of Tailwind's fixed scale. */
export function staticUtility(name: string): NativeStyle | null {
  const exact = EXACT[name];
  if (exact !== undefined) return exact;
  for (const [pattern, style] of RULES) {
    const match = pattern.exec(name);
    if (match !== null) return style(match);
  }
  return null;
}

/** Colours outside the palette a component may still use, the same in every theme. */
const FIXED_COLOUR: Record<string, NativeStyle> = {
  "border-transparent": { borderColor: "transparent" },
  "bg-transparent": { backgroundColor: "transparent" },
};

export type ResolveOptions = {
  /** The tinted surface the classes sit on (`bg-red-50`), whose `within` colours win. */
  on?: string;
};

/** The style of one class without a variant: the theme's colour, a fixed colour, or the scale. */
function plainStyle(name: string, theme: NativeTheme, on: string | undefined): NativeStyle | null {
  const within = on === undefined ? undefined : theme.within[on]?.[name];
  if (name === "border-current") return { borderColor: "currentColor" };
  return within ?? theme.utilities[name] ?? FIXED_COLOUR[name] ?? staticUtility(name);
}

/** The style of `name` under `variant`: the theme's state colour for it, else its plain style. */
function variantStyle(
  variant: string,
  name: string,
  theme: NativeTheme,
  on: string | undefined,
): NativeStyle | null {
  const state = STATE_OF_VARIANT[variant];
  const themed = state === undefined ? undefined : theme.states[state][name];
  return themed ?? plainStyle(name, theme, on);
}

/** Splits one slot's style into its box and its text part, turning em tracking into px. */
function split(own: NativeStyle, idle: NativeStyle): { box: NativeStyle; text: NativeStyle } {
  const box: NativeStyle = {};
  const text: NativeStyle = {};
  for (const [key, value] of Object.entries(own)) {
    if (key === "letterSpacingEm") continue;
    (TEXT_PROPS.has(key) ? text : box)[key] = value;
  }
  if ("letterSpacingEm" in own) {
    const size = Number(own.fontSize ?? idle.fontSize ?? ROOT_PX);
    text.letterSpacing = Number(own.letterSpacingEm) * size;
  }
  // `border-current` is the text colour of the same element.
  if (box.borderColor === "currentColor") box.borderColor = text.color ?? idle.color ?? "black";
  return { box, text };
}

/** Resolves a class string for one theme into its slots; throws on a class it cannot place. */
export function resolve(
  classString: string,
  theme: NativeTheme,
  options: ResolveOptions = {},
): Resolved {
  const slot: Record<Slot, NativeStyle> = { idle: {}, pressed: {}, focused: {}, disabled: {} };
  let placeholderTextColor: string | undefined;
  const dropped: string[] = [];
  const classes = classString.split(/\s+/).filter(Boolean);

  for (const name of classes) {
    if (DROP.some((pattern) => pattern.test(name))) {
      dropped.push(name);
      continue;
    }
    const variant = /^([a-z-]+):(.+)$/.exec(name);
    const target = variant === null ? "idle" : SLOT_OF_VARIANT[at(variant, 1)];
    if (target === undefined)
      throw new Error(`resolve: no native slot for the variant in "${name}"`);
    const style =
      variant === null
        ? plainStyle(name, theme, options.on)
        : variantStyle(at(variant, 1), at(variant, 2), theme, options.on);
    if (style === null) throw new Error(`resolve: unknown class "${name}"`);
    if (target === "placeholder") {
      placeholderTextColor = String(style.placeholderTextColor ?? style.color);
      continue;
    }
    Object.assign(slot[target], style);
  }

  // A theme rule keyed on two classes at once (a flat, plain disabled solid Button).
  for (const compound of theme.compounds) {
    if (classes.includes(compound.utility) && compound.requiresAny.some((r) => classes.includes(r)))
      Object.assign(slot.disabled, compound.style);
  }

  const box = {} as Record<Slot, NativeStyle>;
  const text = {} as Record<Slot, NativeStyle>;
  for (const name of SLOTS) {
    const parts = split(slot[name], slot.idle);
    box[name] = parts.box;
    text[name] = parts.text;
  }
  return { box, text, placeholderTextColor, dropped };
}

export type InteractionState = { pressed?: boolean; focused?: boolean; disabled?: boolean };

/** The style for a state: idle, then each active slot over it, in CSS order (hover, focus, disabled). */
export function pick(
  resolved: Resolved,
  state: InteractionState = {},
): { box: NativeStyle; text: NativeStyle } {
  const on: Slot[] = ["idle"];
  if (state.pressed === true && state.disabled !== true) on.push("pressed");
  if (state.focused === true) on.push("focused");
  if (state.disabled === true) on.push("disabled");
  return {
    box: Object.assign({}, ...on.map((name) => resolved.box[name])) as NativeStyle,
    text: Object.assign({}, ...on.map((name) => resolved.text[name])) as NativeStyle,
  };
}
