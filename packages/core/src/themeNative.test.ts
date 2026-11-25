import { describe, expect, it } from "vitest";
import { missingFromNative, nativeTheme } from "./themeNative.js";

const css = String.raw`
@custom-variant dark (&:where(.night, .night *));
.night {
  color-scheme: dark;
  background-color: #101010;
  color: #EEEEEE;
  --font-sans: "DM Sans", sans-serif;
  --hc-ink: #eeeeee;
}
.night ::selection,
.night::selection { background-color: #ff8800; color: #000000; }
.night :is(h1, h2, h3, .font-heading) { font-family: var(--font-heading); }
.night .bg-white { background-color: #1a1a1a; }
.night .bg-black\/50 { background-color: rgba( 0, 0, 0, 0.5 ); }
.night .hover\:bg-violet-700:hover { background-color: #7700ff; }
.night .focus-visible\:outline-violet-600:focus-visible { outline-color: #8800ff; }
.night .placeholder\:text-slate-400::placeholder { color: #999999; }
.night .backdrop\:bg-slate-900\/50::backdrop { background-color: rgba(0, 0, 0, 0.6); }
.night .bg-violet-50 .text-slate-500 { color: #cccccc; }
.night .disabled\:opacity-50:disabled:is(.bg-violet-600, .bg-red-600) { opacity: 1; background-color: #333333; }
`;

describe("a theme's native map", () => {
  const { theme, unmapped } = nativeTheme(css, "night");

  it("reads the scope, the scheme and the status bar", () => {
    expect(theme.scope).toBe("night");
    expect(theme.scheme).toBe("dark");
    expect(theme.statusBar).toBe("light-content");
    expect(theme.base).toEqual({
      backgroundColor: "#101010",
      color: "#eeeeee",
      fontFamily: "DM Sans",
    });
    expect(theme.selection).toEqual({ backgroundColor: "#ff8800", color: "#000000" });
  });

  it("keys plain utilities as a component writes them, colours in one form", () => {
    expect(theme.utilities["bg-white"]).toEqual({ backgroundColor: "#1a1a1a" });
    expect(theme.utilities["bg-black/50"]).toEqual({ backgroundColor: "rgba(0, 0, 0, 0.5)" });
  });

  it("puts each state variant in its slot", () => {
    expect(theme.states.pressed["bg-violet-700"]).toEqual({ backgroundColor: "#7700ff" });
    expect(theme.states.focused["outline-violet-600"]).toEqual({ outlineColor: "#8800ff" });
    expect(theme.states.placeholderTextColor["text-slate-400"]).toEqual({
      placeholderTextColor: "#999999",
    });
    expect(theme.states.scrim["bg-slate-900/50"]).toEqual({
      backgroundColor: "rgba(0, 0, 0, 0.6)",
    });
  });

  it("keeps a tint's text and a compound rule apart", () => {
    expect(theme.within["bg-violet-50"]?.["text-slate-500"]).toEqual({ color: "#cccccc" });
    expect(theme.compounds).toEqual([
      {
        utility: "disabled:opacity-50",
        requiresAny: ["bg-violet-600", "bg-red-600"],
        style: { opacity: 1, backgroundColor: "#333333" },
      },
    ]);
  });

  it("carries everything, and names what a palette asks for that it lacks", () => {
    expect(unmapped).toEqual([]);
    expect(missingFromNative(theme, ["bg-white", "hover:bg-violet-700", "text-slate-900"])).toEqual(
      ["text-slate-900"],
    );
  });

  it("names what it cannot carry instead of dropping it", () => {
    const odd = nativeTheme(
      ".x { color: #000; } .x .bg-white { box-shadow: none; } .x > p { color: #f00; }",
      "x",
    );
    expect(odd.unmapped).toEqual(["x.css .x .bg-white { box-shadow }", "x.css: selector .x > p"]);
  });

  it("reads a light theme with dark ink in the status bar", () => {
    expect(nativeTheme(".day { color: #000; }", "day").theme.statusBar).toBe("dark-content");
  });
});
