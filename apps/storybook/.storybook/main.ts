import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

const storybookDir = fileURLToPath(new URL("..", import.meta.url));
/** A package's source entry, so an edit shows without a build. */
const source = (path: string): string =>
  fileURLToPath(new URL(`../../../packages/${path}`, import.meta.url));

const config: StorybookConfig = {
  // One entry per story file, in the order of the site's component docs. With no `storySort` in
  // preview.tsx, Storybook's sidebar follows the order of `stories`: Overview, then the site's
  // sections in rail order, each with its pages in page order. Nothing here lists a component.
  stories: () =>
    execFileSync("bun", ["scripts/sidebar.ts"], { cwd: storybookDir, encoding: "utf8" })
      .split("\n")
      .filter(Boolean)
      .map((path) => `../${path.replace(/^apps\/storybook\//, "")}`),
  framework: { name: "@storybook/react-vite", options: {} },
  viteFinal: async (cfg) => {
    cfg.plugins = [...(cfg.plugins ?? []), tailwindcss()];
    // Stories import the packages by name; read their source so an edit shows without a build.
    const existing = cfg.resolve?.alias;
    const aliases = Array.isArray(existing)
      ? existing
      : Object.entries(existing ?? {}).map(([find, replacement]) => ({ find, replacement }));
    cfg.resolve = {
      ...cfg.resolve,
      alias: [
        ...aliases,
        { find: "@slashsuite/ui-react", replacement: source("ui-react/src/index.ts") },
        { find: "@slashsuite/core", replacement: source("core/src/index.ts") },
      ],
    };
    return cfg;
  },
};
export default config;
