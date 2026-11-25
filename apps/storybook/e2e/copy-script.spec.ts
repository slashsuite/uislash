import { expect, test, type Page } from "@playwright/test";
// The script's own module, which imports nothing: the package index pulls in react, which the
// tsconfig maps to its types, and Playwright cannot load those.
import { copyScript } from "../../../packages/ui-react/src/copyScript.js";

// `copyScript` on a page that is never hydrated: a CopyButton's server markup with no React behind
// it, and the script inlined. No story renders that, so the page is made here: the CopyButton
// story's own markup is copied outside React's root (a copy carries no React handler; React hears
// only events inside its root) under the story's stylesheet, and the script is added as a page
// would inline it. jsdom has no Web Animations, so only a browser shows the label held and let go.

const story = "/iframe.html?id=actions-copybutton--default&viewMode=story";

/** The static copy: a region holding a copy of the story's button and its status region. */
async function staticPage(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const copied: string[] = [];
    Object.assign(window, { copied });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async (text: string) => void copied.push(text) },
    });
  });
  await page.goto(story);
  const markup = [
    await page.getByRole("button", { name: "Copy", exact: true }).evaluate((el) => el.outerHTML),
    await page.getByRole("status").evaluate((el) => el.outerHTML),
  ].join("");
  await page.evaluate((html) => {
    const region = document.createElement("section");
    region.setAttribute("aria-label", "Static page");
    region.innerHTML = html;
    document.body.append(region);
  }, markup);
  await page.addScriptTag({ content: copyScript });
}

test("a static copy button shows and announces Copied on a click, and lets it go when the run ends", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await staticPage(page);
  const region = page.getByRole("region", { name: "Static page" });
  const button = region.getByRole("button", { name: "Copy", exact: true });
  const status = region.getByRole("status");
  await expect(button.getByText("Copy", { exact: true })).toBeVisible();
  await expect(button.getByText("Copied", { exact: true })).toBeHidden();
  await expect(status).toHaveText("");

  await button.click();
  await expect(button.getByText("Copied", { exact: true })).toBeVisible();
  await expect(button.getByText("Copy", { exact: true })).toBeHidden();
  await expect(status).toHaveText("Copied");
  const copied = await page.evaluate((): unknown => Reflect.get(window, "copied"));
  expect(copied).toEqual([await button.getAttribute("data-copy-text")]);

  // End the two-second run now rather than wait it out: the label comes back and the region empties.
  await button.evaluate((el) => el.getAnimations({ subtree: true }).forEach((run) => run.finish()));
  await expect(button.getByText("Copy", { exact: true })).toBeVisible();
  await expect(button.getByText("Copied", { exact: true })).toBeHidden();
  await expect(status).toHaveText("");
  expect(errors).toEqual([]);
});
