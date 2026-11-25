import { expect, test, type Page } from "@playwright/test";

test("finds by test id with no reason", async ({ page }) => {
  await expect(page.getByTestId("chart")).toBeVisible(); // expect: ui-testing/testid-needs-reason

  // oxlint-disable-next-line no-console -- a directive is not a reason
  await page.getByTestId("map").click(); // expect: ui-testing/testid-needs-reason
});

// A comment on a test is not a doc comment on a helper.
test("an unreasoned test id under a comment on the test", async ({ page }) => {
  await page.getByTestId("map").click(); // expect: ui-testing/testid-needs-reason
});

/** A doc comment covers its own helper, not the next one. */
const chartOf = (page: Page) => page.getByTestId("chart");
const pinOf = (page: Page) => page.getByTestId("pin"); // expect: ui-testing/testid-needs-reason

test("uses both helpers", async ({ page }) => {
  await expect(chartOf(page)).toBeVisible();
  await expect(pinOf(page)).toBeVisible();
});
