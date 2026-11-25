/**
 * Parity with the pull request check: every shared case of `tools/ui-review/test/cases.ts` runs
 * through layer 1 (added as a new file) and through oxlint with this package's config, and both
 * must report the same rules on the same lines with the same words. oxlint runs once, while the
 * file loads, over one temp dir per case, so no test waits on the child process.
 */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";
import { CASES } from "../../../tools/ui-review/test/cases.js";
import { diffOf, run } from "../../../tools/ui-review/test/fixtures.js";
import { lint } from "../scripts/lint";

type Verdict = { rule: string; line: number; message: string };

const scratch = mkdtempSync(join(tmpdir(), "oxlint-ui-parity-"));
const fileOf = (i: number) => join(String(i), CASES[i]?.path ?? "");
CASES.forEach((c, i) => {
  const file = join(scratch, fileOf(i));
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, c.source);
});
const hits = lint(
  CASES.map((_, i) => fileOf(i)),
  scratch,
);
rmSync(scratch, { recursive: true, force: true });

const byLine = (a: Verdict, b: Verdict) => a.line - b.line || a.rule.localeCompare(b.rule);

const oxlintSays = (i: number): Verdict[] =>
  hits
    .filter((hit) => hit.file === fileOf(i))
    .map((hit) => ({
      rule: hit.rule.replace(/^uislash\//, ""),
      line: hit.line,
      message: hit.message,
    }))
    .toSorted(byLine);

const layer1Says = (path: string, source: string): Verdict[] =>
  run(diffOf({ path, isNew: true, lines: source.split("\n") }), { [path]: source })
    .map(({ rule, line, message }) => ({ rule, line, message }))
    .toSorted(byLine);

describe("oxlint reports what layer 1 reports", () => {
  it.each(CASES.map((c, i) => [c.name, c, i] as const))("%s", (_, c, i) => {
    const layer1 = layer1Says(c.path, c.source);
    expect(layer1.map((v): [string, number] => [v.rule, v.line])).toEqual(
      c.expect.toSorted(([ra, la], [rb, lb]) => la - lb || ra.localeCompare(rb)),
    );
    expect(oxlintSays(i)).toEqual(layer1);
  });
});
