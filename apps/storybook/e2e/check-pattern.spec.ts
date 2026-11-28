import { execFileSync } from "node:child_process";
import { expect, test, type Locator, type Page } from "@playwright/test";

declare global {
  /** Set by `check-pattern.entry.ts`, once the bundle is in the page. */
  var checkPattern: (root: Element, pattern: string) => Promise<void>;
}

/**
 * Each widget against the keyboard and ARIA contract of its WAI-ARIA pattern, checked by UI SDK's
 * `checkPattern` (`@ui-sdk/core/testing`) in the page. It throws one error naming every broken
 * rule, so a failing case reads as the list of what to fix. The function is bundled once per worker
 * for the browser (`check-pattern.entry.ts`), since its modules import `#dev`, which a page cannot
 * resolve.
 *
 * Not checked: a modal `Dialog` and `ConfirmDialog` are the browser's own `<dialog>`, whose Tab
 * goes from the last control to the browser before it wraps, where the pattern wants it to wrap at
 * once; and a `Popover` panel is not modal and leaves the focus on its trigger, which the pattern's
 * modal dialog does not allow. Its trigger is checked as a disclosure.
 */
const bundle = execFileSync(
  "bun",
  ["build", `${import.meta.dirname}/check-pattern.entry.ts`, "--target=browser", "--format=iife"],
  { encoding: "utf8" },
);

interface Case {
  /** The story id. */
  story: string;
  /** What a person does first, when the widget is not on screen as the story loads. */
  open?: (page: Page) => Promise<void>;
  /** The pattern's root element. */
  root: (page: Page) => Locator;
  pattern: string;
}

const cases: Record<string, Case> = {
  "Menu (menu)": {
    story: "actions-menu--closed",
    open: (page) => page.getByRole("button", { name: "More actions" }).click(),
    root: (page) => page.getByRole("menu"),
    pattern: "menu",
  },
  "Combobox (combobox)": {
    story: "forms-combobox--default",
    root: (page) => page.getByRole("combobox"),
    pattern: "combobox",
  },
  "Popover trigger (disclosure)": {
    story: "feedback-popover--default",
    root: (page) => page.getByRole("button", { name: "Filters" }),
    pattern: "disclosure",
  },
  "Tabs (tabs)": {
    story: "navigation-tabs--default",
    root: (page) => page.getByRole("tablist"),
    pattern: "tabs",
  },
  "Checkbox (checkbox)": {
    story: "forms-checkbox--unchecked",
    root: (page) => page.getByRole("checkbox"),
    pattern: "checkbox",
  },
  "Switch (switch)": {
    story: "forms-switch--off",
    root: (page) => page.getByRole("switch"),
    pattern: "switch",
  },
  "RadioGroup (radio-group)": {
    story: "forms-radiogroup--default",
    root: (page) => page.getByRole("radiogroup"),
    pattern: "radio-group",
  },
  "SegmentedControl (radio-group)": {
    story: "forms-segmentedcontrol--default",
    root: (page) => page.getByRole("radiogroup"),
    pattern: "radio-group",
  },
  "Disclosure (disclosure)": {
    story: "content-disclosure--closed",
    root: (page) => page.getByRole("button", { expanded: false }),
    pattern: "disclosure",
  },
  "Slider (slider)": {
    story: "forms-slider--default",
    root: (page) => page.getByRole("slider"),
    pattern: "slider",
  },
};

for (const [name, { story, open, root, pattern }] of Object.entries(cases)) {
  test(`${name} meets its pattern`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${story}&viewMode=story`);
    await open?.(page);
    const widget = root(page);
    await expect(widget).toBeVisible();
    await page.addScriptTag({ content: bundle });
    const problems = await widget.evaluate(async (element, kind) => {
      try {
        await globalThis.checkPattern(element, kind);
        return "";
      } catch (error) {
        return error instanceof Error ? error.message : String(error);
      }
    }, pattern);
    expect(problems).toBe("");
  });
}
