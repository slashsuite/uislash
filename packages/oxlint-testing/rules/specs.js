/** The rules for what a spec or a test does: how it finds, waits, asserts and skips. */

import {
  namesTicket,
  isString,
  textOf,
  nameOf,
  keyOf,
  isFunction,
  ticketNear,
  rule,
  RULE_1,
  RULE_2,
  RULE_7,
  RULE_8,
} from "./shared.js";

// Page methods whose first argument is a selector: `page.click('#x')`. A locator's own method of
// the same name takes no string first (`locator.click()`, `locator.fill('value')`).
const SELECTOR_FIRST = new Set([
  "click",
  "dblclick",
  "hover",
  "tap",
  "check",
  "uncheck",
  "focus",
  "textContent",
  "innerText",
  "innerHTML",
  "inputValue",
  "isVisible",
  "isHidden",
  "isChecked",
  "isEnabled",
  "isDisabled",
  "isEditable",
]);
// Page methods that take a selector then a value: `page.fill('.y', v)`. The locator form takes the
// value first and options second (`locator.fill('ok', { force: true })`, `locator.fill('ok', opts)`),
// so a selector is read when the second argument is a value (a string or an array), or when the
// call is on the page or a frame itself (`page.fill('#name', name)`).
const SELECTOR_THEN_VALUE = new Set([
  "fill",
  "type",
  "press",
  "selectOption",
  "setInputFiles",
  "dispatchEvent",
]);
// Element handle queries: a selector string every time.
const HANDLE_QUERIES = new Set(["$", "$$", "$eval", "$$eval"]);

const PAGE = /^(page|frame|\w+Page|\w+Frame)$/;
const isValue = (node) => isString(node) || node?.type === "ArrayExpression";

function takesSelector(callee, args) {
  const method = nameOf(callee);
  if (HANDLE_QUERIES.has(method)) return true;
  if (SELECTOR_FIRST.has(method)) return isString(args[0]);
  if (!SELECTOR_THEN_VALUE.has(method) || args.length < 2 || !isString(args[0])) return false;
  return isValue(args[1]) || PAGE.test(nameOf(callee.object) ?? "");
}

export const noSelectorActions = rule(
  "act through a role locator, not a selector string",
  (context) => ({
    CallExpression(node) {
      if (node.callee.type !== "MemberExpression") return;
      const method = nameOf(node.callee);
      if (!method || !takesSelector(node.callee, node.arguments)) return;
      context.report({
        node,
        message: `${method}() with a selector string: find it the way a user does, page.getByRole(...).${method === "$" || method === "$$" ? "locator" : method}() ${RULE_1}`,
      });
    },
  }),
);

const LOOK_ATTRIBUTE = /^(class|className|classList|style)(\.|$)/;
const ATTRIBUTE_READS = new Set([
  "toHaveAttribute",
  "getAttribute",
  "hasAttribute",
  "toHaveProperty",
]);
const OBJECT_MATCHERS = new Set(["toMatchObject", "toEqual", "toStrictEqual"]);
const LOOK_KEYS = new Set(["className", "class", "style", "classList"]);
const LOOK_MESSAGE = "assert the state the user sees; the look is the visual check's";

function reportLookKeys(context, expected) {
  if (expected?.type !== "ObjectExpression") return;
  for (const property of expected.properties) {
    if (property.type !== "Property" || !LOOK_KEYS.has(keyOf(property))) continue;
    context.report({
      node: property,
      message: `${keyOf(property)} in an expected object checks look: ${LOOK_MESSAGE} ${RULE_7}`,
    });
  }
}

export const noStyleAssertions = rule("assert behaviour, not class or style", (context) => ({
  CallExpression(node) {
    const method = nameOf(node.callee);
    const [first] = node.arguments;
    if (ATTRIBUTE_READS.has(method) && isString(first) && LOOK_ATTRIBUTE.test(textOf(first))) {
      context.report({
        node,
        message: `${method}('${textOf(first)}') checks look: ${LOOK_MESSAGE} ${RULE_7}`,
      });
    }
    if (OBJECT_MATCHERS.has(method)) reportLookKeys(context, first);
  },
}));

const SKIPS = new Set(["skip", "fixme", "fail"]);

/** The reason a skip gives: the last string argument (a `+` chain counts as one). */
function reasonOf(args) {
  return args
    .map(textOf)
    .filter((text) => text !== undefined)
    .at(-1);
}

export const skipNamesTicket = rule("a skip names its ticket", (context) => ({
  CallExpression(node) {
    const callee = node.callee;
    const kind = nameOf(callee);
    if (callee.type !== "MemberExpression" || !SKIPS.has(kind)) return;
    const args = node.arguments;
    // A skip or fixme that declares a test (a title and a body) is a skipped test, which
    // playwright/no-skipped-test reports. A fail that declares one is a test expected to fail, and
    // its title names the ticket.
    const declares = args.length >= 2 && isFunction(args.at(-1)) && isString(args[0]);
    if (declares && kind !== "fail") return;
    const reason = declares ? textOf(args[0]) : reasonOf(args);
    if (reason !== undefined && namesTicket(reason)) return;
    context.report({
      node,
      message: `${kind}() needs a reason that names its ticket, e.g. 'no hover on touch, FS-12' ${RULE_8}`,
    });
  },
}));

export const noAdhocScreenshot = rule("shots belong to the visual check", (context) => ({
  CallExpression(node) {
    if (node.callee.type !== "MemberExpression" || nameOf(node.callee) !== "screenshot") return;
    context.report({
      node,
      message: `screenshot() takes a shot outside the visual check: assert the state the user sees, the visual check owns every shot ${RULE_7}`,
    });
  },
}));

const TIMER_OWNERS = new Set(["window", "globalThis", "self"]);

/** The statement a node is part of, so a comment above a call formatted over several lines counts. */
function statementOf(node) {
  let at = node;
  while (
    at.parent &&
    !/(Statement|Declaration)$/.test(at.parent.type) &&
    at.parent.type !== "Program"
  )
    at = at.parent;
  return at.parent && at.parent.type !== "Program" ? at.parent : at;
}

// A `timeout` option on any call (an action, an `expect`, `goto`, `request.get`, `test.use`) and
// `test.setTimeout(...)`. A comment naming a ticket on the line or the line above lets one stand.
export const noRaisedTimeout = rule("timeouts stay at the config's defaults", (context) => {
  const report = (node, what) => {
    const lines = [node.loc.start.line, statementOf(node).loc.start.line];
    if (lines.some((line) => ticketNear(context, line))) return;
    context.report({
      node,
      message: `${what} overrides the config's timeout: wait on a state the user sees; a real exception names its ticket in a comment on the line or the line above ${RULE_2}`,
    });
  };
  return {
    Property(node) {
      if (keyOf(node) !== "timeout" || node.parent?.type !== "ObjectExpression") return;
      const call = node.parent.parent;
      if (call?.type !== "CallExpression" || !call.arguments.includes(node.parent)) return;
      report(node, "a timeout option");
    },
    CallExpression(node) {
      const callee = node.callee;
      if (callee.type !== "MemberExpression" || nameOf(callee) !== "setTimeout") return;
      if (TIMER_OWNERS.has(nameOf(callee.object))) return;
      report(node, "setTimeout()");
    },
  };
});

const TEST_ID_QUERY = /^(get|getAll|query|queryAll|find|findAll)ByTestId$/;
const DIRECTIVE = /^\s*(eslint|oxlint)-/;
const FUNCTION = new Set(["ArrowFunctionExpression", "FunctionExpression", "FunctionDeclaration"]);
const DECLARATION = new Set([
  "VariableDeclarator",
  "VariableDeclaration",
  "ExportNamedDeclaration",
  "ExportDefaultDeclaration",
]);

/** The function a node is in, or undefined at the top level. */
function enclosingFunction(node) {
  let fn = node.parent;
  while (fn && !FUNCTION.has(fn.type)) fn = fn.parent;
  return fn;
}

const TEST_CALL = new Set(["test", "it"]);

/**
 * Where a query's test starts: the function passed to `test(...)` or `it(...)` around it, so a reason
 * at the top of the test also covers a query in a callback inside it (`expect.poll`, `map`); the
 * innermost function when no test is around it (a helper).
 */
function testBodyOf(node) {
  const innermost = enclosingFunction(node);
  for (let fn = innermost; fn; fn = enclosingFunction(fn)) {
    const call = fn.parent;
    const callee = call?.type === "CallExpression" ? call.callee : undefined;
    const root = callee?.type === "MemberExpression" ? callee.object : callee;
    if (TEST_CALL.has(nameOf(root) ?? "")) return fn;
  }
  return innermost;
}

/**
 * The declaration a helper starts on, so its doc comment (the one ending on the line above) counts; undefined
 * for a function passed to a call, such as `test`, or for none.
 */
function helperDeclaration(fn) {
  let decl = fn?.parent?.type === "CallExpression" ? undefined : fn;
  while (decl && DECLARATION.has(decl.parent?.type)) decl = decl.parent;
  return decl;
}

/**
 * Whether a reason covers the query: a comment on its own line earlier in its test or function, the
 * doc comment of a helper, or the line above a call outside any function. A directive is not a reason,
 * and a comment trailing code is about that code.
 */
function hasReason(context, node) {
  const line = node.loc.start.line;
  const fn = testBodyOf(node);
  const from = fn ? fn.loc.start.line : line - 1;
  const decl = helperDeclaration(fn);
  const lines = context.sourceCode.text.split("\n");
  const ownLine = (comment) =>
    lines[comment.loc.start.line - 1].slice(0, comment.loc.start.column).trim() === "";
  const placed = (comment) =>
    (comment.loc.start.line >= from && comment.loc.end.line < line) ||
    (decl !== undefined && comment.loc.end.line === decl.loc.start.line - 1);
  return context.sourceCode
    .getAllComments()
    .some((comment) => placed(comment) && ownLine(comment) && !DIRECTIVE.test(comment.value));
}

export const testidNeedsReason = rule(
  "a test id says why no accessible name exists",
  (context) => ({
    CallExpression(node) {
      const name = nameOf(node.callee);
      if (!TEST_ID_QUERY.test(name ?? "") || hasReason(context, node)) return;
      context.report({
        node,
        message: `${name}() needs a comment earlier in its test saying why the element has no accessible name to find it by (a canvas, a chart body); otherwise find it by role ${RULE_1}`,
      });
    },
  }),
);
