// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CopyButton } from "./CopyButton.js";
import { stubAnimate, unstubAnimate, type StubRun } from "./dom.harness.js";
import { act, render, screen, user } from "./render.harness.js";

let runs: StubRun[] = [];
beforeEach(() => {
  runs = stubAnimate();
});
afterEach(() => {
  unstubAnimate();
  vi.restoreAllMocks();
});

/** The runs still going, as `[label text, keyframes]`. */
const holding = () =>
  runs.filter((run) => run.running).map((run) => [run.element.textContent, run.keyframes]);
const HIDDEN = { visibility: ["hidden", "hidden"] };
const VISIBLE = { visibility: ["visible", "visible"] };

/** Lets the clipboard write's promise settle. */
const settle = () => act(async () => {});

describe("CopyButton", () => {
  it("is named by its label and announces nothing before a click", () => {
    render(<CopyButton text="bun add" />);
    expect(screen.getByRole("button", { name: "Copy" })).not.toBeNull();
    expect(screen.getByRole("status").textContent).toBe("");
    expect(screen.getByText("Copied").getAttribute("aria-hidden")).toBe("true");
  });

  it("copies its text on a click, announces copied, and keeps its name", async () => {
    const u = user();
    render(<CopyButton text="bun add" />);
    await u.click(screen.getByRole("button", { name: "Copy" }));
    await settle();
    expect(await navigator.clipboard.readText()).toBe("bun add");
    expect(screen.getByRole("status").textContent).toBe("Copied");
    expect(screen.getByRole("button", { name: "Copy" })).not.toBeNull();
  });

  it("holds the copied label in view for two seconds, then empties the status", async () => {
    const u = user();
    render(<CopyButton text="bun add" />);
    await u.click(screen.getByRole("button", { name: "Copy" }));
    await settle();
    expect(holding()).toEqual([
      ["Copy", HIDDEN],
      ["Copied", VISIBLE],
    ]);
    expect(runs.map((run) => run.duration)).toEqual([2000, 2000]);
    act(() => runs.forEach((run) => run.finish()));
    expect(screen.getByRole("status").textContent).toBe("");
  });

  it("starts the run again on a second copy, and the first run's end does not cut it short", async () => {
    const u = user();
    render(<CopyButton text="x" />);
    const button = screen.getByRole("button", { name: "Copy" });
    await u.click(button);
    await settle();
    const [, first] = runs;
    await u.click(button);
    await settle();
    expect(first?.running).toBe(false);
    expect(holding()).toHaveLength(2);
    expect(screen.getByRole("status").textContent).toBe("Copied");
  });

  it("shows and announces Failed when the clipboard refuses the write", async () => {
    const u = user();
    const writeText = vi.fn<(text: string) => Promise<void>>(() => Promise.reject(new Error("no")));
    vi.spyOn(navigator.clipboard, "writeText").mockImplementation(writeText);
    render(<CopyButton text="bun add" />);
    await u.click(screen.getByRole("button", { name: "Copy" }));
    await settle();
    expect(writeText).toHaveBeenCalledExactlyOnceWith("bun add");
    expect(screen.getByRole("status").textContent).toBe("Failed");
    expect(holding()).toEqual([
      ["Copy", HIDDEN],
      ["Failed", VISIBLE],
    ]);
    expect(screen.getByRole("button", { name: "Copy" })).not.toBeNull();
  });

  it("shows failedLabel when there is no clipboard at all", async () => {
    const u = user();
    render(<CopyButton text="x" failedLabel="Copy it by hand" />);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined });
    await u.click(screen.getByRole("button", { name: "Copy" }));
    await settle();
    expect(screen.getByRole("status").textContent).toBe("Copy it by hand");
  });

  it("renders no <style> element, which a nonce-based CSP would block", () => {
    render(<CopyButton text="x" />);
    expect(document.styleSheets).toHaveLength(0);
  });

  it("takes label and copiedLabel overrides", async () => {
    const u = user();
    render(<CopyButton text="x" label="Copy token" copiedLabel="Done" />);
    await u.click(screen.getByRole("button", { name: "Copy token" }));
    await settle();
    expect(screen.getByRole("status").textContent).toBe("Done");
  });

  it("is type=button, so it does not submit the form it sits in", async () => {
    const u = user();
    const onSubmit = vi.fn<() => void>();
    render(
      <form onSubmit={onSubmit}>
        <CopyButton text="x" />
      </form>,
    );
    const button = screen.getByRole("button", { name: "Copy" });
    expect(button.getAttribute("type")).toBe("button");
    await u.click(button);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("passes disabled through to the button, which then copies nothing", async () => {
    const u = user();
    const writeText = vi.spyOn(navigator.clipboard, "writeText");
    render(<CopyButton text="x" disabled />);
    const button = screen.getByRole("button", { name: "Copy" });
    expect(button.hasAttribute("disabled")).toBe(true);
    await u.click(button);
    expect(writeText).not.toHaveBeenCalled();
  });
});
