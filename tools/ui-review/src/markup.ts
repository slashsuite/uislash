import { attributeValue, blankComments, openTags, stringsIn } from "./jsx.js";
import type { Finding, ReviewFile, RuleId } from "./rules.js";
import { INPUT_TYPES, NAMED_COLOURS, PLAIN_INPUTS, RAW_ELEMENTS } from "./tables.js";

/**
 * The code a rule reads in a file, comments blanked: its whole new text when the caller has it,
 * or else its added lines joined. `lineAt` turns an index in `source` into the file's line number.
 */
export type Code = { source: string; lineAt: (index: number) => number };

export function codeOf(file: ReviewFile): Code {
  const text = file.content ?? file.added.map((added) => added.text).join("\n");
  const source = blankComments(text);
  const starts = [0];
  for (let i = 0; i < source.length; i += 1) if (source[i] === "\n") starts.push(i + 1);
  const lineInText = (index: number) => {
    let low = 0;
    let high = starts.length - 1;
    while (low < high) {
      const mid = Math.ceil((low + high) / 2);
      if ((starts[mid] ?? 0) <= index) low = mid;
      else high = mid - 1;
    }
    return low;
  };
  const lineAt =
    file.content === undefined
      ? (index: number) => file.added[lineInText(index)]?.line ?? 0
      : (index: number) => lineInText(index) + 1;
  return { source, lineAt };
}

/** Each added line's text with its comments blanked, by line number: a colour named in a comment is not used. */
export function uncommentedLines(file: ReviewFile): Map<number, string> {
  const code = codeOf(file).source.split("\n");
  const textOf = (index: number) =>
    file.content === undefined ? code[index] : code[(file.added[index]?.line ?? 0) - 1];
  return new Map(file.added.map((added, index) => [added.line, textOf(index) ?? added.text]));
}

const hit = (rule: RuleId, file: ReviewFile, line: number, message: string): Finding => ({
  rule,
  path: file.path,
  line,
  message,
});

const STYLE_BLOCK = /<style[\s>]/gi;

/** A `<style>` element in markup; one in a comment is not one. */
export function styleBlocks(file: ReviewFile, isCode: boolean): Finding[] {
  if (!isCode) return [];
  const added = new Set(file.added.map((line) => line.line));
  const { source, lineAt } = codeOf(file);
  const lines = new Set([...source.matchAll(STYLE_BLOCK)].map((match) => lineAt(match.index ?? 0)));
  return [...lines]
    .filter((line) => added.has(line))
    .map((line) =>
      hit(
        "style-block",
        file,
        line,
        "<style> block. UISlash apps write no CSS of their own: compose @slashsuite/ui-react parts, and ask uislash for what is missing.",
      ),
    );
}

const HEX = "(?<!url\\()#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\\w-])";
const FUNCTION = "(?<![\\w-])(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\\(";
const NAMED = `(?<![\\w-])(?:${NAMED_COLOURS.join("|")})(?![\\w-])`;
/** A colour written in a CSS value: hex, a colour function, or a named colour. */
export const STYLE_COLOUR = new RegExp(`${HEX}|${FUNCTION}|${NAMED}`, "gi");

/** Every colour in the strings of one `style` value, each at its index in `source`. */
function coloursIn(value: { at: number; text: string }) {
  return stringsIn(value.text).flatMap((part) =>
    [...part.text.matchAll(STYLE_COLOUR)].map((match) => ({
      at: value.at + part.at + (match.index ?? 0),
      colour: match[0].replace(/\($/, "(…)"),
    })),
  );
}

/** Every colour in a `style` attribute's strings, by line. */
function styleColours(code: Code): Map<number, string[]> {
  const byLine = new Map<number, string[]>();
  const values = openTags(code.source).flatMap((tag) =>
    tag.attributes
      .filter((a) => a.name === "style")
      .flatMap((a) => attributeValue(code.source, a) ?? []),
  );
  for (const { at, colour } of values.flatMap(coloursIn)) {
    const line = code.lineAt(at);
    byLine.set(line, [...(byLine.get(line) ?? []), colour]);
  }
  return byLine;
}

export function inlineColourMessage(colours: readonly string[]): string {
  return `Colour ${colours.map((c) => `\`${c}\``).join(", ")} in a \`style\` value. Colour belongs to the theme and to @slashsuite/ui-react parts: use the part (or its \`tone\`) that carries it, or ask uislash for one.`;
}

/** A colour literal inside a JSX `style` value: `style={{ color: "#f00" }}`. */
export function inlineColours(file: ReviewFile, isCode: boolean): Finding[] {
  if (!isCode) return [];
  const added = new Set(file.added.map((line) => line.line));
  return [...styleColours(codeOf(file))]
    .filter(([line]) => added.has(line))
    .map(([line, colours]) => hit("inline-colour", file, line, inlineColourMessage(colours)));
}

/** The part to use for a raw element, `undefined` when the element is allowed. */
export function partFor(element: string, inputType: string | undefined): string | undefined {
  if (!Object.hasOwn(RAW_ELEMENTS, element)) return undefined;
  if (element !== "input" || inputType === undefined) return RAW_ELEMENTS[element];
  if (PLAIN_INPUTS.includes(inputType)) return undefined;
  return Object.hasOwn(INPUT_TYPES, inputType) ? INPUT_TYPES[inputType] : "`Input`";
}

export function rawElementMessage(element: string, part: string): string {
  return `Raw <${element}>. @slashsuite/ui-react has the part for it: use ${part}, which carries the theme, focus and states. If it does not fit, ask uislash for the variant rather than building one.`;
}

const JSX_FILE = /\.[cm]?[jt]sx$/;

/** A raw `<button>`, `<input>`, `<select>`, `<textarea>` or `<dialog>` in a .tsx or .jsx file. */
export function rawElements(file: ReviewFile, isCode: boolean): Finding[] {
  if (!isCode || !JSX_FILE.test(file.path)) return [];
  const added = new Set(file.added.map((line) => line.line));
  const code = codeOf(file);
  return openTags(code.source).flatMap((tag) => {
    const typeAttribute = tag.attributes.find((a) => a.name === "type");
    const typeValue = typeAttribute ? attributeValue(code.source, typeAttribute)?.text : undefined;
    const inputType = /^["']([\w-]+)["']$/.exec(typeValue ?? "")?.[1];
    const part = partFor(tag.name, inputType);
    const line = code.lineAt(tag.at);
    return part === undefined || !added.has(line)
      ? []
      : [hit("raw-element", file, line, rawElementMessage(tag.name, part))];
  });
}
