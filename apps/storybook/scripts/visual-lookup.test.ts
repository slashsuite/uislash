import { describe, expect, it } from "vitest";
import {
  buildsResult,
  failedLine,
  lookupFailure,
  missingSubproject,
  subprojectIds,
} from "./visual-lookup.js";

describe("failedLine", () => {
  it("names the request, the status and the server's error string", () => {
    expect(failedLine("/api/v1/projects", 500, JSON.stringify({ error: "boom" }))).toBe(
      "GET /api/v1/projects -> 500 boom",
    );
  });

  it("reads an error object's message", () => {
    const body = JSON.stringify({ error: { code: "unauthorized", message: "bad token" } });
    expect(failedLine("/x", 401, body)).toBe("GET /x -> 401 bad token");
  });

  it("keeps a body that is not JSON as sent, and drops an empty one", () => {
    expect(failedLine("/x", 502, "Bad Gateway\n")).toBe("GET /x -> 502 Bad Gateway");
    expect(failedLine("/x", 503, "")).toBe("GET /x -> 503");
  });
});

describe("buildsResult", () => {
  it("parses the listing on 200", () => {
    expect(buildsResult("/b", 200, JSON.stringify({ builds: [] }))).toEqual({
      kind: "ok",
      listing: { builds: [] },
    });
  });

  it("reads any other status as a failure, not a missing subproject", () => {
    expect(buildsResult("/b", 500, JSON.stringify({ error: "boom" }))).toEqual({
      kind: "failed",
      line: "GET /b -> 500 boom",
    });
  });
});

describe("subprojectIds", () => {
  const listing = {
    projects: [
      { id: "p1", name: "uislash", parent_project_id: null },
      { id: "s1", name: "forms", parent_project_id: "p1" },
      { id: "s2", name: "text", parent_project_id: "p1" },
      { id: "o1", name: "forms", parent_project_id: "other" },
      { id: "x1", name: "uislash", parent_project_id: "other" },
    ],
  };

  it("maps the top-level project's subprojects by name, and no one else's", () => {
    expect(subprojectIds(listing, "uislash")).toEqual(
      new Map([
        ["forms", "s1"],
        ["text", "s2"],
      ]),
    );
  });

  it("is undefined when the token sees no top-level project of that name", () => {
    expect(subprojectIds(listing, "gone")).toBeUndefined();
    expect(subprojectIds({}, "uislash")).toBeUndefined();
  });
});

describe("missingSubproject", () => {
  it("says which is missing: the project, or the subproject under it", () => {
    expect(missingSubproject(undefined, "forms")).toEqual({
      kind: "missing",
      line: "the token sees no project uislash",
    });
    expect(missingSubproject(new Map(), "forms")).toEqual({
      kind: "missing",
      line: "uislash has no subproject forms",
    });
  });
});

describe("lookupFailure", () => {
  it("reports a 401 as a token that needs reissuing, not as PixelSlash not answering", () => {
    const failure = lookupFailure([
      {
        subproject: "denied",
        result: { kind: "failed", line: "GET /api/v1/projects -> 401 unauthorized" },
      },
    ]);
    expect(failure).toContain("PixelSlash refused the token for denied");
    expect(failure).toContain("-> 401");
    expect(failure).toContain("needs reissuing");
    expect(failure).not.toContain("did not answer");
    expect(failure).not.toContain("pixelslash project create");
  });

  it("names a missing subproject with the command that creates it under uislash", () => {
    const failure = lookupFailure([
      { subproject: "forms", result: { kind: "missing", line: "uislash has no subproject forms" } },
    ]);
    expect(failure).toContain("no PixelSlash subproject forms");
    expect(failure).toContain("pixelslash project create <name> --parent uislash");
  });

  it("is undefined when every lookup gave a listing", () => {
    expect(lookupFailure([])).toBeUndefined();
  });
});
