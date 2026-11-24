// @vitest-environment jsdom
import { queryAllByAttribute } from "@testing-library/dom";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button.js";
import { Dialog } from "./Dialog.js";
import { stubDialog } from "./dom.harness.js";
import { act, fireEvent, render, screen, user, within } from "./render.harness.js";
import { type Toast, ToastRegion } from "./ToastRegion.js";

// The region draws the list it is given. The hide is a CSS animation that a real browser runs
// (toast-region.spec.ts); here a fired `animationend` stands in for its end, an event no person
// makes, as the harness allows.

const SAVED: Toast = {
  id: "saved",
  tone: "positive",
  title: "Saved",
  description: "Your draft is safe.",
};

/** A button, then two toasts that stay, held in state so Dismiss removes them. */
function TwoToasts() {
  const [toasts, setToasts] = useState<Toast[]>([
    { id: "a", tone: "warn", title: "Offline" },
    { id: "b", tone: "danger", title: "Not saved" },
  ]);
  return (
    <>
      <button type="button">Save</button>
      <ToastRegion
        items={toasts}
        onDismiss={(id) => setToasts((all) => all.filter((t) => t.id !== id))}
      />
    </>
  );
}

/** A Dialog that may be open, over a region showing `items`. */
function Shown({ open, items }: { open: boolean; items: Toast[] }) {
  return (
    <>
      {open && <Dialog title="Rename" onClose={() => undefined} />}
      <ToastRegion items={items} onDismiss={() => undefined} />
    </>
  );
}

/** The toast whose title is `title`: the one box, by the marker each toast renders, that holds it. */
function toastOf(title: string): HTMLElement {
  const [box, ...more] = queryAllByAttribute("data-toast", document.body, "").filter(
    (toast) => within(toast).queryByText(title) !== null,
  );
  if (!box || more.length > 0) throw new Error(`not one toast titled ${title}`);
  return box;
}

/**
 * An animation's end, as React hears it in jsdom. jsdom has no `AnimationEvent`, so React listens
 * for the prefixed `webkitAnimationEnd` there, and `fireEvent.animationEnd` (unprefixed) never
 * reaches the handler.
 */
function animationEnd(element: Element): void {
  fireEvent(element, new Event("webkitAnimationEnd", { bubbles: true }));
}

const hideEnd = (title: string) => animationEnd(toastOf(title));

describe("ToastRegion", () => {
  it("keeps a named region with an empty status in the page when there are no toasts", () => {
    render(<ToastRegion items={[]} onDismiss={() => undefined} />);
    const region = screen.getByRole("region", { name: "Notifications" });
    const status = within(region).getByRole("status");
    expect(status.textContent).toBe("");
    expect(status.getAttribute("aria-live")).toBe("polite");
  });

  it("reads a toast's title and description in the status, once, and takes them out when it goes", () => {
    const { rerender } = render(<ToastRegion items={[SAVED]} onDismiss={() => undefined} />);
    const status = screen.getByRole("status");
    expect(status.textContent).toBe("Saved. Your draft is safe.");
    rerender(<ToastRegion items={[]} onDismiss={() => undefined} />);
    expect(status.textContent).toBe("");
  });

  it("reads a danger toast through the alert, not the polite status", () => {
    const { rerender } = render(
      <ToastRegion
        items={[
          {
            id: "x",
            tone: "danger",
            title: "Not saved",
            description: "The server did not answer.",
          },
        ]}
        onDismiss={() => undefined}
      />,
    );
    expect(screen.getByRole("alert").textContent).toBe("Not saved. The server did not answer.");
    expect(screen.getByRole("status").textContent).toBe("");
    rerender(<ToastRegion items={[]} onDismiss={() => undefined} />);
    expect(screen.getByRole("alert").textContent).toBe("");
  });

  it("reads only the words of a toast with actions, then Actions available, never its buttons", () => {
    render(
      <ToastRegion
        items={[{ id: "u", title: "Update available", actions: <Button size="sm">Reload</Button> }]}
        onDismiss={() => undefined}
        actionsLabel="Choose an action"
      />,
    );
    const status = screen.getByRole("status");
    expect(status.textContent).toBe("Update available. Choose an action");
    expect(within(status).queryByRole("button")).toBeNull();
  });

  it("moves focus to the next toast when the focused one is dismissed, then back where it was", async () => {
    const u = user();
    render(<TwoToasts />);
    await u.click(screen.getByRole("button", { name: "Save" }));
    await u.tab();
    const [first] = screen.getAllByRole("button", { name: "Dismiss" });
    expect(document.activeElement).toBe(first);
    await u.keyboard("{Enter}");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Dismiss" }));
    await u.keyboard("{Enter}");
    expect(screen.queryByRole("button", { name: "Dismiss" })).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Save" }));
  });

  it("holds toasts back while a Dialog is open, and shows and reads them once it closes", async () => {
    stubDialog();
    const { rerender } = render(<Shown open items={[]} />);
    rerender(<Shown open items={[SAVED]} />);
    expect(screen.queryByText("Saved")).toBeNull();
    expect(screen.getByRole("status").textContent).toBe("");
    await act(async () => rerender(<Shown open={false} items={[SAVED]} />));
    expect(screen.getByText("Saved")).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe("Saved. Your draft is safe.");
  });

  it("keeps a toast already shown when a Dialog opens, and holds back only the new one", () => {
    stubDialog();
    const late: Toast = { id: "late", tone: "danger", title: "Not sent" };
    const { rerender } = render(<Shown open={false} items={[SAVED]} />);
    rerender(<Shown open items={[SAVED]} />);
    rerender(<Shown open items={[SAVED, late]} />);
    expect(screen.getByText("Saved")).toBeTruthy();
    expect(screen.queryByText("Not sent")).toBeNull();
    expect(screen.getByRole("status").textContent).toBe("Saved. Your draft is safe.");
  });

  it("calls onDismiss once with the id when Dismiss is clicked", async () => {
    const onDismiss = vi.fn<(id: string) => void>();
    render(<ToastRegion items={[SAVED]} onDismiss={onDismiss} />);
    await user().click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss.mock.calls).toEqual([["saved"]]);
  });

  it("calls onDismiss when a positive toast with no actions ends its hide", () => {
    const onDismiss = vi.fn<(id: string) => void>();
    render(<ToastRegion items={[SAVED]} onDismiss={onDismiss} />);
    hideEnd("Saved");
    expect(onDismiss.mock.calls).toEqual([["saved"]]);
  });

  it("never hides a warn, a danger or an actioned toast on its own", () => {
    const onDismiss = vi.fn<(id: string) => void>();
    render(
      <ToastRegion
        items={[
          { id: "w", tone: "warn", title: "Offline" },
          { id: "d", tone: "danger", title: "Not saved" },
          {
            id: "u",
            tone: "info",
            title: "Update available",
            actions: <Button size="sm">Reload</Button>,
          },
        ]}
        onDismiss={onDismiss}
      />,
    );
    for (const title of ["Offline", "Not saved", "Update available"]) {
      expect(toastOf(title).hasAttribute("data-toast-hide")).toBe(false);
      hideEnd(title);
    }
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("ignores an animation that ends on a child", () => {
    const onDismiss = vi.fn<(id: string) => void>();
    render(
      <ToastRegion
        items={[{ id: "u", title: "Update available", actions: <Button size="sm">Reload</Button> }]}
        onDismiss={onDismiss}
      />,
    );
    animationEnd(screen.getByRole("button", { name: "Reload" }));
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("draws only what is in items: a toast left out is gone", () => {
    const { rerender } = render(<ToastRegion items={[SAVED]} onDismiss={() => undefined} />);
    rerender(<ToastRegion items={[]} onDismiss={() => undefined} />);
    expect(screen.queryByText("Saved")).toBeNull();
    expect(screen.getByRole("region", { name: "Notifications" })).toBeTruthy();
  });

  it("takes label and dismissLabel in place of the default names", () => {
    render(
      <ToastRegion
        items={[SAVED]}
        onDismiss={() => undefined}
        label="Meldings"
        dismissLabel="Maak toe"
      />,
    );
    expect(screen.getByRole("region", { name: "Meldings" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Maak toe" })).toBeTruthy();
  });

  it("defaults a toast to the neutral tone, which hides on its own", () => {
    render(<ToastRegion items={[{ id: "c", title: "Copied" }]} onDismiss={() => undefined} />);
    expect(toastOf("Copied").hasAttribute("data-toast-hide")).toBe(true);
  });
});
