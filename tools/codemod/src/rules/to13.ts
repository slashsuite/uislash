import ts from "typescript";
import {
  attributeOf,
  attributesOf,
  isOn,
  literalOf,
  nameOf,
  remove,
  rename,
  replace,
  valueOf,
} from "../attributes.js";
import { type Context, meaningfulChildren, report, type Tag, type TagRule } from "../source.js";
import { usesOf } from "./imports.js";

// The step for the next minor, `--to-0.13`: the renames 0.13 ships (packages/ui-react/MIGRATING.md,
// "0.12 to 0.13"). It runs alone, on 0.12 code, under either package name.

/** `ListRow divided` is gone: the line between rows is the `Stack divided` that holds them. */
export function listRowDivided(tag: Tag, component: string, context: Context): void {
  const divided = attributeOf(tag, "divided");
  if (component !== "ListRow" || divided === undefined) return;
  remove(context, divided);
  report(context, tag, "divided is gone: put the rows in a Stack divided");
}

const TRUNCATED = ["SubsectionHeading", "TableCell", "TableEditCell"];

/** `truncate` on a heading or a cell is `lines={1}`, as on `Text` in 0.11. */
export function truncateLines(tag: Tag, component: string, context: Context): void {
  const truncate = attributeOf(tag, "truncate");
  if (!TRUNCATED.includes(component) || truncate === undefined) return;
  if (isOn(truncate)) replace(context, truncate, "lines={1}");
  else if (valueOf(truncate)?.kind === ts.SyntaxKind.FalseKeyword) remove(context, truncate);
  else report(context, truncate, `${component} truncate is lines={1}: rewrite this one by hand`);
}

/** The property renamed in each kind of item, by the package type that names an item. */
const ITEM_TYPES: Readonly<Record<string, readonly [string, string]>> = {
  MenuItem: ["onSelect", "onClick"],
  MenuAction: ["onSelect", "onClick"],
  Toast: ["body", "description"],
};

/** The type a wrapper type holds: `T[]`, `readonly T`, `...T` or a named tuple member's `T`. */
function innerType(type: ts.TypeNode): ts.TypeNode | undefined {
  if (ts.isArrayTypeNode(type)) return type.elementType;
  if (ts.isTypeOperatorNode(type) || ts.isRestTypeNode(type) || ts.isNamedTupleMember(type)) {
    return type.type;
  }
  return undefined;
}

/** The package export a type name names: `Toast` imported by name, or `ui.Toast` through a namespace. */
function exportOf(name: ts.EntityName, context: Context): string | undefined {
  if (ts.isIdentifier(name)) return context.imports.named.get(name.text);
  if (ts.isIdentifier(name.left) && context.imports.namespaces.has(name.left.text)) {
    return name.right.text;
  }
  return undefined;
}

/** The item type every member of a tuple names, when they all name the same one. */
function tupleType(type: ts.TupleTypeNode, context: Context): string | undefined {
  const names = new Set(type.elements.map((element) => itemType(element, context)));
  const [only] = names;
  return names.size === 1 ? only : undefined;
}

/** The package item type a type node names, as `T`, `T[]`, `readonly T[]`, `Array<T>` or a tuple of `T`. */
function itemType(type: ts.TypeNode | undefined, context: Context): string | undefined {
  if (type === undefined) return undefined;
  const inner = innerType(type);
  if (inner !== undefined) return itemType(inner, context);
  if (ts.isTupleTypeNode(type)) return tupleType(type, context);
  if (!ts.isTypeReferenceNode(type)) return undefined;
  const name = type.typeName;
  if (ts.isIdentifier(name) && ["Array", "ReadonlyArray"].includes(name.text)) {
    return itemType(type.typeArguments?.[0], context);
  }
  const exported = exportOf(name, context);
  return exported !== undefined && exported in ITEM_TYPES ? exported : undefined;
}

function unwrap(node: ts.Expression): ts.Expression {
  if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node)) return unwrap(node.expression);
  return ts.isSatisfiesExpression(node) ? unwrap(node.expression) : node;
}

/** The object literals a value holds: itself, or each element of an array. */
function objectsOf(value: ts.Expression | undefined): ts.ObjectLiteralExpression[] {
  if (value === undefined) return [];
  const bare = unwrap(value);
  if (ts.isObjectLiteralExpression(bare)) return [bare];
  if (!ts.isArrayLiteralExpression(bare)) return [];
  return bare.elements.map(unwrap).filter(ts.isObjectLiteralExpression);
}

/** Whether a value is an array the file writes out in full: every element an object literal. */
function allWritten(value: ts.Expression | undefined): boolean {
  if (value === undefined) return false;
  const bare = unwrap(value);
  return (
    ts.isArrayLiteralExpression(bare) &&
    bare.elements.every((element) => ts.isObjectLiteralExpression(unwrap(element)))
  );
}

/** Renames one property in an object literal, a shorthand `{ body }` included. */
function renameProperty(
  item: ts.ObjectLiteralExpression,
  [from, to]: readonly [string, string],
  context: Context,
): void {
  for (const part of item.properties) {
    if (part.name === undefined || part.name.getText(context.file) !== from) continue;
    if (ts.isShorthandPropertyAssignment(part)) replace(context, part, `${to}: ${from}`);
    else if (ts.isPropertyAssignment(part) || ts.isMethodDeclaration(part)) {
      replace(context, part.name, to);
    }
  }
}

const DISABLED = "disabled is disabledReason: write the reason this action is off";

/** A menu action's `disabled` is reported: only a person can write its `disabledReason`. */
function reportDisabled(item: ts.ObjectLiteralExpression, context: Context): void {
  for (const part of item.properties) {
    if (part.name?.getText(context.file) === "disabled") report(context, part, DISABLED);
  }
}

/** The declarations in the file typed with a package item type, with that type. */
function typedDeclarations(
  context: Context,
): { name: string; type: string; value: ts.Expression | undefined }[] {
  const out: { name: string; type: string; value: ts.Expression | undefined }[] = [];
  const visit = (node: ts.Node): void => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
      const satisfied =
        node.initializer !== undefined && ts.isSatisfiesExpression(node.initializer)
          ? node.initializer.type
          : undefined;
      const type = itemType(node.type ?? satisfied, context);
      if (type !== undefined) out.push({ name: node.name.text, type, value: node.initializer });
    }
    ts.forEachChild(node, visit);
  };
  visit(context.file);
  return out;
}

/** `onSelect` is `onClick` and `body` is `description` in every literal the file types as an item. */
export function typedItems(context: Context): void {
  for (const { type, value } of typedDeclarations(context)) {
    const swap = ITEM_TYPES[type];
    if (swap === undefined) continue;
    for (const item of objectsOf(value)) {
      renameProperty(item, swap, context);
      if (type !== "Toast") reportDisabled(item, context);
    }
  }
}

/**
 * The item literals an attribute holds, when the file writes every one out: an inline array, or a
 * name the file declares once with an item type and an array of literals. Undefined otherwise.
 */
function writtenItems(
  attribute: ts.JsxAttribute,
  type: string,
  context: Context,
): ts.ObjectLiteralExpression[] | undefined {
  const value = valueOf(attribute);
  if (value === undefined) return undefined;
  if (allWritten(value)) return objectsOf(value);
  if (!ts.isIdentifier(value)) return undefined;
  const declared = typedDeclarations(context).filter((d) => d.name === value.text);
  const [only] = declared;
  const declarations = usesOf(context.file, value.text).filter((use) =>
    ts.isVariableDeclaration(use.parent),
  );
  if (declared.length !== 1 || declarations.length !== 1 || only === undefined) return undefined;
  if (ITEM_TYPES[only.type] !== ITEM_TYPES[type] || !allWritten(only.value)) return undefined;
  return objectsOf(only.value);
}

/** A `Menu` action's `onSelect` is `onClick`; a `Menu` whose items the file does not write out is reported. */
export function menuItems(tag: Tag, component: string, context: Context): void {
  const items = attributeOf(tag, "items");
  if (component !== "Menu" || items === undefined) return;
  const written = writtenItems(items, "MenuAction", context);
  if (written === undefined) {
    report(
      context,
      tag,
      "items: rename each action's onSelect to onClick, and give a disabled one a disabledReason",
    );
    return;
  }
  for (const item of written) {
    renameProperty(item, ["onSelect", "onClick"], context);
    reportDisabled(item, context);
  }
}

/** `ToastRegion toasts` is `items`, and a toast's `body` is `description`. */
export function toastRegion(tag: Tag, component: string, context: Context): void {
  if (component !== "ToastRegion") return;
  const toasts = attributeOf(tag, "toasts");
  if (toasts !== undefined) rename(context, toasts, "items");
  const list = toasts ?? attributeOf(tag, "items");
  const written = list === undefined ? undefined : writtenItems(list, "Toast", context);
  if (written === undefined) {
    report(context, tag, "a toast's body is now description: rename it where the toasts are made");
    return;
  }
  for (const item of written) renameProperty(item, ["body", "description"], context);
}

/** `DocsLayout navLabel` is `asideLabel`, the name every layout with an aside uses. */
export function docsAsideLabel(tag: Tag, component: string, context: Context): void {
  const label = attributeOf(tag, "navLabel");
  if (component === "DocsLayout" && label !== undefined) rename(context, label, "asideLabel");
}

const isLi = (node: ts.Node): node is ts.JsxElement =>
  ts.isJsxElement(node) && node.openingElement.tagName.getText() === "li";

/** Whether a child is or holds an `<li>` the Cluster lays out: one not inside another element. */
function holdsLi(node: ts.Node): boolean {
  if (isLi(node) || (ts.isJsxSelfClosingElement(node) && node.tagName.getText() === "li")) {
    return true;
  }
  if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) return false;
  return ts.forEachChild(node, (child) => (holdsLi(child) ? true : undefined)) ?? false;
}

/** The one element an `<li>` holds, with the text that replaces the `<li>`; undefined when it cannot. */
function unwrapped(li: ts.JsxElement, context: Context): string | undefined {
  const attributes = li.openingElement.attributes.properties;
  if (!attributes.every((part) => ts.isJsxAttribute(part) && nameOf(part) === "key")) {
    return undefined;
  }
  const children = li.children.filter(
    (child) => !(ts.isJsxText(child) && child.containsOnlyTriviaWhiteSpaces),
  );
  const [only] = children;
  if (children.length !== 1 || only === undefined) return undefined;
  const inner = ts.isJsxElement(only) ? only.openingElement : only;
  if (!ts.isJsxOpeningElement(inner) && !ts.isJsxSelfClosingElement(inner)) return undefined;
  const text = only.getText(context.file);
  const key = attributeOf(li.openingElement, "key");
  if (key === undefined) return text;
  if (attributesOf(inner).some((attribute) => nameOf(attribute) === "key")) return undefined;
  const at = inner.tagName.end - only.getStart(context.file);
  return `${text.slice(0, at)} ${key.getText(context.file)}${text.slice(at)}`;
}

/** `Cluster as="ul"` wraps each child in an `<li>` now, so an `<li>` of the app's own goes. */
export function clusterList(tag: Tag, component: string, context: Context): void {
  if (component !== "Cluster") return;
  const as = literalOf(attributeOf(tag, "as"));
  if (as !== "ul" && as !== "ol") return;
  const children = meaningfulChildren(tag);
  if (!children.some(holdsLi)) return;
  const swaps = children.map((child) =>
    isLi(child) ? { child, text: unwrapped(child, context) } : { child, text: undefined },
  );
  if (swaps.some((swap) => swap.text === undefined)) {
    report(context, tag, "Cluster as=ul wraps each child in an li now: drop your own li");
    return;
  }
  for (const { child, text } of swaps) {
    context.edits.push({ start: child.getStart(context.file), end: child.end, text: text ?? "" });
  }
}

export const tagRules: readonly TagRule[] = [
  listRowDivided,
  truncateLines,
  menuItems,
  toastRegion,
  docsAsideLabel,
  clusterList,
];
