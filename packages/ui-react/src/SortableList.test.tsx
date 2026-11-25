// @vitest-environment jsdom
import type { ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SortableItem, SortableList, SortableSection } from "./index.js";
import { act, render, screen, within } from "./render.harness.js";
import { dropOperation, moveOf } from "./sortableDrop.js";

const noop = () => undefined;

const queue = () =>
  render(
    <SortableList label="Queue" onReorder={noop}>
      <SortableSection id="urgent" title="Urgent">
        <SortableItem id="a" title="Alpha" />
        <SortableItem id="b" title="Bravo" />
        <SortableItem id="c" title="Charlie" />
      </SortableSection>
      <SortableSection id="high" title="High">
        <SortableItem id="d" title="Delta" />
      </SortableSection>
      <SortableSection id="low" title="Low" />
    </SortableList>,
  );

/** A section, found by the title its name starts with (the heading, count included, follows it). */
const section = (title: string) =>
  within(screen.getByRole("rowgroup", { name: new RegExp(`^${title} `) }));

/** A section's rows below its heading. */
const rowsOf = (title: string) =>
  section(title)
    .getAllByRole("row")
    .filter((row) => within(row).queryByRole("rowheader") === null);

function disabled(button: HTMLElement): boolean {
  expect(button).toBeInstanceOf(HTMLButtonElement);
  return button instanceof HTMLButtonElement && button.disabled;
}

describe("SortableList", () => {
  it("is a grid named by its label", () => {
    queue();
    expect(screen.getByRole("grid", { name: "Queue" })).not.toBeNull();
  });

  it("each heading's count is its number of items, the empty section's placeholder not counted", () => {
    queue();
    const counts = ["Urgent", "High", "Low"].map(
      (title) => within(section(title).getByRole("rowheader")).getByText(/^\d+$/).textContent,
    );
    expect(counts).toEqual(["3", "1", "0"]);
  });

  it("ends a section with items with an empty, disabled tail row", () => {
    queue();
    const rows = rowsOf("High");
    expect(rows.map((row) => row.getAttribute("aria-label"))).toEqual(["Delta", "End of High"]);
    const tail = section("High").getByRole("row", { name: "End of High" });
    expect(tail.textContent).toBe("");
    expect(tail.getAttribute("aria-disabled")).toBe("true");
  });

  it("keeps a section and an item with the same id apart", () => {
    render(
      <SortableList label="Queue" onReorder={noop}>
        <SortableSection id="1" title="One">
          <SortableItem id="1" title="Ticket one" />
        </SortableSection>
      </SortableList>,
    );
    expect(section("One").getByRole("row", { name: "Ticket one" }).textContent).toBe("Ticket one");
  });

  it("names each handle Reorder <title>", () => {
    queue();
    const names = screen
      .getAllByRole("button", { name: /^Reorder / })
      .map((button) => button.getAttribute("aria-label"));
    expect(names).toEqual(["Reorder Alpha", "Reorder Bravo", "Reorder Charlie", "Reorder Delta"]);
  });

  it("shows the empty section a Drop here row that is disabled and never a tab stop", () => {
    queue();
    expect(rowsOf("Low")).toHaveLength(1);
    const placeholder = section("Low").getByRole("row", { name: "Drop here" });
    expect(placeholder.textContent).toBe("Drop here");
    expect(placeholder.getAttribute("aria-disabled")).toBe("true");
    expect(placeholder.hasAttribute("tabindex")).toBe(false);
    expect(disabled(within(placeholder).getByRole("button"))).toBe(true);
  });

  it("refuses a drop on a row's centre or on the list, and takes one before or after a row", () => {
    expect(dropOperation({ type: "item", key: "a", dropPosition: "on" })).toBe("cancel");
    expect(dropOperation({ type: "root" })).toBe("cancel");
    expect(dropOperation({ type: "item", key: "a", dropPosition: "before" })).toBe("move");
    expect(dropOperation({ type: "item", key: "a", dropPosition: "after" })).toBe("move");
  });

  it("reports the section and the neighbour of a move, the end of a section as after its last item, and no target for a drop into an empty section", () => {
    const places = new Map([
      ["a", { section: "urgent", title: "Alpha" }],
      ["d", { section: "high", title: "Delta" }],
      ["end-high", { section: "high", title: "", tail: ["d"] }],
      ["empty", { section: "low", title: "", tail: [] }],
    ]);
    expect(moveOf(places, ["a"], { type: "item", key: "d", dropPosition: "before" })).toEqual({
      id: "a",
      section: "high",
      target: { id: "d", position: "before" },
    });
    expect(moveOf(places, ["a"], { type: "item", key: "empty", dropPosition: "after" })).toEqual({
      id: "a",
      section: "low",
    });
    expect(
      moveOf(places, ["a"], { type: "item", key: "end-high", dropPosition: "before" }),
    ).toEqual({ id: "a", section: "high", target: { id: "d", position: "after" } });
    expect(
      moveOf(places, ["d"], { type: "item", key: "end-high", dropPosition: "before" }),
    ).toEqual({ id: "d", section: "high" });
    expect(moveOf(places, ["a"], { type: "item", key: "d", dropPosition: "on" })).toBeNull();
    expect(moveOf(places, ["a"], { type: "item", key: "a", dropPosition: "after" })).toBeNull();
  });

  it("a list with no sections reports moves with no section", () => {
    const places = new Map([["b", { title: "Bravo" }]]);
    expect(moveOf(places, ["a"], { type: "item", key: "b", dropPosition: "after" })).toEqual({
      id: "a",
      target: { id: "b", position: "after" },
    });
  });
});

describe("SortableList words", () => {
  it("renames the handle's word and the tail row's word", () => {
    render(
      <SortableList label="File" onReorder={noop}>
        <SortableSection id="todo" title="À faire" endLabel="Fin de">
          <SortableItem id="a" title="Alpha" reorderLabel="Déplacer" />
        </SortableSection>
      </SortableList>,
    );
    expect(screen.getByRole("button", { name: "Déplacer Alpha" })).not.toBeNull();
    expect(screen.getByRole("row", { name: "Fin de À faire" })).not.toBeNull();
    expect(screen.queryByRole("row", { name: "End of À faire" })).toBeNull();
  });
});

/** Press on `target`, then start a native drag from the row, as a browser does. */
function dragFrom(row: HTMLElement, target: Element): Event {
  target.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
  const start = new Event("dragstart", { bubbles: true, cancelable: true });
  // jsdom has no DataTransfer: enough of one for react-aria to fill.
  Object.defineProperty(start, "dataTransfer", {
    value: {
      items: { add: noop },
      clearData: noop,
      setData: noop,
      setDragImage: noop,
      effectAllowed: "all",
    },
  });
  row.dispatchEvent(start);
  return start;
}

describe("a pointer drag", () => {
  it("starts from the grip handle only; a press anywhere else on the row starts none", () => {
    queue();
    const row = screen.getByRole("row", { name: "Alpha" });
    expect(dragFrom(row, within(row).getByText("Alpha")).defaultPrevented).toBe(true);
    const grip = within(row).getByRole("button", { name: "Reorder Alpha" });
    expect(dragFrom(row, grip).defaultPrevented).toBe(false);
  });
});

type Slide = { row: string | null; from: unknown };

/** jsdom has no layout: place each row by its order in the list, and record each slide. */
function layout(reduced: boolean): Slide[] {
  const slides: Slide[] = [];
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    const top = Math.max(screen.queryAllByRole("row").indexOf(this), 0) * 40;
    return DOMRect.fromRect({ x: 0, y: top, width: 0, height: 40 });
  });
  Object.defineProperty(HTMLElement.prototype, "animate", {
    configurable: true,
    value(this: HTMLElement, frames: Keyframe[]) {
      slides.push({ row: this.getAttribute("aria-label"), from: frames[0]?.translate });
    },
  });
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: reduced && query.includes("reduce"),
  }));
  return slides;
}

const ordered = (order: string[]) => (
  <SortableList label="Queue" onReorder={noop}>
    {order.map((id) => (
      <SortableItem key={id} id={id} title={id} />
    ))}
  </SortableList>
);

/** Render the new order and let the list's observer see react-aria's rows land. */
async function reorder(rerender: (ui: ReactElement) => void, order: string[]) {
  await act(async () => rerender(ordered(order)));
}

describe("a move", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    Reflect.deleteProperty(HTMLElement.prototype, "animate");
  });

  it("slides every row that changed place from where it was; the first render slides nothing", async () => {
    const slides = layout(false);
    const { rerender } = render(ordered(["a", "b", "c"]));
    await act(async () => undefined);
    expect(slides).toEqual([]);
    await reorder(rerender, ["b", "a", "c"]);
    expect(slides).toEqual([
      { row: "b", from: "0 40px" },
      { row: "a", from: "0 -40px" },
    ]);
  });

  it("slides nothing under prefers-reduced-motion", async () => {
    const slides = layout(true);
    const { rerender } = render(ordered(["a", "b", "c"]));
    await reorder(rerender, ["b", "a", "c"]);
    expect(slides).toEqual([]);
  });
});
