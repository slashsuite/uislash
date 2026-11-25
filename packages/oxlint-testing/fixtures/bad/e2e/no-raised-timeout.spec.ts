import { expect, test } from "@playwright/test";

test("raises its clocks", async ({ page, request }) => {
  test.setTimeout(120_000); // expect: ui-testing/no-raised-timeout
  await page.goto("/", { timeout: 60_000 }); // expect: ui-testing/no-raised-timeout
  await page.getByRole("button", { name: "Save" }).click({ timeout: 10_000 }); // expect: ui-testing/no-raised-timeout
  await expect(page.getByRole("status")).toBeVisible({ timeout: 15_000 }); // expect: ui-testing/no-raised-timeout
  await expect(page.getByRole("alert"), { message: "saved" }).toHaveText("Saved", {
    timeout: 20_000, // expect: ui-testing/no-raised-timeout
  });
  // the build is slow
  await request.get("/sitemap.xml", { timeout: 15_000 }); // expect: ui-testing/no-raised-timeout
});
