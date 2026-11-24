/**
 * What the packed README must open with: a pointer, above its `#` heading, that sends an agent to
 * `agent-docs/llms.txt`. Every `agent-docs/` path the pointer names in backticks must be in the
 * tarball; a path with a `<placeholder>` needs at least one file under the part before it.
 */
export function readmePointerProblems(files: string[], readme: string | undefined): string[] {
  if (readme === undefined) return ["README.md is missing from the tarball"];
  const heading = readme.search(/^# /m);
  const pointer = heading === -1 ? readme : readme.slice(0, heading);
  const paths = [...pointer.matchAll(/`(agent-docs\/[^`]+)`/g)].map((match) => match[1]!);
  return [
    ...(paths.includes("agent-docs/llms.txt")
      ? []
      : ["README.md has no pointer to `agent-docs/llms.txt` above its heading"]),
    ...paths
      .filter((path) => {
        const placeholder = path.indexOf("<");
        return placeholder === -1
          ? !files.includes(path)
          : !files.some((file) => file.startsWith(path.slice(0, placeholder)));
      })
      .map((path) => `README.md points at ${path}, which the tarball lacks`),
  ];
}
