import { expect, test } from "@playwright/test";

// Escape in a search field with a value clears it and goes no further, so the dialog around it
// stays open; Escape in the empty field passes on to the dialog, which closes.
test("Escape clears a search in a dialog, then closes the dialog", async ({ page }) => {
  await page.goto("/iframe.html?id=forms-input--search-in-dialog&viewMode=story");
  const dialog = page.getByRole("dialog", { name: "Add a shop" });
  const field = dialog.getByRole("searchbox", { name: "Search shops" });
  await field.focus();
  await expect(field).toHaveValue("Corner");

  await page.keyboard.press("Escape");
  await expect(field).toHaveValue("");
  await expect(field).toBeFocused();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Clear search" })).toHaveCount(0);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});
