import { expect, test, type Page } from "@playwright/test";

// FileDrop's file input covers its whole zone, invisible, so whatever a pointer does anywhere in the
// zone (a click, a file dragged onto it) lands on the input itself, not on the label around it. A
// label would forward a click to its input too, so the check is on the first click the page hears:
// its target is the input. Playwright cannot drag a file from the OS, so the drop's landing is shown
// by the same hit, and the file arrives through the input's own chooser.

const story = "/iframe.html?id=forms-filedrop--do-chosen&viewMode=story";
const prompt = "Drop a bank statement here or click to choose";

/** The element type each click on the page lands on, in order, from the next click on. */
const recordClicks = (page: Page) =>
  page.evaluate(() => {
    const hits: string[] = [];
    Object.assign(window, { hits });
    document.addEventListener(
      "click",
      (event) => hits.push(event.target instanceof Element ? event.target.localName : ""),
      { capture: true },
    );
  });

/** What `recordClicks` heard, as the page holds it. */
const clicks = (page: Page) => page.evaluate((): unknown => Reflect.get(window, "hits"));

for (const [where, position] of [
  ["its centre", undefined],
  ["a corner of its padding", { x: 3, y: 3 }],
] as const) {
  test(`a click at ${where} lands on the input, whose chooser takes the file the zone then names`, async ({
    page,
  }) => {
    await page.goto(story);
    // The zone is the label: the prompt is its text. A file input has no role, so it is found by that name.
    const zone = page.getByText(prompt, { exact: true });
    const input = page.getByLabel(prompt, { exact: true });
    await expect(input).toHaveAttribute("type", "file");
    await recordClicks(page);

    const chooser = page.waitForEvent("filechooser");
    await zone.click(position === undefined ? {} : { position });
    const picked = await chooser;
    expect(await clicks(page)).toEqual(["input"]);
    expect(picked.isMultiple()).toBe(false);

    await picked.setFiles({
      name: "statement.csv",
      mimeType: "text/csv",
      buffer: Buffer.from("a,b"),
    });
    await expect(page.getByText("statement.csv", { exact: true })).toBeVisible();
    const files = page
      .getByLabel("statement.csv", { exact: true })
      .evaluate((el) =>
        el instanceof HTMLInputElement ? [...(el.files ?? [])].map((f) => f.name) : [],
      );
    expect(await files).toEqual(["statement.csv"]);
  });
}

test("files set on the zone's input show their name in the zone", async ({ page }) => {
  await page.goto(story);
  await page
    .getByLabel(prompt, { exact: true })
    .setInputFiles({ name: "march.csv", mimeType: "text/csv", buffer: Buffer.from("a,b") });
  await expect(page.getByText("march.csv", { exact: true })).toBeVisible();
  await expect(page.getByText(prompt, { exact: true })).toBeHidden();
});
