// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConfirmDialog } from "./ConfirmDialog.js";
import { stubDialog } from "./dom.harness.js";
import { act, render, screen, user, within } from "./render.harness.js";

// stubDialog supplies the modal <dialog> methods jsdom lacks; it does not act through the DOM.
beforeEach(stubDialog);

const PROPS = {
  title: "Delete build?",
  description: "This removes the build and every snapshot in it.",
  confirm: "Delete",
  busyLabel: "Deleting…",
};

function open(
  onConfirm: () => void | Promise<unknown>,
  onClose: () => void = vi.fn<() => void>(),
): void {
  render(<ConfirmDialog {...PROPS} onConfirm={onConfirm} onClose={onClose} />);
}

const button = (name: string): HTMLButtonElement =>
  screen.getByRole<HTMLButtonElement>("button", { name });

describe("ConfirmDialog", () => {
  it("is an alertdialog named by its title and described by its consequence", () => {
    open(() => undefined);
    expect(
      screen.getByRole("alertdialog", { name: "Delete build?", description: PROPS.description }),
    ).not.toBeNull();
  });

  it("puts Cancel first, ahead of the action, and the close button last", () => {
    open(() => undefined);
    expect(screen.getAllByRole("button")).toEqual([
      button("Cancel"),
      button("Delete"),
      button("Close"),
    ]);
  });

  it("closes without confirming on Cancel", async () => {
    const onConfirm = vi.fn<() => void>();
    const onClose = vi.fn<() => void>();
    open(onConfirm, onClose);
    await user().click(button("Cancel"));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("confirms once and closes when the action returns nothing", async () => {
    const onConfirm = vi.fn<() => void>();
    const onClose = vi.fn<() => void>();
    open(onConfirm, onClose);
    await user().click(button("Delete"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("is busy while the action is pending, ignores a second press, then closes", async () => {
    const pending = Promise.withResolvers<void>();
    const onConfirm = vi.fn<() => Promise<unknown>>(() => pending.promise);
    const onClose = vi.fn<() => void>();
    open(onConfirm, onClose);
    await user().click(button("Delete"));
    const busy = button("Deleting…");
    expect(busy.getAttribute("aria-busy")).toBe("true");
    await user().click(busy);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
    await act(async () => pending.resolve());
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows a rejection's message as an alert, stays open and lets the reader retry", async () => {
    const onConfirm = vi
      .fn<() => Promise<unknown>>()
      .mockRejectedValueOnce(new Error("The build is locked."))
      .mockResolvedValue(null);
    const onClose = vi.fn<() => void>();
    open(onConfirm, onClose);
    await user().click(button("Delete"));
    const dialog = screen.getByRole("alertdialog");
    expect(within(dialog).getByRole("alert").textContent).toBe("The build is locked.");
    expect(onClose).not.toHaveBeenCalled();
    await user().click(button("Delete"));
    expect(onConfirm).toHaveBeenCalledTimes(2);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows a thrown error as an alert and stays open, as a rejection does", async () => {
    const onClose = vi.fn<() => void>();
    open(() => {
      throw new Error("No connection.");
    }, onClose);
    await user().click(button("Delete"));
    expect(within(screen.getByRole("alertdialog")).getByRole("alert").textContent).toBe(
      "No connection.",
    );
    expect(button("Delete").getAttribute("aria-busy")).toBeNull();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("takes cancel and closeLabel in another language", () => {
    render(
      <ConfirmDialog
        title="Archive project?"
        description="It leaves the list; you can restore it."
        confirm="Argiveer"
        cancel="Kanselleer"
        closeLabel="Maak toe"
        tone="neutral"
        onConfirm={() => undefined}
        onClose={() => undefined}
      />,
    );
    expect(button("Kanselleer")).toBeTruthy();
    expect(button("Maak toe")).toBeTruthy();
    expect(button("Argiveer")).toBeTruthy();
  });
});
