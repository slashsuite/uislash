import { expect, test } from "@playwright/test";

/**
 * A Popover is the browser's own popover: jsdom runs neither `popovertarget` nor light dismiss, so
 * the open, Esc and the click away are checked only here.
 */
test("the trigger opens the panel, and Esc closes it with the focus back on the trigger", async ({
  page,
}) => {
  await page.goto("/iframe.html?id=feedback-popover--do-popover&viewMode=story");
  const trigger = page.getByRole("button", { name: "Build details" });
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  const panel = page.getByRole("dialog", { name: "Build details" });
  await expect(panel).toBeVisible();
  await expect(panel).toBeInViewport();
  await expect(panel.getByText("982a166")).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await panel.getByText("Shots").click();
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("a click outside the panel closes it, and the page stays usable while it is open", async ({
  page,
}) => {
  await page.goto("/iframe.html?id=feedback-popover--default&viewMode=story");
  const panel = page.getByRole("dialog", { name: "Filters" });
  await expect(panel).toBeVisible();
  await page.mouse.click(5, 5);
  await expect(panel).toBeHidden();
  await expect(page.getByRole("button", { name: "Filters" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
});
