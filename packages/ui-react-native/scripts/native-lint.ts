/** Runs the native lint rules (`nativeLintRules.ts`) on every component file under `src/`. */
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { nativeThemes as themes } from "../test/themes.js";
import { lintSource } from "./nativeLintRules.js";

const root = join(import.meta.dirname, "..");

const files = readdirSync(join(root, "src"), { recursive: true, encoding: "utf8" })
  .filter((name) => /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name))
  .map((name) => join(root, "src", name));

let count = 0;
for (const file of files) {
  for (const finding of lintSource(readFileSync(file, "utf8"), themes)) {
    count += 1;
    process.stderr.write(
      `${relative(root, file)}:${finding.line} ${finding.rule}: ${finding.message}\n`,
    );
  }
}
if (count > 0) {
  process.stderr.write(`native lint: ${count} finding(s)\n`);
  process.exit(1);
}
process.stdout.write(`native lint: ${files.length} files clean in ${themes.length} themes\n`);
