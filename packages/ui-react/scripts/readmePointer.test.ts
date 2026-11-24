import { describe, expect, test } from "vitest";
import { readmePointerProblems } from "./readmePointer";

const files = ["README.md", "agent-docs/llms.txt", "agent-docs/components/card.md"];
const pointer =
  "> **Agents:** read `agent-docs/llms.txt` (the index) first, then the `agent-docs/components/<slug>.md` pages.\n\n";
const body = "# @slashsuite/ui-react\n\nUISlash React components.\n";

describe("readmePointerProblems", () => {
  test("passes a README that opens with the pointer", () => {
    expect(readmePointerProblems(files, pointer + body)).toEqual([]);
  });

  test("fails a README with no pointer", () => {
    expect(readmePointerProblems(files, body)).toEqual([
      "README.md has no pointer to `agent-docs/llms.txt` above its heading",
    ]);
  });

  test("fails a pointer that sits below the heading", () => {
    expect(readmePointerProblems(files, body + pointer)).toEqual([
      "README.md has no pointer to `agent-docs/llms.txt` above its heading",
    ]);
  });

  test("fails a pointer to an index the tarball lacks", () => {
    expect(readmePointerProblems(files.slice(2), pointer + body)).toEqual([
      "README.md points at agent-docs/llms.txt, which the tarball lacks",
    ]);
  });

  test("fails a pointer to a page folder the tarball lacks", () => {
    expect(readmePointerProblems(files.slice(0, 2), pointer + body)).toEqual([
      "README.md points at agent-docs/components/<slug>.md, which the tarball lacks",
    ]);
  });

  test("fails a pointer to the old docs/ path", () => {
    expect(readmePointerProblems(files, pointer.replaceAll("agent-docs/", "docs/") + body)).toEqual(
      ["README.md has no pointer to `agent-docs/llms.txt` above its heading"],
    );
  });

  test("fails a README missing from the tarball", () => {
    expect(readmePointerProblems(files.slice(1), undefined)).toEqual([
      "README.md is missing from the tarball",
    ]);
  });
});
