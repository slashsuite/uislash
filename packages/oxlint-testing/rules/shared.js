/** What the `ui-testing` rules share: reading the AST, finding a ticket, and the rules' names. */

const TICKET = /\b([A-Z]{2,})-\d+\b/g;
// Standards that read like a ticket ref (`UTF-8`, `SHA-256`, `ISO-8601`) and are not one.
const NOT_TICKETS = new Set(["AES", "CVE", "ES", "HTTP", "ISO", "MD", "RFC", "RSA", "SHA", "UTF"]);

export const namesTicket = (text) =>
  [...text.matchAll(TICKET)].some(([, prefix]) => !NOT_TICKETS.has(prefix));

/** A string literal or a template literal. */
export const isString = (node) =>
  Boolean(node) &&
  ((node.type === "Literal" && typeof node.value === "string") || node.type === "TemplateLiteral");

/** The text of a string literal, a template literal (`${}` per hole) or a `+` chain of them. */
export function textOf(node) {
  if (!node) return undefined;
  if (node.type === "Literal") return typeof node.value === "string" ? node.value : undefined;
  if (node.type === "TemplateLiteral") return node.quasis.map((q) => q.value.cooked).join("${}");
  if (node.type === "BinaryExpression" && node.operator === "+") {
    const parts = [textOf(node.left), textOf(node.right)];
    return parts.some((part) => part !== undefined) ? parts.join("") : undefined;
  }
  return undefined;
}

/** The called or read name: `x` for `x` and `a.x`, nothing for `a[x]`. */
export function nameOf(node) {
  if (!node) return undefined;
  if (node.type === "Identifier") return node.name;
  if (node.type === "MemberExpression" && !node.computed) return node.property.name;
  return undefined;
}

/** A property key's name, written bare (`className`) or quoted (`"class"`). */
export const keyOf = (property) => nameOf(property.key) ?? property.key?.value;

export const isFunction = (node) =>
  node?.type === "ArrowFunctionExpression" || node?.type === "FunctionExpression";

/** A string literal holding exactly `value`. */
export const isLiteral = (node, value) => node?.type === "Literal" && node.value === value;

/** The comments that touch `line`, or end on the line above it. */
const commentsAt = (context, line) =>
  context.sourceCode
    .getAllComments()
    .filter((comment) => comment.loc.start.line <= line && comment.loc.end.line >= line - 1);

/** Whether a comment on `line` or the line above names a ticket, as a skip's reason does. */
export const ticketNear = (context, line) =>
  commentsAt(context, line).some((comment) => namesTicket(comment.value));

export const rule = (description, create) => ({
  meta: { type: "problem", docs: { description } },
  create,
});
// The UI testing rules each message names, by number and title (README.md, "The UI testing rules").
export const RULE_1 = "(UI testing rule 1: Find elements the way a user does)";
export const RULE_2 = "(UI testing rule 2: Wait on a state, never on a clock)";
export const RULE_7 = "(UI testing rule 7: Behaviour in tests, look in PixelSlash)";
export const RULE_8 = "(UI testing rule 8: One config shape)";
