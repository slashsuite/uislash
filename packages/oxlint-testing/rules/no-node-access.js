/** `no-node-access`: find elements by role, not by walking the DOM (UI testing rule 1). */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { nameOf, isFunction, rule, RULE_1 } from "./shared.js";

// Testing Library's own modules (eslint-plugin-testing-library 7.16.2, `LIBRARY_MODULES`,
// `OLD_LIBRARY_MODULES` and `USER_EVENT_MODULE`).
const TESTING_LIBRARY = new Set([
  "@testing-library/dom",
  "@testing-library/angular",
  "@testing-library/react",
  "@testing-library/preact",
  "@testing-library/vue",
  "@testing-library/svelte",
  "@marko/testing-library",
  "dom-testing-library",
  "vue-testing-library",
  "react-testing-library",
  "@testing-library/user-event",
]);

// The reads that return a DOM node, from eslint-plugin-testing-library 7.16.2
// (`PROPERTIES_RETURNING_NODES` and `METHODS_RETURNING_NODES`), less `activeElement`: reading where
// focus is, is the keyboard outcome a test asserts.
const NODE_ACCESS = new Set([
  "children",
  "childElementCount",
  "firstChild",
  "firstElementChild",
  "fullscreenElement",
  "lastChild",
  "lastElementChild",
  "nextElementSibling",
  "nextSibling",
  "parentElement",
  "parentNode",
  "pointerLockElement",
  "previousElementSibling",
  "previousSibling",
  "rootNode",
  "scripts",
  "closest",
  "getElementById",
  "getElementsByClassName",
  "getElementsByName",
  "getElementsByTagName",
  "getElementsByTagNameNS",
  "querySelector",
  "querySelectorAll",
]);
// Calls on a query result that act on the node, not as a user (the same plugin's
// `EVENT_HANDLER_METHODS`): `screen.getByRole("button").click()`.
const NODE_EVENTS = new Set(["click", "select", "submit"]);
const QUERY =
  /^(get|getAll|query|queryAll|find|findAll)By(LabelText|PlaceholderText|Text|AltText|Title|DisplayValue|Role|TestId)$/;

const REEXPORTS_TESTING_LIBRARY =
  /\bexport\s+(\*|\{[^}]*\})(\s+as\s+\w+)?\s+from\s+["']@testing-library\//;
const SOURCE_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js"];
const reexports = new Map();

/** A source file's text, or "" when there is no such file. Any other failure is a real one. */
function sourceOf(path) {
  try {
    return readFileSync(path, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return "";
    throw error;
  }
}

/**
 * Whether the relative module `specifier`, imported from `file`, re-exports Testing Library. The
 * repo writes `./render.harness.js` for `render.harness.tsx`, so the extension is swapped for each
 * source one in turn. Read once per path per lint run, one level deep.
 */
function reexportsTestingLibrary(file, specifier) {
  const base = resolve(dirname(file), specifier).replace(/\.[cm]?[jt]sx?$/, "");
  return SOURCE_EXTENSIONS.some((extension) => {
    const path = base + extension;
    if (!reexports.has(path)) reexports.set(path, REEXPORTS_TESTING_LIBRARY.test(sourceOf(path)));
    return reexports.get(path);
  });
}

/** The names a file imports from Testing Library, directly or through a local re-export. */
function testingLibraryNames(program, file) {
  const names = new Set();
  for (const statement of program.body) {
    if (statement.type !== "ImportDeclaration") continue;
    const source = statement.source.value;
    const fromTestingLibrary =
      TESTING_LIBRARY.has(source) ||
      (source.startsWith(".") && reexportsTestingLibrary(file, source));
    if (!fromTestingLibrary) continue;
    names.add(source);
    for (const specifier of statement.specifiers) names.add(specifier.local.name);
  }
  return names;
}

/** Inside an expression statement or a variable declarator, where Testing Library's rule looks. */
function inStatement(node) {
  for (let up = node.parent; up; up = up.parent) {
    if (up.type === "ExpressionStatement" || up.type === "VariableDeclarator") return true;
  }
  return false;
}

/** The identifier a chain starts from: `screen` for `screen.getByRole("x").click`. */
function rootOf(node) {
  if (node?.type === "Identifier") return node;
  if (node?.type === "MemberExpression") return rootOf(node.object);
  if (node?.type === "CallExpression") return rootOf(node.callee);
  return undefined;
}

/**
 * A Testing Library query call on an imported name: `screen.getByRole("x")`. An awaited one
 * (`(await screen.findByRole("x")).click()`) is not, as in Testing Library's own rule.
 */
function isImportedQuery(node, imported) {
  if (node.type !== "CallExpression" || !QUERY.test(nameOf(node.callee) ?? "")) return false;
  return imported.has(rootOf(node)?.name);
}

const walkMessage = (name) =>
  `${name} walks the DOM: find it the way a user does, screen.getByRole(...) ${RULE_1}`;

// Playwright calls whose callback runs in the page: `page.evaluate(fn)`, `locator.evaluate(fn)`.
const EVALUATES = new Set(["evaluate", "evaluateAll", "evaluateHandle", "$eval", "$$eval"]);

/** The Playwright call whose in-page callback holds `node`, if any: `evaluate` in `page.evaluate`. */
function evaluateAround(node) {
  for (let up = node.parent; up; up = up.parent) {
    const call = up.parent;
    if (!isFunction(up) || call?.type !== "CallExpression" || !call.arguments.includes(up))
      continue;
    if (call.callee.type === "MemberExpression" && EVALUATES.has(nameOf(call.callee))) {
      return nameOf(call.callee);
    }
  }
  return undefined;
}

/**
 * A read Testing Library's own rule reports: the last link of a chain (`a.parentElement`, not
 * `a.parentElement.id`), not on `props`, inside a statement.
 */
const isTestingLibraryWalk = (node) =>
  !(node.parent?.type === "MemberExpression" && node.parent.object === node) &&
  !(node.object.type === "Identifier" && node.object.name === "props") &&
  inStatement(node);

/** Reports a walk inside a Playwright `evaluate` callback; whether there was one to report. */
function reportInPage(context, node) {
  const evaluate = evaluateAround(node);
  if (!evaluate) return false;
  context.report({
    node: node.property,
    message: `${node.property.name} walks the DOM inside ${evaluate}(): find it the way a user does, page.getByRole(...) ${RULE_1}`,
  });
  return true;
}

// Testing Library's `no-node-access`, which runs only in a file that imports a Testing Library
// module by name. This one also runs when the file imports a local module that re-exports one
// (`./render.harness.js` with `export { render, screen } from "@testing-library/react"`), and, in
// any file, inside the in-page callback of a Playwright `evaluate`, `evaluateAll` or `$eval`.
export const noNodeAccess = rule("find elements by role, not by walking the DOM", (context) => {
  let imported = new Set();
  return {
    Program(node) {
      imported = testingLibraryNames(node, context.filename);
    },
    MemberExpression(node) {
      if (node.computed || !NODE_ACCESS.has(node.property.name)) return;
      const name = node.property.name;
      // Inside `page.evaluate(...)` a walk is a walk, whatever the file imports.
      if (reportInPage(context, node)) return;
      if (imported.size === 0 || !isTestingLibraryWalk(node)) return;
      context.report({ node: node.property, message: walkMessage(name) });
    },
    CallExpression(node) {
      const callee = node.callee;
      if (callee.type !== "MemberExpression" || !NODE_EVENTS.has(nameOf(callee))) return;
      if (!isImportedQuery(callee.object, imported)) return;
      context.report({ node: callee.property, message: walkMessage(`${nameOf(callee)}()`) });
    },
  };
});
