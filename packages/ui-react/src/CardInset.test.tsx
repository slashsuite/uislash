// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { Card } from "./Card.js";
import { follows, render, screen, within } from "./render.harness.js";

const BOX = ["scrollHeight", "clientHeight"] as const;

afterEach(() => {
  for (const key of BOX) Reflect.deleteProperty(HTMLElement.prototype, key);
  vi.unstubAllGlobals();
});

/** jsdom has no layout: every box's content overflows it, so the scroller takes its tab stop and is a named group. */
function overflow() {
  Object.defineProperty(HTMLElement.prototype, "scrollHeight", { configurable: true, value: 900 });
  Object.defineProperty(HTMLElement.prototype, "clientHeight", { configurable: true, value: 300 });
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

/** The heading, the band and the body, in the order they should read. */
const titleBandBody = (): [HTMLElement, HTMLElement, HTMLElement] => [
  screen.getByRole("heading", { level: 2, name: "Reno" }),
  screen.getByText("band"),
  screen.getByText("body"),
];

describe("Card inset", () => {
  it("reads the band under the title and above the children", () => {
    render(
      <Card title="Reno" inset={<i>band</i>}>
        <p>body</p>
      </Card>,
    );
    const [heading, band, body] = titleBandBody();
    expect(follows(heading, band)).toBeTruthy();
    expect(follows(band, body)).toBeTruthy();
  });

  it("reads the band under the title and above the children of a bar card", () => {
    render(
      <Card bar title="Reno" inset={<i>band</i>}>
        <p>body</p>
      </Card>,
    );
    const [heading, band, body] = titleBandBody();
    expect(follows(heading, band)).toBeTruthy();
    expect(follows(band, body)).toBeTruthy();
  });

  it("reads the band above the body and the body above the footer", () => {
    render(
      <Card footer={<p>foot</p>} inset={<i>band</i>}>
        <p>body</p>
      </Card>,
    );
    const band = screen.getByText("band");
    const body = screen.getByText("body");
    expect(follows(band, body)).toBeTruthy();
    expect(follows(body, screen.getByText("foot"))).toBeTruthy();
  });

  it("reads under the title and above the children on a link card too", () => {
    render(
      <Card href="/x" title="Reno" inset={<i>band</i>}>
        <p>body</p>
      </Card>,
    );
    const [heading, band, body] = titleBandBody();
    expect(follows(heading, band)).toBeTruthy();
    expect(follows(band, body)).toBeTruthy();
  });

  it.each([true, false])("stays put above the scrolling body of a fill card (bar %s)", (bar) => {
    overflow();
    render(
      <Card title="Reno" bar={bar} fill inset={<i>band</i>}>
        <p>body</p>
      </Card>,
    );
    // The box that scrolls holds the body; the band is outside it, with or without a bar.
    const scroller = screen.getByRole("group", { name: "Reno" });
    expect(within(scroller).getByText("body")).not.toBeNull();
    expect(within(scroller).queryByText("band")).toBeNull();
    const [heading, band, body] = titleBandBody();
    expect(follows(heading, band)).toBeTruthy();
    expect(follows(band, body)).toBeTruthy();
  });
});
