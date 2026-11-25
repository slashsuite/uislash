/**
 * Writes `dist/llms.txt`: the whole component reference as one file, the text the docs site
 * publishes as `/ui/llms.txt`. The `ui-review` workflow's `build-rubric` reads it.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { renderLlms } from "../src/llms.js";

const DIST = join(import.meta.dirname, "..", "dist");
mkdirSync(DIST, { recursive: true });
writeFileSync(join(DIST, "llms.txt"), renderLlms());
