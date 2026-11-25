/* The themes the docs list, read from the repo's `themes/` package: one per CSS file. No theme is
   named here: a new CSS file there shows up on the next run. */

import { join } from "node:path";
import { themeFiles } from "@slashsuite/themes-shared/files";
import { themeScope } from "@slashsuite/themes-shared/scope";

export type Theme = {
  /** The theme's id: its file name without `.css`. */
  id: string;
  /** What a consumer imports. */
  specifier: string;
  /** The id as a title. */
  title: string;
  /** The class that goes on `<html>`: the first top-level class rule in the theme's CSS file. */
  scopeClass: string;
};

const titleOf = (slug: string) =>
  slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const themes: Theme[] = themeFiles(
  join(import.meta.dirname, "..", "..", "..", "themes"),
).map(({ id, css }) => ({
  id,
  specifier: `@slashsuite/themes/${id}.css`,
  title: titleOf(id),
  scopeClass: themeScope(css) ?? "",
}));
