// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { observeItems } from "./scrollEdges.js";

/** A ResizeObserver stand-in that records each `observe` call. */
function recorder(): { observer: ResizeObserver; calls: Element[] } {
  const calls: Element[] = [];
  const observer: ResizeObserver = {
    observe: (target) => {
      calls.push(target);
    },
    unobserve: () => undefined,
    disconnect: () => undefined,
  };
  return { observer, calls };
}

function row(): { box: HTMLElement; nav: HTMLElement; panel: HTMLElement } {
  const box = document.createElement("div");
  box.innerHTML =
    '<span id="brand"></span><div id="panel" style="display: none"><div style="display: contents"><nav id="nav"></nav></div></div>';
  document.body.replaceChildren(box);
  const nav = box.querySelector<HTMLElement>("#nav");
  const panel = box.querySelector<HTMLElement>("#panel");
  if (!nav || !panel) throw new Error("fixture");
  return { box, nav, panel };
}

describe("observeItems", () => {
  it("skips a hidden item and looks through one that draws no box", () => {
    const { box, nav, panel } = row();
    const { observer, calls } = recorder();
    observeItems(observer, box);
    expect(calls.map((el) => el.id)).toEqual(["brand"]);
    panel.style.display = "contents";
    observeItems(observer, box);
    expect(calls.at(-1)).toBe(nav);
  });

  it("observes each item once, however often it is called", () => {
    const { box, panel } = row();
    panel.style.display = "contents";
    const { observer, calls } = recorder();
    observeItems(observer, box);
    observeItems(observer, box);
    expect(calls.map((el) => el.id)).toEqual(["brand", "nav"]);
  });
});
