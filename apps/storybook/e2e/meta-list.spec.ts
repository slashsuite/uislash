import { expect, test } from "@playwright/test";

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`;

test.use({ viewport: { width: 390, height: 600 } });

/**
 * A MetaList that wraps shows no separator at the start of a line: each item's separator leads it,
 * and the one of an item that starts a line falls in the margin the list's box clips.
 */
for (const id of ["text-metalist--wraps", "text-metalist--links-wrap"]) {
  test(`${id}: no line starts with a separator`, async ({ page }) => {
    await page.goto(story(id));
    const list = page.getByRole("list");
    await expect(list).toBeVisible();
    const lines = await list.evaluate((ul) => {
      const clip = ul.parentElement;
      if (!(clip instanceof HTMLElement)) return [];
      const boxLeft = clip.getBoundingClientRect().left;
      return [...ul.children].flatMap((li) => {
        const mark = li.firstElementChild;
        if (!(mark instanceof HTMLElement) || mark.getAttribute("aria-hidden") !== "true")
          return [];
        const range = document.createRange();
        range.selectNodeContents(mark);
        return [
          {
            top: Math.round(li.getBoundingClientRect().top),
            glyphRight: range.getBoundingClientRect().right,
            boxLeft,
          },
        ];
      });
    });
    const tops = [...new Set(lines.map((line) => line.top))];
    expect(tops.length).toBeGreaterThan(1);
    for (const top of tops) {
      const first = lines.find((line) => line.top === top);
      // The first item on each line has its separator wholly left of the clipping box's edge.
      expect(first?.glyphRight).toBeLessThanOrEqual(first?.boxLeft ?? 0);
    }
    // Every other item's separator is inside the box, so it shows between two items.
    const inside = lines.filter((line, i) => lines.findIndex((l) => l.top === line.top) !== i);
    expect(inside.length).toBeGreaterThan(0);
    for (const line of inside) expect(line.glyphRight).toBeGreaterThan(line.boxLeft);
  });
}
