import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { device } from "../../test/react-native.js";
import { memoryStorage, schemeFor, useColourScheme } from "./colourScheme.js";

describe("colour scheme", () => {
  it("follows the system until the reader chooses", () => {
    expect(schemeFor("system", "dark")).toBe("dark");
    expect(schemeFor("system", null)).toBe("light");
    expect(schemeFor("light", "dark")).toBe("light");
  });

  it("reads a stored choice and keeps a new one in the storage", async () => {
    device.scheme = "light";
    const storage = memoryStorage("dark");
    const { result } = renderHook(() => useColourScheme(storage));
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.scheme).toBe("dark");
    act(() => result.current.setChoice("system"));
    expect(result.current.scheme).toBe("light");
    expect(storage.get()).toBe("system");
  });
});
