/**
 * A group's `result.json`, as its run of the plan wrote it: the counts, and where to read them.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { isRecord } from "./visual-index.js";
import { VisualError, out } from "./visual-tools.js";
import type { Counts, GroupResult } from "./visual-upload.js";

function readJson(path: string): unknown {
  return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : null;
}

/** The against-main counts result.json holds, when the server sent them. */
function againstMainOf(counts: Record<string, unknown>): Pick<Counts, "againstMain" | "toReview"> {
  const against = counts["againstMain"];
  const toReview = counts["toReview"];
  return {
    ...(isRecord(against) &&
    typeof against["changed"] === "number" &&
    typeof against["new"] === "number"
      ? { againstMain: { changed: against["changed"], new: against["new"] } }
      : {}),
    ...(typeof toReview === "number" ? { toReview } : {}),
  };
}

/**
 * A group's result from its last run for this plan, and where to read it: the server's build
 * page for an upload, the local report otherwise; `undefined` when the plan skipped it.
 */
export function readResult(id: string, slug: string): GroupResult | undefined {
  const path = join(out, slug, "result.json");
  const result = readJson(path);
  if (!isRecord(result) || result["id"] !== id)
    throw new VisualError(`${slug} has no result for this plan: its capture did not run`);
  if (result["skipped"] === true) return undefined;
  const counts = result["counts"];
  if (!isRecord(counts)) throw new VisualError(`${path} has no counts`);
  const read = (key: "changed" | "unchanged" | "new" | "removed") => {
    const value = counts[key];
    if (typeof value !== "number") throw new VisualError(`${path} has no ${key} count`);
    return value;
  };
  const status = result["status"];
  const url = result["url"];
  return {
    counts: {
      changed: read("changed"),
      unchanged: read("unchanged"),
      new: read("new"),
      removed: read("removed"),
      ...againstMainOf(counts),
    },
    ...(typeof status === "string" ? { status } : {}),
    where: typeof url === "string" && url !== "" ? url : join(out, slug, "report", "index.html"),
  };
}
