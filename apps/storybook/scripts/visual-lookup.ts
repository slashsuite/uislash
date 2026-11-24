/**
 * What the PixelSlash server said about a subproject's builds, and the failure an upload reports
 * when it gave no listing. Pure, so `visual-lookup.test.ts` needs no server; `visual-remote.ts`
 * makes the requests.
 *
 * The reads go to the API, not to `pixelslash builds`: that command names a top-level project only
 * and has no `--subproject`, so it cannot list a subproject's builds.
 */
import { isRecord } from "./visual-index.js";

/** The PixelSlash project every group uploads to, as the subproject named by its slug. */
export const PIXELSLASH_PROJECT = "uislash";

/**
 * What the server said about a subproject: its builds listing, a subproject it does not have (or
 * the token cannot see), or a failure. `line` names the request and what came back.
 */
export type LookupResult =
  | { kind: "ok"; listing: unknown }
  | { kind: "missing"; line: string }
  | { kind: "failed"; line: string };

/** A request that did not answer 200: `GET <path> -> <status> <the server's error>`. */
export function failedLine(path: string, status: number, body: string): string {
  let detail = body.trim();
  try {
    const parsed: unknown = JSON.parse(body);
    const error = isRecord(parsed) ? parsed["error"] : undefined;
    if (typeof error === "string") detail = error;
    else if (isRecord(error) && typeof error["message"] === "string") detail = error["message"];
  } catch {
    // Not JSON: the body as sent.
  }
  return `GET ${path} -> ${status}${detail === "" ? "" : ` ${detail}`}`;
}

/** The `LookupResult` for one `GET .../builds` reply. */
export function buildsResult(path: string, status: number, body: string): LookupResult {
  if (status === 200) return { kind: "ok", listing: JSON.parse(body) };
  return { kind: "failed", line: failedLine(path, status, body) };
}

/**
 * The ids of `project`'s subprojects by name, from a `GET /api/v1/projects` reply, or `undefined`
 * when the token sees no top-level project of that name.
 */
export function subprojectIds(listing: unknown, project: string): Map<string, string> | undefined {
  const rows = isRecord(listing) && Array.isArray(listing["projects"]) ? listing["projects"] : [];
  const projects = rows.filter(isRecord);
  const parent = projects.find((p) => p["name"] === project && p["parent_project_id"] === null);
  if (parent === undefined) return undefined;
  const ids = new Map<string, string>();
  for (const p of projects)
    if (
      p["parent_project_id"] === parent["id"] &&
      typeof p["name"] === "string" &&
      typeof p["id"] === "string"
    )
      ids.set(p["name"], p["id"]);
  return ids;
}

/** The `LookupResult` for a subproject the projects listing does not have. */
export function missingSubproject(
  ids: Map<string, string> | undefined,
  subproject: string,
): LookupResult {
  return {
    kind: "missing",
    line:
      ids === undefined
        ? `the token sees no project ${PIXELSLASH_PROJECT}`
        : `${PIXELSLASH_PROJECT} has no subproject ${subproject}`,
  };
}

/** A lookup that gave no listing: the subproject and what the server said. */
export type LookupMiss = { subproject: string; result: Exclude<LookupResult, { kind: "ok" }> };

const UNAUTHORIZED = / -> 401\b/;

/**
 * Why the lookups failed, one line per kind: the server not answering first, since that hides
 * whether the other subprojects exist, then a token it refused, then the subprojects it does not
 * have. Each names its subprojects with the server's line. `undefined` when there is nothing to
 * report.
 */
export function lookupFailure(misses: LookupMiss[]): string | undefined {
  const named = (keep: (miss: LookupMiss) => boolean) =>
    misses
      .filter(keep)
      .map(({ subproject, result }) => `${subproject} (pixelslash: ${result.line})`)
      .join(", ");
  const isFailed = ({ result }: LookupMiss) => result.kind === "failed";
  const down = named((miss) => isFailed(miss) && !UNAUTHORIZED.test(miss.result.line));
  const refused = named((miss) => isFailed(miss) && UNAUTHORIZED.test(miss.result.line));
  const missing = named((miss) => !isFailed(miss));
  const lines: string[] = [];
  if (down !== "")
    lines.push(
      `PixelSlash did not answer for ${down}. This is a PixelSlash failure, not a missing ` +
        "subproject, so do not create it: report it to the PixelSlash architect with this output",
    );
  if (refused !== "")
    lines.push(
      `PixelSlash refused the token for ${refused}: it is missing, wrong, expired or revoked ` +
        `and needs reissuing (the ${PIXELSLASH_PROJECT} project's CI token, psci_, or an org ` +
        "token, psorg_); do not create the subproject",
    );
  if (missing !== "")
    lines.push(
      `the server has no PixelSlash subproject ${missing} (or the token cannot see it); create ` +
        `each with \`pixelslash project create <name> --parent ${PIXELSLASH_PROJECT}\` and re-run`,
    );
  return lines.length > 0 ? lines.join("\n") : undefined;
}
