import { afterEach, beforeEach, vi } from "vitest";

/**
 * jsdom has no layout and no ResizeObserver. In a `describe` that calls this, every element's text
 * is wider than its box (200 against 100), and a ResizeObserver reports once as it starts watching,
 * so a one-line run reads as cut. Outside it, runs read as fitting.
 */
export function everyRunCut(): void {
  beforeEach(() => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(private readonly report: () => void) {}
        observe(): void {
          this.report();
        }
        disconnect(): void {}
      },
    );
    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(200);
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(100);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });
}
