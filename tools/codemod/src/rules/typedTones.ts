import ts from "typescript";
import { type Context, report } from "../source.js";
import { replace } from "../attributes.js";

/** The tone types whose values changed: old value to new, for a literal the app typed with one. */
const TYPED: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  PillTone: {
    slate: "neutral",
    amber: "warn",
    emerald: "positive",
    blue: "info",
    red: "danger",
    violet: "accent",
    sky: "info",
  },
  BarTone: { negative: "danger" },
  ButtonTone: { default: "neutral" },
  IconButtonTone: { default: "neutral" },
  CellTone: { default: "neutral" },
};

/** The tone type a variable is declared with, as `T`, `T[]` or `readonly T[]`. */
function declaredTone(type: ts.TypeNode | undefined, context: Context): string | undefined {
  if (type === undefined) return undefined;
  if (ts.isArrayTypeNode(type)) return declaredTone(type.elementType, context);
  if (ts.isTypeOperatorNode(type)) return declaredTone(type.type, context);
  if (!ts.isTypeReferenceNode(type) || !ts.isIdentifier(type.typeName)) return undefined;
  const name = context.imports.named.get(type.typeName.text);
  return name !== undefined && name in TYPED ? name : undefined;
}

/** The string literals a declaration's value holds: itself, or the elements of an array. */
function literalsOf(value: ts.Expression | undefined): ts.StringLiteral[] {
  if (value === undefined) return [];
  if (ts.isStringLiteral(value)) return [value];
  if (ts.isArrayLiteralExpression(value)) return value.elements.filter(ts.isStringLiteral);
  return [];
}

/** `const tones: PillTone[] = ["amber"]` is `["warn"]`; two old values that meet are reported. */
export function typedTones(context: Context): void {
  const visit = (node: ts.Node): void => {
    if (ts.isVariableDeclaration(node)) {
      const type = declaredTone(node.type, context);
      const map = type === undefined ? undefined : TYPED[type];
      if (map !== undefined) retone(literalsOf(node.initializer), map, context);
    }
    ts.forEachChild(node, visit);
  };
  visit(context.file);
}

function retone(
  literals: readonly ts.StringLiteral[],
  map: Readonly<Record<string, string>>,
  context: Context,
): void {
  // Each value the list holds after the pass, and whether the pass wrote it.
  const seen = new Map<string, boolean>();
  for (const literal of literals) {
    const to = map[literal.text] ?? literal.text;
    const rewritten = to !== literal.text;
    // Two of a value the pass wrote neither of were already there: the app's own list.
    const before = seen.get(to);
    if (before !== undefined && (before || rewritten)) {
      const why = rewritten
        ? `"${literal.text}" is "${to}" now, which this list already holds`
        : `"${to}" is in this list twice now: an earlier value became it`;
      report(context, literal, why);
    }
    seen.set(to, (before ?? false) || rewritten);
    if (rewritten) replace(context, literal, `"${to}"`);
  }
}
