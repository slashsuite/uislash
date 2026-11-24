// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { showModal, stubDialog } from "./dom.harness.js";
import { Drawer } from "./Drawer.js";
import { act, fireEvent, render, screen, user, within } from "./render.harness.js";

// stubDialog supplies the modal <dialog> methods jsdom lacks; it does not act through the DOM.
beforeEach(stubDialog);

// A finger event at a given place and time: the timestamp is the value under test, so it is
// set, never read off the clock.
const finger = (
  target: Element,
  type: "pointerdown" | "pointermove" | "pointerup" | "pointercancel",
  at: { x: number; y?: number; t: number; pointerType?: string },
) => {
  const event = new MouseEvent(type, { bubbles: true, clientX: at.x, clientY: at.y ?? 0 });
  Object.defineProperties(event, {
    pointerId: { value: 1 },
    pointerType: { value: at.pointerType ?? "touch" },
    timeStamp: { value: at.t },
  });
  fireEvent(target, event);
};

const open = (onClose = vi.fn<() => void>()) => {
  render(
    <Drawer title="t" onClose={onClose}>
      <p>Body</p>
    </Drawer>,
  );
  const dialog = screen.getByRole<HTMLDialogElement>("dialog", { name: "t" });
  vi.spyOn(dialog, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 300, 800));
  return { dialog, body: screen.getByText("Body"), onClose };
};

describe("Drawer", () => {
  it("opens as a modal on mount", () => {
    render(<Drawer title="Item" onClose={() => {}} />);
    expect(showModal).toHaveBeenCalledExactlyOnceWith(
      screen.getByRole<HTMLDialogElement>("dialog", { name: "Item" }),
    );
  });

  it("closes the dialog when the parent unmounts it, so focus returns to the opener", () => {
    const { unmount } = render(<Drawer title="Item" onClose={() => {}} />);
    const dialog = screen.getByRole<HTMLDialogElement>("dialog", { name: "Item" });
    expect(dialog.hasAttribute("open")).toBe(true);
    unmount();
    expect(dialog.hasAttribute("open")).toBe(false);
  });

  it("is named by its title heading and shows the body, and the footer in its own region", () => {
    render(
      <Drawer title="Item 12" footer={<button type="button">Save</button>} onClose={() => {}}>
        <p>Body text</p>
      </Drawer>,
    );
    const dialog = screen.getByRole<HTMLDialogElement>("dialog", { name: "Item 12" });
    expect(within(dialog).getByRole("heading", { name: "Item 12" })).not.toBeNull();
    expect(within(dialog).getByText("Body text")).not.toBeNull();
    expect(within(dialog).getByRole("contentinfo").textContent).toBe("Save");
  });

  it("renders no footer when none is given", () => {
    render(<Drawer title="t" onClose={() => {}} />);
    expect(screen.queryByRole("contentinfo")).toBeNull();
  });

  it("calls onClose when the dialog closes (Esc fires the same event)", async () => {
    const onClose = vi.fn<() => void>();
    render(<Drawer title="t" onClose={onClose} />);
    // Esc closes a modal <dialog> in the browser; jsdom has none, so the test calls the close it makes.
    await act(async () => screen.getByRole<HTMLDialogElement>("dialog", { name: "t" }).close());
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on a click on the scrim, which is a click on the <dialog> itself", async () => {
    const onClose = vi.fn<() => void>();
    render(<Drawer title="t" onClose={onClose} />);
    await user().click(screen.getByRole<HTMLDialogElement>("dialog", { name: "t" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes from the close button, named by closeLabel", async () => {
    const onClose = vi.fn<() => void>();
    render(<Drawer title="t" closeLabel="Dismiss" onClose={onClose} />);
    await user().click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close on a click inside the panel", async () => {
    const onClose = vi.fn<() => void>();
    render(
      <Drawer title="t" onClose={onClose}>
        <button type="button">inner</button>
      </Drawer>,
    );
    await user().click(screen.getByRole("button", { name: "inner" }));
    await user().click(screen.getByRole("heading", { name: "t" }));
    expect(onClose).not.toHaveBeenCalled();
  });

  describe("swipe to dismiss on touch", () => {
    it("follows the finger to the right, and closes on a release past a third of the width", async () => {
      const { dialog, body, onClose } = open();
      finger(body, "pointerdown", { x: 10, t: 0 });
      finger(body, "pointermove", { x: 60, t: 500 });
      expect(dialog.style.translate).toBe("50px");
      expect(dialog.hasAttribute("data-swiping")).toBe(true);
      finger(body, "pointermove", { x: 130, t: 1000 });
      await act(async () => finger(body, "pointerup", { x: 130, t: 1500 }));
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(dialog.style.translate).toBe("");
    });

    it("springs back from a slow, short swipe", async () => {
      const { dialog, body, onClose } = open();
      finger(body, "pointerdown", { x: 10, t: 0 });
      finger(body, "pointermove", { x: 60, t: 500 });
      await act(async () => finger(body, "pointerup", { x: 60, t: 1000 }));
      expect(onClose).not.toHaveBeenCalled();
      expect(dialog.style.translate).toBe("");
      expect(dialog.hasAttribute("data-swiping")).toBe(false);
    });

    it("closes on a quick flick to the right, however short", async () => {
      const { body, onClose } = open();
      finger(body, "pointerdown", { x: 10, t: 0 });
      finger(body, "pointermove", { x: 20, t: 10 });
      finger(body, "pointermove", { x: 40, t: 20 });
      await act(async () => finger(body, "pointerup", { x: 40, t: 30 }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("leaves a vertical move to the body's scroll", async () => {
      const { dialog, body, onClose } = open();
      finger(body, "pointerdown", { x: 10, y: 10, t: 0 });
      finger(body, "pointermove", { x: 20, y: 200, t: 500 });
      finger(body, "pointermove", { x: 200, y: 210, t: 1000 });
      expect(dialog.style.translate).toBe("");
      await act(async () => finger(body, "pointerup", { x: 200, y: 210, t: 1500 }));
      expect(onClose).not.toHaveBeenCalled();
    });

    it("does nothing for a mouse, or a drag that starts in a field", async () => {
      const onClose = vi.fn<() => void>();
      render(
        <Drawer title="t" onClose={onClose}>
          <input aria-label="Name" />
          <p>Body</p>
        </Drawer>,
      );
      const dialog = screen.getByRole<HTMLDialogElement>("dialog", { name: "t" });
      vi.spyOn(dialog, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 300, 800));
      const body = screen.getByText("Body");
      finger(body, "pointerdown", { x: 10, t: 0, pointerType: "mouse" });
      finger(body, "pointermove", { x: 200, t: 500, pointerType: "mouse" });
      await act(async () => finger(body, "pointerup", { x: 200, t: 1000, pointerType: "mouse" }));
      const field = screen.getByRole("textbox", { name: "Name" });
      finger(field, "pointerdown", { x: 10, t: 0 });
      finger(field, "pointermove", { x: 200, t: 500 });
      await act(async () => finger(field, "pointerup", { x: 200, t: 1000 }));
      expect(dialog.style.translate).toBe("");
      expect(onClose).not.toHaveBeenCalled();
    });

    it("springs back when the system cancels the touch", async () => {
      const { dialog, body, onClose } = open();
      finger(body, "pointerdown", { x: 10, t: 0 });
      finger(body, "pointermove", { x: 200, t: 500 });
      await act(async () => finger(body, "pointercancel", { x: 200, t: 600 }));
      expect(onClose).not.toHaveBeenCalled();
      expect(dialog.style.translate).toBe("");
    });
  });
});
