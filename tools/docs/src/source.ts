/**
 * Cuts what the docs show out of a `*.examples.tsx` file with the TypeScript compiler API: the body
 * of an exported example (`export const DoX = () => …`), its JSDoc as its caption, and the imports
 * the body needs.
 */
import ts from "typescript";

export type StoryParts = {
  /** The imports the snippet uses, then the body of the example, dedented. */
  code: string;
  /** The example's JSDoc, which the docs show as its caption. */
  caption: string | undefined;
};

const parse = (raw: string) =>
  ts.createSourceFile("example.tsx", raw, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

function exportedExample(file: ts.SourceFile, name: string): ts.VariableStatement | undefined {
  return file.statements.filter(ts.isVariableStatement).find((s) => {
    const exported = s.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false;
    return exported && s.declarationList.declarations.some((d) => d.name.getText() === name);
  });
}

/** The arrow function an example is: `export const DoX = () => …`. */
function arrowOf(statement: ts.VariableStatement): ts.ArrowFunction | undefined {
  const init = statement.declarationList.declarations[0]?.initializer;
  return init !== undefined && ts.isArrowFunction(init) ? init : undefined;
}

/** Dedent by the smallest indent of any non-blank line. */
function dedent(text: string): string {
  const lines = text.split("\n");
  const indents = lines.filter((l) => l.trim() !== "").map((l) => /^ */.exec(l)?.[0].length ?? 0);
  const cut = Math.min(...indents, Number.POSITIVE_INFINITY);
  return lines.map((l) => l.slice(Number.isFinite(cut) ? cut : 0)).join("\n");
}

/** A block body (hooks and a `return`) as `function Example() {…}`, or the expression of a concise one. */
function bodyText(fn: ts.ArrowFunction, raw: string): string {
  const { body } = fn;
  if (ts.isBlock(body)) {
    const first = body.statements[0];
    const last = body.statements.at(-1);
    if (first === undefined || last === undefined) return "";
    const from = raw.lastIndexOf("\n", first.getStart()) + 1;
    const inner = dedent(raw.slice(from, last.end));
    return `function Example() {\n${inner.replace(/^(?=.)/gm, "  ")}\n}`;
  }
  const expression = ts.isParenthesizedExpression(body) ? body.expression : body;
  const from = raw.lastIndexOf("\n", expression.getStart()) + 1;
  if (raw.slice(from, expression.getStart()).trim() === "")
    return dedent(raw.slice(from, expression.end));
  const [first = "", ...rest] = raw.slice(expression.getStart(), expression.end).split("\n");
  return [first, ...dedent(rest.join("\n")).split("\n")].join("\n");
}

/** The longest one-line import the docs frame shows without a sideways scroll. */
const IMPORT_WIDTH = 90;

/** `import { A, B } from "mod";` for the names a snippet uses, from every package import. */
function importsFor(file: ts.SourceFile, snippet: string): string {
  const used = (name: string) => new RegExp(`\\b${name}\\b`).test(snippet);
  const lines = file.statements.filter(ts.isImportDeclaration).flatMap((decl) => {
    const spec = decl.moduleSpecifier.getText().slice(1, -1);
    const named = decl.importClause?.namedBindings;
    if (spec.startsWith(".") || named === undefined) return [];
    if (!ts.isNamedImports(named)) return [];
    const names = named.elements.map((e) => e.name.text).filter(used);
    if (names.length === 0) return [];
    const line = `import { ${names.join(", ")} } from "${spec}";`;
    // Past the width the frame shows without scrolling, one name per line.
    return [
      line.length <= IMPORT_WIDTH ? line : `import {\n  ${names.join(",\n  ")},\n} from "${spec}";`,
    ];
  });
  return lines.join("\n");
}

/** The names an examples file declares at top level (not imports): a snippet cannot use them. */
function localNames(file: ts.SourceFile): string[] {
  return file.statements.flatMap((statement) => {
    if (ts.isVariableStatement(statement))
      return statement.declarationList.declarations.flatMap((d) =>
        ts.isIdentifier(d.name) ? [d.name.text] : [],
      );
    return ts.isFunctionDeclaration(statement) && statement.name ? [statement.name.text] : [];
  });
}

/** Every identifier in `node`; a string that happens to contain a word is not one. */
function identifiersIn(node: ts.Node): string[] {
  const found: string[] = ts.isIdentifier(node) ? [node.text] : [];
  node.forEachChild((child) => {
    found.push(...identifiersIn(child));
  });
  return found;
}

function captionOf(statement: ts.VariableStatement): string | undefined {
  const doc = ts.getJSDocCommentsAndTags(statement).find(ts.isJSDoc);
  const text = doc === undefined ? undefined : ts.getTextOfJSDocComment(doc.comment);
  return text?.replace(/\s*\n\s*/g, " ").trim();
}

/** The code and caption of the named example in `raw`, or `undefined` when it has none. */
export function storyParts(raw: string, name: string): StoryParts | undefined {
  const file = parse(raw);
  const statement = exportedExample(file, name);
  const example = statement === undefined ? undefined : arrowOf(statement);
  if (statement === undefined || example === undefined) return undefined;
  const body = bodyText(example, raw);
  const stray = identifiersIn(example).find((id) => localNames(file).includes(id));
  if (stray !== undefined) {
    throw new Error(
      `Example "${name}" uses "${stray}" from its own file; a doc snippet must stand alone`,
    );
  }
  const imports = importsFor(file, body);
  return {
    code: imports === "" ? body : `${imports}\n\n${body}`,
    caption: captionOf(statement),
  };
}
