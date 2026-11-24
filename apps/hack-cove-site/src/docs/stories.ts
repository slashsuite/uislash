/**
 * Every docs example in `packages/ui-react/docs/examples/`, so the docs can render it and show its
 * source. An example is named `<File>/<Export>`: `Button/DoOnePrimary` is `DoOnePrimary` in
 * `Button.examples.tsx`. A file's `Frame` export, when it has one, is not an example: every example
 * of that file renders inside it. Nothing here lists a component or an example.
 */
import { createElement, type ComponentType, type ReactNode } from "react";
import { storyParts, type StoryParts } from "./source.js";

type Examples = Record<string, ComponentType | undefined> & {
  Frame?: ComponentType<{ children: ReactNode }>;
};

const modules = import.meta.glob<Examples>(
  "../../../../packages/ui-react/docs/examples/**/*.examples.tsx",
  { eager: true },
);
const sources = import.meta.glob<string>(
  "../../../../packages/ui-react/docs/examples/**/*.examples.tsx",
  { eager: true, query: "?raw", import: "default" },
);

const stemOf = (path: string) =>
  path
    .split("/")
    .at(-1)
    ?.replace(/\.examples\.tsx$/, "") ?? path;

const stems = Object.keys(modules).map(stemOf);
const clash = stems.find((stem, i) => stems.indexOf(stem) !== i);
if (clash !== undefined) throw new Error(`two example files are both named ${clash}.examples.tsx`);

export type DocStory = StoryParts & {
  id: string;
  Story: ComponentType;
};

const moduleByStem = new Map(Object.entries(modules).map(([path, mod]) => [stemOf(path), mod]));
const rawByStem = new Map(Object.entries(sources).map(([path, raw]) => [stemOf(path), raw]));

/** The example `<File>/<Export>`, or `undefined` when the file has no such example. */
export function findStory(id: string): DocStory | undefined {
  const [stem, name] = id.split("/");
  if (stem === undefined || name === undefined || name === "Frame") return undefined;
  const mod = moduleByStem.get(stem);
  const Example = mod?.[name];
  const raw = rawByStem.get(stem);
  const parts = raw === undefined ? undefined : storyParts(raw, name);
  if (Example === undefined || parts === undefined) return undefined;
  const { Frame } = mod ?? {};
  const Story =
    Frame === undefined ? Example : () => createElement(Frame, null, createElement(Example));
  return { id, Story, ...parts };
}
