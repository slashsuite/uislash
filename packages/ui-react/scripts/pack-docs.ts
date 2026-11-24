/**
 * Fails `pack-check` when the tarball's agent docs are incomplete (`packedDocs.ts` says what they
 * must hold). Reads the file list from `npm pack --dry-run`, so it checks what would ship, not the
 * working tree. The docs are written by `bunx moon run ui-react:agent-docs`.
 */
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentPages } from "../docs/components/index";
import { packedDocsProblems } from "./packedDocs";

const root = resolve(import.meta.dirname, "..");
const pack = Bun.spawnSync(["npm", "pack", "--dry-run", "--json", "--ignore-scripts"], {
  cwd: root,
  stdout: "pipe",
  stderr: "pipe",
});
if (pack.exitCode !== 0) throw new Error(`npm pack --dry-run failed:\n${pack.stderr.toString()}`);
type Pack = { files: { path: string }[] };
const isPath = (file: unknown): file is { path: string } =>
  typeof file === "object" && file !== null && "path" in file && typeof file.path === "string";
const isPack = (value: unknown): value is Pack =>
  typeof value === "object" &&
  value !== null &&
  "files" in value &&
  Array.isArray(value.files) &&
  value.files.every(isPath);
// npm prints an array of packs, or (npm 11 in a workspace) an object keyed by package name.
const json: unknown = JSON.parse(pack.stdout.toString());
const listed: unknown[] = typeof json === "object" && json !== null ? Object.values(json) : [];
const packs = listed.filter(isPack);
if (packs.length === 0) throw new Error("npm pack --dry-run --json listed no files");
const files = packs.flatMap((p) => p.files.map((file) => file.path));
const index = files.includes("agent-docs/llms.txt")
  ? readFileSync(join(root, "agent-docs/llms.txt"), "utf8")
  : undefined;
const problems = packedDocsProblems(
  files,
  index,
  componentPages.map((page) => page.slug),
);
if (problems.length > 0) {
  throw new Error(
    `the tarball's agent docs are incomplete (run \`bunx moon run ui-react:agent-docs\`):\n${problems.join("\n")}`,
  );
}
