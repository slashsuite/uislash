import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ColourSchemeToggle, SiteSearch, type SiteSearchItem } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/SiteSearch.examples.js";
import { until } from "./openByTrigger";

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

/** Click the trigger on screen, wait for the open dialog to focus its field, then type `text`. */
async function openAndType(canvasElement: HTMLElement, text: string): Promise<HTMLDialogElement> {
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
  Reflect.set(HTMLInputElement.prototype, "value", text, field);
  field.dispatchEvent(new Event("input", { bubbles: true }));
  return until(() => document.querySelector("dialog"));
}

/** Waits for `links` rows and the open's fade, so every capture is the same. */
async function settled(dialog: HTMLDialogElement, links: number): Promise<void> {
  await until(() => dialog.querySelectorAll("a[href]").length === links || null);
  // getAnimations flushes style, so it sees the fade the open started.
  await Promise.all(dialog.getAnimations({ subtree: true }).map((animation) => animation.finished));
}

/** Open, with "dia" typed: Dialog first (its name starts with it), then FieldDialog. */
export const Open: S = {
  render: () => (
    <div className="p-6">
      <SiteSearch items={pages} label="Search components" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await settled(await openAndType(canvasElement, "dia"), 2);
  },
};

/**
 * A site with a full text search page passes `resultsHref`: its link is the last row once anything
 * is typed, and Enter goes there.
 */
export const FullResults: S = {
  render: () => (
    <div className="p-6">
      <SiteSearch
        items={pages}
        label="Search components"
        resultsHref={(query) => `#search?q=${encodeURIComponent(query)}`}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await settled(await openAndType(canvasElement, "dia"), 3);
  },
};

/** At each `size`, the same height as a `Button` and a `ColourSchemeToggle` of that size. */
export const Sizes: S = {
  render: () => (
    <div className="flex flex-col gap-4 p-6">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex items-center gap-2">
          <SiteSearch items={pages} label="Search components" size={size} />
          <Button variant="outline" size={size}>
            Sign in
          </Button>
          <ColourSchemeToggle size={size} store={false} />
        </div>
      ))}
    </div>
  ),
};

export const DoHeader: S = {
  render: examples.DoHeader,
};

export const DontHeader: S = {
  render: examples.DontHeader,
};
