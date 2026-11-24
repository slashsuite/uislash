// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { popoverOpen, stubPopover, unstubPopover } from "./dom.harness.js";
import { Popover } from "./Popover.js";
import { act, fireEvent, render, screen } from "./render.harness.js";

// jsdom has no popover API: `stubPopover` adds `showPopover`, and jsdom does not run the trigger's
// `popovertarget` or fire `toggle`, so the open, Esc and light dismiss are the browser's
// (popover.spec.ts). Here a fired `toggle` stands in for the browser's, an event no person makes.

/** The browser's `toggle` on a popover, carrying its new state. */
function toggle(panel: Element, newState: "open" | "closed"): void {
  fireEvent(panel, Object.assign(new Event("toggle"), { newState, oldState: "" }));
}

/** An open panel; a closed one is out of the accessibility tree, as `display: none` puts it. */
const panelOf = (name: string) => screen.getByRole("dialog", { name });

describe("Popover", () => {
  beforeEach(stubPopover);
  afterEach(unstubPopover);

  it("renders a collapsed button that targets a closed panel named by the label", () => {
    render(<Popover label="Filters">Only paid orders</Popover>);
    const trigger = screen.getByRole("button", { name: "Filters" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.getAttribute("popovertarget")).toBeTruthy();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("names an icon trigger by the label, which the panel shares", () => {
    render(
      <Popover label="Notifications" icon="bell" defaultOpen>
        Nothing new
      </Popover>,
    );
    const trigger = screen.getByRole("button", { name: "Notifications" });
    expect(trigger.textContent).toBe("");
    expect(panelOf("Notifications").textContent).toBe("Nothing new");
  });

  it("opens on mount with defaultOpen: the panel the trigger targets, as a popover", () => {
    render(
      <Popover label="Filters" defaultOpen>
        Only paid orders
      </Popover>,
    );
    const panel = panelOf("Filters");
    expect(popoverOpen(panel)).toBe(true);
    expect(panel.getAttribute("popover")).toBe("auto");
    expect(panel.textContent).toBe("Only paid orders");
    expect(screen.getByRole("button", { name: "Filters" }).getAttribute("popovertarget")).toBe(
      panel.id,
    );
  });

  it("marks the trigger expanded while the panel is open, and collapsed once it closes", async () => {
    render(
      <Popover label="Filters" defaultOpen>
        Only paid orders
      </Popover>,
    );
    const trigger = screen.getByRole("button", { name: "Filters" });
    const panel = panelOf("Filters");
    await act(async () => toggle(panel, "open"));
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    await act(async () => toggle(panel, "closed"));
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });
});
