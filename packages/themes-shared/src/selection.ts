import { contrastRatio, parseColour, toHex } from "./colour.js";
import { TEXT_BAR } from "./contrastRules.js";
import { themeScope } from "./scope.js";

const stripComments = (css: string): string => css.replace(/\/\*[\s\S]*?\*\//g, "");
const escapeRe = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Selected text in a theme: a `.<scope> ::selection, .<scope>::selection` rule that sets an opaque
 * background and text colour, the text at AA (4.5:1) on the background. Without one the browser's own
 * highlight shows, which no theme chose and which can drop a theme's ink under the bar. Empty when
 * the theme is green; else one readable line per failure.
 */
export function selectionFailures(css: string): string[] {
  const scope = themeScope(css);
  if (scope === undefined) return ["::selection: the theme names no scope class"];
  const rules = stripComments(css);
  const rule = new RegExp(
    `\\.${escapeRe(scope)} ::selection,\\s*\\.${escapeRe(scope)}::selection\\s*\\{([^{}]*)\\}`,
  ).exec(rules);
  if (rule === null) {
    return [`::selection: no ".${scope} ::selection, .${scope}::selection" rule`];
  }
  const body = rule[1] ?? "";
  const read = (property: string) => {
    const value = new RegExp(`(?:^|[\\s;])${property}:\\s*([^;]+);`).exec(body)?.[1];
    return value === undefined ? undefined : parseColour(value);
  };
  const background = read("background-color");
  const ink = read("color");
  if (background === undefined || ink === undefined) {
    return ["::selection: sets no readable background-color and color"];
  }
  if (background.alpha < 1 || ink.alpha < 1) {
    return ["::selection: the background and the text must be opaque colours"];
  }
  const ratio = contrastRatio(ink.rgb, background.rgb);
  if (ratio >= TEXT_BAR) return [];
  const shown = (Math.floor(ratio * 100) / 100).toFixed(2);
  return [
    `::selection: text ${toHex(ink.rgb)} on ${toHex(background.rgb)} is ${shown}:1, needs ${TEXT_BAR}:1`,
  ];
}
