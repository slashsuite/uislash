// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BottomSheet } from "./BottomSheet.js";
import { Card } from "./Card.js";
import { CodeExample } from "./CodeExample.js";
import { stubDialog } from "./dom.harness.js";
import { Drawer } from "./Drawer.js";
import { render, screen } from "./render.harness.js";

beforeEach(stubDialog);

afterEach(() => {
  for (const key of ["scrollWidth", "clientWidth", "scrollHeight", "clientHeight"]) {
    Reflect.deleteProperty(HTMLElement.prototype, key);
  }
  vi.unstubAllGlobals();
});

const size = (value: number) => ({ configurable: true, value });

/** jsdom has no layout and no ResizeObserver: every box's content overflows it both ways, or none does. */
function overflow(over: boolean) {
  Object.defineProperty(HTMLElement.prototype, "scrollWidth", size(over ? 900 : 300));
  Object.defineProperty(HTMLElement.prototype, "scrollHeight", size(over ? 900 : 300));
  Object.defineProperty(HTMLElement.prototype, "clientWidth", size(300));
  Object.defineProperty(HTMLElement.prototype, "clientHeight", size(300));
  // As in a browser, an observer reports once as soon as it starts observing.
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(private readonly notify: () => void) {}
      observe() {
        this.notify();
      }
      disconnect() {}
    },
  );
}

const TEXT = <p>A long body of text with nothing in it the keyboard can reach.</p>;

const cases = [
  {
    name: "a Drawer's body, named by the drawer's title",
    ui: (
      <Drawer title="Order" onClose={() => {}}>
        {TEXT}
      </Drawer>
    ),
    group: "Order",
  },
  {
    name: "a BottomSheet's body, named by its label",
    ui: (
      <BottomSheet label="Shops" snaps={[0.25, 0.5]} snap={2} onSnapChange={() => {}}>
        {TEXT}
      </BottomSheet>
    ),
    group: "Shops",
  },
  {
    name: "a filled Card's body, named by its title",
    ui: (
      <Card title="Activity" fill>
        {TEXT}
      </Card>
    ),
    group: "Activity",
  },
  {
    name: "a filled Card's body under a bar, named by its title",
    ui: (
      <Card title="Activity" bar fill>
        {TEXT}
      </Card>
    ),
    group: "Activity",
  },
  {
    name: "a CodeExample's preview, named Preview",
    ui: <CodeExample code="<Wide />">{TEXT}</CodeExample>,
    group: "Preview",
  },
];

describe("a scrolling body", () => {
  it.each(cases)(
    "$name takes a tab stop while it overflows with nothing to focus",
    ({ ui, group }) => {
      overflow(true);
      render(ui);
      const stop = screen.getByRole("group", { name: group });
      expect(stop.getAttribute("tabindex")).toBe("0");
      expect(stop.textContent).toContain("nothing in it the keyboard can reach");
    },
  );

  it.each(cases)("$name takes none while it fits", ({ ui, group }) => {
    overflow(false);
    render(ui);
    expect(screen.queryByRole("group", { name: group })).toBeNull();
  });

  it("takes none while it holds something the keyboard reaches", () => {
    overflow(true);
    render(
      <Drawer title="Order" onClose={() => {}}>
        <a href="/orders/1">Order 1</a>
      </Drawer>,
    );
    expect(screen.queryByRole("group", { name: "Order" })).toBeNull();
  });
});
