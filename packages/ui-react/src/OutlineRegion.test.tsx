// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { OutlineRegion, RegionFrame } from "./OutlineRegion.js";
import { fireEvent, follows, render, screen } from "./render.harness.js";

const within = { width: 200, height: 100 };
const rect = { x: 0, y: 0, width: 10, height: 10 };

describe("OutlineRegion", () => {
  it("shows its label tag", () => {
    render(<OutlineRegion rect={rect} within={within} label="config" />);
    expect(screen.getByText("config")).not.toBeNull();
  });

  it.each(["accent", "positive", "warn", "danger"] as const)(
    "shows its label tag in the %s tone, dashed and active",
    (tone) => {
      render(<OutlineRegion rect={rect} within={within} label={tone} tone={tone} dashed active />);
      expect(screen.getByText(tone)).not.toBeNull();
    },
  );

  it("has no neutral or info tone", () => {
    // @ts-expect-error a pale edge would not stand out on a picture
    const view = <OutlineRegion rect={rect} within={within} tone="info" />;
    expect(view).not.toBeNull();
  });

  it("takes a data attribute, and has no tag without a label", () => {
    render(<OutlineRegion rect={rect} within={within} data-testid="region" />);
    // With no label the region has no accessible name, which is what this checks.
    expect(screen.getByTestId("region").textContent).toBe("");
  });
});

describe("RegionFrame", () => {
  it("draws the picture with its own props, and the regions after it", () => {
    render(
      <RegionFrame src="/shot.png" alt="A shot" data-testid="shot">
        <OutlineRegion rect={rect} within={within} label="config" />
      </RegionFrame>,
    );
    const img = screen.getByRole("img", { name: "A shot" });
    expect(img.getAttribute("src")).toBe("/shot.png");
    expect(img.getAttribute("data-testid")).toBe("shot");
    expect(img.hasAttribute("loading")).toBe(false);
    expect(follows(img, screen.getByText("config"))).toBeTruthy();
  });

  it("keeps the picture's alt and onLoad at a letterboxed aspect and a fixed width", () => {
    const loaded: string[] = [];
    render(
      <RegionFrame
        src="/shot.png"
        alt="A shot"
        aspect="16:9"
        width="md"
        onLoad={(event) => loaded.push(event.currentTarget.alt)}
      >
        <OutlineRegion rect={rect} within={within} label="config" />
      </RegionFrame>,
    );
    const img = screen.getByRole("img", { name: "A shot" });
    // A load is not something jsdom does, so it is fired by hand.
    fireEvent.load(img);
    expect(loaded).toEqual(["A shot"]);
    expect(follows(img, screen.getByText("config"))).toBeTruthy();
  });

  it("is a bone of its shape while loading with no src, named by its alt", () => {
    render(
      <RegionFrame src={undefined} alt="A shot" aspect="16:9" loading>
        <OutlineRegion rect={rect} within={within} label="config" />
      </RegionFrame>,
    );
    const bone = screen.getByRole("img", { name: "A shot" });
    expect(bone.getAttribute("aria-busy")).toBe("true");
    expect(bone.hasAttribute("src")).toBe(false);
    expect(screen.queryByText("config")).toBeNull();
  });

  it("is the empty frame with no src and not loading, still named and taking its id", () => {
    render(<RegionFrame src={undefined} alt="A shot" id="shot" data-testid="frame" />);
    const frame = screen.getByRole("img", { name: "A shot" });
    expect(frame.id).toBe("shot");
    expect(frame.getAttribute("data-testid")).toBe("frame");
  });

  it("draws the picture as usual while loading once it has a src", () => {
    render(<RegionFrame src="/shot.png" alt="A shot" loading />);
    expect(screen.getByRole("img", { name: "A shot" }).getAttribute("src")).toBe("/shot.png");
  });
});
