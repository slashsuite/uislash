import { expect, test } from "@playwright/test";

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`;

test("a missing clipboard does not throw, and shows and announces the failure", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined });
  });
  await page.goto(story("actions-copybutton--default"));
  const button = page.getByRole("button", { name: "Copy", exact: true });
  await button.click();
  await expect(button.getByText("Failed", { exact: true })).toBeVisible();
  await expect(button.getByText("Copy", { exact: true })).toBeHidden();
  await expect(button.getByText("Copied", { exact: true })).toBeHidden();
  await expect(page.getByRole("status")).toHaveText("Failed");
  // End the two-second run now rather than wait it out: the label comes back and the region empties.
  await page.evaluate(() => document.getAnimations().forEach((run) => run.finish()));
  await expect(button.getByText("Copy", { exact: true })).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("");
  expect(errors).toEqual([]);
});
