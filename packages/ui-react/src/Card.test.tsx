// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { Card } from "./Card.js";
import { Pill } from "./Pill.js";
import { follows, render, screen, within } from "./render.harness.js";

describe("Card badge", () => {
  it("reads the badge after the body", () => {
    render(
      <Card title="Shot" badge={<Pill tone="warn">Flaky</Pill>}>
        <p>body</p>
      </Card>,
    );
    expect(follows(screen.getByText("body"), screen.getByText("Flaky"))).toBeTruthy();
  });

  it("on a link card is read with the card, not in the link's name", () => {
    render(
      <Card href="/shots/1" title="Home page" badge={<Pill tone="warn">Flaky</Pill>}>
        Desktop
      </Card>,
    );
    const link = screen.getByRole("link", { name: "Home page" });
    expect(link.getAttribute("href")).toBe("/shots/1");
    expect(screen.getByText("Flaky")).not.toBeNull();
  });
});

describe("Card title names its article", () => {
  it("makes the card an article named by its level-2 heading", () => {
    render(<Card title="Billing">body</Card>);
    const article = screen.getByRole("article", { name: "Billing" });
    expect(within(article).getByRole("heading", { level: 2, name: "Billing" })).not.toBeNull();
  });

  it("names an article too, with a bar or actions", () => {
    render(
      <Card bar title="Billing" actions={<button type="button">Edit</button>}>
        body
      </Card>,
    );
    const article = screen.getByRole("article", { name: "Billing" });
    expect(within(article).getByRole("button", { name: "Edit" })).not.toBeNull();
  });

  it("names two cards each by its own title", () => {
    render(
      <>
        <Card title="One">a</Card>
        <Card title="Two">b</Card>
      </>,
    );
    expect(within(screen.getByRole("article", { name: "One" })).getByText("a")).not.toBeNull();
    expect(within(screen.getByRole("article", { name: "Two" })).getByText("b")).not.toBeNull();
  });

  it("is an article named by an aria-label with no title, and a plain div with neither", () => {
    render(
      <>
        <Card aria-label="Usage">a</Card>
        <Card>b</Card>
      </>,
    );
    expect(within(screen.getByRole("article", { name: "Usage" })).getByText("a")).not.toBeNull();
    expect(screen.getByText("b").tagName).toBe("DIV");
    expect(screen.getAllByRole("article")).toHaveLength(1);
  });

  it("lets a caller's aria-label win", () => {
    render(
      <Card title="Billing" aria-label="Invoices">
        body
      </Card>,
    );
    expect(screen.getByRole("article", { name: "Invoices" })).not.toBeNull();
    expect(screen.queryByRole("article", { name: "Billing" })).toBeNull();
  });

  it("lets a caller's aria-labelledby win", () => {
    render(
      <>
        <p id="elsewhere">Elsewhere</p>
        <Card title="Billing" aria-labelledby="elsewhere">
          body
        </Card>
      </>,
    );
    expect(screen.getByRole("article", { name: "Elsewhere" })).not.toBeNull();
    expect(screen.queryByRole("article", { name: "Billing" })).toBeNull();
  });

  it("leaves a card with no title unnamed, so it is no article", () => {
    render(<Card>body</Card>);
    expect(screen.queryByRole("article")).toBeNull();
  });

  it("is an article with a footer too", () => {
    render(
      <Card title="Billing" footer={<span>Total</span>}>
        body
      </Card>,
    );
    expect(screen.getByRole("article", { name: "Billing" })).not.toBeNull();
  });
});

describe("Card that is a link: root attributes", () => {
  it("puts id on the card root, not on the link", () => {
    render(
      <Card href="/x" title="Home" id="home" data-testid="probe">
        body
      </Card>,
    );
    // The root of a link card has no role of its own (the link inside it does): found by test id.
    expect(screen.getByTestId("probe").getAttribute("id")).toBe("home");
    expect(screen.getByRole("link", { name: /Home/ }).hasAttribute("id")).toBe(false);
  });

  it("is named by its heading, not the whole card, under the caller's id", () => {
    render(
      <Card href="/x" title="Home" id="home" badge={<Pill tone="warn">Flaky</Pill>}>
        body
      </Card>,
    );
    const link = screen.getByRole("link", { name: "Home" });
    const heading = screen.getByRole("heading", { name: "Home" });
    expect(link.getAttribute("aria-labelledby")).toBe(heading.id);
  });

  it("is named by its heading when the caller gives no id", () => {
    render(
      <Card href="/x" title="Home">
        body
      </Card>,
    );
    expect(screen.getByRole("link", { name: "Home" }).getAttribute("href")).toBe("/x");
  });

  it("with no title is named by the card's text, the only name it has", () => {
    render(
      <Card href="/x">
        <p>Spring sale</p>
      </Card>,
    );
    expect(screen.getByRole("link", { name: "Spring sale" }).getAttribute("href")).toBe("/x");
  });

  it("keeps aria-label and aria-current, which name and mark the link, on the link", () => {
    render(
      <Card href="/x" title="Home" aria-label="Go home" aria-current="page" data-testid="probe">
        body
      </Card>,
    );
    const link = screen.getByRole("link", { name: "Go home" });
    expect(link.getAttribute("aria-current")).toBe("page");
    expect(link.hasAttribute("aria-labelledby")).toBe(false);
    // The card root has no role of its own, so its test id finds it.
    expect(screen.getByTestId("probe").hasAttribute("aria-label")).toBe(false);
  });
});

describe("Card icon", () => {
  it("hides the icon from assistive tech: the title alone names the card", () => {
    render(
      <Card title="Diff" icon="diff">
        body
      </Card>,
    );
    expect(screen.getByRole("article", { name: "Diff" })).not.toBeNull();
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("hides the icon on a link card too: the link is named by the title", () => {
    render(
      <Card href="/x" title="Diff" icon="diff">
        body
      </Card>,
    );
    expect(screen.getByRole("link", { name: "Diff" })).not.toBeNull();
    expect(screen.queryByRole("img")).toBeNull();
  });
});
