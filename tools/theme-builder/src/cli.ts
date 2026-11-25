import { writeFileSync } from "node:fs";
import { relative } from "node:path";
import { buildSpec, ROOT } from "./build.js";

/**
 * `bun tools/theme-builder/src/cli.ts <spec.json>`: builds every theme in the spec and writes each
 * to themes/<id>.css, but only when all of them pass every contract; otherwise it prints each
 * failure, writes nothing and exits 1.
 */
const out = (line: string): void => void process.stdout.write(`${line}\n`);
const err = (line: string): void => void process.stderr.write(`${line}\n`);

const specs = process.argv.slice(2);
if (specs.length === 0) {
  err("usage: bun tools/theme-builder/src/cli.ts <spec.json>...");
  process.exit(2);
}

const built = specs.flatMap((spec) => buildSpec(spec));
for (const theme of built) {
  for (const warning of theme.warnings) err(`${theme.id}: status, ${warning}`);
}
const failing = built.filter((theme) => theme.failures.length > 0);
for (const theme of failing) {
  err(`${theme.id}: ${theme.failures.length} failure(s), not written`);
  for (const failure of theme.failures) err(`  ${failure}`);
}
if (failing.length > 0) process.exit(1);

for (const theme of built) {
  writeFileSync(theme.file, theme.css);
  out(`${relative(ROOT, theme.file)}: written`);
}
