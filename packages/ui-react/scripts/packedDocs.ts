/**
 * What the tarball must hold of the docs: `agent-docs/llms.txt`, one `agent-docs/components/<slug>.md`
 * per docs page (`docs/components/`), an index that lists each, and none of the docs' sources
 * under `docs/`. Exports with no docs page (subcomponents, hooks, types) need no file.
 */
const pageFile = (slug: string) => `agent-docs/components/${slug}.md`;

export function packedDocsProblems(
  files: string[],
  index: string | undefined,
  slugs: string[],
): string[] {
  const packed = new Set(files);
  const expected = new Set(slugs.map(pageFile));
  return [
    ...(index === undefined ? ["agent-docs/llms.txt is missing from the tarball"] : []),
    ...slugs
      .filter((slug) => !packed.has(pageFile(slug)))
      .map((slug) => `${pageFile(slug)} is missing from the tarball (docs page ${slug})`),
    ...files
      .filter((path) => path.startsWith("agent-docs/components/") && !expected.has(path))
      .map((path) => `${path} is in the tarball but no docs page has its slug`),
    ...(index === undefined
      ? []
      : slugs
          .filter((slug) => !index.includes(`(components/${slug}.md)`))
          .map((slug) => `agent-docs/llms.txt does not list components/${slug}.md`)),
    ...files
      .filter((path) => path.startsWith("docs/"))
      .map((path) => `${path} is a docs source and must not ship`),
  ];
}
