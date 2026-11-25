// @vitest-environment jsdom
import { renderToStaticMarkup } from "react-dom/server"; // markup read as data, below
import { afterEach, describe, expect, it, vi } from "vitest";
import { useState } from "react";
import { PageFade, startPageTransition } from "./PageFade.js";
import { SegmentedControl } from "./SegmentedControl.js";
import { render, screen, user } from "./render.harness.js";

afterEach(() => {
  vi.unstubAllGlobals();
  Reflect.deleteProperty(document, "startViewTransition");
});

function stubMotion(reduce: boolean): void {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: reduce && query === "(prefers-reduced-motion: reduce)",
  }));
}

describe("PageFade", () => {
  it("with no name leaves its box unnamed, so the fade is the page's root transition", () => {
    render(<PageFade>page</PageFade>);
    expect(screen.getByText("page").hasAttribute("data-page-fade")).toBe(false);
    // The <style> beside the element has no role to find it by, so it is read as data.
    const out = renderToStaticMarkup(<PageFade>x</PageFade>); // markup read as data
    expect(out).not.toContain("view-transition-name");
    expect(out).toContain(
      "@media (prefers-reduced-motion:reduce){::view-transition-group(root),::view-transition-old(root),::view-transition-new(root){animation:none}}",
    );
    expect(out).not.toMatch(/#[0-9a-f]{3}|rgb|hsl/i);
  });

  it("with a name names its box, so a second region fades apart from the page", () => {
    render(<PageFade name="side">x</PageFade>);
    expect(screen.getByText("x").getAttribute("data-page-fade")).toBe("side");
    const css = renderToStaticMarkup(<PageFade name="side">x</PageFade>); // markup read as data
    expect(css).toContain('[data-page-fade="side"]{view-transition-name:side}');
    expect(css).toContain("::view-transition-group(side)");
    expect(css).not.toContain("(root)");
  });

  it("forwards props to the element", () => {
    render(<PageFade id="content">x</PageFade>);
    expect(screen.getByText("x").id).toBe("content");
  });
});

describe("startPageTransition", () => {
  it("runs the update inside a view transition when the browser has one", () => {
    stubMotion(false);
    const start = vi.fn<(run: () => void) => { ready: Promise<void> }>((run) => {
      run();
      return { ready: Promise.resolve() };
    });
    Reflect.set(document, "startViewTransition", start);
    const update = vi.fn<() => void>();
    startPageTransition(update);
    expect(start).toHaveBeenCalledOnce();
    expect(update).toHaveBeenCalledOnce();
  });

  it("swallows the rejection of a skipped transition", async () => {
    stubMotion(false);
    const ready = Promise.reject(new DOMException("skipped", "AbortError"));
    const catchSpy = vi.spyOn(ready, "catch");
    Reflect.set(document, "startViewTransition", () => ({ ready }));
    startPageTransition(vi.fn<() => void>());
    expect(catchSpy).toHaveBeenCalledOnce();
    await ready.catch(() => {});
  });

  it("just runs the update where the browser has no View Transitions", () => {
    stubMotion(false);
    const update = vi.fn<() => void>();
    startPageTransition(update);
    expect(update).toHaveBeenCalledOnce();
  });

  it("skips the transition under prefers-reduced-motion", () => {
    stubMotion(true);
    const start = vi.fn<(run: () => void) => void>();
    Reflect.set(document, "startViewTransition", start);
    const update = vi.fn<() => void>();
    startPageTransition(update);
    expect(start).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledOnce();
  });

  it("runs the update where matchMedia is missing", () => {
    vi.stubGlobal("matchMedia", undefined);
    const update = vi.fn<() => void>();
    startPageTransition(update);
    expect(update).toHaveBeenCalledOnce();
  });
});

/** A page with a nav button outside its view and a SegmentedControl inside it, both changing the view. */
function Site() {
  const [page, setPage] = useState("one");
  return (
    <>
      <button type="button" onClick={() => startPageTransition(() => setPage("two"))}>
        Go to page two
      </button>
      <PageFade name="aside">aside</PageFade>
      <PageFade>
        {`page ${page}`}
        <SegmentedControl
          label="View"
          items={[
            { value: "one", label: "One" },
            { value: "three", label: "Three" },
          ]}
          value={page}
          onChange={(next) => startPageTransition(() => setPage(next))}
        />
      </PageFade>
    </>
  );
}

describe("startPageTransition focus", () => {
  it("moves the focus to the page's view, the unnamed PageFade, after the change", async () => {
    stubMotion(false);
    render(<Site />);
    await user().click(screen.getByRole("button", { name: "Go to page two" }));
    const view = screen.getByText("page two");
    expect(document.activeElement).toBe(view);
    expect(view.getAttribute("tabindex")).toBe("-1");
  });

  it("moves it the same under reduced motion", async () => {
    stubMotion(true);
    render(<Site />);
    await user().click(screen.getByRole("button", { name: "Go to page two" }));
    expect(document.activeElement).toBe(screen.getByText("page two"));
  });

  it("moves it inside a view transition, once the new view is in the page", async () => {
    stubMotion(false);
    Reflect.set(document, "startViewTransition", (run: () => void) => {
      run();
      return { ready: Promise.resolve() };
    });
    render(<Site />);
    await user().click(screen.getByRole("button", { name: "Go to page two" }));
    expect(document.activeElement).toBe(screen.getByText("page two"));
  });

  it("leaves the focus on a radio or tab, which switches the view in place", async () => {
    stubMotion(false);
    render(<Site />);
    const three = screen.getByRole("radio", { name: "Three" });
    await user().click(three);
    expect(screen.getByText("page three")).not.toBeNull();
    expect(document.activeElement).toBe(three);
  });
});
