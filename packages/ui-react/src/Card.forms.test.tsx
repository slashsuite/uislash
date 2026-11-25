// @vitest-environment jsdom
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import { Card } from "./Card.js";
import { CardGrid, CardGridRow } from "./index.js";
import { Pill } from "./Pill.js";
import { render, screen, user, within } from "./render.harness.js";

describe("Card hue", () => {
  it("renders its title as its heading and its children", () => {
    render(
      <Card hue="sky" title="PixelSlash">
        <p>Visual checks</p>
      </Card>,
    );
    const article = screen.getByRole("article", { name: "PixelSlash" });
    expect(within(article).getByRole("heading", { name: "PixelSlash" })).not.toBeNull();
    expect(within(article).getByText("Visual checks")).not.toBeNull();
  });

  it("can be a link card, one link named by its title", () => {
    render(
      <Card hue="orange" href="/tools/ob" title="ob">
        <p>Tasks and secrets</p>
      </Card>,
    );
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link", { name: "ob" }).getAttribute("href")).toBe("/tools/ob");
  });

  it("is a type error with tone", () => {
    // @ts-expect-error hue is a peer card's paint, tone a status: a card takes one
    const both: ComponentProps<typeof Card> = { hue: "green", tone: "info", children: "x" };
    expect(both).toMatchObject({ children: "x" });
  });
});

describe("Card onPress", () => {
  it("makes the whole card one button named by its title", async () => {
    const onPress = vi.fn();
    render(
      <Card onPress={onPress} title="Cape Town store" badge={<Pill tone="info">Open</Pill>}>
        <p>Long Street</p>
      </Card>,
    );
    const button = screen.getByRole("button", { name: "Cape Town store" });
    await user().click(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("keeps aria-pressed on the button and id on the card", () => {
    render(
      <Card onPress={() => undefined} title="Plan" id="plan" aria-pressed data-testid="probe">
        body
      </Card>,
    );
    const button = screen.getByRole("button", { name: "Plan", pressed: true });
    expect(button.hasAttribute("id")).toBe(false);
    // The card root has no role of its own, so its test id finds it.
    expect(screen.getByTestId("probe").getAttribute("id")).toBe("plan");
  });

  it("keeps a button in the body its own button", async () => {
    const onPress = vi.fn();
    const onEdit = vi.fn();
    render(
      <Card onPress={onPress} title="Plan">
        <button type="button" onClick={onEdit}>
          Edit
        </button>
      </Card>,
    );
    await user().click(screen.getByRole("button", { name: "Edit" }));
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("is a type error with href", () => {
    // @ts-expect-error a card is one link or one button, not both
    const both: ComponentProps<typeof Card> = {
      href: "/x",
      onPress: () => undefined,
      children: "x",
    };
    expect(both).toMatchObject({ children: "x" });
  });
});

describe("Card more", () => {
  it("draws the cue on a link card and keeps the link named by its title", () => {
    render(
      <Card href="/posts/1" title="Shipping subgrid" more>
        <p>Cards that line up.</p>
      </Card>,
    );
    expect(screen.getByText("Read more")).not.toBeNull();
    expect(screen.getByRole("link", { name: "Shipping subgrid" })).not.toBeNull();
  });

  it("takes its words as a prop", () => {
    render(
      <Card href="/posts/1" title="Subgrid" more moreLabel="Lees meer">
        body
      </Card>,
    );
    expect(screen.getByText("Lees meer")).not.toBeNull();
  });

  it("is a type error on a panel", () => {
    // @ts-expect-error the cue says a card goes somewhere, so it needs href
    const panel: ComponentProps<typeof Card> = { more: true, children: "x" };
    expect(panel).toMatchObject({ children: "x" });
  });
});

describe("CardGrid", () => {
  it("spans a row in a list too, as one list item", () => {
    render(
      <CardGrid as="ul">
        <CardGridRow>
          <p>Ales</p>
        </CardGridRow>
        <Card title="Pale">a</Card>
        <Card title="Stout">b</Card>
      </CardGrid>,
    );
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(items.map((item) => within(item).queryByText("Ales") !== null)).toEqual([
      true,
      false,
      false,
    ]);
  });
});
