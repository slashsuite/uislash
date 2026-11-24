import { cleanup, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { afterEach } from "vitest";

// The one way a component test renders and acts: Testing Library's `render` into jsdom, found by
// role, label or text through `screen`, driven by `user()` the way a person types and clicks.
// `fireEvent` is for an event no person makes (an image's `error`, `animationend`, a resize), with a
// comment saying so. Import it in a file that runs under `// @vitest-environment jsdom`.

export { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";

afterEach(() => {
  cleanup();
  // A field-error live region outlives the fields that made it; start each test without one.
  for (const region of document.querySelectorAll("[data-field-errors]")) region.remove();
});

/** A user to drive the page: `await user().click(screen.getByRole("button", { name: "Save" }))`. */
export function user(): UserEvent {
  return userEvent.setup();
}

/** Whether `b` comes after `a` in the document: reading order, the way a screen reader meets them. */
export function follows(a: Node, b: Node): boolean {
  return (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
}

/** The page's one polite live region for field errors (`fieldAnnounce.tsx`), or `null` before any field. */
export function errorRegion(): HTMLElement | null {
  return document.querySelector<HTMLElement>("[data-field-errors]");
}

/** The field errors the live regions (the page's and any dialog's) hold right now, in order. */
export function announced(): string[] {
  return [...document.querySelectorAll("[data-field-errors] > *")].map(
    (line) => line.textContent ?? "",
  );
}

/** How many field-error live regions the page holds (its own and any dialog's). */
export function liveRegions(): number {
  return document.querySelectorAll("[data-field-errors]").length;
}

/** The error line a field draws for `text`, not its copy in the live region. */
export function drawn(text: string): HTMLElement {
  const line = screen.getAllByText(text).find((node) => !node.closest("[data-field-errors]"));
  if (!line) throw new Error(`no drawn error line reads "${text}"`);
  return line;
}
