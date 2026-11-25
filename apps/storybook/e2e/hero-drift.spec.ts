import { expect, test, type Page } from "@playwright/test";

// The Hero's glow drifts only under `prefers-reduced-motion: no-preference`: a media query, which
// jsdom does not evaluate. Read from what the page runs: the CSS animations named HERO_DRIFT.

const story = "/iframe.html?id=layout-hero--landing&viewMode=story";

/**
 * The drift's keyframes name, `HERO_DRIFT` in Hero.tsx. It is not in the package index, and the spec
 * cannot import Hero.tsx (the tsconfig maps react to its types, which Playwright then loads).
 */
const HERO_DRIFT = "hc-hero-tide";

/** How many of the page's running animations are the Hero's drift. */
const drifts = (page: Page) =>
  page.evaluate(
    (name) =>
      document
        .getAnimations()
        .filter((run) => run instanceof CSSAnimation && run.animationName === name).length,
    HERO_DRIFT,
  );

test("with no motion preference, each of the glow's three ribbons drifts", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(story);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await drifts(page)).toBe(3);
});

test("under reduced motion the glow stands still: no drift runs", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(story);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await drifts(page)).toBe(0);
});

test("turning reduced motion on stops the drift, and off starts it again", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(story);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await drifts(page)).toBe(3);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => drifts(page)).toBe(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect.poll(() => drifts(page)).toBe(3);
});
