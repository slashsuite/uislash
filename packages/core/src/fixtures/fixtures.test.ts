import { describe, expect, it } from "vitest";
import { buttonFixtures } from "./button.js";
import { storyId } from "./types.js";

describe("story ids", () => {
  it("are Storybook's", () => {
    expect(storyId("Actions/Button", "Variants")).toBe("actions-button--variants");
    expect(storyId("Actions/Button", "DoDisabledReason")).toBe(
      "actions-button--do-disabled-reason",
    );
    expect(storyId("Layout/App shell", "SizesCompact")).toBe("layout-app-shell--sizes-compact");
  });
});

describe("Button's fixtures", () => {
  it("key each fixture by its story", () => {
    for (const [key, fixture] of Object.entries(buttonFixtures)) {
      expect(fixture.story).toBe(key);
      expect(fixture.title).toBe("Actions/Button");
      expect(fixture.items.length).toBeGreaterThan(0);
    }
  });
});
