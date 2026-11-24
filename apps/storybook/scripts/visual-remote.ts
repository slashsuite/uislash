/**
 * What `--upload` does against the PixelSlash server: the checks before any capture, the upload
 * itself, and reading the build the server made. The decisions are pure and live in
 * `visual-upload.ts`; this file runs git and the pixelslash CLI for them.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { isRecord } from "./visual-index.js";
import {
  PIXELSLASH_PROJECT,
  buildsResult,
  failedLine,
  lookupFailure,
  missingSubproject,
  subprojectIds,
  type LookupMiss,
  type LookupResult,
} from "./visual-lookup.js";
import { VisualError, git, log, pixelslashCli, repoRoot, run } from "./visual-tools.js";
import {
  baselineFailure,
  buildIn,
  decideUpload,
  settle,
  shasOf,
  type BuildState,
  type MainShas,
  type UploadMode,
  type UploadState,
} from "./visual-upload.js";

const tokenPathFlags = () => {
  const tokenPath = process.env["PIXELSLASH_TOKEN_PATH"];
  return tokenPath ? ["--token-path", tokenPath] : [];
};

/**
 * `pixelslash upload` into the subproject, run from `cwd`, the checkout whose commit, branch and
 * merge-base it sends. Not `bun run --cwd` like the other calls: that would read git from the
 * pixelslash checkout.
 */
async function uploadSnapshots(dir: string, cwd: string, subproject: string, ...flags: string[]) {
  await run(
    [
      "bun",
      pixelslashCli,
      "upload",
      dir,
      "--project",
      PIXELSLASH_PROJECT,
      "--subproject",
      subproject,
      ...tokenPathFlags(),
      ...flags,
    ],
    cwd,
  );
}

/** `GET <path>` on the server with the token: the status and the body, or why there was none. */
async function get(path: string): Promise<{ status: number; body: string } | { line: string }> {
  const url = `${(process.env["PIXELSLASH_SERVER"] ?? "").replace(/\/+$/, "")}${path}`;
  try {
    const response = await fetch(url, { headers: { Authorization: `Bearer ${token()}` } });
    return { status: response.status, body: await response.text() };
  } catch (error) {
    return { line: `cannot fetch ${url}: ${error instanceof Error ? error.message : String(error)}` };
  }
}

let subprojectCache: Map<string, string> | undefined;

/**
 * The project's subprojects by name (`undefined` when the token sees no such project), or the
 * failed request. A listing is read once per run; a failure is not kept, so the next read retries.
 */
async function readSubprojects(): Promise<Map<string, string> | undefined | LookupResult> {
  if (subprojectCache !== undefined) return subprojectCache;
  const path = "/api/v1/projects";
  const reply = await get(path);
  if ("line" in reply) return { kind: "failed", line: reply.line };
  if (reply.status !== 200)
    return { kind: "failed", line: failedLine(path, reply.status, reply.body) };
  subprojectCache = subprojectIds(JSON.parse(reply.body), PIXELSLASH_PROJECT);
  return subprojectCache;
}

/**
 * The subproject's builds, newest first (the API's reply, as `pixelslash builds --json` prints a
 * project's), or why there are none.
 */
async function listBuilds(
  subproject: string,
  query: { branch?: string; limit: number },
): Promise<LookupResult> {
  const ids = await readSubprojects();
  if (ids !== undefined && !(ids instanceof Map)) return ids;
  const id = ids?.get(subproject);
  if (id === undefined) return missingSubproject(ids, subproject);
  const params = new URLSearchParams({ limit: String(query.limit) });
  if (query.branch !== undefined) params.set("branch", query.branch);
  const path = `/api/v1/projects/${encodeURIComponent(id)}/builds?${params.toString()}`;
  const reply = await get(path);
  if ("line" in reply) return { kind: "failed", line: reply.line };
  return buildsResult(path, reply.status, reply.body);
}

/**
 * The shas of the subproject's 100 newest `main` builds (the API's most), or why the server gave
 * none. A branch behind origin/main's tip finds its merge-base's build among them; a branch more
 * than 100 main uploads behind still fails with "upload main first".
 */
async function mainShas(subproject: string): Promise<MainShas> {
  const result = await listBuilds(subproject, { branch: "main", limit: 100 });
  return result.kind === "ok" ? { kind: "ok", shas: shasOf(result.listing) } : result;
}

async function isAncestor(sha: string, of: string): Promise<boolean> {
  const proc = Bun.spawn(["git", "merge-base", "--is-ancestor", sha, of], {
    cwd: repoRoot,
    stdout: "ignore",
    stderr: "ignore",
  });
  return (await proc.exited) === 0;
}

function token(): string {
  const tokenPath = process.env["PIXELSLASH_TOKEN_PATH"];
  if (process.env["PIXELSLASH_TOKEN"]) return process.env["PIXELSLASH_TOKEN"];
  return tokenPath && existsSync(tokenPath) ? readFileSync(tokenPath, "utf8").trim() : "";
}

/**
 * What `--upload` needs, checked before any capture, and which upload this is (`decideUpload`). A
 * branch is diffed by the server against the main build it already holds, so every subproject must
 * hold one at the merge-base or an ancestor of it, unless it holds no main build at all (a new
 * subproject, whose first build reads every shot as new); main's own upload needs none. Each
 * subproject must exist: an upload never creates one.
 */
export async function checkUpload(subprojects: string[]): Promise<UploadMode> {
  if (!process.env["PIXELSLASH_SERVER"]) throw new VisualError("--upload needs PIXELSLASH_SERVER");
  if (process.env["VISUAL_BASE"])
    throw new VisualError("--upload diffs against origin/main on the server; unset VISUAL_BASE");
  const state = await uploadState();
  const mode = decide(state);
  if (mode === "main") await requireSubprojects(subprojects);
  else await requireBaselines(subprojects, state.mergeBase);
  return mode;
}

async function uploadState(): Promise<UploadState> {
  const [branch, status, head, tip, mergeBase] = await Promise.all([
    git(repoRoot, "branch", "--show-current"),
    git(repoRoot, "status", "--porcelain"),
    git(repoRoot, "rev-parse", "HEAD"),
    git(repoRoot, "rev-parse", "origin/main"),
    git(repoRoot, "merge-base", "HEAD", "origin/main"),
  ]);
  return { branch, dirty: status !== "", head, tip, mergeBase };
}

function decide(state: UploadState): UploadMode {
  try {
    return decideUpload(state);
  } catch (error) {
    throw new VisualError(error instanceof Error ? error.message : String(error));
  }
}

/** Main's own upload needs no baseline, only a subproject to send to. */
async function requireSubprojects(subprojects: string[]) {
  const misses: LookupMiss[] = [];
  for (const subproject of subprojects) {
    const result = await listBuilds(subproject, { limit: 1 });
    if (result.kind !== "ok") misses.push({ subproject, result });
  }
  const failure = lookupFailure(misses);
  if (failure !== undefined) throw new VisualError(failure);
}

async function requireBaselines(subprojects: string[], mergeBase: string) {
  const { failure, fresh } = await baselineFailure(subprojects, {
    mainShas,
    isAncestor: (sha) => isAncestor(sha, mergeBase),
  });
  if (failure !== undefined) throw new VisualError(failure);
  if (fresh.length > 0)
    log(
      `no main build yet in ${fresh.join(", ")}: a new subproject, so every shot reads as new ` +
        "until main's next upload sets its baselines",
    );
}

const POLL_TIMEOUT_MS = 5 * 60_000;
const POLL_INTERVAL_MS = 3000;

/**
 * The build `id` as the subproject's builds listing has it. Not the build itself
 * (`GET /api/v1/builds/:id`), which carries every shot (about 0.5 MB for 444); the listing carries
 * the same status and counts in a line.
 */
async function readBuildState(subproject: string, id: string): Promise<BuildState> {
  const result = await listBuilds(subproject, { limit: 20 });
  if (result.kind !== "ok")
    throw new VisualError(lookupFailure([{ subproject, result }]) ?? result.line);
  const build = buildIn(result.listing, id);
  if (build === undefined)
    throw new VisualError(`${subproject} lists no build ${id} among its newest 20`);
  return build;
}

/** The build id `pixelslash upload` recorded in the shot dir it sent. */
function recordedBuild(dir: string): string {
  const path = join(dir, "build.json");
  const recorded: unknown = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : null;
  const id = isRecord(recorded) ? recorded["build"] : undefined;
  if (typeof id !== "string" || id === "")
    throw new VisualError(`${path} has no build id: the upload made no build`);
  return id;
}

/**
 * The group's capture sent to its subproject: on the branch, or as `main` in main mode. Then
 * waits for the server to finish diffing it and returns the build, whose counts and page are the
 * result. Nothing about main is built or captured here: the server holds the baseline.
 */
export async function uploadGroup(subproject: string, dir: string, mode: UploadMode) {
  const snapshots = join(dir, "branch");
  const target = `${PIXELSLASH_PROJECT}/${subproject}`;
  log(
    mode === "main"
      ? `uploading this commit to ${target} as main`
      : `uploading the branch to ${target}`,
  );
  await uploadSnapshots(
    snapshots,
    repoRoot,
    subproject,
    ...(mode === "main" ? ["--branch", "main"] : []),
  );
  const id = recordedBuild(snapshots);
  let build: BuildState;
  try {
    build = await settle(id, {
      read: () => readBuildState(subproject, id),
      sleep: (ms) => Bun.sleep(ms),
      now: Date.now,
      timeoutMs: POLL_TIMEOUT_MS,
      intervalMs: POLL_INTERVAL_MS,
    });
  } catch (error) {
    if (error instanceof VisualError) throw error;
    throw new VisualError(`${target}: ${error instanceof Error ? error.message : String(error)}`);
  }
  log(build.url ? `build: ${build.url}` : `uploaded ${target} build ${id}, which lists no page`);
  return build;
}
