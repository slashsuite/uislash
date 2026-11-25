import { existsSync, readFileSync } from "node:fs";

/**
 * The UISlash rules, loaded by oxlint's `jsPlugins` as `uislash`: the hard rules the `ui-review`
 * pull request check runs on a diff, here on the AST of every file an app lints. Plain ESM over
 * the ESTree AST oxlint hands an ESLint-style plugin. Each message says what to use instead.
 *
 * `ui-react.json` (written at pack time from the `@slashsuite/ui-react` source) holds the
 * components it exports, its palette and the colour and element tables.
 */

const DATA = new URL("./ui-react.json", import.meta.url);
if (!existsSync(DATA)) {
  throw new Error(
    "@slashsuite/oxlint-ui: ui-react.json is missing. It is written when the package is packed; in the uislash repo, run `bun packages/oxlint-ui/scripts/data.ts`.",
  );
}
const data = JSON.parse(readFileSync(DATA, "utf8"));
const components = new Set(data.components);
const palette = new Map(Object.entries(data.palette));

const UI_PACKAGE = /^@(?:slashsuite|hackcove)\/ui-react$/;
const STYLING = new Set(["className", "class", "class:list", "style"]);
const JSX_FILE = /\.[cm]?[jt]sx$/;

const UTILITY = "(?:bg|text|border|outline|ring|accent|fill|stroke|decoration|divide)";
const HUES =
  "white|black|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";
const COLOUR = new RegExp(
  `(?<![\\w-])(?:[a-z-]+:)*${UTILITY}-(?:${HUES})(?:-\\d{2,3})?(?:\\/\\d+)?(?![\\w-])`,
  "g",
);
const ARBITRARY_COLOUR = new RegExp(
  `(?<![\\w-])(?:[a-z-]+:)*${UTILITY}-\\[(?:#[0-9a-fA-F]{3,8}|(?:rgb|hsl|oklch|oklab|color)\\([^\\]]*\\))\\]`,
  "g",
);
const DARK = /(?<![\w-])dark:[\w[\]-]/;
const HEX = "(?<!url\\()#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\\w-])";
const FUNCTION = "(?<![\\w-])(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\\(";
const NAMED = `(?<![\\w-])(?:${data.namedColours.join("|")})(?![\\w-])`;
const STYLE_COLOUR = new RegExp(`${HEX}|${FUNCTION}|${NAMED}`, "gi");

const rule = (description, create) => ({
  meta: { type: "problem", docs: { description } },
  create,
});

/** A JSX name as written: `Button`, `svg:g`, `UI.Button`. */
function jsxName(node) {
  if (node.type === "JSXIdentifier") return node.name;
  if (node.type === "JSXNamespacedName") return `${node.namespace.name}:${node.name.name}`;
  if (node.type === "JSXMemberExpression") return `${jsxName(node.object)}.${node.property.name}`;
  return "";
}

/** The local names a file imports, as values, from `@slashsuite/ui-react`. */
function importedFromUi(program) {
  const names = new Set();
  for (const statement of program.body) {
    if (statement.type !== "ImportDeclaration" || statement.importKind === "type") continue;
    if (!UI_PACKAGE.test(statement.source.value)) continue;
    for (const specifier of statement.specifiers) {
      if (specifier.type === "ImportSpecifier" && specifier.importKind !== "type") {
        names.add(specifier.local.name);
      }
    }
  }
  return names;
}

const SKIPPED_KEYS = new Set(["parent", "loc", "range"]);
const isNode = (value) =>
  value !== null && typeof value === "object" && typeof value.type === "string";

/** The AST nodes directly under `node`. */
function childrenOf(node) {
  return Object.entries(node)
    .filter(([key]) => !SKIPPED_KEYS.has(key))
    .flatMap(([, value]) => (Array.isArray(value) ? value : [value]))
    .filter(isNode);
}

/** The text of a string literal or a template literal's text, as written; `undefined` otherwise. */
function stringText(node) {
  if (node.type === "Literal" && typeof node.value === "string") return node.raw ?? node.value;
  return node.type === "TemplateElement" ? node.value.raw : undefined;
}

/** Each string piece of the code under `node`: string literals and template literal text. */
function stringsUnder(node, found = []) {
  const text = stringText(node);
  if (text !== undefined) found.push({ text, line: node.loc.start.line, node });
  for (const child of childrenOf(node)) stringsUnder(child, found);
  return found;
}

/** Every match of `pattern` in the strings, by the line it sits on, keeping the first node. */
function matchesByLine(strings, pattern, byLine = new Map()) {
  for (const { text, line, node } of strings) {
    for (const match of text.matchAll(pattern)) {
      const at = line + (text.slice(0, match.index).match(/\n/g)?.length ?? 0);
      const entry = byLine.get(at) ?? { node, found: [] };
      entry.found.push(match[0]);
      byLine.set(at, entry);
    }
  }
  return byLine;
}

/** Report one message per line, at that line. */
function reportByLine(context, byLine, message) {
  for (const [line, { found }] of [...byLine].toSorted(([a], [b]) => a - b)) {
    context.report({
      message: message(found),
      loc: { start: { line, column: 0 }, end: { line, column: 0 } },
    });
  }
}

/** A rule that reads every string piece in the file once it is parsed. */
const onStrings = (description, check) =>
  rule(description, (context) => ({
    "Program:exit"(program) {
      check(context, stringsUnder(program));
    },
  }));

const styleBlock = rule("no <style> element in JSX", (context) => ({
  JSXOpeningElement(node) {
    if (jsxName(node.name) !== "style") return;
    context.report({
      node,
      message:
        "<style> block. UISlash apps write no CSS of their own: compose @slashsuite/ui-react parts, and ask uislash for what is missing.",
    });
  },
}));

const rawColour = onStrings("no stock Tailwind colour utility", (context, strings) => {
  const stock = matchesByLine(strings, COLOUR);
  const arbitrary = matchesByLine(strings, ARBITRARY_COLOUR);
  const byLine = new Map(stock);
  for (const [line, entry] of arbitrary) {
    const known = byLine.get(line);
    byLine.set(line, known ? { ...known, found: [...known.found, ...entry.found] } : entry);
  }
  reportByLine(context, byLine, (used) => {
    const roles = [...new Set(used.flatMap((utility) => palette.get(utility) ?? []))];
    const role = roles.length === 0 ? "" : ` (the ${roles.join(", ")} role of the palette)`;
    return `Raw colour utility ${used.map((u) => `\`${u}\``).join(", ")}${role}. Colour belongs to the theme and to @slashsuite/ui-react parts; use the part that carries it, or ask uislash for one.`;
  });
});

const darkVariant = onStrings("no dark: variant", (context, strings) => {
  const byLine = new Map();
  for (const { text, line, node } of strings) {
    text.split("\n").forEach((part, i) => {
      if (DARK.test(part) && !byLine.has(line + i)) byLine.set(line + i, { node, found: [] });
    });
  }
  reportByLine(
    context,
    byLine,
    () =>
      "`dark:` variant. A theme decides light or dark; an app never branches on it. Remove the variant.",
  );
});

const stylingProp = rule("no className or style on a @slashsuite/ui-react component", (context) => {
  let imported = new Set();
  return {
    Program(program) {
      imported = importedFromUi(program);
    },
    JSXOpeningElement(node) {
      const component = jsxName(node.name);
      if (!imported.has(component)) return;
      for (const attribute of node.attributes) {
        if (attribute.type !== "JSXAttribute") continue;
        const prop = jsxName(attribute.name);
        if (!STYLING.has(prop)) continue;
        context.report({
          node: attribute,
          message: `\`${prop}\` on <${component}>. @slashsuite/ui-react components take no styling props: compose the parts, or ask uislash for the variant you need.`,
        });
      }
    },
  };
});

const duplicateMessage = (name) =>
  `Local component \`${name}\` has the same name as an @slashsuite/ui-react export. If it does the same job, import the UISlash one, and if that one does not fit, ask uislash for what is missing rather than building a look-alike. If it is a different thing, rename it so it is not mistaken for the UISlash one.`;

const WRAPPERS = new Set(["memo", "forwardRef"]);

/** An initialiser that makes a component: a function, `memo(…)`, `forwardRef(…)`, `React.…`. */
function makesComponent(init) {
  if (!init) return false;
  if (init.type === "ArrowFunctionExpression" || init.type === "FunctionExpression") return true;
  const callee = init.type === "CallExpression" ? init.callee : init;
  if (callee.type === "Identifier") return init !== callee && WRAPPERS.has(callee.name);
  return callee.type === "MemberExpression" && callee.object.name === "React";
}

const duplicateComponent = rule(
  "no local component named like a @slashsuite/ui-react export",
  (context) => {
    let imported = new Set();
    const check = (node, name) => {
      if (components.has(name) && !imported.has(name)) {
        context.report({ node, message: duplicateMessage(name) });
      }
    };
    return {
      Program(program) {
        imported = importedFromUi(program);
        const stem = /([^/\\]+?)(?:\.[^./\\]+)$/.exec(context.filename)?.[1] ?? "";
        if (components.has(stem)) {
          context.report({
            message: duplicateMessage(stem),
            loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 0 } },
          });
        }
      },
      FunctionDeclaration(node) {
        if (node.id) check(node, node.id.name);
      },
      ClassDeclaration(node) {
        if (node.id) check(node, node.id.name);
      },
      VariableDeclarator(node) {
        if (node.id.type === "Identifier" && makesComponent(node.init)) check(node, node.id.name);
      },
    };
  },
);

const inlineColour = rule("no colour literal in a style value", (context) => ({
  JSXAttribute(node) {
    if (jsxName(node.name) !== "style" || !node.value) return;
    const byLine = matchesByLine(stringsUnder(node.value), STYLE_COLOUR);
    for (const entry of byLine.values()) {
      entry.found = entry.found.map((colour) => colour.replace(/\($/, "(…)"));
    }
    reportByLine(
      context,
      byLine,
      (colours) =>
        `Colour ${colours.map((c) => `\`${c}\``).join(", ")} in a \`style\` value. Colour belongs to the theme and to @slashsuite/ui-react parts: use the part (or its \`tone\`) that carries it, or ask uislash for one.`,
    );
  },
}));

/** The part to use for a raw element, `undefined` when the element is allowed. */
function partFor(element, inputType) {
  if (!Object.hasOwn(data.rawElements, element)) return undefined;
  if (element !== "input" || inputType === undefined) return data.rawElements[element];
  if (data.plainInputs.includes(inputType)) return undefined;
  return Object.hasOwn(data.inputTypes, inputType) ? data.inputTypes[inputType] : "`Input`";
}

/** An `<input>`'s `type`, when it is written as a plain string. */
function inputTypeOf(node) {
  const type = node.attributes.find((a) => a.type === "JSXAttribute" && jsxName(a.name) === "type");
  const value = type?.value;
  return value?.type === "Literal" && /^[\w-]+$/.test(value.value) ? value.value : undefined;
}

const rawElement = rule("no raw HTML element that has a @slashsuite/ui-react part", (context) => ({
  JSXOpeningElement(node) {
    if (!JSX_FILE.test(context.filename)) return;
    const element = jsxName(node.name);
    const part = partFor(element, inputTypeOf(node));
    if (part === undefined) return;
    context.report({
      node,
      message: `Raw <${element}>. @slashsuite/ui-react has the part for it: use ${part}, which carries the theme, focus and states. If it does not fit, ask uislash for the variant rather than building one.`,
    });
  },
}));

export default {
  meta: { name: "uislash" },
  rules: {
    "style-block": styleBlock,
    "raw-colour": rawColour,
    "dark-variant": darkVariant,
    "styling-prop": stylingProp,
    "duplicate-component": duplicateComponent,
    "inline-colour": inlineColour,
    "raw-element": rawElement,
  },
};
