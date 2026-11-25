/**
 * The native theme generator: a theme's CSS (`themes/<id>.css`) as the style map a React Native
 * renderer reads (`themes/<id>.native.json`). Pure: it takes the CSS text and the palette and
 * returns the map, so the theme test can assert the committed file is current.
 *
 * Every palette utility lands in one place: a plain one (`bg-white`) in `utilities`, one behind a
 * state variant in that state's slot (`hover:bg-violet-700` in `pressed`, `placeholder:text-slate-400`
 * in `placeholderTextColor`, `backdrop:bg-slate-900/35` in `scrim`). A rule the map cannot hold as
 * one utility (`.disabled\:opacity-50:disabled:is(…)`) is a compound. Anything else is listed in
 * `unmapped`, so nothing is dropped silently, and the theme test requires that list to be empty.
 */

/** A React Native style, as the theme sets it: colours as lower-case hex or `rgba(…)`, and opacity. */
export type NativeStyle = Record<string, string | number>;

/** The slot a state variant lands in. */
export type NativeState =
  | "pressed"
  | "focused"
  | "placeholderTextColor"
  | "scrim"
  | "disabled"
  | "invalid"
  | "target";

/** A rule that holds only alongside other classes: `disabled:opacity-50` on a solid fill. */
export type NativeCompound = { utility: string; requiresAny: string[]; style: NativeStyle };

export type NativeTheme = {
  /** The theme's id, its file name without `.css`. */
  id: string;
  /** The scope class the web theme sits under. */
  scope: string;
  scheme: "light" | "dark";
  /** The status bar's content style: light content on a dark theme. */
  statusBar: "light-content" | "dark-content";
  /** The page: its canvas, its ink and its sans family. */
  base: { backgroundColor: string; color: string; fontFamily: string | null };
  /** The text selection's colours. */
  selection: NativeStyle;
  /** Every plain palette utility, keyed as a component writes it. */
  utilities: Record<string, NativeStyle>;
  /** Each state's utilities, keyed by the plain utility they restyle: `hover:bg-violet-700` sits under `pressed`. */
  states: Record<NativeState, Record<string, NativeStyle>>;
  /** A utility drawn on a tint: `within["bg-violet-50"]["text-slate-500"]`. */
  within: Record<string, Record<string, NativeStyle>>;
  compounds: NativeCompound[];
};

/** Which slot each Tailwind variant the palette uses lands in. */
export const STATE_OF_VARIANT: Record<string, NativeState> = {
  hover: "pressed",
  "focus-visible": "focused",
  "has-focus-visible": "focused",
  placeholder: "placeholderTextColor",
  backdrop: "scrim",
  disabled: "disabled",
  "aria-invalid": "invalid",
  "has-aria-invalid": "invalid",
  "user-invalid": "invalid",
  "has-user-invalid": "invalid",
  target: "target",
};

const CSS_TO_NATIVE: Record<string, string> = {
  "background-color": "backgroundColor",
  color: "color",
  "border-color": "borderColor",
  "outline-color": "outlineColor",
  "accent-color": "accentColor",
  opacity: "opacity",
  "font-weight": "fontWeight",
};

/** Declarations a native map has no use for: web-only, or carried in `base`. Listed, so nothing else is dropped. */
const WEB_ONLY = new Set([
  "transition",
  "text-underline-offset",
  "color-scheme",
  "font-family",
  "--font-mono",
  "--font-sans",
  "--font-heading",
]);

const COLOUR = /^(#[0-9a-f]{3,8}|rgba?\([^)]*\)|transparent)$/i;

/** One canonical form of a colour: lower-case hex, `rgba(r, g, b, a)`. */
function colourOf(value: string, where: string, unmapped: string[]): string | undefined {
  if (!COLOUR.test(value)) {
    unmapped.push(`${where}: "${value}" is not a colour React Native parses`);
    return undefined;
  }
  return value
    .toLowerCase()
    .replace(/\(\s*/, "(")
    .replace(/\s*\)/, ")")
    .replace(/\s*,\s*/g, ", ");
}

function declarationsOf(body: string, where: string, unmapped: string[]): NativeStyle {
  const style: NativeStyle = {};
  for (const declaration of body.split(";")) {
    const colon = declaration.indexOf(":");
    if (colon < 0) continue;
    const property = declaration.slice(0, colon).trim();
    const value = declaration
      .slice(colon + 1)
      .replace(/\s+/g, " ")
      .trim();
    if (property === "" || WEB_ONLY.has(property) || property.startsWith("--hc-")) continue;
    const native = CSS_TO_NATIVE[property];
    if (native === undefined) {
      unmapped.push(`${where} { ${property} }`);
      continue;
    }
    if (native === "opacity") style[native] = Number(value);
    else if (native === "fontWeight") style[native] = value;
    else {
      const colour = colourOf(value, `${where} ${property}`, unmapped);
      if (colour !== undefined) style[native] = colour;
    }
  }
  return style;
}

/** Split a selector list on the commas outside brackets. */
function selectorsOf(list: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const char of list) {
    if (char === "(" || char === "[") depth += 1;
    if (char === ")" || char === "]") depth -= 1;
    if (char === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
    } else current += char;
  }
  return [...parts, current.trim()].filter(Boolean);
}

const unescapeClass = (name: string): string => name.replace(/\\(.)/g, "$1");
const CLASS = String.raw`((?:\\.|[\w-])+)`;

/** `hover:bg-violet-700` as its variant and plain utility; no variant gives `undefined`. */
function splitVariant(utility: string): { variant: string | undefined; plain: string } {
  const colon = utility.lastIndexOf(":");
  if (colon < 0) return { variant: undefined, plain: utility };
  return { variant: utility.slice(0, colon), plain: utility.slice(colon + 1) };
}

function merge(table: Record<string, NativeStyle>, key: string, style: NativeStyle): void {
  table[key] = { ...table[key], ...style };
}

type Parsed = {
  scope: string;
  base: NativeTheme["base"];
  selection: NativeStyle;
  utilities: Record<string, NativeStyle>;
  states: NativeTheme["states"];
  within: NativeTheme["within"];
  compounds: NativeCompound[];
};

function emptyParsed(scope: string): Parsed {
  return {
    scope,
    base: { backgroundColor: "", color: "", fontFamily: null },
    selection: {},
    utilities: {},
    states: {
      pressed: {},
      focused: {},
      placeholderTextColor: {},
      scrim: {},
      disabled: {},
      invalid: {},
      target: {},
    },
    within: {},
    compounds: [],
  };
}

/** The scope rule: the page's canvas, ink and sans family. */
function readScope(parsed: Parsed, body: string, file: string, unmapped: string[]): void {
  const style = declarationsOf(body, `${file} .${parsed.scope}`, unmapped);
  parsed.base.backgroundColor = String(style["backgroundColor"] ?? "");
  parsed.base.color = String(style["color"] ?? "");
  const sans = /--font-sans:([^;]+);/.exec(body)?.[1];
  const family = sans
    ?.split(",")[0]
    ?.trim()
    .replace(/^["']|["']$/g, "");
  parsed.base.fontFamily = family === undefined || family === "" ? null : family;
}

/** A selector that is not one utility: the selection, the headings, a utility on a tint. */
function readSpecial(parsed: Parsed, selector: string, style: NativeStyle): boolean {
  const scope = parsed.scope;
  if (new RegExp(`^\\.${scope}\\s*::selection$`).test(selector)) {
    Object.assign(parsed.selection, style);
    return true;
  }
  // Headings take the theme's heading face, which a native renderer sets per text role.
  if (new RegExp(`^\\.${scope}\\s+:is\\(h1, h2, h3`).test(selector)) return true;
  const within = new RegExp(`^\\.${scope}\\s+\\.${CLASS}\\s+\\.${CLASS}$`).exec(selector);
  if (!within) return false;
  const tint = unescapeClass(within[1] ?? "");
  parsed.within[tint] = parsed.within[tint] ?? {};
  merge(parsed.within[tint], unescapeClass(within[2] ?? ""), style);
  return true;
}

/** One utility, plain, behind a state variant, or held only alongside other classes. */
function readUtility(parsed: Parsed, utility: string, rest: string, style: NativeStyle): boolean {
  const requires = /:is\(([^)]*)\)/.exec(rest)?.[1];
  if (requires !== undefined) {
    const requiresAny = requires.split(",").map((name) => unescapeClass(name.trim().slice(1)));
    parsed.compounds.push({ utility, requiresAny, style });
    return true;
  }
  const { variant, plain } = splitVariant(utility);
  if (variant === undefined) {
    merge(parsed.utilities, plain, style);
    return true;
  }
  const state = STATE_OF_VARIANT[variant];
  if (state === undefined) return false;
  merge(
    parsed.states[state],
    plain,
    state === "placeholderTextColor" ? asPlaceholder(style) : style,
  );
  return true;
}

/** One `.scope …` selector into its place in the map; false when it has none. */
function readSelector(parsed: Parsed, selector: string, style: NativeStyle): boolean {
  if (readSpecial(parsed, selector, style)) return true;
  const plain = new RegExp(`^\\.${parsed.scope}\\s+\\.${CLASS}(.*)$`).exec(selector);
  if (!plain) return false;
  return readUtility(parsed, unescapeClass(plain[1] ?? ""), plain[2] ?? "", style);
}

/** A placeholder's colour is a prop on a native text input, not a style. */
const asPlaceholder = (style: NativeStyle): NativeStyle =>
  style["color"] === undefined ? style : { placeholderTextColor: style["color"] };

/**
 * The native map of one theme's CSS. `id` is the file name without `.css`. Returns the map and
 * every rule or declaration it could not carry.
 */
export function nativeTheme(css: string, id: string): { theme: NativeTheme; unmapped: string[] } {
  const file = `${id}.css`;
  const uncommented = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const scheme = /@custom-variant\s+dark\b/.test(uncommented) ? "dark" : "light";
  const unmapped: string[] = [];
  const { scope, base, selection, utilities, states, within, compounds } = parse(
    uncommented.replace(/@[^;{}]*;/g, ""),
    file,
    unmapped,
  );
  return {
    theme: {
      id,
      scope,
      scheme,
      statusBar: scheme === "dark" ? "light-content" : "dark-content",
      base,
      selection,
      utilities,
      states,
      within,
      compounds,
    },
    unmapped,
  };
}

/** The scope rule's map, from the first rule: its selector must be the one scope class. */
function parseScope(list: string, body: string, file: string, unmapped: string[]): Parsed {
  const scope = /^\.([\w-]+)$/.exec(selectorsOf(list)[0] ?? "")?.[1];
  if (scope === undefined) throw new Error(`${file}: the first rule is not the scope rule`);
  const parsed = emptyParsed(scope);
  readScope(parsed, body, file, unmapped);
  return parsed;
}

/** The rules of one theme's CSS, comments and at-statements gone: the scope rule first. */
function parse(source: string, file: string, unmapped: string[]): Parsed {
  let parsed: Parsed | undefined;
  for (const [, list = "", body = ""] of source.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (parsed === undefined) {
      parsed = parseScope(list, body, file, unmapped);
      continue;
    }
    for (const selector of selectorsOf(list)) {
      const style = declarationsOf(body, `${file} ${selector}`, unmapped);
      if (!readSelector(parsed, selector, style)) unmapped.push(`${file}: selector ${selector}`);
    }
  }
  if (parsed === undefined) throw new Error(`${file}: no scope rule`);
  return parsed;
}

/** The palette utilities a native map does not hold: each in `utilities`, or in its variant's slot. */
export function missingFromNative(theme: NativeTheme, palette: readonly string[]): string[] {
  return palette.filter((utility) => {
    const { variant, plain } = splitVariant(utility);
    if (variant === undefined) return theme.utilities[plain] === undefined;
    const state = STATE_OF_VARIANT[variant];
    return state === undefined || theme.states[state][plain] === undefined;
  });
}

/** The map as the file holds it: two-space JSON with a trailing newline. */
export const nativeThemeJson = (theme: NativeTheme): string =>
  `${JSON.stringify(theme, null, 2)}\n`;
