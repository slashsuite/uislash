// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { Code } from "./Code.js";
import { MetaList } from "./MetaList.js";
import { render, screen, within } from "./render.harness.js";
import { TextLink } from "./TextLink.js";

describe("MetaList", () => {
  it("is a list, one item per fact", () => {
    render(
      <MetaList>
        <span>main</span>
        <Code>0f9d376</Code>
        <span>26 Oct</span>
      </MetaList>,
    );
    expect(within(screen.getByRole("list")).getAllByRole("listitem")).toHaveLength(3);
  });

  it("leads every item with a dot that is hidden from assistive tech", () => {
    render(
      <MetaList>
        <span>a</span>
        <span>b</span>
        <span>c</span>
      </MetaList>,
    );
    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "·a",
      "·b",
      "·c",
    ]);
    // The dots are drawn but not read: none of them is in the accessibility tree.
    expect(screen.queryAllByText("·")).toHaveLength(3);
    expect(screen.queryAllByText("·", { ignore: "[aria-hidden] *" })).toHaveLength(0);
  });

  it("takes text, Code and TextLink items", () => {
    render(
      <MetaList>
        plain text
        <Code>abc123</Code>
        <TextLink href="/b/main">main</TextLink>
      </MetaList>,
    );
    expect(screen.getByText("plain text")).not.toBeNull();
    expect(screen.getByRole("code").textContent).toBe("abc123");
    expect(screen.getByRole("link", { name: "main" }).getAttribute("href")).toBe("/b/main");
  });
});

const links = [
  <TextLink key="p" href="/privacy">
    Privacy
  </TextLink>,
  <TextLink key="t" href="/terms">
    Terms
  </TextLink>,
  <TextLink key="e" href="mailto:a@b.c">
    Email
  </TextLink>,
];

describe("MetaList separator", () => {
  it("sits in the same item as the link after it, so no item ends with one", () => {
    render(<MetaList separator="•">{links}</MetaList>);
    const items = screen.getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual(["•Privacy", "•Terms", "•Email"]);
  });

  it("takes a bullet in place of the dot", () => {
    render(<MetaList separator="•">{links}</MetaList>);
    expect(screen.getAllByText("•")).toHaveLength(3);
    expect(screen.queryByText("·")).toBeNull();
  });

  it("takes none, for a gap alone", () => {
    render(<MetaList separator="none">{links}</MetaList>);
    expect(screen.queryAllByText(/[·•]/)).toHaveLength(0);
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });
});
