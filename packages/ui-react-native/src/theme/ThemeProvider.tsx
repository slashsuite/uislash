/**
 * The theme in force: `ThemeProvider` takes a theme's generated `<id>.native.json` (imported from
 * `@slashsuite/themes`), so no theme is named in code, and `useStyles` resolves a class string from
 * core's tables against it, once per theme.
 */
import type { NativeTheme } from "@slashsuite/core";
import { createContext, type ReactElement, type ReactNode, useContext, useMemo } from "react";
import { resolve, type Resolved, type ResolveOptions } from "./resolve.js";

const ThemeContext = createContext<NativeTheme | null>(null);

export type ThemeProviderProps = { theme: NativeTheme; children?: ReactNode };

/** Puts `theme` in force for everything inside it. */
export function ThemeProvider({ theme, children }: ThemeProviderProps): ReactElement {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

/** The theme in force; throws outside a `ThemeProvider`, since a native component has no default look. */
export function useTheme(): NativeTheme {
  const theme = useContext(ThemeContext);
  if (theme === null) throw new Error("useTheme: render inside a ThemeProvider");
  return theme;
}

const cache = new WeakMap<NativeTheme, Map<string, Resolved>>();

/** `resolve`, cached per theme and class string, so a list of buttons resolves its classes once. */
export function resolveCached(
  classString: string,
  theme: NativeTheme,
  options: ResolveOptions = {},
): Resolved {
  let forTheme = cache.get(theme);
  if (forTheme === undefined) {
    forTheme = new Map();
    cache.set(theme, forTheme);
  }
  const key = `${options.on ?? ""}|${classString}`;
  let resolved = forTheme.get(key);
  if (resolved === undefined) {
    resolved = resolve(classString, theme, options);
    forTheme.set(key, resolved);
  }
  return resolved;
}

/** The styles of `classString` in the theme in force, as slots to `pick` from. */
export function useStyles(classString: string, options: ResolveOptions = {}): Resolved {
  const theme = useTheme();
  const { on } = options;
  return useMemo(
    () => resolveCached(classString, theme, on === undefined ? {} : { on }),
    [classString, theme, on],
  );
}
