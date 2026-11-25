/**
 * A story fixture: a story as data, which every renderer draws. `title` and `story` give the story
 * id both renderers use (`storyId`), and `layout` how the items sit: `wrap` a wrapping row with the
 * standard gap, `wrap-center` the same row with its items centred on the cross axis.
 */
export type StoryFixture<Item> = {
  title: string;
  story: string;
  layout: "wrap" | "wrap-center";
  items: Item[];
};

/** Storybook's slug of a title or a story name: camelCase split, lower-cased, hyphenated. */
const slug = (text: string): string =>
  text
    .replace(/([a-z\d])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z\d]+/g, "-")
    .replace(/^-|-$/g, "");

/** Storybook's id for a story: `Actions/Button` and `Variants` give `actions-button--variants`. */
export function storyId(title: string, story: string): string {
  return `${slug(title)}--${slug(story)}`;
}
