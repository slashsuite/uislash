import { describe, expect, it } from "vitest";
import { check, hasFollowUp, outOfStep } from "../../../scripts/parityLine";

// The parity line check (scripts/parityLine.ts): a twin changed on one renderer only needs its
// other half in the same pull request, or a "Parity: follow-up <ref>" line.
const twins = ["Button"];
const web = "packages/ui-react/src/Button.tsx";
const native = "packages/ui-react-native/src/components/Button.tsx";

describe("parity line", () => {
  it("passes a pull request that changes both twins", () => {
    expect(check([web, native], twins, "")).toEqual([]);
  });

  it("passes a change to core's tables, which reaches both", () => {
    expect(check(["packages/core/src/button.ts"], twins, "")).toEqual([]);
  });

  it("names a twin changed on the web only, and the file it is missing", () => {
    const [finding] = check([web], twins, "");
    expect(finding).toContain("Button changed on web only");
    expect(finding).toContain(native);
  });

  it("names a twin changed on native only", () => {
    expect(outOfStep([native], twins)).toEqual([["Button", "native"]]);
  });

  it("takes a follow-up line with a ref, and nothing less", () => {
    expect(check([web], twins, "Fixes the gap.\n\nParity: follow-up UI-12\n")).toEqual([]);
    expect(hasFollowUp("Parity: follow-up")).toBe(false);
    expect(hasFollowUp("parity: follow-up UI-12")).toBe(false);
  });

  it("ignores a component with no twin yet", () => {
    expect(check(["packages/ui-react/src/Card.tsx"], twins, "")).toEqual([]);
  });
});
