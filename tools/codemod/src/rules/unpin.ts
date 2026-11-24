import ts from "typescript";
import { attributeOf, isOn, literalOf, remove, valueOf } from "../attributes.js";
import {
  componentOf,
  type Context,
  enclosing,
  meaningfulChildren,
  report,
  type Tag,
  type TagRule,
} from "../source.js";

// The second step, `--unpin`: it takes out the pins the 0.11 pass wrote so nothing moved, where
// the new default is what the pin meant. It cannot tell a pin it wrote from one a person wrote, so
// it removes one only where the new default draws the same thing, and reports the rest.

/** The package parts that lay their children out in a flex column: each child is its own row. */
const COLUMN_PARTS = new Set(["Stack", "Section", "Field"]);

/**
 * The package parts and HTML elements whose children flow as plain blocks: a lone child that turns
 * from a `<span>` into a `<p>` looks the same, but a `<p>` next to inline siblings breaks the line.
 */
const BLOCK_PARTS = new Set(["Card", "Dialog", "Drawer", "BottomSheet", "Callout", "Fieldset"]);
const BLOCK_ELEMENTS = new Set(["div", "section", "article", "main", "header", "footer", "li"]);

/** The containers whose `Stack` and `Section` default to the `xs` gap, not `md` (`CenteredLayout` draws a `Card`). */
const TIGHT = new Set([
  "Card",
  "Dialog",
  "Drawer",
  "BottomSheet",
  "Callout",
  "ListRow",
  "CenteredLayout",
]);

/**
 * Whether the element would look the same as a `<p>`, read from the JSX alone: in a flex column it
 * is its own row whatever sits beside it; in a plain block only when it is the block's one child.
 */
function inBlock(tag: Tag, context: Context): boolean {
  const element = ts.isJsxOpeningElement(tag) ? tag.parent : tag;
  const parent = element.parent;
  if (!ts.isJsxElement(parent)) return false;
  const opening = parent.openingElement;
  const part = componentOf(opening, context.imports);
  if (part !== undefined && COLUMN_PARTS.has(part)) return true;
  const name = opening.tagName;
  const block =
    part === undefined
      ? ts.isIdentifier(name) && BLOCK_ELEMENTS.has(name.text)
      : BLOCK_PARTS.has(part);
  return block && meaningfulChildren(opening).length === 1;
}

/** `Text`/`Caption` `as="span"` goes where a paragraph sits as well: in a block container. */
export function unpinSpan(tag: Tag, component: string, context: Context): void {
  if (component !== "Text" && component !== "Caption") return;
  const as = attributeOf(tag, "as");
  if (literalOf(as) !== "span" || as === undefined) return;
  if (inBlock(tag, context)) remove(context, as);
  else report(context, as, 'as="span" kept: inline here, check it');
}

/** `Stack`/`Section` `gap="md"` goes at page level, where `md` is the default. */
export function unpinGap(tag: Tag, component: string, context: Context): void {
  if (component !== "Stack" && component !== "Section") return;
  const gap = attributeOf(tag, "gap");
  if (literalOf(gap) !== "md" || gap === undefined) return;
  const size = attributeOf(tag, "size");
  if (component === "Section" && size !== undefined && literalOf(size) !== "md") {
    report(context, gap, 'gap="md" kept: this Section\'s size sets its own gap, check it');
    return;
  }
  if (enclosing(tag, context.imports).some(({ name }) => TIGHT.has(name))) {
    report(
      context,
      gap,
      'gap="md" kept: the default here is xs, remove it if the tighter gap is wanted',
    );
  } else {
    remove(context, gap);
  }
}

/**
 * `Cluster wrap={false}` goes: a row that wraps is the new look. A bare `wrap` (or `{true}`), which
 * the 0.11 pass keeps, says the default and goes too. One set in code is a person's call.
 */
export function unpinWrap(tag: Tag, component: string, context: Context): void {
  if (component !== "Cluster") return;
  const wrap = attributeOf(tag, "wrap");
  if (wrap === undefined) return;
  if (isOn(wrap) || valueOf(wrap)?.kind === ts.SyntaxKind.FalseKeyword) remove(context, wrap);
  else report(context, wrap, "wrap is set in code: a Cluster wraps by default now, check it");
}

const NUMERIC_CELLS = ["TableCell", "TableEditCell"];

/** A `numeric` cell's `align="start"` goes: end aligned figures are the look. */
export function unpinNumericStart(tag: Tag, component: string, context: Context): void {
  if (!NUMERIC_CELLS.includes(component)) return;
  const align = attributeOf(tag, "align");
  const numeric = attributeOf(tag, "numeric");
  if (align === undefined || numeric === undefined || literalOf(align) !== "start") return;
  if (isOn(numeric)) remove(context, align);
  else if (valueOf(numeric)?.kind !== ts.SyntaxKind.FalseKeyword) {
    report(context, align, 'align="start" kept: numeric is not a literal, check it');
  }
}

/** A `numeric` cell's `align="end"`, which the 0.11 pass keeps, is what `numeric` does by itself. */
export function unpinNumericEnd(tag: Tag, component: string, context: Context): void {
  if (!NUMERIC_CELLS.includes(component)) return;
  const align = attributeOf(tag, "align");
  if (align !== undefined && literalOf(align) === "end" && isOn(attributeOf(tag, "numeric"))) {
    remove(context, align);
  }
}

/**
 * `Callout tone="info"` stays: with no tone a callout is `neutral`, a grey note, so the new default
 * never draws the blue box. Each one is reported, since it may be a pin or a note that is news.
 */
export function reportCalloutInfo(tag: Tag, component: string, context: Context): void {
  if (component !== "Callout") return;
  const tone = attributeOf(tag, "tone");
  if (literalOf(tone) === "info" && tone !== undefined) {
    report(
      context,
      tone,
      'tone="info" kept: a Callout is neutral by default now, remove it unless the note must stay blue',
    );
  }
}

export const tagRules: readonly TagRule[] = [
  unpinSpan,
  unpinGap,
  unpinWrap,
  unpinNumericStart,
  unpinNumericEnd,
  reportCalloutInfo,
];
