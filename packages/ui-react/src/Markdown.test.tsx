// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { Markdown } from "./Markdown.js";
import { render, screen, within } from "./render.harness.js";
import { Section } from "./Section.js";

describe("Markdown", () => {
  it("renders headings, bullets and paragraphs", () => {
    render(<Markdown md={"## Done\n- one\n* two\n\n### Next\nplain"} />);
    expect(screen.getByRole("heading", { level: 2, name: "Done" })).not.toBeNull();
    expect(screen.getByRole("heading", { level: 3, name: "Next" })).not.toBeNull();
    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual(["one", "two"]);
    expect(screen.getByRole("paragraph").textContent).toBe("plain");
  });

  it("groups consecutive bullets into one list and starts a new one after a break", () => {
    render(<Markdown md={"- a\n- b\n\n- c"} />);
    const lists = screen.getAllByRole("list");
    expect(lists.map((list) => within(list).getAllByRole("listitem").length)).toEqual([2, 1]);
  });

  it("renders **bold** as strong", () => {
    render(<Markdown md="- **HC-42** shipped" />);
    expect(screen.getByText("HC-42").tagName).toBe("STRONG");
  });

  it("never injects HTML from the input", () => {
    const source = "<script>alert(1)</script>";
    render(<Markdown md={source} />);
    expect(screen.getByRole("paragraph").textContent).toBe(source);
  });

  it("puts its headings one and two levels below the heading that holds it", () => {
    render(
      <Section title="Notes">
        <Markdown md={"## Done\n### Next"} />
      </Section>,
    );
    expect(screen.getByRole("heading", { level: 3, name: "Done" })).not.toBeNull();
    expect(screen.getByRole("heading", { level: 4, name: "Next" })).not.toBeNull();
  });

  it("never goes past h6", () => {
    render(
      <Section title="Notes" level={6}>
        <Markdown md={"## Done\n### Next"} />
      </Section>,
    );
    expect(screen.getByRole("heading", { level: 6, name: "Done" })).not.toBeNull();
    expect(screen.getByRole("heading", { level: 6, name: "Next" })).not.toBeNull();
  });

  it("renders a link as a link, and keeps only the words of an unsafe one", () => {
    render(
      <Markdown
        md={"See [the data sheet](https://example.com/sheet.pdf) and [this](javascript:alert`1`)."}
      />,
    );
    expect(screen.getByRole("link", { name: "the data sheet" }).getAttribute("href")).toBe(
      "https://example.com/sheet.pdf",
    );
    expect(screen.queryByRole("link", { name: "this" })).toBeNull();
    expect(screen.getByRole("paragraph").textContent).toBe("See the data sheet and this.");
  });

  it("renders a picture on its own line as an image named by its alt", () => {
    render(<Markdown md={"Mash in.\n![The mash tun at 66 degrees](/mash.jpg)"} />);
    expect(screen.getByRole("img", { name: "The mash tun at 66 degrees" })).toBeInstanceOf(
      HTMLElement,
    );
  });

  it("renders a numbered list as an ordered list, from the first item's number", () => {
    render(<Markdown md={"3. Boil\n4. Chill\n- dry hop"} />);
    const lists = screen.getAllByRole("list");
    expect(lists.map((list) => list.tagName)).toEqual(["OL", "UL"]);
    expect(lists[0]).toHaveProperty("start", 3);
    expect(lists.map((list) => list.textContent)).toEqual(["BoilChill", "dry hop"]);
  });

  it("renders a table named by the heading above it, with its head and body rows", () => {
    render(
      <Markdown
        md={"## Grain bill\n| Malt | kg |\n| --- | --: |\n| Pale | 4.5 |\n| Crystal | 0.3 |"}
      />,
    );
    const table = screen.getByRole("table", { name: "Grain bill" });
    expect(
      within(table)
        .getAllByRole("columnheader")
        .map((th) => th.textContent),
    ).toEqual(["Malt", "kg"]);
    expect(within(table).getAllByRole("row")).toHaveLength(3);
    expect(
      within(table)
        .getAllByRole("cell")
        .map((td) => td.textContent),
    ).toEqual(["Pale", "4.5", "Crystal", "0.3"]);
  });

  it("names a table with no heading above it by tableLabel", () => {
    render(<Markdown md={"| a | b |\n|---|---|\n| 1 | 2 |"} tableLabel="Tabel" />);
    expect(screen.getByRole("table", { name: "Tabel" })).toBeInstanceOf(HTMLElement);
  });
});
