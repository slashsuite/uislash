/**
 * What the tarball must hold of the `uislash` skill: `skills/uislash/SKILL.md`, and every
 * `agent-docs/...` file the skill names, so an agent that follows it never opens a file the
 * package lacks. A path with a `<placeholder>` in it is a pattern, not a file, and is skipped.
 */
export const skillFile = "skills/uislash/SKILL.md";

export function packedSkillProblems(files: string[], skill: string | undefined): string[] {
  if (skill === undefined) return [`${skillFile} is missing from the tarball`];
  const packed = new Set(files);
  const named = new Set(skill.match(/agent-docs\/[\w./-]*\w(?![\w/<-]|\.\w)/g) ?? []);
  return [...named]
    .filter((path) => !packed.has(path))
    .map((path) => `${skillFile} names ${path}, which the tarball lacks`);
}
