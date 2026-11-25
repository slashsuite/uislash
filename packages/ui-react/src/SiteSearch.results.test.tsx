// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { recordFollowed, stubDialog } from "./dom.harness.js";
import { fireEvent, render, screen, user, within } from "./render.harness.js";
import { SiteSearch, type SiteSearchItem } from "./SiteSearch.js";

beforeEach(stubDialog);

const ITEMS: SiteSearchItem[] = [
  { label: "Dialog", description: "A modal window.", href: "/dialog/" },
  { label: "Diagram", description: "A drawing.", href: "/diagram/" },
];

const toResults = (query: string) => `/search?q=${encodeURIComponent(query)}`;

let followed: string[] = [];
let stop = () => {};
beforeEach(() => {
  ({ followed, stop } = recordFollowed());
});
afterEach(() => stop());

async function openSearch(resultsHref?: (query: string) => string) {
  render(<SiteSearch items={ITEMS} label="Search components" resultsHref={resultsHref} />);
  const person = user();
  await person.keyboard("{Control>}k{/Control}");
  const dialog = within(screen.getByRole("dialog", { name: "Search components" }));
  return { person, dialog, field: dialog.getByRole("searchbox") };
}

describe("SiteSearch field", () => {
  it("is a search landmark, with no autocorrect or capitalising of what is typed", async () => {
    const { dialog, field } = await openSearch();
    expect(within(dialog.getByRole("search")).getByRole("searchbox")).toBe(field);
    expect(field.getAttribute("autocorrect")).toBe("off");
    expect(field.getAttribute("autocapitalize")).toBe("off");
    expect(field.getAttribute("spellcheck")).toBe("false");
  });

  it("follows the first result on Enter", async () => {
    const { person, field } = await openSearch();
    await person.type(field, "dia{Enter}");
    expect(followed).toEqual(["/dialog/"]);
  });

  it.each([
    ["isComposing", { isComposing: true }],
    ["Safari's 229 keyCode", { keyCode: 229 }],
  ])("leaves Enter to an IME during composition (%s)", async (_name, composing) => {
    const { person, field } = await openSearch();
    await person.type(field, "dia");
    // user-event cannot compose with an IME: the Enter that commits a composition is fired by hand.
    // fireEvent returns true when nothing kept the browser from acting on the key.
    expect(fireEvent.keyDown(field, { key: "Enter", ...composing })).toBe(true);
    expect(followed).toEqual([]);
  });
});

describe("SiteSearch resultsHref", () => {
  it("adds no full results link without it", async () => {
    const { person, dialog, field } = await openSearch();
    await person.type(field, "zzz");
    expect(dialog.queryAllByRole("link")).toHaveLength(0);
  });

  it("puts the full results link last once something is typed, matches or not", async () => {
    const { person, dialog, field } = await openSearch(toResults);
    expect(dialog.queryAllByRole("link")).toHaveLength(0);

    await person.type(field, " dia ");
    const links = dialog.getAllByRole("link");
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "/dialog/",
      "/diagram/",
      "/search?q=dia",
    ]);
    expect(links.at(-1)).toBe(dialog.getByRole("link", { name: "See all results for dia" }));

    await person.clear(field);
    await person.type(field, "a b");
    expect(dialog.getByText("No results for a b")).not.toBeNull();
    expect(dialog.getByRole("link", { name: "See all results for a b" }).getAttribute("href")).toBe(
      "/search?q=a%20b",
    );
  });

  it("goes to the full results page on Enter, not the first match", async () => {
    const { person, field } = await openSearch(toResults);
    await person.type(field, "dia{Enter}");
    expect(followed).toEqual(["/search?q=dia"]);
  });

  it("names the link in another language", async () => {
    render(
      <SiteSearch
        items={ITEMS}
        label="Rechercher"
        resultsHref={toResults}
        allResultsLabel="Tous les résultats pour"
      />,
    );
    const person = user();
    await person.keyboard("{Control>}k{/Control}");
    await person.type(screen.getByRole("searchbox"), "dia");
    expect(screen.getByRole("link", { name: "Tous les résultats pour dia" })).not.toBeNull();
  });
});
