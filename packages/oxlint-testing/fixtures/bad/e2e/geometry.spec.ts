import { expect, test } from "@playwright/test";

test("measures layout and samples pixels", async ({ page }) => {
  const button = page.getByRole("button", { name: "Save" });
  const height = await button.evaluate((el) => el.getBoundingClientRect().height); // expect: no-restricted-properties
  expect(height).toBe(40);
  await button.evaluate((el) => el instanceof HTMLElement && el.offsetWidth); // expect: no-restricted-properties
  await button.evaluate((el) => el instanceof HTMLElement && el.offsetHeight); // expect: no-restricted-properties
  await button.evaluate((el) => el instanceof HTMLElement && el.offsetTop); // expect: no-restricted-properties
  await button.evaluate((el) => el instanceof HTMLElement && el.offsetLeft); // expect: no-restricted-properties
  const chart = page.getByRole("img", { name: "Sales" });
  await chart.evaluate((canvas) => {
    const context = canvas instanceof HTMLCanvasElement ? canvas.getContext("2d") : null;
    return [
      context?.measureText("Sales").width, // expect: no-restricted-properties
      context?.getImageData(0, 0, 1, 1).data, // expect: no-restricted-properties
    ];
  });
});
