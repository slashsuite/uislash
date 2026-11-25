/** A styling attribute written on a UISlash component's opening tag. */
export type StylingProp = { component: string; prop: string; line: number };

const STYLING = new Set(["className", "class", "class:list", "style"]);
const IMPORT =
  /import\s+(?!type\b)(?:[\w$]+\s*,\s*)?\{([^}]*)\}\s*from\s*["']@(?:hackcove|slashsuite)\/ui-react["']/g;
const OPEN_TAG = /<([A-Z][\w$]*)(?=[\s/>])/g;

/** The local names `import { A, B as C } from "@slashsuite/ui-react"` brings in (types are skipped). */
export function importedFromUi(source: string): Set<string> {
  const names = new Set<string>();
  for (const statement of source.matchAll(IMPORT)) {
    for (const entry of (statement[1] ?? "").split(",")) {
      const spec = entry.trim();
      const name = spec.split(/\s+as\s+/).at(-1) ?? "";
      if (!spec.startsWith("type ") && /^[A-Za-z_$][\w$]*$/.test(name)) names.add(name);
    }
  }
  return names;
}

const isQuote = (char: string | undefined) => char === '"' || char === "'";

/** Index just past the quoted string that starts at `from`; a `\` skips the next character. */
function skipString(source: string, from: number): number {
  const quote = source[from];
  for (let i = from + 1; i < source.length; i += 1) {
    if (source[i] === "\\") i += 1;
    else if (source[i] === quote) return i + 1;
  }
  return source.length;
}

/** One step through template text; returns the next index. `` ` `` closes it, `${` opens code. */
function stepTemplate(source: string, i: number, stack: string[]): number {
  const char = source[i];
  if (char === "\\") return i + 2;
  if (char === "`") stack.pop();
  else if (char === "$" && source[i + 1] === "{") {
    stack.push("{");
    return i + 2;
  }
  return i + 1;
}

/** One step through code inside `{ … }`; returns the next index. */
function stepCode(source: string, i: number, stack: string[]): number {
  const char = source[i];
  if (isQuote(char)) return skipString(source, i);
  if (char === "`" || char === "{") stack.push(char);
  else if (char === "}") stack.pop();
  return i + 1;
}

/**
 * Index just past the `{…}`, quoted string or template literal that starts at `from`. A template
 * literal's `${ … }` is code, so braces and templates nest: an explicit stack of the open ones
 * (`` ` `` for template text, `{` for code) keeps deep nesting off the call stack, and every step
 * moves `i` forward.
 */
function skipValue(source: string, from: number): number {
  const open = source[from];
  if (isQuote(open)) return skipString(source, from);
  if (open !== "{" && open !== "`") return from + 1;
  const stack = [open];
  let i = from + 1;
  while (i < source.length) {
    i = stack.at(-1) === "`" ? stepTemplate(source, i, stack) : stepCode(source, i, stack);
    if (stack.length === 0) return i;
  }
  return source.length;
}

type Attribute = { name: string; at: number; end: number };

/** The attributes of the opening tag whose name ends at `from`, and nothing after its `>`. */
export function attributesOf(source: string, from: number): Attribute[] {
  const found: Attribute[] = [];
  let i = from;
  while (i < source.length && source[i] !== ">") {
    const rest = source.slice(i);
    const name = /^[\w$:-]+/.exec(rest)?.[0];
    if (name !== undefined) {
      found.push({ name, at: i, end: i + name.length });
      i += name.length;
    } else if ((rest[0] === "{" || isQuote(rest[0])) && i > from) {
      i = skipValue(source, i);
    } else i += 1;
  }
  return found;
}

/** Every `className`, `class` or `style` attribute on a component imported from `@slashsuite/ui-react`. */
export function stylingProps(source: string): StylingProp[] {
  const imported = importedFromUi(source);
  const lineAt = (index: number) => source.slice(0, index).split("\n").length;
  return [...source.matchAll(OPEN_TAG)].flatMap((tag) => {
    const component = tag[1] ?? "";
    if (!imported.has(component)) return [];
    const from = (tag.index ?? 0) + tag[0].length;
    return attributesOf(source, from)
      .filter((attribute) => STYLING.has(attribute.name))
      .map((attribute) => ({ component, prop: attribute.name, line: lineAt(attribute.at) }));
  });
}

const blank = (text: string) => text.replace(/[^\n]/g, " ");

/** Index just past a `"` or `'` string at `from`; it ends at its quote or at the line's end. */
function skipLineString(source: string, from: number): number {
  const quote = source[from];
  for (let i = from + 1; i < source.length; i += 1) {
    if (source[i] === "\\") i += 1;
    else if (source[i] === quote || source[i] === "\n") return i + 1;
  }
  return source.length;
}

/** Where the comment that starts at `i` ends, or -1 when no comment starts there. */
function commentEnd(source: string, i: number): number {
  const two = source.slice(i, i + 2);
  const close = (marker: string, from: number) => {
    const at = source.indexOf(marker, from);
    return at === -1 ? source.length : at + marker.length;
  };
  if (two === "//") {
    const at = source.indexOf("\n", i);
    return at === -1 ? source.length : at;
  }
  if (two === "/*") return close("*/", i + 2);
  if (source.startsWith("<!--", i)) return close("-->", i + 4);
  return -1;
}

/**
 * `source` with every comment (`//`, `/* … *\/`, `<!-- … -->`, so JSX's `{/* … *\/}` too) blanked
 * to spaces, newlines kept, so an index or a line number means what it did. Strings and template
 * literals are skipped, so a `//` in a URL stays. A `"` or `'` string ends at its line, so an
 * apostrophe in JSX text (`<p>Don't</p>`) hides at most the rest of its line.
 */
export function blankComments(source: string): string {
  let out = "";
  let i = 0;
  while (i < source.length) {
    const char = source[i];
    const end = commentEnd(source, i);
    let next = i + 1;
    if (end !== -1) next = end;
    else if (isQuote(char)) next = skipLineString(source, i);
    else if (char === "`") next = skipValue(source, i);
    const text = source.slice(i, next);
    out += end === -1 ? text : blank(text);
    i = next;
  }
  return out;
}

/** An opening tag of any element or component: `<div`, `<Button`, `<svg:g`. */
const ANY_OPEN_TAG = /<([A-Za-z][\w$.:-]*)(?=[\s/>])/g;

/** An attribute's value as written (`"text"`, `{…}`), or `undefined` for a bare attribute. */
export function attributeValue(
  source: string,
  attribute: Attribute,
): { at: number; text: string } | undefined {
  const equals = /^\s*=\s*/.exec(source.slice(attribute.end, attribute.end + 64));
  if (equals === null) return undefined;
  const at = attribute.end + equals[0].length;
  return { at, text: source.slice(at, skipValue(source, at)) };
}

export type Tag = { name: string; at: number; attributes: Attribute[] };

/** Every opening tag in `source` (comments blanked first by the caller), with its attributes. */
export function openTags(source: string): Tag[] {
  return [...source.matchAll(ANY_OPEN_TAG)].map((tag) => {
    const at = tag.index ?? 0;
    return { name: tag[1] ?? "", at, attributes: attributesOf(source, at + tag[0].length) };
  });
}

type Part = { at: number; text: string };

/** A template literal's text runs, and the strings inside each `${ … }`, from the `` ` `` at `from` to `end`. */
function templateParts(value: string, from: number, end: number): Part[] {
  const found: Part[] = [];
  let start = from + 1;
  let i = start;
  while (i < end - 1) {
    if (value[i] === "\\") i += 2;
    else if (value[i] === "$" && value[i + 1] === "{") {
      found.push({ at: start, text: value.slice(start, i) });
      const close = skipValue(value, i + 1);
      const code = value.slice(i + 2, close - 1);
      found.push(...stringsIn(code).map((part) => ({ at: i + 2 + part.at, text: part.text })));
      i = close;
      start = i;
    } else i += 1;
  }
  found.push({ at: start, text: value.slice(start, end - 1) });
  return found;
}

/**
 * The string parts of a JSX value (`"…"`, `'…'`, a template literal's text, and the strings in its
 * `${ … }`, never its code), each with its index in the value. Object keys come too: a CSS property
 * name is never a colour.
 */
export function stringsIn(value: string): Part[] {
  const found: Part[] = [];
  let i = 0;
  while (i < value.length) {
    const char = value[i];
    if (char === "`") {
      const end = skipValue(value, i);
      found.push(...templateParts(value, i, end));
      i = end;
    } else if (isQuote(char)) {
      const end = skipString(value, i);
      found.push({ at: i + 1, text: value.slice(i + 1, end - 1) });
      i = end;
    } else i += 1;
  }
  return found;
}
