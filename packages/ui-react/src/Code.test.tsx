// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Code } from "./Code.js";
import { stubPopover, unstubPopover } from "./dom.harness.js";
import { render, screen, user } from "./render.harness.js";
import { everyRunCut } from "./truncated.harness.js";

describe("Code", () => {
  it("is an inline code element holding its text", () => {
    render(<Code>bun install</Code>);
    expect(screen.getByRole("code").textContent).toBe("bun install");
  });

  it("passes an id through", () => {
    render(<Code id="command">x</Code>);
    expect(screen.getByRole("code").id).toBe("command");
  });

  it("has no title without lines", () => {
    render(<Code breakWords>https://example.com/a/very/long/path</Code>);
    expect(screen.getByRole("code").title).toBe("");
  });
});

const hash = "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08";

describe("Code, cut to one line", () => {
  everyRunCut();

  // jsdom has no anchor positioning, so the tooltip falls back to the native title, which focus
  // never shows: the run is no focus stop there.
  it("shows its whole text in the title, and is no focus stop", async () => {
    render(<Code lines={1}>sha256:{hash}</Code>);
    expect(screen.getByRole("code").title).toBe(`sha256:${hash}`);
    await user().tab();
    expect(document.activeElement).toBe(document.body);
  });
});

describe("Code, cut to one line, with the library's tooltip", () => {
  everyRunCut();
  beforeEach(stubPopover);
  afterEach(unstubPopover);

  it("is a focus stop, and keeps the caller's description", async () => {
    render(
      <>
        <Code lines={1} aria-describedby="note">
          {hash}
        </Code>
        <p id="note">The build's digest</p>
      </>,
    );
    await user().tab();
    expect(document.activeElement).toBe(screen.getByRole("code"));
    expect(screen.getByRole("code").getAttribute("aria-describedby")).toBe("note");
  });
});
