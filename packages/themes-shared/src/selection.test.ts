import { describe, expect, it } from "vitest";
import { selectionFailures } from "./selection.js";

const theme = (rule: string): string => `.paper { color: #111111; }\n${rule}`;

describe("selectionFailures", () => {
  it("passes a scoped rule whose text clears AA on its background", () => {
    expect(
      selectionFailures(
        theme(
          ".paper ::selection,\n.paper::selection {\n  background-color: #1e3a8a;\n  color: #ffffff;\n}",
        ),
      ),
    ).toEqual([]);
  });

  it("names a theme with no selection rule", () => {
    expect(selectionFailures(theme(".paper .bg-white { background-color: #ffffff; }"))).toEqual([
      '::selection: no ".paper ::selection, .paper::selection" rule',
    ]);
  });

  it("names the ratio of selected text under AA", () => {
    expect(
      selectionFailures(
        theme(
          ".paper ::selection, .paper::selection { background-color: #cccccc; color: #ffffff; }",
        ),
      ),
    ).toEqual(["::selection: text #ffffff on #cccccc is 1.60:1, needs 4.5:1"]);
  });

  it("refuses a translucent highlight, which cannot be measured on its own", () => {
    expect(
      selectionFailures(
        theme(
          ".paper ::selection, .paper::selection { background-color: rgba(0, 0, 0, 0.2); color: #111111; }",
        ),
      ),
    ).toEqual(["::selection: the background and the text must be opaque colours"]);
  });
});
