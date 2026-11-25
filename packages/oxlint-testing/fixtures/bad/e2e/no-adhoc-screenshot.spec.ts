import { expect, test } from "@playwright/test";

test("takes its own shots", async ({ page }) => {
  const before = await page.screenshot(); // expect: ui-testing/no-adhoc-screenshot
  await page.getByRole("button", { name: "Dark" }).click();
  await page.screenshot({ path: "test-results/after.png", fullPage: true }); // expect: ui-testing/no-adhoc-screenshot
  const hero = await page.getByRole("banner").screenshot(); // expect: ui-testing/no-adhoc-screenshot
  expect(hero.equals(before)).toBe(false);
});
