import { describe, expect, test } from "vitest";
import { packedSkillProblems, skillFile } from "./packedSkill";

const skill =
  "Read `agent-docs/llms.txt`, then `agent-docs/components/<slug>.md`, like `agent-docs/components/table.md`.";
const files = [skillFile, "agent-docs/llms.txt", "agent-docs/components/table.md"];

describe("packedSkillProblems", () => {
  test("passes a tarball with the skill and every path it names", () => {
    expect(packedSkillProblems(files, skill)).toEqual([]);
  });

  test("skips a <placeholder> pattern and a path ending a sentence", () => {
    expect(packedSkillProblems(files, `${skill} Start at agent-docs/llms.txt.`)).toEqual([]);
  });

  test("fails a missing skill", () => {
    expect(packedSkillProblems(files.slice(1), undefined)).toEqual([
      "skills/uislash/SKILL.md is missing from the tarball",
    ]);
  });

  test("fails a path the skill names that the tarball lacks", () => {
    expect(
      packedSkillProblems(
        files.filter((path) => path !== "agent-docs/components/table.md"),
        skill,
      ),
    ).toEqual([
      "skills/uislash/SKILL.md names agent-docs/components/table.md, which the tarball lacks",
    ]);
  });
});
