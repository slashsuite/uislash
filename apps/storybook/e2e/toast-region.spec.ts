import { expect, test } from "@playwright/test";

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`;

// The hide is a CSS animation, eight seconds and a fade; the spec finishes it rather than waiting
// for it, which proves the keyframes run and their end reaches `onDismiss`.
const finishAnimations = async (page: import("@playwright/test").Page) =>
  page.evaluate(() => {
    for (const animation of document.getAnimations()) animation.finish();
  });

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`a saved toast is announced in the status and leaves at its animation's end (${reducedMotion} motion)`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion });
    await page.goto(story("feedback-toast--do-saved"));
    await page.getByRole("button", { name: "Save" }).click();
    const region = page.getByRole("region", { name: "Notifications" });
    const status = region.getByRole("status");
    const toast = region.getByText("Saved", { exact: true });
    // The status reads the toast as text; the toast on screen sits outside it.
    await expect(status).toContainText("Saved");
    await expect(toast).toBeVisible();
    await finishAnimations(page);
    await expect(toast).toHaveCount(0);
    await expect(status).toHaveText("");
  });
}

test("a toast with an action stays when the animations finish, and Dismiss removes it", async ({
  page,
}) => {
  await page.goto(story("feedback-toast--do-action"));
  const toast = page.getByText("Update available", { exact: true });
  await expect(toast).toBeVisible();
  await finishAnimations(page);
  await expect(toast).toBeVisible();
  await expect(page.getByRole("status")).toHaveText(/Update available\. .*Actions available/);
  await page.getByRole("button", { name: "Dismiss" }).click();
  await expect(toast).toHaveCount(0);
});
