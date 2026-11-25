/**
 * Writes `<id>.native.json` beside every `*.css` here, by glob, naming no theme (`theme-native`,
 * run by hand), with the generator in `@slashsuite/core`. It fails, naming each, on a rule or declaration the
 * native map cannot carry, or a palette utility the map does not hold.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import {
  missingFromNative,
  nativeTheme,
  nativeThemeJson,
} from "../../packages/core/src/themeNative.js";

const themes = new URL("../", import.meta.url);
const roles: Record<string, string[]> = JSON.parse(
  readFileSync(new URL("../../packages/ui-react/palette.json", import.meta.url), "utf8"),
);
const palette = [...new Set(Object.values(roles).flat())];
const problems: string[] = [];
for (const file of readdirSync(themes)
  .filter((name) => name.endsWith(".css"))
  .toSorted()) {
  const id = file.slice(0, -".css".length);
  const { theme, unmapped } = nativeTheme(readFileSync(new URL(file, themes), "utf8"), id);
  const missing = missingFromNative(theme, palette).map((utility) => `${id}: no ${utility}`);
  problems.push(...unmapped, ...missing);
  writeFileSync(new URL(`${id}.native.json`, themes), nativeThemeJson(theme));
}
if (problems.length > 0) {
  process.stderr.write(`${problems.join("\n")}\n`);
  process.exit(1);
}
