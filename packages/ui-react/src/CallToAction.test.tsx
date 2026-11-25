// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { Button } from "./Button.js";
import { CallToAction } from "./CallToAction.js";
import { render, screen } from "./render.harness.js";
import { Section } from "./Section.js";

describe("CallToAction", () => {
  it("is a region named by its title, with its sentence and actions", () => {
    render(
      <CallToAction
        overline="Ready?"
        title="Start your first review today"
        description="Free for open source."
        actions={<Button href="/start">Get started</Button>}
      />,
    );
    const region = screen.getByRole("region", { name: "Start your first review today" });
    expect(region.tagName).toBe("SECTION");
    expect(screen.getByRole("heading", { name: "Start your first review today" }).tagName).toBe(
      "H2",
    );
    expect(screen.getByText("Free for open source.").tagName).toBe("P");
    expect(screen.getByRole("link", { name: "Get started" }).getAttribute("href")).toBe("/start");
  });

  it("takes its heading level from the section that holds it", () => {
    render(
      <Section title="Pricing">
        <CallToAction title="Talk to us" actions={<Button href="/contact">Contact</Button>} />
      </Section>,
    );
    expect(screen.getByRole("heading", { name: "Talk to us" }).tagName).toBe("H3");
  });
});
