import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { BUTTON_BOX } from "./button.js";
import { parityJson, parityManifest, radiusPx, spacingPx } from "./parity.js";

describe("the parity manifest", () => {
  it("is current: run `bun scripts/parity.ts` after a token change", () => {
    expect(readFileSync(new URL("../parity.json", import.meta.url), "utf8")).toBe(parityJson());
  });

  it("gives Button the heights the web draws (26, 38 and 46px)", () => {
    const button = parityManifest().components["Button"];
    expect(button?.["sm"]?.height).toBe(26);
    expect(button?.["md"]?.height).toBe(38);
    expect(button?.["lg"]?.height).toBe(46);
  });

  it("moves with the table: a different icon gap is a different manifest", () => {
    const before = parityJson();
    const md = BUTTON_BOX.md;
    BUTTON_BOX.md = md.replace("gap-2", "gap-3");
    try {
      expect(parityManifest().components["Button"]?.["md"]?.gap).toBe(12);
      expect(parityJson()).not.toBe(before);
    } finally {
      BUTTON_BOX.md = md;
    }
  });
});

describe("reading a class string", () => {
  it("reads a spacing step in px, halves included", () => {
    expect(spacingPx("gap-1.5 px-2.5 py-1", "px")).toBe(10);
    expect(spacingPx("gap-1.5 px-2.5 py-1", "gap")).toBe(6);
    expect(spacingPx("md:px-4", "px")).toBe(0);
    expect(spacingPx("px-4", "py")).toBe(0);
  });

  it("reads the radius", () => {
    expect(radiusPx("inline-flex rounded-lg border")).toBe(8);
    expect(radiusPx("border")).toBe(0);
  });
});
