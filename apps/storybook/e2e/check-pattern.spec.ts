import { execFileSync } from "node:child_process";
import { expect, test, type Locator, type Page } from "@playwright/test";
import type { checkPattern as CheckPattern } from "@ui-sdk/core/testing";

declare global {
  /** Set by `check-pattern.entry.ts`, once the bundle is in the page. */
  var checkPattern: typeof CheckPattern;
}

/**
 * Each widget against the keyboard and ARIA contract of its WAI-ARIA pattern, checked by UI SDK's
 * `checkPattern` (`@ui-sdk/core/testing`) in the page. It throws one error naming every broken
 * rule, so a failing case reads as the list of what to fix. The function is bundled once per worker
 * for the browser (`check-pattern.entry.ts`), since its modules import `#dev`, which a page cannot
 * resolve.
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
  pattern: Parameters<typeof CheckPattern>[1];
  /**
   * Rules the check's own key presses cannot drive here, each with its proof elsewhere. Its keys
   * are untrusted events, and the browser closes its own `<dialog>` or popover only on a trusted
   * Esc, so "Escape should close it" fails on every native one; `keyboard.spec.ts`, `modal-exit.spec.ts`
   * and `popover.spec.ts` press the real Esc on each and check the focus goes back.
   */
  untrustedEscape?: true;
}

/** The problem a native `<dialog>` or popover gets from the check's untrusted Esc. */
const escapeRule = /^- .*: Escape should close it \(APG (dialog \(modal\)|alert dialog)\)\.$/;

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
  "Dialog (dialog)": {
    story: "feedback-dialog--default",
    root: (page) => page.getByRole("dialog"),
    pattern: "dialog",
    untrustedEscape: true,
  },
  "ConfirmDialog (alertdialog)": {
    story: "feedback-confirmdialog--default",
    root: (page) => page.getByRole("alertdialog"),
    pattern: "alertdialog",
    untrustedEscape: true,
  },
  "Popover panel (dialog)": {
    story: "feedback-popover--do-popover",
    open: (page) => page.getByRole("button", { name: "Build details" }).click(),
    root: (page) => page.getByRole("dialog"),
    pattern: "dialog",
    untrustedEscape: true,
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

for (const [name, { story, open, root, pattern, untrustedEscape }] of Object.entries(cases)) {
  test(`${name} meets its pattern`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${story}&viewMode=story`);
    await open?.(page);
    const widget = root(page);
    await expect(widget).toBeVisible();
    await page.addScriptTag({ content: bundle });
    const message = await widget.evaluate(async (element, kind) => {
      try {
        await globalThis.checkPattern(element, kind);
        return "";
      } catch (error) {
        return error instanceof Error ? error.message : String(error);
      }
    }, pattern);
    // The message is a heading line, then one "- " line per problem.
    const problems = message
      .split("\n")
      .filter((line) => !line.startsWith("checkPattern found"))
      .filter((line) => !(untrustedEscape && escapeRule.test(line)));
    expect(problems.join("\n")).toBe("");
  });
}
