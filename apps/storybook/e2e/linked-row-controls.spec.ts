import { expect, test, type Locator, type Page } from "@playwright/test";

// A linked ListRow's link and a TableRow's `TextLink stretch` are stretched over the whole row, and
// the row's own links and buttons are lifted above them (`liftInteractive`). Only a real pointer
// shows which one a click reaches, so each control is clicked the way a person does: Playwright's
// click fails if anything else would receive it at that point. (Card and the button ListRow are
// covered by card-under-sticky-bars.spec.ts and list-row-button.spec.ts.)

const story = (id: string) => `/iframe.html?id=data-listrow--${id}&viewMode=story`;

/** Each of `controls` notes `name` in the page's `hits` when a click reaches it. */
async function recordClicks(page: Page, controls: Record<string, Locator>): Promise<void> {
  await page.evaluate(() => Object.assign(window, { hits: [] }));
  for (const [name, control] of Object.entries(controls)) {
    await control.evaluate((el, label) => {
      el.addEventListener("click", () => {
        const hits: unknown = Reflect.get(window, "hits");
        if (Array.isArray(hits)) hits.push(label);
      });
    }, name);
  }
}

/** What `recordClicks` heard, as the page holds it. */
const clicks = (page: Page) => page.evaluate((): unknown => Reflect.get(window, "hits"));

const listRowLink = (page: Page) => page.getByRole("link", { name: /^Grace Hopper/ });
const tableRow = (page: Page) => page.getByRole("row", { name: /Q-1042/ });

test.describe("a linked ListRow with a link and a button in trailing", () => {
  test("the inner button takes the click, and the row's link does not follow", async ({ page }) => {
    await page.goto(story("list-row-with-controls"));
    const start = page.url();
    const accept = page.getByRole("button", { name: "Accept", exact: true });
    await recordClicks(page, { accept, row: listRowLink(page) });
    await accept.click();
    expect(await clicks(page)).toEqual(["accept"]);
    expect(page.url()).toBe(start);
  });

  test("the inner link follows its own href, not the row's", async ({ page }) => {
    await page.goto(story("list-row-with-controls"));
    await page.getByRole("link", { name: "Notes", exact: true }).click();
    await expect(page).toHaveURL(/#grace-notes$/);
  });

  test("the row's label is under the row link: a click on it follows the row", async ({ page }) => {
    await page.goto(story("list-row-with-controls"));
    // `force` skips Playwright's check that the text is topmost: the point is that the row link is.
    await page.getByText("Grace Hopper", { exact: true }).click({ force: true });
    await expect(page).toHaveURL(/#grace$/);
  });

  test("Tab reaches the row link, then its link, then its button", async ({ page }) => {
    await page.goto(story("list-row-with-controls"));
    await page.getByRole("link", { name: "Notes", exact: true }).waitFor();
    await page.keyboard.press("Tab");
    await expect(listRowLink(page)).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Notes", exact: true })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Accept", exact: true })).toBeFocused();
  });
});

test.describe("a TableRow with a stretched TextLink, a second link and a button", () => {
  test("the inner button takes the click, and the row's link does not follow", async ({ page }) => {
    await page.goto(story("table-row-with-controls"));
    const start = page.url();
    const resend = tableRow(page).getByRole("button", { name: "Resend", exact: true });
    const link = tableRow(page).getByRole("link", { name: "Q-1042", exact: true });
    await recordClicks(page, { resend, link });
    await resend.click();
    expect(await clicks(page)).toEqual(["resend"]);
    expect(page.url()).toBe(start);
  });

  test("the second link follows its own href, not the row's", async ({ page }) => {
    await page.goto(story("table-row-with-controls"));
    await tableRow(page).getByRole("link", { name: "Naledi Dlamini", exact: true }).click();
    await expect(page).toHaveURL(/#Q-1042-client$/);
  });

  test("a click on the row away from its controls follows the row's href", async ({ page }) => {
    await page.goto(story("table-row-with-controls"));
    // The actions cell's start corner is padding (its button sits at the end); only the stretched
    // link reaches there. `force` skips Playwright's check that the cell is topmost: the point is
    // that the row link is.
    await tableRow(page)
      .getByRole("cell")
      .last()
      .click({ force: true, position: { x: 2, y: 2 } });
    await expect(page).toHaveURL(/#Q-1042$/);
  });
});
