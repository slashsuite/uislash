// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { EmbedFrame } from "./EmbedFrame.js";
import { render, screen, within } from "./render.harness.js";

const map = <iframe title="Shops map" src="about:blank" sandbox="allow-scripts" />;

describe("EmbedFrame", () => {
  it("is a region named by label that holds the embed, with no overlay when ready", () => {
    render(<EmbedFrame label="Map of the shops">{map}</EmbedFrame>);
    const region = screen.getByRole("region", { name: "Map of the shops" });
    expect(within(region).getByTitle("Shops map").tagName).toBe("IFRAME");
    expect(region.hasAttribute("aria-busy")).toBe(false);
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.queryByText("Loading")).toBeNull();
  });

  it("marks the region busy while loading, says so, and keeps the embed mounted", () => {
    render(
      <EmbedFrame label="Map of the shops" status="loading">
        {map}
      </EmbedFrame>,
    );
    const region = screen.getByRole("region", { name: "Map of the shops" });
    expect(region.getAttribute("aria-busy")).toBe("true");
    expect(within(region).getByText("Loading")).toBeInstanceOf(HTMLElement);
    expect(within(region).getByTitle("Shops map")).toBeInstanceOf(HTMLIFrameElement);
  });

  it("takes its own loading word", () => {
    render(
      <EmbedFrame label="Karte" status="loading" loadingLabel="Wird geladen">
        {map}
      </EmbedFrame>,
    );
    expect(screen.getByText("Wird geladen")).toBeInstanceOf(HTMLElement);
  });

  it("announces the built-in error words when it failed", () => {
    render(
      <EmbedFrame label="Map of the shops" status="error">
        {map}
      </EmbedFrame>,
    );
    expect(screen.getByRole("alert").textContent).toBe("Could not load.");
  });

  it("announces its own error words", () => {
    render(
      <EmbedFrame label="Map of the shops" status="error" errorLabel="The map is offline.">
        {map}
      </EmbedFrame>,
    );
    expect(screen.getByRole("alert").textContent).toBe("The map is offline.");
  });
});
