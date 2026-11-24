import { describe, expect, it } from "vitest";
import { baselineFailure, type MainShas } from "./visual-upload.js";

describe("baselineFailure", () => {
  const ancestors = new Set(["c1", "c2"]);
  const listings: Record<string, MainShas> = {
    text: { kind: "ok", shas: ["m9", "m8"] },
    layout: { kind: "ok", shas: ["m9", "c2"] },
    fresh: { kind: "ok", shas: [] },
    gone: { kind: "missing", line: "uislash has no subproject gone" },
    down: { kind: "failed", line: "GET /builds -> 500 internal: boom" },
    denied: { kind: "failed", line: "GET /builds -> 401 unauthorized" },
  };
  const deps = {
    mainShas: async (subproject: string) => listings[subproject] ?? { kind: "ok", shas: [] },
    isAncestor: async (sha: string) => ancestors.has(sha),
  };
  const failureOf = async (subprojects: string[], with_ = deps) =>
    (await baselineFailure(subprojects, with_)).failure;

  it("passes when a main build is an ancestor of the merge-base", async () => {
    expect(await failureOf(["layout"])).toBeUndefined();
  });

  it("passes the merge-base itself, which is its own ancestor", async () => {
    const own = { ...deps, isAncestor: async (sha: string) => sha === "m9" };
    expect(await failureOf(["text"], own)).toBeUndefined();
  });

  it("fails naming the subproject and the main-mode command when no listed sha is an ancestor", async () => {
    const failure = await failureOf(["layout", "text"]);
    expect(failure).toContain("in text;");
    expect(failure).not.toContain("layout");
    expect(failure).toContain("upload main first");
    expect(failure).toContain("bunx moon run storybook:visual-upload");
    expect(failure).toContain("origin/main");
  });

  it("passes a new subproject with no main build at all, and names it as fresh", async () => {
    expect(await baselineFailure(["fresh", "layout"], deps)).toEqual({
      failure: undefined,
      fresh: ["fresh"],
    });
  });

  it("reports a missing subproject as one to create, and a 500 as PixelSlash not answering", async () => {
    const gone = await failureOf(["gone"]);
    expect(gone).toMatch(/no PixelSlash subproject gone \(pixelslash: uislash has no .*create/);
    expect(gone).toContain("--parent uislash");
    const down = await failureOf(["down"]);
    expect(down).toMatch(/did not answer for down \(pixelslash: .*500 internal: boom.*architect/);
    expect(down).not.toMatch(/no PixelSlash subproject|pixelslash project create/);
  });

  it("names every kind in one call, the server failure first", async () => {
    const failure = await failureOf(["text", "gone", "denied", "down"]);
    expect(failure?.split("\n")).toEqual([
      expect.stringMatching(/^PixelSlash did not answer for down \(pixelslash: .*-> 500/),
      expect.stringMatching(/^PixelSlash refused the token for denied \(/),
      expect.stringMatching(/^the server has no PixelSlash subproject gone \(/),
      expect.stringMatching(/^no main build .* in text; upload main first/),
    ]);
  });
});
