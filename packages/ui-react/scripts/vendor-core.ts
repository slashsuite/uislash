/**
 * Puts `@slashsuite/core` inside ui-react's `dist/`, so the published package has no runtime
 * dependency on it: copies core's built `dist/` to `dist/core/` and rewrites each
 * `"@slashsuite/core"` specifier in `dist/` to a relative path. A consumer's `@source` of ui-react's
 * `dist/` then also scans the token tables, so every class a Button draws reaches its CSS.
 * Runs after `tsc -p tsconfig.build.json` (the `build` script).
 */
import { cpSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { Glob } from "bun";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = join(root, "dist");
const core = join(root, "node_modules", "@slashsuite", "core", "dist");
if (!existsSync(join(core, "index.js"))) {
  throw new Error(`${core} has no index.js: build @slashsuite/core first (core:build)`);
}
cpSync(core, join(dist, "core"), { recursive: true });

const SPECIFIER = /(["'])@slashsuite\/core\1/g;
for (const file of new Glob("**/*.{js,d.ts}").scanSync({ cwd: dist })) {
  if (file.startsWith("core/")) continue;
  const path = join(dist, file);
  const text = readFileSync(path, "utf8");
  if (!text.includes("@slashsuite/core")) continue;
  let target = relative(dirname(path), join(dist, "core", "index.js"));
  if (!target.startsWith(".")) target = `./${target}`;
  writeFileSync(
    path,
    text.replace(SPECIFIER, (_, quote: string) => `${quote}${target}${quote}`),
  );
}
