import type { Palette } from "./contrastRules.js";

const escapeRe = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * The palette utilities a theme does not remap: each one `packages/ui-react/palette.json` lists that
 * has no `.<utility>` selector in the theme's CSS (escaped as Tailwind writes it). Empty when the
 * theme reskins every colour the components use.
 */
export function unmappedUtilities(css: string, palette: Palette): string[] {
  return Object.values(palette)
    .flat()
    .filter((utility) => {
      const escaped = escapeRe("." + utility.replace(/[:/]/g, "\\$&"));
      return !new RegExp(`${escaped}(?=[\\s,:{\\[])`).test(css);
    });
}
