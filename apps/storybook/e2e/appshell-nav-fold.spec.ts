import { expect, test, type Page } from "@playwright/test";
import { themeFiles } from "@slashsuite/themes-shared/files";

/**
 * From `md` a nav too wide for the header row folds into the Menu, as on a phone, and comes back
 * when the screen is wide enough again. Measured by the row's own size, so a resize drives it both
 * ways. Themes are found the way the toolbar switcher finds them, so a new theme is checked with no edit here.
 */
const themes = themeFiles(`${import.meta.dirname}/../../../themes`);

const STORY = "layout-appshell--nav-folds";
const LINKS = 10;

const open = async (page: Page, id: string, theme: string, width: number) => {
  await page.setViewportSize({ width, height: 800 });
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`);
  await page.getByRole("banner").waitFor();
};

// The Menu is the browser's popover, which the button targets; its links are the header's navigation links.
const menuButton = (page: Page) =>
  page.getByRole("banner").getByRole("button", { name: "Menu", exact: true });
const menuLinks = (page: Page) =>
  page.getByRole("banner").getByRole("navigation").getByRole("link");
const isOpen = (page: Page) =>
  menuButton(page).evaluate(
    (button) =>
      button instanceof HTMLButtonElement &&
      !!button.popoverTargetElement?.matches(":popover-open"),
  );
const rowLink = (page: Page) =>
  page.getByRole("banner").getByRole("link", { name: "Settings", exact: true });

const sideways = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

test("the themes folder lists at least one theme", () => {
  expect(themes.length).toBeGreaterThan(0);
});

for (const { id: theme } of themes) {
  test.describe(`theme ${theme}`, () => {
    test("at 1280 the nav is in the row and no Menu button shows", async ({ page }) => {
      await open(page, STORY, theme, 1280);
      await expect(rowLink(page)).toBeVisible();
      await expect(menuButton(page)).toBeHidden();
      expect(await sideways(page)).toBeLessThanOrEqual(0);
    });

    test("at 900 the nav folds: the Menu lists every link and following one closes it", async ({
      page,
    }) => {
      await open(page, STORY, theme, 900);
      await expect(menuButton(page)).toBeVisible();
      expect(await sideways(page)).toBeLessThanOrEqual(0);
      await menuButton(page).click();
      await expect.poll(() => isOpen(page)).toBe(true);
      await expect(menuLinks(page)).toHaveCount(LINKS);
      await menuLinks(page).filter({ hasText: "Audit" }).click();
      await expect.poll(() => isOpen(page)).toBe(false);
      expect(await sideways(page)).toBeLessThanOrEqual(0);
    });
  });
}

test("resizing from 900 to 1280 and back follows, both ways", async ({ page }) => {
  await open(page, STORY, "default", 900);
  await expect(menuButton(page)).toBeVisible();
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(rowLink(page)).toBeVisible();
  await expect(menuButton(page)).toBeHidden();
  await page.setViewportSize({ width: 900, height: 800 });
  await expect(menuButton(page)).toBeVisible();
  await expect(rowLink(page)).toBeHidden();
  expect(await sideways(page)).toBeLessThanOrEqual(0);
});

for (const id of ["layout-appshell--long-page", "layout-appshell--header-slots"]) {
  test(`${id} fits at 1280: no Menu button`, async ({ page }) => {
    await open(page, id, "default", 1280);
    await expect(menuButton(page)).toBeHidden();
  });
}

const WITH_SUBNAV = "layout-appshell--nav-folds-with-subnav";
const signOut = (page: Page) => page.getByRole("button", { name: "Sign out" });
const subnavLink = (page: Page) =>
  page
    .getByRole("banner")
    .getByRole("navigation", { name: "Section" })
    .getByRole("link", { name: "Runs" });

test("at 900 only the nav and menuControls fold: the subnav row stays, and Sign out is at the foot of the Menu", async ({
  page,
}) => {
  await open(page, WITH_SUBNAV, "default", 900);
  await expect(menuButton(page)).toBeVisible();
  await expect(subnavLink(page)).toBeVisible();
  await expect(subnavLink(page)).toBeInViewport({ ratio: 1 });
  await expect(signOut(page)).toBeHidden();
  await menuButton(page).click();
  await expect.poll(() => isOpen(page)).toBe(true);
  await expect(signOut(page)).toBeVisible();
  // The Menu holds the nav's links; the subnav's phone copy is not drawn from `md`, so a screen
  // reader meets one Section nav.
  const banner = page.getByRole("banner");
  const nav = banner.getByRole("navigation", { name: "Main" });
  await expect(nav.getByRole("link")).toHaveCount(LINKS);
  await expect(banner.getByRole("navigation", { name: "Section" })).toHaveCount(1);
  const last = nav.getByRole("link").last();
  const button = await signOut(page).elementHandle();
  expect(
    await last.evaluate(
      (link, control) =>
        !!control && !!(link.compareDocumentPosition(control) & Node.DOCUMENT_POSITION_FOLLOWING),
      button,
    ),
  ).toBe(true);
});

test("at 1280 Tab follows the row as it shows: nav, Sign out, the theme toggle, then the subnav", async ({
  page,
}) => {
  await open(page, WITH_SUBNAV, "default", 1280);
  await expect(menuButton(page)).toBeHidden();
  const banner = page.getByRole("banner");
  const settings = rowLink(page);
  const toggle = banner.getByRole("button", { name: /dark|light/i });
  await settings.focus();
  await page.keyboard.press("Tab");
  await expect(signOut(page)).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(toggle).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    banner.getByRole("navigation", { name: "Section" }).getByRole("link").first(),
  ).toBeFocused();
});
