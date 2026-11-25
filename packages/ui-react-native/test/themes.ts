/** Every theme's generated `<id>.native.json`, read from `themes/` as the web's switcher reads the CSS. */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { NativeTheme } from "@slashsuite/core";

const dir = join(import.meta.dirname, "../../../themes");

export const nativeThemes: NativeTheme[] = readdirSync(dir)
  .filter((name) => name.endsWith(".native.json"))
  .sort()
  .map((name) => JSON.parse(readFileSync(join(dir, name), "utf8")) as NativeTheme);
