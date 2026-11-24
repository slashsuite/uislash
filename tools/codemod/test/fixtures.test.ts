import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { transform } from "../src/transform.js";

// One folder per swap in the 0.10 to 0.11 table: `before.txt` is an app file as 0.10 wrote it,
// `after.txt` the file the codemod must produce, and `report.txt` the file:line reports it must
// print (one `line: message` each). A folder with no `after.txt` is a by-hand row: the file stays
// as it is and the report says where to look. The files are .txt so no formatter or linter
// rewrites them. A folder whose name starts `unpin-` runs the second step, `--unpin`, and one that
// starts `to-0.13-` runs the step for the next minor, `--to-0.13`.

const root = join(import.meta.dirname, "fixtures");
const read = (dir: string, name: string) => {
  const path = join(root, dir, name);
  return existsSync(path) ? readFileSync(path, "utf8") : undefined;
};
const PREFIXES = { "unpin-": "unpin", "to-0.13-": "0.13" } as const;
const stepOf = (dir: string) =>
  Object.entries(PREFIXES).find(([prefix]) => dir.startsWith(prefix))?.[1] ?? "0.11";
const fixtures = readdirSync(root).toSorted();
const messages = (reports: readonly { message: string }[]) => reports.map((r) => r.message);

// The 0.11 fixtures whose output the pass changes again, each with the reason.
const notIdempotent: Readonly<Record<string, string>> = {
  "text-as-p":
    'a bare Text is a span in 0.10 and a p in 0.11, so the pass reads it as 0.10 and pins as="span"',
  "text-truncate-lines":
    "the same bare Text: its as=p becomes a bare Text, which a second run pins as a span",
};

describe("the codemod", () => {
  it.each(fixtures)("%s", (dir) => {
    const before = read(dir, "before.txt") ?? "";
    const { output, reports } = transform(before, `${dir}.tsx`, { step: stepOf(dir) });
    expect(output).toBe(read(dir, "after.txt") ?? before);
    const lines = reports.map((line) => `${line.line}: ${line.message}`);
    expect(lines).toEqual((read(dir, "report.txt") ?? "").split("\n").filter(Boolean));
  });

  it("changes nothing and reports nothing on a Field it already unpaired", () => {
    const unpaired = read("field-htmlfor-pair", "after.txt") ?? "";
    expect(unpaired).not.toBe("");
    expect(transform(unpaired, "field.tsx")).toEqual({ output: unpaired, reports: [] });
    expect(transform(unpaired, "field.tsx", { step: "unpin" })).toEqual({
      output: unpaired,
      reports: [],
    });
  });

  it("reads a .ts file as TypeScript, so a generic arrow is not a tag", () => {
    const source =
      'import type { PillTone } from "@hackcove/ui-react";\nconst id = <T>(x: T) => x;\nexport const t: PillTone[] = id(["amber"]);\nexport const u: PillTone = "amber";\n';
    expect(transform(source, "tones.ts").output).toBe(
      source.replace('u: PillTone = "amber"', 'u: PillTone = "warn"'),
    );
  });

  it("leaves a file that imports nothing from the package as it is", () => {
    const source = 'import { Card } from "./Card";\nexport const x = <Card dashed />;\n';
    expect(transform(source, "local.tsx")).toEqual({ output: source, reports: [] });
  });

  // A second 0.11 run over its own output changes nothing, and says nothing the first run did not.
  it.each(fixtures.filter((dir) => stepOf(dir) === "0.11" && !(dir in notIdempotent)))(
    "runs the 0.11 pass over %s twice to the same file",
    (dir) => {
      const before = read(dir, "before.txt") ?? "";
      const first = transform(before, `${dir}.tsx`);
      const input = read(dir, "after.txt") ?? before;
      const again = transform(input, `${dir}.tsx`);
      expect(again.output).toBe(input);
      for (const message of messages(again.reports)) {
        expect(messages(first.reports)).toContain(message);
      }
    },
  );

  it("keeps a bare Cluster wrap on a second 0.11 run, and --unpin drops it", () => {
    const source =
      'import { Cluster } from "@hackcove/ui-react";\nexport const x = <Cluster gap="sm" wrap>x</Cluster>;\n';
    expect(transform(source, "a.tsx")).toEqual({ output: source, reports: [] });
    expect(transform(source, "a.tsx", { step: "unpin" }).output).toBe(
      source.replace(" wrap>", ">"),
    );
  });

  it("keeps a numeric cell's align=end on a second 0.11 run, and --unpin drops it", () => {
    const source =
      'import { TableCell } from "@hackcove/ui-react";\nexport const x = <TableCell numeric align="end">1</TableCell>;\n';
    expect(transform(source, "a.tsx")).toEqual({ output: source, reports: [] });
    expect(transform(source, "a.tsx", { step: "unpin" }).output).toBe(
      source.replace(' align="end"', ""),
    );
  });

  it("does not report a Checkbox onChange it already rewrote", () => {
    for (const dir of [
      "checkbox-on-change",
      "checkbox-on-change-body",
      "checkbox-on-change-method",
    ]) {
      const rewritten = read(dir, "after.txt") ?? "";
      expect(rewritten).not.toBe("");
      expect(transform(rewritten, `${dir}.tsx`).reports).toEqual([]);
    }
  });

  it("reads @slashsuite/ui-react in --unpin and --to-0.13, and leaves it to 0.11 code alone", () => {
    const source =
      'import { Cluster, ListRow } from "@slashsuite/ui-react";\nexport const x = <Cluster wrap={false}><ListRow divided title="a" /></Cluster>;\n';
    expect(transform(source, "a.tsx")).toEqual({ output: source, reports: [] });
    expect(transform(source, "a.tsx", { step: "unpin" }).output).toBe(
      source.replace(" wrap={false}", ""),
    );
    const to13 = transform(source, "a.tsx", { step: "0.13" });
    expect(to13.output).toBe(source.replace(" divided", ""));
    expect(messages(to13.reports)).toEqual(["divided is gone: put the rows in a Stack divided"]);
  });
});
