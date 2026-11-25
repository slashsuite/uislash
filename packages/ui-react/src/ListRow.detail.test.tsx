// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { ListRow } from "./ListRow.js";
import { follows, render, screen, within } from "./render.harness.js";

describe("ListRow detail", () => {
  it("reads the detail after the row's line, inside the row", () => {
    render(
      <ListRow aria-label="Chat row" leading="L" trailing="3" panel={<p>Thread</p>}>
        Chat
      </ListRow>,
    );
    const row = screen.getByLabelText("Chat row");
    expect(within(row).getByText("Thread")).not.toBeNull();
    expect(follows(screen.getByText("L"), screen.getByText("Chat"))).toBeTruthy();
    expect(follows(screen.getByText("Chat"), screen.getByText("3"))).toBeTruthy();
    expect(follows(screen.getByText("3"), screen.getByText("Thread"))).toBeTruthy();
  });

  it("reads the row's actions before the detail", () => {
    render(
      <ListRow actions={<button type="button">Hide</button>} panel="Thread">
        Chat
      </ListRow>,
    );
    expect(
      follows(screen.getByRole("button", { name: "Hide" }), screen.getByText("Thread")),
    ).toBeTruthy();
  });
});

// How the stripe and a narrow thumbnail row look is the visual check's (the ListRow Stripes and
// ThumbnailNarrow stories); these say what a reader gets.
describe("ListRow stripe", () => {
  it.each([
    ["button", { onClick: () => {} }, "button"],
    ["link", { href: "/builds/412" }, "link"],
  ] as const)("a %s row's stripe adds nothing to its name", (_, form, role) => {
    render(
      <ListRow {...form} stripe="danger">
        Build #412
      </ListRow>,
    );
    // An exact name: the stripe draws no text of its own.
    expect(screen.getByRole(role, { name: "Build #412" })).not.toBeNull();
  });

  it("a static row's stripe adds no text to the row", () => {
    render(
      <ListRow stripe="danger" aria-label="Build row">
        Build #412
      </ListRow>,
    );
    expect(screen.getByLabelText("Build row").textContent).toBe("Build #412");
  });
});

describe("ListRow thumbnail with trailing", () => {
  it("reads the label, then the trailing value, inside the row", () => {
    render(
      <ListRow
        onClick={() => {}}
        leading={<img alt="" src="/a.png" />}
        leadingWidth="thumbnail"
        trailing="R 120"
      >
        Ginger beer
      </ListRow>,
    );
    expect(screen.getByRole("button", { name: "Ginger beer" })).not.toBeNull();
    expect(follows(screen.getByText("Ginger beer"), screen.getByText("R 120"))).toBeTruthy();
  });
});
