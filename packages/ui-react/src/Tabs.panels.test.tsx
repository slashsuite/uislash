// @vitest-environment jsdom
import { type ReactElement, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { stubBeforeMatch, unstubBeforeMatch } from "./dom.harness.js";
import { act, fireEvent, render, screen, user } from "./render.harness.js";
import { type TabButton, Tabs } from "./Tabs.js";

const items: TabButton[] = [
  { value: "a", label: "Alpha", panel: "Alpha view" },
  { value: "b", label: "Beta", panel: "Beta view" },
  { value: "c", label: "Gamma", panel: "Gamma view", disabledReason: "Not yet" },
];

function Stateful({ vertical = false }: { vertical?: boolean }): ReactElement {
  const [value, setValue] = useState("a");
  return vertical ? (
    <Tabs label="Views" items={items} value={value} onChange={setValue} orientation="vertical" />
  ) : (
    <Tabs label="Views" items={items} value={value} onChange={setValue} />
  );
}

/** The panel of the tab named `name`, shown or hidden (a hidden one is out of the tree a name is read from). */
const panel = (name: string): HTMLElement => {
  const found = screen
    .getAllByRole("tabpanel", { hidden: true })
    .find((each) => each.textContent === `${name} view`);
  if (!found) throw new Error(`no panel for ${name}`);
  return found;
};

describe("Tabs panels", () => {
  afterEach(unstubBeforeMatch);

  it("draws each tab's panel, labelled by the tab and named in its aria-controls", () => {
    render(<Stateful />);
    const tab = screen.getByRole("tab", { name: "Alpha" });
    const view = screen.getByRole("tabpanel", { name: "Alpha" });
    expect(tab.getAttribute("aria-controls")).toBe(view.id);
    expect(view.getAttribute("aria-labelledby")).toBe(tab.id);
    expect(view.textContent).toBe("Alpha view");
    expect(view.tabIndex).toBe(0);
  });

  it("shows only the current tab's panel, and follows the choice", async () => {
    render(<Stateful vertical />);
    expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
    expect(panel("Beta").hidden).toBe(true);
    await user().click(screen.getByRole("tab", { name: "Beta" }));
    expect(panel("Beta").hidden).toBe(false);
    expect(panel("Alpha").hidden).toBe(true);
  });

  it("gives every tab an id and aria-controls only when it has a panel", () => {
    render(
      <Tabs label="Views" items={[{ value: "a", label: "Alpha" }]} value="a" onChange={() => {}} />,
    );
    expect(screen.getByRole("tab", { name: "Alpha" }).hasAttribute("aria-controls")).toBe(false);
    expect(screen.queryByRole("tabpanel")).toBeNull();
  });

  it("is hidden until found where the browser has it, and a find switches to its tab", () => {
    stubBeforeMatch();
    const onChange = vi.fn<(value: string) => void>();
    render(<Tabs label="Views" items={items} value="a" onChange={onChange} />);
    expect(panel("Beta").getAttribute("hidden")).toBe("until-found");
    act(() => {
      fireEvent(panel("Beta"), new Event("beforematch"));
    });
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("keeps a disabled tab's panel out of find in page", () => {
    stubBeforeMatch();
    render(<Tabs label="Views" items={items} value="a" onChange={() => {}} />);
    expect(panel("Gamma").getAttribute("hidden")).toBe("");
  });

  it("leaves a plain hidden panel where the browser has no until-found", () => {
    render(<Tabs label="Views" items={items} value="a" onChange={() => {}} />);
    expect(panel("Beta").getAttribute("hidden")).toBe("");
  });
});
