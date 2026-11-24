import { expect, test, type Page } from "@playwright/test";
import { themeFiles } from "@slashsuite/themes-shared/files";

// Every control of one size stands at one height, so a field and the button beside it line up:
// 26px at `sm`, 38px at `md`, 46px at `lg`. The responsive row (`{ base: "sm", md: "lg" }`) is the
// `sm` height on a phone and the `lg` height from 48rem up, every control together.
const themes = themeFiles(`${import.meta.dirname}/../../../themes`);
const story = "/iframe.html?id=forms-input--heights&viewMode=story";
const HEIGHT = { sm: 26, md: 38, lg: 46 };

const widths = [
  { name: "phone", viewport: { width: 390, height: 900 }, responsive: HEIGHT.sm },
  { name: "desktop", viewport: { width: 1280, height: 900 }, responsive: HEIGHT.lg },
];

/** Each control of the row `data-size={size}`, by its `data-control` name, with its height. */
const rowHeights = (page: Page, size: string): Promise<Record<string, number>> =>
  page
    .locator(`[data-size="${size}"] [data-control]`)
    .evaluateAll((els) =>
      Object.fromEntries(
        els.map((el) => [el.getAttribute("data-control"), el.getBoundingClientRect().height]),
      ),
    );

for (const { name, viewport, responsive } of widths) {
  for (const { id } of themes) {
    test(`every control of a row is one height, ${name}, ${id}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(`${story}&globals=theme:${id}`);
      await page.getByRole("textbox", { name: "Input", exact: true }).first().waitFor();
      const expected = { ...HEIGHT, responsive };
      for (const [size, height] of Object.entries(expected)) {
        const heights = await rowHeights(page, size);
        expect(Object.keys(heights)).toHaveLength(9);
        expect(heights).toEqual(
          Object.fromEntries(Object.keys(heights).map((control) => [control, height])),
        );
      }
    });
  }
}
