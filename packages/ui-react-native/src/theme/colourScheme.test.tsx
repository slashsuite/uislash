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

  it("keeps a choice made before the stored one arrives", async () => {
    const waiting: Array<(choice: "light") => void> = [];
    const storage = {
      get: () => new Promise<"light">((settle) => waiting.push(settle)),
      set: () => undefined,
    };
    const { result } = renderHook(() => useColourScheme(storage));
    act(() => result.current.setChoice("dark"));
    await act(async () => {
      for (const settle of waiting) settle("light");
      await Promise.resolve();
    });
    expect(result.current.choice).toBe("dark");
  });
});
