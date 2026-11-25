/** `config-shape`: every Playwright config keeps the house values (UI testing rule 8). */

import { textOf, nameOf, keyOf, isLiteral, rule, RULE_8 } from "./shared.js";

// The values every Playwright config holds. `trace` must be written down, since its default is
// "off"; `retries` and `reuseExistingServer` already default to these. `fullyParallel` defaults to
// false and `reporter` to "dot" on CI, so both are written down too.
const HOUSE = {
  retries: 0,
  reuseExistingServer: false,
  trace: "retain-on-failure",
  fullyParallel: true,
};
const HOUSE_REPORTER = `process.env.CI ? [["github"], ["html", { open: "never" }]] : "list"`;
// The keys a config must write down, each with what it must say.
const REQUIRED = {
  trace: `use.trace: "retain-on-failure" (its default is "off")`,
  fullyParallel: "fullyParallel: true (its default is false)",
  reporter: `reporter: ${HOUSE_REPORTER}`,
};

const propertyOf = (object, key) =>
  object?.type === "ObjectExpression"
    ? object.properties.find((property) => property.type === "Property" && keyOf(property) === key)
    : undefined;

/** `process.env.CI` or `process.env["CI"]`. */
const readsCI = (node) =>
  node?.type === "MemberExpression" &&
  (nameOf(node) === "CI" || isLiteral(node.property, "CI")) &&
  nameOf(node.object) === "env";

/** A literal, array or object expression as the value it writes; a spread or a call as a marker. */
function valueOf(node) {
  if (node?.type === "Literal") return node.value;
  if (node?.type === "ArrayExpression") return node.elements.map(valueOf);
  if (node?.type !== "ObjectExpression") return `<${node?.type}>`;
  return Object.fromEntries(
    node.properties.map((property) =>
      property.type === "Property" ? [keyOf(property), valueOf(property.value)] : ["...", "..."],
    ),
  );
}

const CI_REPORTERS = JSON.stringify([["github"], ["html", { open: "never" }]]);

const isHouseReporter = (node) =>
  node?.type === "ConditionalExpression" &&
  readsCI(node.test) &&
  JSON.stringify(valueOf(node.consequent)) === CI_REPORTERS &&
  isLiteral(node.alternate, "list");

/** The device a project's `use` spreads, `"iPhone 15"` for `...devices["iPhone 15"]`. */
function deviceOf(use) {
  if (use?.type !== "ObjectExpression") return {};
  const index = use.properties.findIndex(
    (property) =>
      property.type === "SpreadElement" &&
      property.argument.type === "MemberExpression" &&
      nameOf(property.argument.object) === "devices" &&
      property.argument.property.type === "Literal",
  );
  if (index === -1) return {};
  return { device: use.properties[index].argument.property.value, index };
}

// Devices whose `defaultBrowserType` is Chromium; every other one (the iPhones, Safari, Firefox)
// needs `browserName: "chromium"` after the spread.
const CHROMIUM_DEVICE = /^Desktop (Chrome|Edge)\b/;

/** A phone project (named phone or mobile, or on a phone device) is on the iPhone 15. */
function phoneProblem(name, device) {
  const phone =
    /phone|mobile/i.test(name) || (device !== undefined && !device.startsWith("Desktop "));
  return phone && device !== "iPhone 15"
    ? `a phone project uses ...devices["iPhone 15"]`
    : undefined;
}

/**
 * A project on a device that is not Chromium sets `browserName: "chromium"` after the spread (one
 * written before it is overwritten). An explicit `browserName` is checked on its own, by the
 * Property visitor.
 */
function chromiumProblem(use, device, index) {
  if (device === undefined || CHROMIUM_DEVICE.test(device)) return undefined;
  if (use.properties.indexOf(propertyOf(use, "browserName")) > index) return undefined;
  return `every project runs Chromium: add browserName: "chromium" after the device`;
}

/** What is off the house shape in one entry of `projects`, as a list of phrases. */
function projectProblems(project) {
  const name = textOf(propertyOf(project, "name")?.value) ?? "";
  const use = propertyOf(project, "use")?.value;
  const { device, index } = deviceOf(use);
  return [phoneProblem(name, device), chromiumProblem(use, device, index)].filter(Boolean);
}

const modeOf = (object) => propertyOf(object, "mode")?.value;

function houseValueProblem(node) {
  const key = keyOf(node);
  if (key === "reporter") {
    return isHouseReporter(node.value) ? undefined : `reporter must be ${HOUSE_REPORTER}`;
  }
  if (key === "browserName") {
    return isLiteral(node.value, "chromium") ? undefined : `browserName must be "chromium"`;
  }
  if (!Object.hasOwn(HOUSE, key)) return undefined;
  // `trace` may be an object, `{ mode: "retain-on-failure", sources: false }`.
  const mode =
    node.value.type === "ObjectExpression" && key === "trace" ? modeOf(node.value) : node.value;
  if (isLiteral(mode, HOUSE[key])) return undefined;
  return `${key} must be ${JSON.stringify(HOUSE[key])}`;
}

export const configShape = rule("the Playwright config keeps the house values", (context) => {
  const seen = new Set();
  return {
    Property(node) {
      const key = keyOf(node);
      seen.add(key);
      const problem = houseValueProblem(node);
      if (problem) context.report({ node, message: `${problem} ${RULE_8}` });
      if (key !== "projects" || node.value.type !== "ArrayExpression") return;
      for (const project of node.value.elements) {
        if (project?.type !== "ObjectExpression") continue;
        const problems = projectProblems(project);
        if (problems.length === 0) continue;
        context.report({ node: project, message: `${problems.join("; ")} ${RULE_8}` });
      }
    },
    "Program:exit"(node) {
      const missing = Object.keys(REQUIRED).filter((key) => !seen.has(key));
      if (missing.length === 0) return;
      const wanted = missing.map((key) => REQUIRED[key]).join("; ");
      context.report({ node, message: `the config must write down ${wanted} ${RULE_8}` });
    },
  };
});
