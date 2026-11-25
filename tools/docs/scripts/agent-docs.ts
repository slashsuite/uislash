/**
 * Writes `packages/ui-react/agent-docs/` (the docs shipped in `@slashsuite/ui-react`) from
 * `renderAgentDocs` in `src/llms.ts`. Run by ui-react's `agent-docs` task and its `prepack`; the
 * output is a build artifact, never committed.
 */
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { renderAgentDocs } from "../src/llms.js";

const AGENT_DOCS = resolve(import.meta.dirname, "../../../packages/ui-react/agent-docs");

const docs = renderAgentDocs();
// Written whole, so a page removed from the docs leaves no file behind.
rmSync(AGENT_DOCS, { recursive: true, force: true });
for (const [path, text] of docs) {
  const file = join(AGENT_DOCS, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, text);
}
