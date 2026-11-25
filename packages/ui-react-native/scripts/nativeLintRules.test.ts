import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { nativeThemes } from "../test/themes.js";
import { lintSource } from "./nativeLintRules.js";

const fixture = (name: string) => readFileSync(join(import.meta.dirname, "fixtures", name), "utf8");

describe("native lint", () => {
  it("fires every rule on the planted bad fixture", () => {
    const findings = lintSource(fixture("bad.tsx"), nativeThemes);
    expect(findings.map((finding) => [finding.rule, finding.line])).toEqual([
      ["stylesheet", 5],
      ["unresolved-class", 8],
      ["colour-literal", 10],
      ["bare-text", 11],
      ["bare-text", 12],
    ]);
  });

  it("names the class that does not resolve", () => {
    const [finding] = lintSource(fixture("bad.tsx"), nativeThemes).filter(
      (each) => each.rule === "unresolved-class",
    );
    expect(finding?.message).toContain("shadow-glow");
  });

  it("passes the clean fixture", () => {
    expect(lintSource(fixture("good.tsx"), nativeThemes)).toEqual([]);
  });
});
