import { describe, expect, test } from "vitest";
import { packedDocsProblems } from "./packedDocs";

const index = "- Card (components/card.md): a block\n- Pill (components/pill.md): a label\n";
const whole = [
  "dist/index.js",
  "agent-docs/llms.txt",
  "agent-docs/components/card.md",
  "agent-docs/components/pill.md",
];

describe("packedDocsProblems", () => {
  test("passes a tarball with the index and one page per docs page", () => {
    expect(packedDocsProblems(whole, index, ["card", "pill"])).toEqual([]);
  });

  test("fails a docs page with no file", () => {
    expect(
      packedDocsProblems(
        whole.filter((path) => path !== "agent-docs/components/pill.md"),
        index,
        ["card", "pill"],
      ),
    ).toEqual(["agent-docs/components/pill.md is missing from the tarball (docs page pill)"]);
  });

  test("fails an index that misses a page", () => {
    expect(packedDocsProblems(whole, index.split("\n")[0], ["card", "pill"])).toEqual([
      "agent-docs/llms.txt does not list components/pill.md",
    ]);
  });

  test("fails a missing index", () => {
    expect(packedDocsProblems(whole.slice(2), undefined, ["card", "pill"])).toEqual([
      "agent-docs/llms.txt is missing from the tarball",
    ]);
  });

  test("fails a page file no docs page names", () => {
    expect(packedDocsProblems(whole, index, ["card"])).toEqual([
      "agent-docs/components/pill.md is in the tarball but no docs page has its slug",
    ]);
  });

  test("fails a docs source in the tarball", () => {
    expect(packedDocsProblems([...whole, "docs/props.json"], index, ["card", "pill"])).toEqual([
      "docs/props.json is a docs source and must not ship",
    ]);
  });
});
