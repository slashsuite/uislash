// @vitest-environment jsdom
import { Script, runInNewContext } from "node:vm";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  appliedColourScheme,
  applyColourScheme,
  colourSchemeScript,
  followColourScheme,
  readColourScheme,
  schemeClass,
  storeColourScheme,
  type ColourScheme,
} from "./colourScheme.js";
import { schemeClasses, storageFromAnotherTab, stubSystemScheme } from "./colourScheme.harness.js";

const KEY = "hackcove:colour-scheme";
const root = document.documentElement;

/** jsdom has no matchMedia: answer the dark query with `dark`, or remove matchMedia when undefined. */
function systemPrefers(dark: boolean | undefined): { flip: (dark: boolean) => void } {
  if (dark === undefined) {
    vi.stubGlobal("matchMedia", undefined);
    return { flip: () => {} };
  }
  return stubSystemScheme(vi.stubGlobal, dark);
}

function resetRoot(): void {
  schemeClasses().remove("dark", "my-light");
  root.style.removeProperty("color-scheme");
}

function reset(): void {
  localStorage.clear();
  resetRoot();
}

/** The window listeners the head script added in this test, taken off again after it. */
const scriptListeners: [string, EventListener][] = [];

/** Run the head script as a browser would, against this document, storage, window events and (stubbed) matchMedia. */
function runScript(): void {
  runInNewContext(colourSchemeScript, {
    document,
    localStorage,
    matchMedia: Reflect.get(globalThis, "matchMedia"),
    addEventListener: (type: string, listener: EventListener) => {
      scriptListeners.push([type, listener]);
      addEventListener(type, listener);
    },
  });
}

beforeEach(reset);
afterEach(() => {
  for (const [type, listener] of scriptListeners.splice(0)) removeEventListener(type, listener);
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  reset();
});

describe("applyColourScheme", () => {
  it("toggles the dark class and sets color-scheme on <html>", () => {
    applyColourScheme("dark");
    expect(schemeClasses().has("dark")).toBe(true);
    expect(root.style.colorScheme).toBe("dark");
    applyColourScheme("light");
    expect(schemeClasses().has("dark")).toBe(false);
    expect(root.style.colorScheme).toBe("light");
  });

  it("applies to the root it is given and leaves <html> alone", () => {
    const scoped = document.createElement("div");
    applyColourScheme("dark", scoped);
    expect(schemeClasses(scoped).has("dark")).toBe(true);
    expect(scoped.style.colorScheme).toBe("dark");
    expect(schemeClasses().has("dark")).toBe(false);
  });
});

const paper = { light: "my-light", dark: "dark" };

describe("schemes with a light class of their own", () => {
  it("schemeClass names the class for each scheme, with the default of dark and none", () => {
    expect(schemeClass("dark")).toBe("dark");
    expect(schemeClass("light")).toBe("");
    expect(schemeClass("light", paper)).toBe("my-light");
    expect(schemeClass("dark", paper)).toBe("dark");
  });

  it("leaves other classes on <html> alone", () => {
    schemeClasses().add("antialiased");
    applyColourScheme("dark", root, paper);
    applyColourScheme("light", root, paper);
    expect(schemeClasses().has("antialiased")).toBe(true);
    schemeClasses().remove("antialiased");
  });

  it("appliedColourScheme reads which one <html> carries", () => {
    expect(appliedColourScheme(root, paper)).toBe("light");
    schemeClasses().add("dark");
    expect(appliedColourScheme(root, paper)).toBe("dark");
    schemeClasses().remove("dark");
    schemeClasses().add("my-light");
    expect(appliedColourScheme(root, paper)).toBe("light");
    schemeClasses().remove("my-light");
  });
});

describe("readColourScheme", () => {
  it("returns the stored choice over the system preference", () => {
    systemPrefers(true);
    localStorage.setItem(KEY, "light");
    expect(readColourScheme()).toBe("light");
  });

  it("falls back to the system preference when nothing is stored", () => {
    systemPrefers(true);
    expect(readColourScheme()).toBe("dark");
    systemPrefers(false);
    expect(readColourScheme()).toBe("light");
  });

  it("ignores a stored value that is not a scheme", () => {
    systemPrefers(true);
    localStorage.setItem(KEY, "sepia");
    expect(readColourScheme()).toBe("dark");
  });

  it("uses the system preference when storage throws", () => {
    systemPrefers(true);
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("denied");
    });
    expect(readColourScheme()).toBe("dark");
  });

  it("uses the fallback when neither storage nor the system answers", () => {
    systemPrefers(undefined);
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("denied");
    });
    expect(readColourScheme()).toBe("light");
    expect(readColourScheme("dark")).toBe("dark");
  });
});

describe("storeColourScheme", () => {
  it("writes the key", () => {
    storeColourScheme("dark");
    expect(localStorage.getItem(KEY)).toBe("dark");
  });

  it("with `system` forgets the choice, so the page follows the system again", () => {
    systemPrefers(true);
    storeColourScheme("light");
    storeColourScheme("system");
    expect(localStorage.getItem(KEY)).toBeNull();
    expect(readColourScheme()).toBe("dark");
  });

  it("swallows a storage error", () => {
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("denied");
    });
    expect(() => storeColourScheme("system")).not.toThrow();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    expect(() => storeColourScheme("dark")).not.toThrow();
  });
});

describe("followColourScheme", () => {
  let stop: (() => void) | undefined;
  afterEach(() => {
    stop?.();
    stop = undefined;
  });

  it("follows the system switching while nothing is stored", () => {
    const system = systemPrefers(false);
    stop = followColourScheme();
    system.flip(true);
    expect(schemeClasses().has("dark")).toBe(true);
    expect(root.style.colorScheme).toBe("dark");
    system.flip(false);
    expect(schemeClasses().has("dark")).toBe(false);
  });

  it("keeps a stored choice when the system switches", () => {
    const system = systemPrefers(false);
    storeColourScheme("light");
    applyColourScheme("light");
    stop = followColourScheme();
    system.flip(true);
    expect(schemeClasses().has("dark")).toBe(false);
  });

  it("takes a choice made or cleared in another tab", () => {
    systemPrefers(false);
    stop = followColourScheme(root, paper);
    storageFromAnotherTab(KEY, "dark");
    expect(appliedColourScheme(root, paper)).toBe("dark");
    storageFromAnotherTab(KEY, null);
    expect(appliedColourScheme(root, paper)).toBe("light");
    expect(schemeClasses().has("my-light")).toBe(true);
  });

  it("ignores another key, and stops when told", () => {
    const system = systemPrefers(false);
    stop = followColourScheme();
    storageFromAnotherTab("other", "dark");
    expect(schemeClasses().has("dark")).toBe(false);
    stop();
    system.flip(true);
    storageFromAnotherTab(KEY, "dark");
    expect(schemeClasses().has("dark")).toBe(false);
  });
});

describe("colourSchemeScript", () => {
  it("is valid JavaScript and a few hundred bytes", () => {
    expect(() => new Script(colourSchemeScript)).not.toThrow();
    expect(colourSchemeScript.length).toBeLessThan(500);
  });

  it("leaves a light page light, with no dark flash, when nothing is stored and the system is light", () => {
    systemPrefers(false);
    runScript();
    expect(schemeClasses().has("dark")).toBe(false);
    expect(root.style.colorScheme).toBe("light");
  });

  // Every stored and system state; `stored` is what is in storage, empty when nothing is.
  const states = [false, true].flatMap((system) =>
    ([[], ["light"], ["dark"]] as ColourScheme[][]).map((stored) => ({ system, stored })),
  );

  it.each(states)(
    "does what readColourScheme + applyColourScheme do (stored $stored, system dark $system)",
    ({ system, stored }) => {
      systemPrefers(system);
      for (const choice of stored) localStorage.setItem(KEY, choice);
      runScript();
      const fromScript = [schemeClasses().has("dark"), root.style.colorScheme];

      resetRoot();
      applyColourScheme(readColourScheme());
      const fromApi = [schemeClasses().has("dark"), root.style.colorScheme];

      expect(fromScript).toEqual(fromApi);
    },
  );

  it("then follows the system switching while nothing is stored, as followColourScheme does", () => {
    const system = systemPrefers(false);
    runScript();
    system.flip(true);
    expect(schemeClasses().has("dark")).toBe(true);
    expect(root.style.colorScheme).toBe("dark");
  });

  it("then takes a choice made or cleared in another tab", () => {
    systemPrefers(true);
    runScript();
    storageFromAnotherTab(KEY, "light");
    expect(schemeClasses().has("dark")).toBe(false);
    storageFromAnotherTab(KEY, null);
    expect(schemeClasses().has("dark")).toBe(true);
  });

  it("uses the system preference when storage throws", () => {
    systemPrefers(true);
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("denied");
    });
    runScript();
    expect(schemeClasses().has("dark")).toBe(true);
  });

  it("touches nothing when neither storage nor the system answers", () => {
    systemPrefers(undefined);
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("denied");
    });
    schemeClasses().add("dark");
    runScript();
    expect(schemeClasses().has("dark")).toBe(true);
    expect(root.style.colorScheme).toBe("");
  });
});
