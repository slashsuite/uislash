import type { Meta, StoryObj } from "@storybook/react-vite";
import { SiteSearch, type SiteSearchItem } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/SiteSearch.examples.js";

const meta: Meta = { title: "Navigation/SiteSearch" };
export default meta;
type S = StoryObj;

/** A docs site's pages, in its rail order. */
const pages: SiteSearchItem[] = [
  { label: "Button", description: "The one main action.", href: "#button" },
  { label: "Dialog", description: "A modal on the browser's own dialog.", href: "#dialog" },
  {
    label: "FieldDialog",
    description: "A dialog with one field and a submit.",
    href: "#field-dialog",
  },
  { label: "Drawer", description: "A panel that slides in from the side.", href: "#drawer" },
  { label: "Tabs", description: "Switch a view in place.", href: "#tabs" },
  {
    label: "Breadcrumbs",
    description: "Where this page sits in the hierarchy.",
    href: "#breadcrumbs",
  },
  { label: "Input", description: "A text field.", href: "#input", keywords: ["search"] },
];

/** The trigger on its own: from `sm` up, Search and its key; below, the search icon. Ctrl+K opens it. */
export const Default: S = {
  render: () => (
    <div className="p-6">
      <SiteSearch items={pages} label="Search components" />
    </div>
  ),
};

/**
 * Resolves with what `find` returns, checking again on every DOM change and focus move. No timer or
 * frame: the visual capture pauses the page clock, so neither would ever fire.
 */
function until<T>(find: () => T | null | undefined): Promise<T> {
  return new Promise((resolve) => {
    const check = () => {
      const found = find();
      if (!found) return;
      observer.disconnect();
      document.removeEventListener("focusin", check);
      resolve(found);
    };
    const observer = new MutationObserver(check);
    observer.observe(document.body, { subtree: true, childList: true, attributes: true });
    document.addEventListener("focusin", check);
    check();
  });
}

/** Open, with "dia" typed: Dialog first (its name starts with it), then FieldDialog. */
export const Open: S = {
  render: () => (
    <div className="p-6">
      <SiteSearch items={pages} label="Search components" />
    </div>
  ),
  // Waits for the settled state (both rows rendered, the fade done), so every capture is the same.
  play: async ({ canvasElement }) => {
    const trigger = [...canvasElement.querySelectorAll("button")].find(
      (button) => button.offsetParent !== null,
    );
    trigger?.click();
    // The field is in the page while closed; type only once the open dialog has focused it.
    const field = await until(() =>
      document.activeElement instanceof HTMLInputElement &&
      document.activeElement.matches("dialog[open] input")
        ? document.activeElement
        : null,
    );
    Reflect.set(HTMLInputElement.prototype, "value", "dia", field);
    field.dispatchEvent(new Event("input", { bubbles: true }));
    const dialog = await until(() =>
      document.querySelectorAll("dialog a[href]").length === 2
        ? document.querySelector("dialog")
        : null,
    );
    // getAnimations flushes style, so it sees the fade the open started.
    await Promise.all(
      dialog.getAnimations({ subtree: true }).map((animation) => animation.finished),
    );
  },
};

export const DoHeader: S = {
  render: examples.DoHeader,
};

export const DontHeader: S = {
  render: examples.DontHeader,
};
