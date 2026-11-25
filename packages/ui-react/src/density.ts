import {
  createContext,
  createElement,
  type ReactElement,
  type ReactNode,
  useContext,
  useMemo,
} from "react";
import { CONTROL_LEADING, CONTROL_TEXT } from "@slashsuite/core";
import { isResponsive, type ResponsiveSize, type Size } from "./size.js";

/**
 * The type step a whole app may set once: `compact` is one step down for text, headings and
 * controls, for an app's chrome; unset is the default, a site's. Only `AppShell` sets it.
 */
export type TypeStep = "compact";

/**
 * What a container sets for the parts inside it. `size` is the control size: a `Card`, `ListRow`
 * or `Table` of a size provides it, and a `Button`, `IconButton` or `Pill` with no `size` of its
 * own takes it, so a compact card's buttons are compact without a prop on each. `type` is the type
 * step, set once around the app. The two are independent: a container that sets a size keeps the
 * type step from above.
 */
type Density = { size: Size | undefined; type: TypeStep | undefined };

const DensityContext = createContext<Density>({ size: undefined, type: undefined });

/**
 * Sets the density for its children: what it leaves out, it keeps from the nearest one above, and
 * `size={null}` clears the size, for a container of the default size or a modal that opens inside a
 * compact one. Internal: not exported from the package.
 */
export function DensityProvider({
  size,
  type,
  children,
}: {
  size?: Size | null | undefined;
  type?: TypeStep | undefined;
  children: ReactNode;
}): ReactElement {
  const outer = useContext(DensityContext);
  const value = useMemo(
    () => ({ size: size === null ? undefined : (size ?? outer.size), type: type ?? outer.type }),
    [size, type, outer],
  );
  return createElement(DensityContext.Provider, { value }, children);
}

/** A control's size: its own `size`, else the nearest container's, else `md`. */
export function useDensity(size: Size | undefined): Size {
  const container = useContext(DensityContext).size;
  return size ?? container ?? "md";
}

/**
 * A control's size where it may also be responsive: its own `size` as given, else the nearest
 * container's, else `md`.
 */
export function useResponsiveDensity(
  size: Size | ResponsiveSize | undefined,
): Size | ResponsiveSize {
  const container = useContext(DensityContext).size;
  return size ?? container ?? "md";
}

/** The type step in force: `compact` under an app that set it, else undefined (the default). */
export function useTypeStep(): TypeStep | undefined {
  return useContext(DensityContext).type;
}

/** `CONTROL_TEXT` from the `md` breakpoint up, for a responsive size. */
const CONTROL_TEXT_MD: Record<"default" | TypeStep, Record<Size, string>> = {
  default: { sm: "md:text-sm", md: "md:text-base", lg: "md:text-lg" },
  compact: { sm: "md:text-xs", md: "md:text-sm", lg: "md:text-base" },
};

/**
 * Where a text-entry control would be under 16px, it is 16px on a touch screen, so iOS Safari does
 * not zoom the page when it takes the focus.
 */
const TOUCH_TEXT = "pointer-coarse:text-base";

// `CONTROL_TEXT` and `CONTROL_LEADING` are core's, the one copy both renderers read; a `Select`, an
// `IconButton` and a `DateRangePicker`, whose heights are fixed, line up with them.

/** `CONTROL_LEADING` from the `md` breakpoint up, for a responsive size. */
const CONTROL_LEADING_MD: Record<Size, string> = {
  sm: "md:leading-4",
  md: "md:leading-5",
  lg: "md:leading-6",
};

/** The size twins, for the data test that each is its table with `md:` on every class. */
export const controlTextTables = {
  text: CONTROL_TEXT,
  textMd: CONTROL_TEXT_MD,
  leading: CONTROL_LEADING,
  leadingMd: CONTROL_LEADING_MD,
};

/**
 * The type class of a control of `size` at `step`; `entry` adds the 16px floor on touch for a field
 * a person types in. A responsive size adds its `md` size from the breakpoint up, and the floor
 * holds at both widths: `pointer-coarse:` comes after the breakpoints in Tailwind's order, so it
 * wins over an `md:` size under 16px.
 */
export function controlText(
  size: Size | ResponsiveSize,
  step: TypeStep | undefined,
  entry: boolean,
): string {
  const table = CONTROL_TEXT[step ?? "default"];
  const [base, wide] = isResponsive(size) ? [size.base, size.md] : [size, size];
  const plain = `${table[base]} ${CONTROL_LEADING[base]}`;
  const md = isResponsive(size)
    ? ` ${CONTROL_TEXT_MD[step ?? "default"][wide]} ${CONTROL_LEADING_MD[wide]}`
    : "";
  const small = [table[base], table[wide]].some((text) => !/text-(base|lg)/.test(text));
  return `${plain}${md}${entry && small ? ` ${TOUCH_TEXT}` : ""}`;
}

/**
 * The type of a field's words at each step: the label is the type of a `md` control (16px, 14px
 * compact), so a label sits at the size of the text typed under it, and the notes under a control
 * (the hint and the error) are one step below. `line` is the height of a note's first line, for the
 * error's alert icon.
 */
const FIELD_TYPE: Record<"default" | TypeStep, { label: string; note: string; line: string }> = {
  default: { label: "text-base", note: "text-sm", line: "h-5" },
  compact: { label: "text-sm", note: "text-xs", line: "h-4" },
};

/** The field type table, for the data test. */
export const fieldTypeTable = FIELD_TYPE;

/** The type of a field's label and its notes at the step in force. */
export function useFieldType(): { label: string; note: string; line: string } {
  return FIELD_TYPE[useTypeStep() ?? "default"];
}
