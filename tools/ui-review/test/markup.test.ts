import { describe, expect, it } from "vitest";
import { blankComments } from "../src/jsx.js";
import { CASES } from "./cases.js";
import { diffOf, run } from "./fixtures.js";

/** Layer 1 over `source` added as a new file, as `[rule, line]`. */
const verdict = (path: string, source: string) =>
  run(diffOf({ path, isNew: true, lines: source.split("\n") }), { [path]: source }).map(
    (f): [string, number] => [f.rule, f.line],
  );

describe("the shared cases (the oxlint-ui parity test runs the same files)", () => {
  it.each(CASES.map((c) => [c.name, c] as const))("%s", (_, c) => {
    expect(verdict(c.path, c.source)).toEqual(c.expect);
  });
});

describe("inline-colour", () => {
  it("reports hex, rgb() and a named colour in a style value, once per line", () => {
    const source = '<div style={{ color: "#ff0000", background: "rgb(1, 2, 3)" }} />';
    const found = run(diffOf({ path: "src/a.tsx", lines: [source] }), { "src/a.tsx": source });
    expect(found).toHaveLength(1);
    expect(found[0]).toMatchObject({ rule: "inline-colour", line: 1 });
    expect(found[0]?.message).toContain("`#ff0000`, `rgb(…)`");
  });

  it("passes a colour word in a plain string, in prose and in a comment", () => {
    const source = [
      'const label = "red";',
      "// style={{ color: 'red' }}",
      'export const a = <p title="#ff0000">A red door, rgb(1, 2, 3) and hsl(0 0% 0%).</p>;',
    ].join("\n");
    expect(verdict("src/a.tsx", source)).toEqual([]);
  });

  it("reports only an added line", () => {
    const source = 'export const a = <i style={{ color: "red" }} />;\nexport const b = 1;';
    const diff = diffOf({ path: "src/a.tsx", start: 2, lines: ["export const b = 1;"] });
    expect(run(diff, { "src/a.tsx": source })).toEqual([]);
  });
});

describe("raw-element", () => {
  it("names the UISlash part to use", () => {
    const found = run(diffOf({ path: "src/a.tsx", lines: ['<input type="range" />'] }));
    expect(found).toEqual([expect.objectContaining({ rule: "raw-element", line: 1 })]);
    expect(found[0]?.message).toContain("`Slider`");
    const button = run(diffOf({ path: "src/a.tsx", lines: ["<button>Go</button>"] }));
    expect(button[0]?.message).toContain("`Button`");
  });

  it("passes <img>, a hidden input, and a raw element in a .astro or .html file", () => {
    const lines = ['<img src="/a.png" alt="" />', '<input type="hidden" />'];
    expect(run(diffOf({ path: "src/a.tsx", lines }))).toEqual([]);
    expect(run(diffOf({ path: "src/a.astro", lines: ["<button>Go</button>"] }))).toEqual([]);
  });
});

describe("style-block", () => {
  it("does not match <style> inside a comment (the old false positive)", () => {
    const source = [
      "// a <style> tag is not allowed here",
      "/* <style>",
      "   h1 { margin: 0 } */",
      "export const a = <p>{/* <style> */}a</p>;",
    ].join("\n");
    expect(verdict("src/a.tsx", source)).toEqual([]);
    expect(verdict("src/a.astro", "<!-- <style> was here -->\n<p>a</p>")).toEqual([]);
  });

  it("still reports a real one after a comment on the same line", () => {
    expect(verdict("src/a.tsx", "/* x */ export const a = <style>{css}</style>;")).toEqual([
      ["style-block", 1],
    ]);
  });
});

describe("blankComments", () => {
  it("keeps strings, URLs and line numbers, and blanks every comment kind", () => {
    const source = 'const u = "https://x"; // gone\n/* a\nb */ <!-- c --> `//kept`';
    const blanked = blankComments(source);
    expect(blanked.split("\n")).toHaveLength(3);
    expect(blanked).toContain('"https://x"');
    expect(blanked).toContain("`//kept`");
    expect(blanked).not.toMatch(/gone|a|c -->/);
  });

  it("ends an apostrophe in JSX text at its line", () => {
    expect(blankComments("<p>Don't</p>\n// gone")).toBe("<p>Don't</p>\n       ");
  });
});

describe("the probe: one change down each route around the library", () => {
  it("reports each route, with its line", () => {
    const tsx = [
      "export function Probe() {",
      "  return (",
      '    <div className="bg-red-500 text-[#123456]">',
      '      <p style={{ color: "#ff0000", background: "rgb(1, 2, 3)" }}>Hi</p>',
      "      <button>Go</button>",
      '      <input type="text" />',
      "      <dialog>Done</dialog>",
      "    </div>",
      "  );",
      "}",
    ].join("\n");
    const diff = diffOf(
      { path: "src/probe.css", isNew: true, lines: [".probe {", "  color: red;", "}"] },
      { path: "src/Probe.tsx", isNew: true, lines: tsx.split("\n") },
    );
    const found = run(diff, { "src/Probe.tsx": tsx }).map((f) => [f.path, f.rule, f.line]);
    expect(found).toEqual([
      ["src/probe.css", "new-css", 1],
      ["src/Probe.tsx", "raw-colour", 3],
      ["src/Probe.tsx", "inline-colour", 4],
      ["src/Probe.tsx", "raw-element", 5],
      ["src/Probe.tsx", "raw-element", 6],
      ["src/Probe.tsx", "raw-element", 7],
    ]);
  });
});
