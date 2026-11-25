import { expect, test } from "@playwright/test";

test("walks the DOM inside the page", async ({ page }) => {
  const count = await page.evaluate(() => document.querySelectorAll("li").length); // expect: ui-testing/no-node-access
  expect(count).toBe(3);
  await page.evaluate(() => document.querySelector("#search")); // expect: ui-testing/no-node-access
  const list = page.getByRole("list");
  await list.evaluate((el) => el.children.length); // expect: ui-testing/no-node-access
  await list.evaluate((el) => el.parentElement); // expect: ui-testing/no-node-access
  await list.evaluateAll((els) => els.map((el) => el.firstElementChild)); // expect: ui-testing/no-node-access
  await list.evaluate(function (el) {
    return el.closest("nav"); // expect: ui-testing/no-node-access
  });
});
