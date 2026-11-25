import { readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { parseColour, toHex } from "../../../packages/themes-shared/src/colour.js";
import { contrastFailures } from "../../../packages/themes-shared/src/contrast.js";
import type { Palette } from "../../../packages/themes-shared/src/contrastRules.js";
import { unmappedUtilities } from "../../../packages/themes-shared/src/coverage.js";
import {
  distanceOf,
  distinctionFailures,
} from "../../../packages/themes-shared/src/distinction.js";
import { declaresDark, themeScope } from "../../../packages/themes-shared/src/scope.js";
import { selectionFailures } from "../../../packages/themes-shared/src/selection.js";

/** The repo root, from this file's place in it. */
export const ROOT = resolve(import.meta.dirname, "../../..");
export const THEMES = join(ROOT, "themes");

/**
 * A brand's accent in one scheme, as opaque hex colours. The fill is a solid button's ground and the
 * label its text; the text is a link's and a selected item's ink; the edge is a field's border and the
 * focus ring. Each hover is its own colour, never derived, so the spec says every colour it ships.
 */
export type Accent = {
  /** The colour's name, written beside each value it sets (`mauve`). */
  name: string;
  fill: string;
  fillHover: string;
  label: string;
  text: string;
  textHover: string;
  edge: string;
};

/** One theme to build: the base it starts from, and what it changes. */
export type ThemeSpec = {
  /** The new theme's id: its file name without `.css`, and its scope class. */
  id: string;
  /** The id of the theme in themes/ it starts from. */
  base: string;
  /** The header's title line, as `<name>: <about>`. */
  name: string;
  about: string;
  accent: Accent;
};

/** A spec file: one brand, usually its light and its dark theme. */
export type Spec = { themes: ThemeSpec[] };

/** A built theme: its file name and text, and every contract it fails. Write it only when empty. */
export type Built = {
  id: string;
  file: string;
  css: string;
  failures: string[];
  /** Status tones the accent sits close to (`statusWarnings`): printed, never refused. */
  warnings: string[];
};

type Role = (accent: Accent) => { colour: string; role: string };

/**
 * Every rule the accent paints, by the selector it opens with under the scope, the property it sets
 * and which colour of the accent goes there. A translucent base value keeps its own alpha, so a tint
 * stays the same strength in the new colour.
 */
type Slot = { selector: string; property: string; take: Role };
const slot = (selector: string, property: string, take: Role): Slot => ({
  selector,
  property,
  take,
});
const fill: Role = (a) => ({ colour: a.fill, role: "fill" });
const tint: Role = (a) => ({ colour: a.fill, role: "tint" });
const text: Role = (a) => ({ colour: a.text, role: "text" });
const textHover: Role = (a) => ({ colour: a.textHover, role: "text, hovered" });
const edge: Role = (a) => ({ colour: a.edge, role: "edge" });
const focus: Role = (a) => ({ colour: a.edge, role: "focus" });

const SLOTS: readonly Slot[] = [
  slot("::selection", "background-color", fill),
  slot("::selection", "color", (a) => ({ colour: a.label, role: "label" })),
  slot(".bg-violet-600", "background-color", fill),
  slot(".hover\\:bg-violet-700:hover", "background-color", (a) => ({
    colour: a.fillHover,
    role: "fill, hovered",
  })),
  slot(".text-violet-50", "color", (a) => ({ colour: a.label, role: "label on the fill" })),
  slot(".hover\\:text-violet-700:hover", "color", textHover),
  slot(".hover\\:bg-violet-50:hover", "background-color", tint),
  slot(".border-violet-600", "border-color", edge),
  slot(".hover\\:border-violet-400:hover", "border-color", edge),
  slot(".outline-violet-600", "outline-color", focus),
  slot(".target\\:outline-violet-600:target", "outline-color", focus),
  slot(".focus-visible\\:outline-violet-600:focus-visible", "outline-color", focus),
  slot(".has-focus-visible\\:outline-violet-600:has(:focus-visible)", "outline-color", focus),
  slot(".accent-violet-600", "accent-color", edge),
  slot(".bg-violet-50", "background-color", tint),
  slot(".text-violet-600", "color", text),
  slot(".text-purple-700", "color", (a) => ({ colour: a.edge, role: "chart mark" })),
  slot(".link", "color", text),
  slot(".link:hover", "color", textHover),
  slot(".bg-indigo-400\\/25", "background-color", (a) => ({ colour: a.fill, role: "hero glow" })),
];

const escapeRe = (raw: string): string => raw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** `#rrggbb`, lower case, or a thrown error naming the field. */
function hex(value: string, field: string): string {
  const colour = parseColour(value);
  if (colour === undefined || colour.alpha < 1) {
    throw new Error(`${field}: "${value}" is not an opaque colour`);
  }
  return toHex(colour.rgb);
}

/** The value a slot gets: the colour, at the base value's own alpha when the base is translucent. */
function valueFor(colour: string, base: string): string {
  const alpha = /^rgba\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*([\d.]+)\s*\)$/.exec(base)?.[1];
  if (alpha === undefined) return colour;
  const rgb = parseColour(colour)?.rgb ?? [0, 0, 0];
  return `rgba(${rgb.map((channel) => Math.round(channel)).join(", ")}, ${alpha})`;
}

/** One declaration to set: the value from the base's own, and the comment naming its role. */
type SlotEdit = {
  selector: string;
  property: string;
  value: (base: string) => string;
  comment: string;
};

/**
 * Set `property` in the one rule whose selector list opens with `.<scope> <selector>` (or
 * `.<scope><selector>` for a pseudo-element), with a comment naming the accent's role. Throws when
 * the base has no such rule, or more than one, so a base that moved is never half rewritten.
 */
function setSlot(
  lines: string[],
  scope: string,
  { selector, property, value, comment }: SlotEdit,
): void {
  const opener = new RegExp(`^\\.${escapeRe(scope)} ${escapeRe(selector)}\\s*(,|\\{)$`);
  const starts = lines.flatMap((line, i) => (opener.test(line) ? [i] : []));
  if (starts.length !== 1) {
    throw new Error(`.${scope} ${selector}: the base has ${starts.length} such rules, needs one`);
  }
  const declaration = new RegExp(`^(\\s+)${escapeRe(property)}:\\s*([^;]+);`);
  for (let i = starts[0] ?? 0; i < lines.length && !/^\s*\}/.test(lines[i] ?? ""); i++) {
    const match = declaration.exec(lines[i] ?? "");
    if (match === null) continue;
    lines[i] = `${match[1]}${property}: ${value((match[2] ?? "").trim())}; /* ${comment} */`;
    return;
  }
  throw new Error(`.${scope} ${selector}: the base rule sets no ${property}`);
}

/** Words wrapped to lines of at most `width` characters, each starting with `indent`. */
function wrap(words: string, indent: string, width = 100): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of words.split(/\s+/).filter(Boolean)) {
    if (line !== "" && indent.length + line.length + 1 + word.length > width) {
      lines.push(indent + line);
      line = word;
    } else line = line === "" ? word : `${line} ${word}`;
  }
  return line === "" ? lines : [...lines, indent + line];
}

const RULE = "   " + "-".repeat(75);

/** The header a built theme carries in place of its base's: what it is and how it was made. */
function header(theme: ThemeSpec, accent: Accent, specPath: string, dark: boolean): string {
  const scheme = dark
    ? "It is dark, and declares the `dark` variant on its own scope."
    : "It is light, so it declares no `dark` variant.";
  return [
    `/* ${RULE.slice(3)}`,
    ...wrap(`${theme.name}: ${theme.about}`, "   "),
    RULE,
    ...wrap(
      `Generated by tools/theme-builder from themes/${theme.base}.css and ${specPath}. Do not edit it by hand: change the spec or the base and regenerate (themes/README.md, "Make a brand theme").`,
      "   ",
    ),
    "",
    ...wrap(
      `Consumers import it AFTER \`@import "tailwindcss"\` and put \`.${theme.id}\` on <html>. ${scheme}`,
      "   ",
    ),
    "",
    ...wrap(
      `Everything but the accent is ${theme.base}'s, and the comments below are its own. The accent is ${accent.name}:`,
      "   ",
    ),
    `     fill ${accent.fill} · fill hovered ${accent.fillHover} · label ${accent.label}`,
    `     text ${accent.text} · text hovered ${accent.textHover} · edges and focus ${accent.edge}`,
    `${RULE} */`,
  ].join("\n");
}

/** The accent with every colour as lower-case hex, or a thrown error naming the bad field. */
function normalised(theme: ThemeSpec): Accent {
  const at = (field: Exclude<keyof Accent, "name">): string =>
    hex(theme.accent[field], `${theme.id}: accent.${field}`);
  return {
    name: theme.accent.name,
    fill: at("fill"),
    fillHover: at("fillHover"),
    label: at("label"),
    text: at("text"),
    textHover: at("textHover"),
    edge: at("edge"),
  };
}

/**
 * The theme's CSS: the base file with its scope renamed to the id, its header replaced and each
 * accent slot (and each avatar the spec moves) set. Nothing else in the base changes.
 */
export function render(theme: ThemeSpec, specPath: string): string {
  if (!/^[a-z][a-z0-9-]*$/.test(theme.id)) {
    throw new Error(`${theme.id}: an id is lower-case letters, digits and hyphens`);
  }
  if (theme.id === theme.base) throw new Error(`${theme.id}: the id must differ from the base`);
  const base = readFileSync(join(THEMES, `${theme.base}.css`), "utf8");
  const baseScope = themeScope(base);
  if (baseScope === undefined) throw new Error(`${theme.base}.css names no scope class`);
  const accent = normalised(theme);

  const opening = /^(\/\*![^\n]*\*\/\n)\/\* -{10,}\n[\s\S]*?-{10,} \*\//.exec(base);
  if (opening === null) {
    throw new Error(`${theme.base}.css: no banner line followed by a dashed header comment`);
  }
  const body = base.slice(opening[0].length);
  const renamed = body.replace(
    new RegExp(`\\.${escapeRe(baseScope)}(?![\\w-])`, "g"),
    `.${theme.id}`,
  );
  const lines = renamed.split("\n");

  for (const { selector, property, take } of SLOTS) {
    const { colour, role } = take(accent);
    setSlot(lines, theme.id, {
      selector,
      property,
      value: (was) => valueFor(colour, was),
      comment: `${accent.name}: ${role}`,
    });
  }

  const css =
    (opening[1] ?? "") + header(theme, accent, specPath, declaresDark(base)) + lines.join("\n");
  const exposed = /^(\s+--hc-accent:\s*)[^;]+;/m;
  if (!exposed.test(css)) throw new Error(`${theme.base}.css: the scope block sets no --hc-accent`);
  return css.replace(exposed, `$1${accent.text};`);
}

/**
 * The status tones an accent must stay apart from: the palette's info, positive, warn and danger
 * inks, and the fills a status paints (the positive and danger buttons, the warn bar, and the sky
 * avatar, which sits beside an accent button in a toolbar).
 */
const STATUS_TEXT = ["text-blue-700", "text-emerald-700", "text-amber-700", "text-red-700"];
const STATUS_FILLS = ["bg-sky-600", "bg-emerald-600", "bg-amber-600", "bg-red-600"];
const TEXT_APART = 0.09;
const FILL_APART = 0.12;

/** How far the accent's text and fill sit from each status tone, in OKLab, nearest first. */
function statusDistances(css: string): { from: string; to: string; apart: number }[] {
  const measure = (from: string, tos: string[]) =>
    tos.map((to) => ({ from, to, apart: distanceOf(css, from, to) }));
  return [
    ...measure("text-violet-600", STATUS_TEXT),
    ...measure("bg-violet-600", STATUS_FILLS),
  ].toSorted((a, b) => a.apart - b.apart);
}

/** The status pairs closer than their bar, one readable line each: a report, not a contract. */
export function statusWarnings(css: string): string[] {
  return statusDistances(css)
    .map((pair) => ({ ...pair, bar: pair.from.startsWith("bg-") ? FILL_APART : TEXT_APART }))
    .filter(({ apart, bar }) => apart < bar)
    .map(
      ({ from, to, apart, bar }) =>
        `${from} and ${to} are ${(Math.floor(apart * 1000) / 1000).toFixed(3)} apart in OKLab, under ${bar}`,
    );
}

/**
 * Every contract a theme's CSS fails, one readable line each: the scope, palette coverage, and the
 * contrast, distinction and selection contracts `themes/themes.test.ts` holds every theme to. The
 * status distances are not here: the suite's own peach sits under them beside the warn tone, so
 * they are reported (`statusWarnings`) for a person to weigh, not refused.
 */
export function themeFailures(css: string, palette: Palette): string[] {
  if (themeScope(css) === undefined) return ["the theme names no scope class"];
  return [
    ...unmappedUtilities(css, palette).map((utility) => `palette: ${utility} is not remapped`),
    ...contrastFailures(css, palette),
    ...distinctionFailures(css, palette),
    ...selectionFailures(css),
  ];
}

/** ui-react's palette, the utilities every theme remaps. */
export function readPalette(): Palette {
  const palette: Palette = JSON.parse(
    readFileSync(join(ROOT, "packages/ui-react/palette.json"), "utf8"),
  );
  return palette;
}

/** Every theme of a spec file, built and measured. `specPath` is the file, inside the repo. */
export function buildSpec(specPath: string, palette = readPalette()): Built[] {
  const absolute = resolve(specPath);
  const shown = relative(ROOT, absolute);
  if (shown.startsWith("..")) throw new Error(`${specPath}: a spec lives inside the repo`);
  const spec: Spec = JSON.parse(readFileSync(absolute, "utf8"));
  return spec.themes.map((theme) => {
    const css = render(theme, shown);
    return {
      id: theme.id,
      file: join(THEMES, `${theme.id}.css`),
      css,
      failures: themeFailures(css, palette),
      warnings: statusWarnings(css),
    };
  });
}
