/**
 * `bunx moon run storybook:visual`: what did this change do to the stories it reaches, in the
 * themes it reaches?
 *
 * The stories are split into groups, one per section of the site's component docs, and each group
 * is its own PixelSlash subproject (`<slug>`, under the project `uislash`). `--run` (the `visual` and `visual:upload`
 * scripts) does three steps, after moon has built Storybook:
 *
 * - The plan reads the diff against the base and writes `.pixelslash/plan.json`: which groups,
 *   story files and themes the change reaches, and why (`visual-plan.ts`): every story in the
 *   reference theme, the Gallery sections in every other. `--all`, or
 *   `VISUAL_ALL=1`, picks everything.
 * - Each group captures its picked stories on the branch and on the base, and compares them; a
 *   group the plan skipped does nothing. It fails, naming the shot, when a branch shot is over
 *   PixelSlash's 24.5 Mpx limit (`visual-shots.ts`; the Overview pages are shot in slices for that
 *   reason). The local compare runs its groups one at a time, since they build and capture the base
 *   under one lock; an upload the server renders sends every group at once, and one captured here
 *   (`VISUAL_RENDER=client`) runs `VISUAL_PARALLEL` of them at once (default 1).
 * - The summary reads every group's result and totals them. It runs only when every group passed.
 *
 * Each step can also run on its own, so a full check splits into short runs (`visual-args.ts`):
 *
 * - `--plan-only` writes the plan and stops. A local compare also builds the base Storybook here,
 *   which starts no browser.
 * - `--group <slug>` (repeatable) runs only those groups of the saved plan. It refuses when there is
 *   no plan, when the plan was made with other flags (`--upload` or `--all`), when `HEAD` has moved
 *   since the plan (plan again), or for a slug the plan does not have.
 * - `--summary-only` totals the saved plan's results, failing on each group that has none.
 *
 * A bare `--run` does all three in one process.
 *
 * Locally the base is the branch's merge-base with origin/main (the fork point, so a main that
 * moved since stays out of the diff); `VISUAL_BASE` names another ref. It is built in a shared
 * worktree and captured, and `pixelslash compare` writes the local report.
 *
 * `--upload` builds and captures no base at all. It sends the group to its PixelSlash subproject on
 * `PIXELSLASH_SERVER`. By default the server renders it: the upload sends the Storybook build and
 * the group's stories and themes (`pixelslash upload --bundle`), and nothing is captured here, so
 * every group is sent at once and the server takes them in turn. A render takes one set of stories
 * in one set of themes, so Overview's Gallery sections in the themes other than the reference go to
 * their own subproject, `overview-themes` (`bundleGroups`). `VISUAL_RENDER=client` is the fallback:
 * it captures the working tree here, `VISUAL_PARALLEL` groups at once, and sends the shots, Overview
 * whole to `overview`. The two read as different environments on the server, so a switch between
 * them re-seeds main first. Either way it uploads in one of two modes (`visual-upload.ts`):
 *
 * - On a branch (on origin/main's tip or behind it), it uploads the branch and the server diffs it
 *   against the main build at its merge-base or nearest ancestor. It first checks that each subproject holds one at the merge-base or
 *   an ancestor, and fails naming the subproject when not. A subproject with no main build at all
 *   is new: its first branch build reads every shot as new, and main's next upload sets its
 *   baselines.
 * - On a checkout at origin/main's tip, it uploads that commit as branch `main`, which the server
 *   auto-accepts as the baseline. This is the post-merge step that keeps those main builds there.
 *
 * Either way it waits for the server to finish diffing and takes the counts and the build's page
 * from the server. An upload takes a group whole or not at all (every story in the reference theme,
 * the Gallery sections in the others; `visual-plan.ts`), since a partial capture would read as
 * removals. A branch uploads only the groups its change reaches, plus Overview, which is always
 * captured; main uploads every group (`uploadPlan`).
 */
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { themeFiles } from "@slashsuite/themes-shared/files";
import { baseThemeIds, capturesOnBase } from "./theme-reach.js";
import { indexOf, shotsByTheme, shotsOf } from "./visual-index.js";
import { variants } from "./visual-shots.js";
import {
  groupStories,
  planCapture,
  readRepo,
  uploadPlan,
  type Grouping,
  type Plan,
} from "./visual-plan.js";
import {
  VisualError,
  baseStatic,
  baselineDir,
  branchStatic,
  buildBase,
  capture,
  changedSince,
  checkShotSizes,
  compare,
  ensurePixelslashInstall,
  git,
  log,
  out,
  repoRoot,
  resolveBase,
  withBaselineLock,
  type Selection,
} from "./visual-tools.js";
import {
  bundleGroups,
  pickGroups,
  renderFrom,
  savedPlanFrom,
  stepFrom,
  type PlannedGroup,
  type SavedPlan,
} from "./visual-args.js";
import { eachAtOnce, parallelFrom, uploadWorkers } from "./visual-parallel.js";
import { checkSubprojects, uploadBundle, uploadGroup, uploadMode } from "./visual-remote.js";
import { readResult } from "./visual-result.js";
import {
  uploadSummaryLine,
  uploadTotalLine,
  type GroupResult,
  type UploadMode,
} from "./visual-upload.js";

const upload = process.argv.includes("--upload");
const everything = process.argv.includes("--all") || process.env["VISUAL_ALL"] === "1";
const planPath = join(out, "plan.json");

function readJson(path: string): unknown {
  return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : null;
}

/** The saved plan's JSON; a file cut short (a plan step killed mid-write) reads as no plan. */
function readPlan(): unknown {
  try {
    return readJson(planPath);
  } catch (error) {
    if (error instanceof SyntaxError) return null;
    throw error;
  }
}

/** The repo's groups, failing on a story file no docs page names, or a page naming no story file. */
function checked(result: Grouping): Grouping {
  if (result.unsectioned.length > 0)
    throw new VisualError(
      `no page of the site's component docs names ${result.unsectioned.map((f) => f.path).join(", ")}; ` +
        "add it to a page's `pairs` or `stories` in packages/ui-react/docs/components",
    );
  if (result.unknown.length > 0)
    throw new VisualError(
      `docs pages name story files that do not exist: ${result.unknown.join(", ")}`,
    );
  return result;
}

/** Two story files may share a title (a page's extra stories), and PixelSlash includes by title. */
const titlesOf = (captures: { files: { title: string }[]; themes: string[] }[]) =>
  captures.map((c) => ({ titles: [...new Set(c.files.map((f) => f.title))], themes: c.themes }));

/**
 * What the plan says, at the top of the run: what is captured and why, and what is skipped, then
 * the shots per theme against what a run of everything takes (`whole`).
 */
function reportPlan(plan: Plan, grouping: Grouping, saved: SavedPlan, whole: Plan) {
  const index = indexOf(branchStatic);
  const shots = (captures: Selection[]) =>
    captures.reduce(
      (n, c) =>
        n + (c.themes.length > 0 ? shotsOf(index, c.titles, c.themes.length, variants.length) : 0),
      0,
    );
  const planned = saved.groups.flatMap((g) => g.captures);
  const wholeCaptures = whole.picked.flatMap((g) => titlesOf(g.captures));
  const files = plan.picked.reduce((n, g) => n + g.picked.length, 0);
  const allFiles = grouping.groups.reduce((n, g) => n + g.files.length, 0);
  log(
    `${plan.all ? "everything" : "affected"}: ${plan.picked.length} of ${grouping.groups.length} groups, ` +
      `${files} of ${allFiles} story files, ${shots(planned)} of ${shots(wholeCaptures)} shots`,
  );
  for (const note of plan.notes) log(`  ${note}`);
  for (const g of plan.picked) {
    const why = g.why.length > 0 ? ` (${g.why.join("; ")})` : "";
    const captures = g.captures
      .filter((c) => c.themes.length > 0)
      .map((c) => `${c.files.length} of ${g.files.length} story files in ${c.themes.join(", ")}`);
    log(`  ${g.slug}: ${captures.join("; ")}${why}`);
  }
  const skipped = plan.skipped.map((g) => `${g.slug} (${g.files.length} story files)`);
  if (skipped.length > 0)
    log(
      `skipped, no changed file reaches them${upload ? ", nothing uploaded" : ""}: ${skipped.join(", ")}`,
    );
  const now = shotsByTheme(index, planned, variants.length);
  const all = shotsByTheme(index, wholeCaptures, variants.length);
  const perTheme = [...all.themes].map(([id, n]) => `${id} ${now.themes.get(id) ?? 0} of ${n}`);
  log(`shots per theme: ${perTheme.join(", ")}; shot once: ${now.once} of ${all.once}`);
}

async function planMode(): Promise<SavedPlan> {
  await ensurePixelslashInstall();
  const repo = await readRepo(repoRoot);
  const grouping = checked(groupStories(repo.sections, repo.storyFiles));
  const base = await resolveBase();
  const mode = upload ? await uploadMode() : null;
  const changed = await changedSince(base.sha);
  const plan = uploadPlan(mode, { repo, grouping, changed, everything });
  const bundle = mode !== null && renderFrom(process.env["VISUAL_RENDER"]) === "server";
  const picked = new Map(plan.picked.map((g) => [g.slug, g]));
  const planned = grouping.groups.map((group) => {
    const pick = picked.get(group.slug);
    const captures = titlesOf(pick?.captures ?? []);
    return { slug: group.slug, skipped: !pick, captures };
  });
  const groups = bundle ? bundleGroups(planned) : planned;
  if (mode !== null)
    await checkSubprojects(
      mode,
      groups.filter((g) => !g.skipped).map((g) => g.slug),
    );
  const head = await git(repoRoot, "rev-parse", "HEAD");
  const saved: SavedPlan = {
    id: randomUUID(),
    upload,
    all: everything,
    mode,
    bundle,
    sha: base.sha,
    head,
    groups,
  };
  mkdirSync(out, { recursive: true });
  writeFileSync(planPath, `${JSON.stringify(saved, null, 2)}\n`);
  if (bundle) log("the server renders the shots from this Storybook build (VISUAL_RENDER=server)");
  if (mode === "main")
    log(`main: uploading ${base.sha.slice(0, 7)} as the baseline, nothing compared`);
  else if (mode === "branch") log("branch: the server diffs it against the main build it holds");
  else log(`base: ${base.label} ${base.sha.slice(0, 7)}`);
  const whole = planCapture({ repo, grouping, changed: [], everything: true });
  reportPlan(plan, grouping, saved, whole);
  return saved;
}

/**
 * The base's capture of `captures`, reused while the base commit, the selection and the branch's
 * themes stay the same. The base is asked for its own theme ids, and `capturesOnBase` maps the
 * branch's captures onto them: a theme added on the branch reads as new, a theme it removed, or a
 * reference it moved, as removed.
 */
async function captureBase(dir: string, sha: string, captures: Selection[]) {
  const keyPath = join(dir, "main.key");
  const branch = themeFiles(join(repoRoot, "themes")).map((theme) => theme.id);
  const key = JSON.stringify({ sha, captures, branch });
  if (existsSync(keyPath) && readFileSync(keyPath, "utf8").trim() === key) {
    log(`base ${sha.slice(0, 7)} already captured`);
    return;
  }
  rmSync(keyPath, { force: true });
  await withBaselineLock(async () => {
    await buildBase(sha);
    // buildBase leaves the shared worktree at `sha`, which is the base these ids come from.
    let ids: string[];
    try {
      ids = await baseThemeIds(baselineDir);
    } catch (error) {
      throw new VisualError(error instanceof Error ? error.message : String(error));
    }
    await capture(baseStatic, join(dir, "main"), capturesOnBase(captures, ids, branch));
  });
  writeFileSync(keyPath, `${key}\n`);
}

const skippedWhy = (plan: SavedPlan) =>
  `skipped, no changed file reaches it${plan.mode === null ? "" : "; nothing uploaded"}`;

/**
 * Uploads one group: the server renders it from the Storybook build (`plan.bundle`), or it is
 * captured here and its shots are sent.
 */
async function uploadOne(plan: SavedPlan, group: PlannedGroup, dir: string, mode: UploadMode) {
  if (plan.bundle) {
    const [selection] = group.captures;
    if (selection === undefined)
      throw new VisualError(`${group.slug}: the plan gives it no capture`);
    return uploadBundle(group.slug, selection, mode);
  }
  await capture(branchStatic, join(dir, "branch"), group.captures, uploadWorkers());
  checkShotSizes(join(dir, "branch"), group.slug);
  return uploadGroup(group.slug, dir, mode);
}

async function groupMode(plan: SavedPlan, group: PlannedGroup) {
  const { slug } = group;
  const dir = join(out, slug);
  mkdirSync(dir, { recursive: true });
  const result = join(dir, "result.json");
  if (group.skipped) {
    log(`${slug}: ${skippedWhy(plan)}`);
    writeFileSync(result, `${JSON.stringify({ id: plan.id, slug, skipped: true })}\n`);
    return;
  }
  const started = Date.now();
  if (plan.mode !== null) {
    // An upload builds and captures nothing of main: the server holds the baseline and diffs.
    const build = await uploadOne(plan, group, dir, plan.mode);
    log(`${slug}: done in ${Math.round((Date.now() - started) / 1000)}s`);
    writeFileSync(
      result,
      `${JSON.stringify({ id: plan.id, slug, skipped: false, counts: build.counts, status: build.status, url: build.url })}\n`,
    );
    return;
  }
  await capture(branchStatic, join(dir, "branch"), group.captures);
  checkShotSizes(join(dir, "branch"), slug);
  await captureBase(dir, plan.sha, group.captures);
  const report = join(dir, "report");
  const counts = await compare(join(dir, "main"), join(dir, "branch"), report);
  log(`${slug}: done in ${Math.round((Date.now() - started) / 1000)}s`);
  log(`${slug}: report: ${join(report, "index.html")}`);
  writeFileSync(result, `${JSON.stringify({ id: plan.id, slug, skipped: false, counts })}\n`);
}

function summaryMode(plan: SavedPlan) {
  const results: GroupResult[] = [];
  const missing: string[] = [];
  for (const group of plan.groups) {
    let result: GroupResult | undefined;
    try {
      result = readResult(plan.id, group.slug);
    } catch (error) {
      if (!(error instanceof VisualError)) throw error;
      missing.push(error.message);
      continue;
    }
    if (result === undefined) {
      log(`${group.slug}: ${skippedWhy(plan)}`);
      continue;
    }
    results.push(result);
    log(uploadSummaryLine(group.slug, result, plan.mode));
  }
  if (missing.length > 0) throw new VisualError(missing.join("; "));
  log(uploadTotalLine(results, plan.mode));
}

/**
 * How many groups run at once. A server render sends every group at once: nothing runs here but the
 * upload and the wait, and the server takes the builds in turn, so it is never idle between two.
 */
const atOnce = (plan: SavedPlan, parallel: number) =>
  plan.bundle && plan.mode !== null ? plan.groups.length : parallel;

/**
 * The plan, then each group, then the summary: what the moon task runs. The local compare takes one
 * group at a time (they build and capture the base under one lock); an upload the server renders
 * sends every group at once, and one captured here (`VISUAL_RENDER=client`) takes `VISUAL_PARALLEL`
 * at once, each writing its own `.pixelslash/<slug>/` and uploading to its own subproject. A failed
 * group does not stop the others; the summary runs only when none failed.
 *
 * The split run takes the same three steps one invocation at a time: `--plan-only` writes the plan
 * (and, for a local compare, builds the base, which starts no browser), `--group <slug>` runs the
 * named groups of the saved plan, and `--summary-only` totals the saved plan's results.
 */
async function main() {
  if (!process.argv.includes("--run"))
    throw new VisualError(
      "give --run [--upload] [--all] [--plan-only | --group <slug>... | --summary-only]",
    );
  const step = stepFrom(process.argv.slice(2));
  const parallel = upload ? parallelFrom(process.env["VISUAL_PARALLEL"]) : 1;
  if (step.kind === "summary") {
    summaryMode(savedPlanFrom(readPlan()));
    return;
  }
  if (step.kind === "groups") {
    const plan = savedPlanFrom(readPlan());
    const head = await git(repoRoot, "rev-parse", "HEAD");
    const groups = pickGroups(plan, {
      upload,
      all: everything,
      head,
      slugs: step.slugs,
    });
    await ensurePixelslashInstall();
    await eachAtOnce(groups, atOnce(plan, parallel), (group) => groupMode(plan, group));
    return;
  }
  const plan = await planMode();
  if (step.kind === "plan") {
    // An upload compares against the server's builds; a local compare needs the base built.
    if (!upload && plan.groups.some((g) => !g.skipped))
      await withBaselineLock(() => buildBase(plan.sha));
    log(
      `plan saved; run each group with --group <slug>: ${plan.groups.map((g) => g.slug).join(", ")}`,
    );
    log("then total them with --summary-only");
    return;
  }
  await eachAtOnce(plan.groups, atOnce(plan, parallel), (group) => groupMode(plan, group));
  summaryMode(plan);
}

try {
  await main();
} catch (error) {
  if (!(error instanceof VisualError)) throw error;
  process.stderr.write(`visual: ${error.message}\n`);
  process.exit(1);
}
