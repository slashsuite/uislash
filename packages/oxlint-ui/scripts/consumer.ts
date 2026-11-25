/**
 * Consumer check: the published tarball works where a consumer installs it. Packs the package
 * (its `prepack` writes `ui-react.json` first), installs the tarball and its exact peer into a
 * throwaway app in the temp dir (bun's isolated linker with the global store, where the package's
 * config, plugin and data live outside the app), and runs the app's own oxlint with a config that
 * extends the package's. One bad component must be reported by the plugin, which proves the
 * config's `jsPlugins` resolve from the installed package and the plugin finds its data; the same
 * code in a test file must not be. Built as `packages/oxlint-testing/scripts/consumer.ts` builds
 * its app. Run by `pack-check`.
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const pkg: { name: string; version: string; peerDependencies: Record<string, string> } = JSON.parse(
  readFileSync(join(root, "package.json"), "utf8"),
);

// One dir per checkout, so concurrent worktrees do not collide.
const app = join(
  tmpdir(),
  `slashsuite-oxlint-ui-consumer-${createHash("sha1").update(root).digest("hex").slice(0, 8)}`,
);
rmSync(app, { recursive: true, force: true });
mkdirSync(join(app, "src"), { recursive: true });

function run(cmd: string[], cwd: string): { code: number; out: string; err: string } {
  const result = Bun.spawnSync(cmd, { cwd, stdout: "pipe", stderr: "pipe" });
  return { code: result.exitCode, out: result.stdout.toString(), err: result.stderr.toString() };
}

function mustRun(cmd: string[], cwd: string): void {
  const { code, out, err } = run(cmd, cwd);
  if (code !== 0) throw new Error(`${cmd.join(" ")} failed in ${cwd}\n${out}${err}`);
}

const BAD = [
  "export function Save() {",
  '  return <button className="bg-red-500">Save</button>;',
  "}",
  "",
].join("\n");

try {
  mustRun(["npm", "pack", "--pack-destination", app], root);
  const tarball = join(app, `${pkg.name.slice(1).replace("/", "-")}-${pkg.version}.tgz`);

  writeFileSync(
    join(app, "package.json"),
    JSON.stringify({
      name: "consumer",
      private: true,
      type: "module",
      devDependencies: { "@slashsuite/oxlint-ui": `file:${tarball}`, ...pkg.peerDependencies },
    }),
  );
  writeFileSync(join(app, "bunfig.toml"), '[install]\nlinker = "isolated"\nglobalStore = true\n');
  writeFileSync(
    join(app, ".oxlintrc.json"),
    JSON.stringify({ extends: ["./node_modules/@slashsuite/oxlint-ui/.oxlintrc.json"] }),
  );
  writeFileSync(join(app, "src", "Save.tsx"), BAD);
  writeFileSync(join(app, "src", "Save.test.tsx"), BAD);

  mustRun(["bun", "install", "--prefer-offline"], app);
  // The report is stdout alone; oxlint may print a notice on stderr.
  const { out } = run(["node_modules/.bin/oxlint", "-f", "json", "src"], app);
  const report: { diagnostics: { code: string; filename: string }[] } = JSON.parse(out);
  const ours = report.diagnostics.filter((d) => d.code.startsWith("uislash("));
  const codes = new Set(ours.filter((d) => d.filename.endsWith("Save.tsx")).map((d) => d.code));
  const missing = ["uislash(raw-element)", "uislash(raw-colour)"].filter((c) => !codes.has(c));
  if (missing.length > 0) {
    throw new Error(`the installed config did not report ${missing.join(", ")}:\n${out}`);
  }
  const inTest = ours.filter((d) => d.filename.endsWith(".test.tsx"));
  if (inTest.length > 0) {
    throw new Error(`the installed config reported a test file:\n${JSON.stringify(inTest)}`);
  }
  process.stdout.write("consumer: ok (the installed config reports the bad component)\n");
} finally {
  rmSync(app, { recursive: true, force: true });
}
