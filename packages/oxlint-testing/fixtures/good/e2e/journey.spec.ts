import { expect, test, type Page } from "@playwright/test";

test("saves a name", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html[data-hydrated]")).toBeAttached();
  const name = page.getByRole("textbox", { name: "Name" });
  await name.fill("ok");
  await name.fill("ok", { force: true });
  const options = { force: true };
  await name.fill("ok", options);
  await name.dispatchEvent("click", options);
  await name.press("Enter");
  await name.type("more", { delay: 0 });
  await page.getByRole("button", { name: "Save" }).click();
  await page.getByRole("button", { name: "Save" }).click({ force: true });
  await page.getByLabel("Size").selectOption("large");
  await page.getByLabel("Photo").setInputFiles("photo.png");
  await expect(page.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
  expect({ label: "Save", pressed: true }).toMatchObject({ label: "Save", pressed: true });
});

test("checks what layout and DOM reads a test may make", async ({ page, request }) => {
  // the first request cold-starts the preview build, FS-14
  test.setTimeout(60_000);
  await request.get("/health", { timeout: 30_000 }); // a cold worker answers late, FS-15
  // No sideways scroll on the phone is an outcome, not a look.
  const sideways = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(sideways).toBe(0);
  const menu = page.getByRole("menu");
  expect(await menu.evaluate((el) => el.scrollWidth - el.clientWidth)).toBe(0);
  expect(await menu.evaluate((el) => el === document.activeElement)).toBe(false);
  // The chart body is a canvas: it has no accessible name to find it by.
  await expect(page.getByTestId("chart")).toBeVisible();
});

test("is scoped off the phone with its ticket", async ({ isMobile }) => {
  test.skip(isMobile, "no hover on touch, FS-12");
  test.fixme(isMobile, "the phone menu closes on scroll, " + "HC-401");
  test.fail(isMobile, `the tooltip never opens, HC-402`);
});

test.fail("the menu opens on tap, HC-403", async () => {});

/**
 * The map is a canvas with no accessible name; the story's test id is the only way to it.
 */
const mapOf = (page: Page) => page.getByTestId("map");

test("reads the map through a helper with a doc comment", async ({ page }) => {
  await expect(mapOf(page)).toBeVisible();
});

test("gives its reason once for a query inside a callback", async ({ page }) => {
  // The sparkline is drawn on a canvas: it has no accessible name to find it by.
  await page.goto("/");
  await expect.poll(() => page.getByTestId("sparkline").isVisible()).toBe(true);
  // a cold worker answers late, FS-15
  await expect(page.getByRole("status")).toHaveText("Saved", {
    timeout: 20_000,
  });
});
