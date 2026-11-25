import { describe, expect, test } from "vitest";
import { componentPages } from "../../../packages/ui-react/docs/components/index";
import { renderAgentDocs, renderLlms } from "../src/llms";

// llms.txt is the package index's setup followed by every package page, each linking its
// siblings by their site address instead of their file. Missing pages read as empty, so the
// comparison below fails rather than the file's collection.
const docs = renderAgentDocs();
const index = docs.get("llms.txt") ?? "";
const joined = [
  index.slice(0, index.indexOf("\n\n## Components\n")),
  ...componentPages.map(({ slug }) =>
    (docs.get(`components/${slug}.md`) ?? "")
      .replace(/^(- .+) \(([a-z0-9-]+)\.md\): /gm, "$1 (/ui/$2/): ")
      .replace(/\n$/, ""),
  ),
].join("\n\n");

describe("/ui/llms.txt and the docs shipped in @slashsuite/ui-react", () => {
  test("/ui/llms.txt is the package's index setup and pages, joined", () => {
    expect(renderLlms()).toBe(`${joined}\n`);
  });
});
