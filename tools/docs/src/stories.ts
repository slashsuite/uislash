/**
 * Every docs example in `packages/ui-react/docs/examples/`, as the docs show it: its code and its
 * caption. An example is named `<File>/<Export>`: `Button/DoOnePrimary` is `DoOnePrimary` in
 * `Button.examples.tsx`. A file's `Frame` export, when it has one, is not an example. Nothing here
 * lists a component or an example.
 */
import { globSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { storyParts, type StoryParts } from "./source.js";

const EXAMPLES = join(
  import.meta.dirname,
  "..",
  "..",
  "..",
  "packages",
  "ui-react",
  "docs",
  "examples",
);

const files = globSync("**/*.examples.tsx", { cwd: EXAMPLES });

const stemOf = (path: string) =>
  path
    .split("/")
    .at(-1)
    ?.replace(/\.examples\.tsx$/, "") ?? path;

const stems = files.map(stemOf);
const clash = stems.find((stem, i) => stems.indexOf(stem) !== i);
if (clash !== undefined) throw new Error(`two example files are both named ${clash}.examples.tsx`);

export type DocStory = StoryParts & { id: string };

const rawByStem = new Map(
  files.map((path) => [stemOf(path), readFileSync(join(EXAMPLES, path), "utf8")]),
);

/** The example `<File>/<Export>`, or `undefined` when the file has no such example. */
export function findStory(id: string): DocStory | undefined {
  const [stem, name] = id.split("/");
  if (stem === undefined || name === undefined || name === "Frame") return undefined;
  const raw = rawByStem.get(stem);
  const parts = raw === undefined ? undefined : storyParts(raw, name);
  return parts === undefined ? undefined : { id, ...parts };
}
