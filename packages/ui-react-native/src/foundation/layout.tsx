/**
 * F3: layout on native. `Stack` is a column and `Cluster` a wrapping row, both on View, with the
 * gap scale of the web's (`gap` in Tailwind steps). `useBreakpoint` reads the window against the
 * web's breakpoints, and `useColumns` how many columns of `minWidth` fit.
 */
import type { ReactElement, ReactNode } from "react";
import { useWindowDimensions, View } from "react-native";
import { renderText } from "./text.js";

/** The web's breakpoints, in px: `sm`, `md` and `lg`. */
export const BREAKPOINTS = { sm: 640, md: 768, lg: 1024 } as const;
export type Breakpoint = "base" | keyof typeof BREAKPOINTS;

/** The breakpoint a `width` falls in. */
export function breakpointOf(width: number): Breakpoint {
  if (width >= BREAKPOINTS.lg) return "lg";
  if (width >= BREAKPOINTS.md) return "md";
  if (width >= BREAKPOINTS.sm) return "sm";
  return "base";
}

/** The breakpoint of the window. */
export function useBreakpoint(): Breakpoint {
  return breakpointOf(useWindowDimensions().width);
}

/** How many columns at least `minWidth` wide fit in `width` with `gap` between them; at least one. */
export function columnsFor(width: number, minWidth: number, gap: number): number {
  return Math.max(1, Math.floor((width + gap) / (minWidth + gap)));
}

/** `columnsFor` the window's width. */
export function useColumns(minWidth: number, gap: number): number {
  return columnsFor(useWindowDimensions().width, minWidth, gap);
}

/** The gap scale, in px: `xs` to `xl`, the web's `gap-2` to `gap-12`. */
export const GAP = { xs: 8, sm: 12, md: 16, lg: 24, xl: 48 } as const;
export type Gap = keyof typeof GAP;

export type StackProps = { gap?: Gap | undefined; children?: ReactNode };

/** A column of blocks, `md` apart unless `gap` says. */
export function Stack({ gap = "md", children }: StackProps): ReactElement {
  return <View style={{ flexDirection: "column", gap: GAP[gap] }}>{renderText(children)}</View>;
}

export type ClusterProps = {
  gap?: "xs" | "sm" | "md" | undefined;
  align?: "center" | "start" | undefined;
  children?: ReactNode;
};

/** A wrapping row of items, `sm` apart unless `gap` says. */
export function Cluster({ gap = "sm", align = "center", children }: ClusterProps): ReactElement {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: align === "center" ? "center" : "flex-start",
        gap: GAP[gap],
      }}
    >
      {renderText(children)}
    </View>
  );
}
