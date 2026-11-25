import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// What `nx release` publishes (nx.json `release.projects`) goes out through `npm publish`, which
// rewrites no Bun specifier: Nx's executor refuses a `workspace:` or `file:` one, and a `catalog:`
// one would ship as written. A package that only bundles a private workspace package (ui-react
// vendors @slashsuite/core into its dist) names it as a devDependency by the version on disk, which
// Bun links to the workspace all the same.
const root = fileURLToPath(new URL("../../..", import.meta.url));
type Manifest = {
  name: string;
  version: string;
  private?: boolean;
  nx?: { name?: string };
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
};
const read = (path: string) => readFileSync(join(root, path), "utf8");

const manifests = new Map<string, Manifest>();
const folders = [
  "themes",
  ...["packages", "tools"].flatMap((dir) =>
    readdirSync(join(root, dir)).map((name) => join(dir, name)),
  ),
];
for (const folder of folders) {
  const path = join(folder, "package.json");
  if (!existsSync(join(root, path))) continue;
  const manifest: Manifest = JSON.parse(read(path));
  manifests.set(manifest.nx?.name ?? manifest.name, manifest);
}
const byName = new Map([...manifests.values()].map((m) => [m.name, m]));
const nx: { release: { projects: string[] } } = JSON.parse(read("nx.json"));
const released = nx.release.projects;
const depTypes = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
] as const;
const bunOnly = ["workspace:", "file:", "catalog:"];

describe("released manifests", () => {
  it.each(released)("%s names every dependency by a version npm can read", (project) => {
    const manifest = manifests.get(project);
    expect(manifest, `no package.json for ${project}`).toBeDefined();
    const local = depTypes.flatMap((type) =>
      Object.entries(manifest?.[type] ?? {})
        .filter(([, spec]) => bunOnly.some((protocol) => spec.startsWith(protocol)))
        .map(([dep, spec]) => `${type}.${dep}: ${spec}`),
    );
    expect(local).toEqual([]);
  });

  it.each(released)("%s needs no private package to install", (project) => {
    // A private package is not on npm, so only a devDependency, which an app never installs, may
    // name it.
    const manifest = manifests.get(project);
    const unpublished = depTypes
      .filter((type) => type !== "devDependencies")
      .flatMap((type) =>
        Object.keys(manifest?.[type] ?? {})
          .filter((dep) => byName.get(dep)?.private === true)
          .map((dep) => `${type}.${dep}`),
      );
    expect(unpublished).toEqual([]);
  });

  it("releases no private package", () => {
    expect(released.filter((project) => manifests.get(project)?.private === true)).toEqual([]);
  });
});
