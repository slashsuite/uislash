// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { Audio } from "./Audio.js";
import { render, screen } from "./render.harness.js";

/** An audio player has no role; it is found by the name `label` gives it. */
const audio = () => screen.getByLabelText<HTMLAudioElement>("Voice note from Anna");

describe("Audio", () => {
  it("is a player named by label, with the browser's controls, loading metadata only", () => {
    render(<Audio src="/note.ogg" label="Voice note from Anna" />);
    expect(audio().tagName).toBe("AUDIO");
    expect(audio().controls).toBe(true);
    expect(audio().preload).toBe("metadata");
    expect(audio().getAttribute("src")).toBe("/note.ogg");
  });

  it("asks the browser to load it lazily", () => {
    render(<Audio src="/note.ogg" label="Voice note from Anna" />);
    expect(audio().getAttribute("loading")).toBe("lazy");
  });

  it("keeps label as its name over an aria-label passed through", () => {
    render(<Audio src="/note.ogg" label="Voice note from Anna" aria-label="Other" />);
    expect(screen.queryByLabelText("Other")).toBeNull();
    expect(audio()).toBeInstanceOf(HTMLAudioElement);
  });

  it("holds the fallback text for a browser that cannot play it", () => {
    render(
      <Audio src="/note.ogg" label="Voice note from Anna">
        Your browser cannot play audio.
      </Audio>,
    );
    expect(screen.getByText("Your browser cannot play audio.")).toBeInstanceOf(HTMLElement);
  });
});
