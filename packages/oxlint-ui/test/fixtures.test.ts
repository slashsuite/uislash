/**
 * The config, proven on planted code. Every line of `fixtures/bad/` that a rule must report ends
 * with `// expect: <rule> [<rule> ...]`, or has it on the line below, on its own. The suite runs the
 * pinned oxlint with the package's config and fails when a marked line is not reported, when
 * anything else is, or when `fixtures/good/` reports at all. oxlint runs once, while the file
 * loads, so no test waits on the child process.
 */
import {
  copyFileSync,
  globSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { lint } from "../scripts/lint";

const root = resolve(import.meta.dirname, "..");
const MARK = /\/\/ expect: (.+)$/;

/** `file:line rule` for each rule a fixture line is marked with; a marker on its own line marks the line above. */
function marked(file: string): string[] {
  return readFileSync(join(root, file), "utf8")
    .split("\n")
    .flatMap((text, i) => {
      const rules = MARK.exec(text)?.[1]?.trim().split(/\s+/) ?? [];
      const line = text.trimStart().startsWith("//") ? i : i + 1;
      return rules.map((rule) => `${file}:${line} ${rule}`);
    });
}

// The plugin is plain JS with no types; its rule names are all this suite reads from it.
const pluginPath: string = join(root, "plugin.js");
const plugin: { default: { rules: Record<string, unknown> } } = await import(pluginPath);
const rules = Object.keys(plugin.default.rules).map((rule) => `uislash/${rule}`);
const config: { rules: Record<string, string> } = JSON.parse(
  readFileSync(join(root, ".oxlintrc.json"), "utf8"),
);
const fixtureOf = (kind: string) => (rule: string) =>
  `fixtures/${kind}/${rule.replace("uislash/", "")}.tsx`;

const badFiles = globSync("fixtures/bad/**/*.tsx", { cwd: root }).toSorted();
const hits = lint(["fixtures"], root);
const reported = (prefix: string): string[] =>
  hits
    .filter((hit) => hit.file.startsWith(prefix))
    .map((hit) => `${hit.file}:${hit.line} ${hit.rule}`)
    .toSorted();

// Every bad fixture, renamed as a test and a spec: the override clears them. (A .d.ts holds no JSX.)
const scratch = mkdtempSync(join(tmpdir(), "oxlint-ui-"));
mkdirSync(join(scratch, "src"));
const outside = badFiles.flatMap((file, i) =>
  ["test.tsx", "spec.tsx"].map((suffix) => {
    const name = join("src", `f${i}.${suffix}`);
    copyFileSync(join(root, file), join(scratch, name));
    return name;
  }),
);
writeFileSync(
  join(scratch, "src", "types.d.ts"),
  'export declare const tone: "bg-red-500 dark:p-4";\n',
);
const asDeclaration = lint(["src/types.d.ts"], scratch);
writeFileSync(join(scratch, "src", "types.ts"), 'export const tone = "bg-red-500 dark:p-4";\n');
const asSource = lint(["src/types.ts"], scratch).map((hit) => hit.rule);
const inTests = lint(outside, scratch);
rmSync(scratch, { recursive: true, force: true });

describe("the config", () => {
  test("turns every rule of the plugin on, as an error", () => {
    expect(config.rules).toEqual(Object.fromEntries(rules.map((rule) => [rule, "error"])));
  });

  test("leaves test files and specs alone", () => {
    expect(outside).toHaveLength(badFiles.length * 2);
    expect(inTests).toEqual([]);
  });

  test("leaves .d.ts files alone, and only through the override", () => {
    expect(asDeclaration).toEqual([]);
    expect(asSource).toEqual(["uislash/raw-colour", "uislash/dark-variant"]);
  });
});

describe("fixtures/bad", () => {
  test("reports every marked line and nothing else", () => {
    expect(reported("fixtures/bad/")).toEqual(badFiles.flatMap(marked).toSorted());
  });

  test("each rule has a bad fixture of its name that plants it", () => {
    const planted = new Set(badFiles.flatMap(marked).map((line) => line.split(" ")[1]));
    expect(rules.filter((rule) => !planted.has(rule))).toEqual([]);
    expect(badFiles).toEqual(rules.map(fixtureOf("bad")).toSorted());
  });

  test("each message says what to use instead", () => {
    const vague = hits.filter(
      (hit) => !/@slashsuite\/ui-react|ask uislash|Remove the variant/.test(hit.message),
    );
    expect(vague).toEqual([]);
  });
});

describe("fixtures/good", () => {
  test("has one file per rule, and reports nothing", () => {
    const goodFiles = globSync("fixtures/good/**/*.tsx", { cwd: root }).toSorted();
    expect(goodFiles).toEqual(rules.map(fixtureOf("good")).toSorted());
    expect(reported("fixtures/good/")).toEqual([]);
  });
});
