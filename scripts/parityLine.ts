/**
 * The parity line check: a pull request that changes a component on one renderer only either changes
 * its twin in the same pull request or says it will follow, with a `Parity: follow-up <ref>` line in
 * its body. The twins are the components in core's parity manifest (`packages/core/parity.json`):
 * `packages/ui-react/src/<Name>.tsx` on the web and `packages/ui-react-native/src/components/<Name>.tsx`
 * on native. A change to core's own tables reaches both renderers, so it needs no line.
 *
 * Run from the repo root with `bun scripts/parityLine.ts`; it reads BASE (the base commit) and
 * PR_BODY from the environment, and exits 8 naming each component out of step.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

/** The exit code of a pull request with a component changed on one side and no follow-up line. */
export const OUT_OF_STEP = 8;

const webFile = (name: string) => `packages/ui-react/src/${name}.tsx`;
const nativeFile = (name: string) => `packages/ui-react-native/src/components/${name}.tsx`;

/** A `Parity: follow-up <ref>` line, with a ref after it. */
export function hasFollowUp(body: string): boolean {
  return /^Parity: follow-up \S+/m.test(body);
}

/** The components changed on one side only: `[name, the side that changed]`. */
export function outOfStep(changed: string[], twins: string[]): [string, "web" | "native"][] {
  const files = new Set(changed);
  return twins.flatMap((name): [string, "web" | "native"][] => {
    const web = files.has(webFile(name));
    const native = files.has(nativeFile(name));
    if (web === native) return [];
    return [[name, web ? "web" : "native"]];
  });
}

/** The findings for one pull request; empty when it is in step or carries a follow-up line. */
export function check(changed: string[], twins: string[], body: string): string[] {
  if (hasFollowUp(body)) return [];
  return outOfStep(changed, twins).map(
    ([name, side]) =>
      `${name} changed on ${side} only: change ${side === "web" ? nativeFile(name) : webFile(name)} too, or add "Parity: follow-up <ref>" to the pull request body`,
  );
}

function twinsFromManifest(): string[] {
  const manifest: { components: Record<string, unknown> } = JSON.parse(
    readFileSync("packages/core/parity.json", "utf8"),
  );
  return Object.keys(manifest.components);
}

if (import.meta.main) {
  const base = process.env.BASE ?? "origin/main";
  const changed = execFileSync("git", ["diff", "--name-only", `${base}...HEAD`], {
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean);
  const findings = check(changed, twinsFromManifest(), process.env.PR_BODY ?? "");
  for (const finding of findings) console.error(`parity: ${finding}`);
  if (findings.length > 0) process.exit(OUT_OF_STEP);
  console.log(`parity: in step (${changed.length} files changed)`);
}
