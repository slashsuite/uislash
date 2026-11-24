import { expect, test } from "@playwright/test";

/**
 * A ConfirmDialog in the browser's own `<dialog>`: it opens on Cancel, so a stray Enter cancels,
 * and a rejected action shows its alert and keeps the dialog open. jsdom stubs `showModal`, so the
 * first focus is checked only here.
 */
test("opens on Cancel, and Enter there cancels without confirming", async ({ page }) => {
  await page.goto("/iframe.html?id=feedback-confirmdialog--do-confirm&viewMode=story");
  await page.getByRole("button", { name: "Delete build" }).click();
  const modal = page.getByRole("alertdialog", { name: "Delete build?" });
  await expect(modal).toBeVisible();
  await expect(modal).toHaveAccessibleDescription(
    "This removes the build and every snapshot in it.",
  );
  await expect(modal.getByRole("button", { name: "Cancel" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(modal).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Delete build" })).toBeFocused();
});

test("a rejected action shows its alert and keeps the dialog open", async ({ page }) => {
  await page.goto("/iframe.html?id=feedback-confirmdialog--rejects&viewMode=story");
  const modal = page.getByRole("alertdialog");
  await modal.getByRole("button", { name: "Delete" }).click();
  await expect(modal.getByRole("alert")).toHaveText("The build is locked by a running review.");
  await expect(modal).toBeVisible();
});
