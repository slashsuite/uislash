import { expect, test, type Page } from "@playwright/test";

/**
 * StateMachine's moves, in the Move Along Arrows story: three items change state at once and one
 * item left behind takes a freed slot. The story's own play moves them; each test lands that and
 * moves them back itself, so each move starts after one has landed. Each move is read off its own
 * animation, held or finished by the test, so nothing here waits on a clock. Where a run goes
 * (along the arrow's bends, or straight across) is `runPath`'s unit test; how it looks is the
 * visual check's.
 */
const STORY = "/iframe.html?id=data-statemachine--move-along-arrows&viewMode=story";
const WERE = [
  "Spring launch post, in In review",
  "Pricing page rewrite, in In review",
  "Old changelog, in Draft",
];
const ARRIVED = [
  "Spring launch post, in Published",
  "Pricing page rewrite, in Draft",
  "Old changelog, in Rejected",
];

/**
 * The moves under way, held where they are (with the hiding of each place a dot runs to): each
 * move's kind and length in milliseconds.
 */
const holdMoves = (page: Page) =>
  page.evaluate(() =>
    document
      .getAnimations()
      .flatMap((a) =>
        a instanceof CSSAnimation && a.animationName.startsWith("hc-sm-") ? [a] : [],
      )
      .map((move) => {
        move.pause();
        return {
          name: move.animationName,
          duration: Number(move.effect?.getTiming().duration ?? 0),
        };
      })
      .flatMap(({ name, duration }) =>
        name === "hc-sm-arrive"
          ? []
          : [{ kind: name === "hc-sm-travel" ? "run" : "slide", duration }],
      ),
  );

/** How many runs are drawn, finished or not. */
const countRuns = (page: Page) =>
  page.evaluate(
    () =>
      document
        .getAnimations()
        .filter((a) => a instanceof CSSAnimation && a.animationName === "hc-sm-travel").length,
  );

/** Every move run to its end at once. */
const finishMoves = (page: Page) =>
  page.evaluate(() => {
    for (const move of document.getAnimations()) move.finish();
  });

/** The story with its play's moves landed: the three items in their new boxes. */
const open = async (page: Page) => {
  await page.goto(STORY);
  await expect(page.getByRole("button", { name: "Move them back" })).toBeVisible();
  await finishMoves(page);
  for (const name of ARRIVED) await expect(page.getByRole("img", { name })).toBeVisible();
};

test("three dots run back to their boxes, one dot slides out of the way, and each lands", async ({
  page,
}) => {
  await open(page);
  await page.getByRole("button", { name: "Move them back" }).click();
  const moves = await holdMoves(page);
  expect(moves.filter((m) => m.kind === "run")).toHaveLength(3);
  expect(moves.filter((m) => m.kind === "slide")).toHaveLength(1);
  for (const move of moves) {
    expect(move.duration).toBeGreaterThanOrEqual(400);
    expect(move.duration).toBeLessThanOrEqual(700);
  }
  // While a dot runs, its place in the new box waits empty.
  for (const name of WERE) await expect(page.getByRole("img", { name })).toBeHidden();
  await expect(page.getByRole("img", { name: "Team interview, in In review" })).toBeVisible();

  await finishMoves(page);
  for (const name of WERE) await expect(page.getByRole("img", { name })).toBeVisible();
  // A run that has landed is gone, so a dot never sits on the line.
  await expect.poll(() => countRuns(page)).toBe(0);
});

test("under reduced motion every dot is in its new place at once, with no run or slide", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(STORY);
  for (const name of ARRIVED) await expect(page.getByRole("img", { name })).toBeVisible();
  await page.getByRole("button", { name: "Move them back" }).click();
  for (const name of WERE) await expect(page.getByRole("img", { name })).toBeVisible();
  const moves = await holdMoves(page);
  expect(moves.filter((m) => m.kind === "slide")).toHaveLength(0);
  for (const move of moves) expect(move.duration).toBeLessThanOrEqual(1);
});
