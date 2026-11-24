/**
 * Writes `packages/ui-react/agent-docs/` (the docs shipped in `@slashsuite/ui-react`) from
 * `renderAgentDocs` in `src/docs/llms.ts`. Run by the `agent-docs` moon task; the output is
 * committed, and `test/agentDocs.test.ts` fails when it differs from a fresh render.
 *
 * The docs read the stories through `import.meta.glob`, so the renderer is loaded through Vite's
 * SSR loader rather than imported by Bun.
 */
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { createServer } from "vite";

type Llms = typeof import("../src/docs/llms.js");
const isLlms = (mod: Record<string, unknown>): mod is Llms =>
  typeof mod["renderAgentDocs"] === "function";

const root = resolve(import.meta.dirname, "..");
export const AGENT_DOCS = resolve(root, "../../packages/ui-react/agent-docs");

const server = await createServer({
  root,
  configFile: false,
  logLevel: "error",
  appType: "custom",
  server: { middlewareMode: true, hmr: false, ws: false },
});
try {
  const llms = await server.ssrLoadModule(join(root, "src/docs/llms.ts"));
  if (!isLlms(llms)) throw new Error("src/docs/llms.ts exports no renderAgentDocs");
  const { renderAgentDocs } = llms;
  // Written whole, so a page removed from the docs leaves no file behind.
  rmSync(AGENT_DOCS, { recursive: true, force: true });
  for (const [path, text] of renderAgentDocs()) {
    const file = join(AGENT_DOCS, path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, text);
  }
} finally {
  await server.close();
}
