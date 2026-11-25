// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { Card } from "./Card.js";
import { render, screen, within } from "./render.harness.js";

describe("Card fill", () => {
  it("is not on a link card", () => {
    const link = (
      // @ts-expect-error A card that is a link does not fill its parent.
      <Card href="/x" title="Shops" fill>
        body
      </Card>
    );
    expect(link.props.href).toBe("/x");
  });

  it.each([true, false])("is still an article named by its title (bar %s)", (bar) => {
    render(
      <Card title="Shops nearby" bar={bar} fill>
        <p>body</p>
      </Card>,
    );
    const article = screen.getByRole("article", { name: "Shops nearby" });
    expect(within(article).getByText("body")).not.toBeNull();
  });
});
