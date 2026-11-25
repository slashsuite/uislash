import { expect, test, type Page } from "@playwright/test";

/**
 * NavigationProgress under reduced motion: the segment keeps sliding, slower and evenly, rather
 * than standing still at full width, which would read as a finished load.
 */
const story = "/iframe.html?id=feedback-navigationprogress--default&viewMode=story";

/** The sliding segment's animation and how much of the track it covers. */
const segment = (page: Page) =>
  page.getByRole("progressbar", { name: "Loading page" }).evaluate((track) => {
    const bar = track.firstElementChild;
    if (!(bar instanceof HTMLElement)) return null;
    const [slide] = bar.getAnimations();
    return {
      playing: slide?.playState === "running",
      duration: slide?.effect?.getTiming().duration,
      share: bar.getBoundingClientRect().width / track.getBoundingClientRect().width,
    };
  });

test("with motion, a 40% segment slides across in 1.4s", async ({ page }) => {
  await page.goto(story);
  expect(await segment(page)).toMatchObject({ playing: true, duration: 1400 });
  expect((await segment(page))?.share).toBeCloseTo(0.4, 2);
});

test("under reduced motion the segment still slides, slower and evenly, never a full bar", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(story);
  expect(await segment(page)).toMatchObject({ playing: true, duration: 4000 });
  expect((await segment(page))?.share).toBeCloseTo(0.4, 2);
});
