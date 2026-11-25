// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { ArticleLayout } from "./ArticleLayout.js";
import { Card } from "./Card.js";
import { render, screen, within } from "./render.harness.js";

describe("ArticleLayout", () => {
  it("draws the title, the byline with a machine date, the body and the related cards", () => {
    render(
      <ArticleLayout
        title="Brewing a pale ale"
        author="Sam Mokoena"
        date="12 November 2026"
        dateTime="2026-11-12"
        readingTime="6 min read"
        related={["Stout", "Lager"].map((t) => (
          <Card key={t} title={t}>
            {t}
          </Card>
        ))}
      >
        <p>The body.</p>
      </ArticleLayout>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Brewing a pale ale" })).toBeTruthy();
    expect(screen.getByText("Sam Mokoena")).toBeTruthy();
    expect(screen.getByText("12 November 2026").getAttribute("datetime")).toBe("2026-11-12");
    expect(screen.getByText("6 min read")).toBeTruthy();
    expect(screen.getByText("The body.")).toBeTruthy();
    const foot = screen.getByRole("region", { name: "More like this" });
    expect(within(within(foot).getByRole("list")).getAllByRole("listitem")).toHaveLength(2);
  });

  it("draws no byline and no foot when none is given", () => {
    render(
      <ArticleLayout title="Opening hours" relatedTitle="Recipes">
        <p>Closed on the 25th.</p>
      </ArticleLayout>,
    );
    expect(screen.queryByRole("list")).toBeNull();
    expect(screen.queryByRole("region", { name: "Recipes" })).toBeNull();
  });
});
