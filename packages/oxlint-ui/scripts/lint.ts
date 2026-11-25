/**
 * Runs the pinned oxlint with this package's config and returns what it reported, keeping only the
 * package's own rules (`uislash/*`). oxlint also runs its default rules (the correctness category)
 * on any config, and those are not this package's to count. Used by the fixture and parity suites.
 * Not published.
 */
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const configPath = resolve(import.meta.dirname, "..", ".oxlintrc.json");
const oxlint = resolve(import.meta.dirname, "../../../node_modules/.bin/oxlint");

/** One report: the file (relative to `cwd`), its 1-based line, the rule (`uislash/raw-colour`) and its message. */
export type Hit = { file: string; line: number; rule: string; message: string };

type Diagnostic = {
  code?: string;
  message: string;
  filename: string;
  labels: { span: { line: number } }[];
};

/** `uislash(raw-colour)` to `uislash/raw-colour`. */
function ruleOf(code: string | undefined): string {
  const match = /^([\w-]+)\((.+)\)$/.exec(code ?? "");
  return match ? `${match[1]}/${match[2]}` : (code ?? "");
}

/** Lints `paths` (relative to `cwd`) with the package's config alone. */
export function lint(paths: string[], cwd: string): Hit[] {
  const result = spawnSync(oxlint, ["-c", configPath, "-f", "json", ...paths], {
    cwd,
    encoding: "utf8",
  });
  const out = result.stdout;
  if (!out.trimStart().startsWith("{")) {
    throw new Error(`oxlint printed no report (exit ${result.status}):\n${out}${result.stderr}`);
  }
  const report: { diagnostics: Diagnostic[] } = JSON.parse(out);
  return report.diagnostics
    .map((d) => ({
      file: d.filename,
      line: d.labels[0]?.span.line ?? 0,
      rule: ruleOf(d.code),
      message: d.message,
    }))
    .filter((hit) => hit.rule.startsWith("uislash/"));
}
