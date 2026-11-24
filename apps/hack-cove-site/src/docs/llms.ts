/**
 * The component docs as plain text for agents, made from the same sources as the pages
 * (`packages/ui-react/docs/components/`, the stories and `packages/ui-react/docs/props.json`), so
 * they cannot drift. Two outputs share every part: the site's `/ui/llms.txt` (one file, every
 * component's section) and the docs shipped in `@slashsuite/ui-react` under `agent-docs/` (an
 * index and one file per component page, written by the `agent-docs` task).
 */
import {
  componentPageOf,
  componentPages,
  componentSections,
  sectionOfPage,
  type ComponentPage,
} from "../../../../packages/ui-react/docs/components/index.js";
import { site } from "../content/site.js";
import { themes } from "../content/themes.js";
import { pairOf } from "./pairs.js";
import { docOf, typeOf } from "./Props.js";
import { findStory } from "./stories.js";

const fence = (code: string) => `\`\`\`tsx\n${code}\n\`\`\``;

/** A story's caption (when it has one) over its code. */
const captioned = ({ caption, code }: { caption?: string | undefined; code: string }) =>
  caption === undefined ? fence(code) : `${caption}\n${fence(code)}`;

/** The bullets as a `- ` list, one per line. */
const bullets = (rules: string[]) => rules.map((rule) => `- ${rule}`).join("\n");

/** The Don't section: the `usage.dont` bullets first, then the Don't stories. */
function dontSectionOf(page: ComponentPage): string {
  const { dont = [] } = page.usage;
  return [bullets(dont), dontsOf(page)].filter((part) => part !== "").join("\n\n");
}

/** Each Don't story: its caption over its code. */
function dontsOf(page: ComponentPage): string {
  return page.pairs
    .flatMap((topic) => {
      const { dont } = pairOf(topic);
      return dont === undefined ? [] : [captioned(dont)];
    })
    .join("\n\n");
}

function propsOf(name: string): string {
  const { description, props } = docOf(name);
  const lines = props.map((prop) => {
    const flags = `${prop.required ? " (required)" : ""}${prop.native ? " (native)" : ""}${prop.default === undefined ? "" : ` (default ${prop.default})`}`;
    return `- ${prop.name}: ${prop.type}${flags}${prop.description === "" ? "" : `. ${prop.description}`}`;
  });
  return [`### ${name}`, description.replace(/\s*\n\s*/g, " "), ...lines].join("\n");
}

/** One type: its name, its definition and what it is. */
function typeLine(name: string): string {
  const { description, definition } = typeOf(name);
  return `- ${name}: \`${definition}\`. ${description.replace(/\s*\n\s*/g, " ")}`;
}

function typesOf(page: ComponentPage): string[] {
  const { types = [] } = page;
  return types.length === 0 ? [] : [`### Types\n${types.map(typeLine).join("\n")}`];
}

function functionsOf(page: ComponentPage): string[] {
  const { functions = [] } = page;
  return functions.length === 0
    ? []
    : [
        `### Functions\n${functions.map((fn) => `- ${fn.name}: \`${docOf(fn.name).signature ?? fn.name}\`. ${fn.text}${fn.example === undefined ? "" : `\n${fence(fn.example)}`}`).join("\n")}`,
      ];
}

function fullPageOf(page: ComponentPage): string[] {
  if (page.fullPage === undefined) return [];
  const story = findStory(page.fullPage);
  if (story === undefined) throw new Error(`llms.txt: ${page.name} has no story ${page.fullPage}`);
  return [`### Full page\n${captioned(story)}`];
}

/** Where a sibling page is: its address on the site, or its file beside this one in `agent-docs/components/`. */
type LinkOf = (slug: string) => string;
const siteLink: LinkOf = (slug) => `/ui/${slug}/`;
const fileLink: LinkOf = (slug) => `${slug}.md`;

/** The "Use instead" list: each sibling page with when to use it instead of this one. */
function siblingsOf(page: ComponentPage, linkOf: LinkOf): string[] {
  const { siblings = [] } = page;
  return siblings.length === 0
    ? []
    : [
        `### Use instead\n${siblings.map(({ slug, when }) => `- ${componentPageOf(slug).name} (${linkOf(slug)}): ${when}`).join("\n")}`,
      ];
}

/** One component page, from its `## <name>` heading to its last list. */
function sectionOf(page: ComponentPage, linkOf: LinkOf): string {
  const [lead] = page.pairs;
  const right = lead === undefined ? undefined : pairOf(lead).do;
  if (right === undefined) throw new Error(`llms.txt: ${page.name} has no Do story to lead with`);
  return [
    `## ${page.name}`,
    `Group: ${sectionOfPage(page.slug).title}`,
    `When to use: ${page.whenToUse}`,
    ...siblingsOf(page, linkOf),
    `### The one right way\n${captioned(right)}`,
    ...fullPageOf(page),
    `### Do\n${bullets(page.usage.do)}`,
    `### Don't\n${dontSectionOf(page)}`,
    `### Accessibility\n${bullets(page.accessibility)}`,
    `### Props\n${page.api.map(propsOf).join("\n\n")}`,
    ...typesOf(page),
    ...functionsOf(page),
  ].join("\n\n");
}

/** Install, the CSS wiring and every theme's package and class: what an agent needs before any component works. */
function setupOf(): string {
  const { install, themes: themesCopy } = site.ui;
  const steps = install.steps.map((step, i) => {
    const code =
      "code" in step ? `\n\`\`\`${step.language}\n${[step.code].flat().join("\n")}\n\`\`\`` : "";
    return `${i + 1}. ${step.text}${code}`;
  });
  const list = themes.map(
    (theme) =>
      `- ${theme.title}: \`${theme.specifier}\`; ${themesCopy.scopeLabel}: \`${theme.scopeClass}\`.`,
  );
  return [
    `## ${install.title}`,
    steps.join("\n\n"),
    `### ${themesCopy.title}\n${themesCopy.intro}\n${list.join("\n")}`,
  ].join("\n\n");
}

/** The title, the purpose and the rule every component follows. */
function headOf(): string {
  return [
    "# UISlash",
    `> ${site.ui.subtitle}`,
    ...site.ui.intro,
    "Every component has one right way to use it. There are no extension recipes and no styling escape hatches: do not restyle a component, compose the parts.",
  ].join("\n\n");
}

/** The site's `/ui/llms.txt`: the setup, then every component's section in rail order. */
export function renderLlms(): string {
  const sections = componentPages.map((page) => sectionOf(page, siteLink));
  return `${[headOf(), setupOf(), ...sections].join("\n\n")}\n`;
}

/** The packaged index's list: each group, and under it each page's file and when to use it. */
function indexOf(): string {
  const groups = componentSections.map(({ title, pages }) =>
    [
      `### ${title}`,
      ...pages.map(
        ({ name, slug, whenToUse }) => `- ${name} (components/${fileLink(slug)}): ${whenToUse}`,
      ),
    ].join("\n"),
  );
  return [
    "## Components",
    "Each component page is its own file under `components/`: the one right way, do and don't, accessibility and props. Read the page before you use the component.",
    ...groups,
  ].join("\n\n");
}

/**
 * The docs shipped in `@slashsuite/ui-react`, by path under `agent-docs/`: `llms.txt` (the setup and
 * an index of the pages) and `components/<slug>.md` (one per component page, the same section as on
 * `/ui/llms.txt`, linking its siblings by file).
 */
export function renderAgentDocs(): Map<string, string> {
  return new Map([
    ["llms.txt", `${[headOf(), setupOf(), indexOf()].join("\n\n")}\n`],
    ...componentPages.map((page): [string, string] => [
      `components/${fileLink(page.slug)}`,
      `${sectionOf(page, fileLink)}\n`,
    ]),
  ]);
}
