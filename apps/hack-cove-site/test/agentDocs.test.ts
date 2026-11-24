import { globSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, test } from "vitest";
import { componentPages } from "../../../packages/ui-react/docs/components/index";
import { renderAgentDocs, renderLlms } from "../src/docs/llms";

/** The docs shipped in `@slashsuite/ui-react`, committed, written by `bunx moon run hack-cove-site:agent-docs`. */
const dir = join(import.meta.dirname, "../../../packages/ui-react/agent-docs");
const committed = new Map(
  globSync("**/*", { cwd: dir, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => {
      const path = relative(dir, join(entry.parentPath, entry.name));
      return [path, readFileSync(join(dir, path), "utf8")] as const;
    }),
);
const fresh = renderAgentDocs();
const regenerate = "run `bunx moon run hack-cove-site:agent-docs` and commit the result";

describe("packages/ui-react/agent-docs", () => {
  test(`holds exactly the files a fresh render writes (${regenerate})`, () => {
    expect([...committed.keys()].toSorted()).toEqual([...fresh.keys()].toSorted());
  });

  test.each([...fresh.keys()])(`%s is what a fresh render writes (${regenerate})`, (path) => {
    expect(committed.get(path)).toBe(fresh.get(path));
  });
});

// The site's file is the committed index's setup followed by every committed page, each linking its
// siblings by their site address instead of their file. Missing files read as empty, so the
// comparison below fails rather than the file's collection.
const committedIndex = committed.get("llms.txt") ?? "";
const joined = [
  committedIndex.slice(0, committedIndex.indexOf("\n\n## Components\n")),
  ...componentPages.map(({ slug }) =>
    (committed.get(`components/${slug}.md`) ?? "")
      .replace(/^(- .+) \(([a-z0-9-]+)\.md\): /gm, "$1 (/ui/$2/): ")
      .replace(/\n$/, ""),
  ),
].join("\n\n");

describe("/ui/llms.txt and agent-docs", () => {
  test("/ui/llms.txt is the committed agent-docs, joined", () => {
    expect(renderLlms()).toBe(`${joined}\n`);
  });
});
