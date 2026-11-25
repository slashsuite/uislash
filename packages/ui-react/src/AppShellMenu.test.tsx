// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AppShell } from "./AppShell.js";
import {
  popoverOpen,
  popovers,
  popoverTargetOf,
  stubPopover,
  unstubPopover,
} from "./dom.harness.js";
import { act, render, screen, user, within } from "./render.harness.js";

// The menu is the browser's popover: the button's `popovertarget` opens it, and a click outside,
// Escape and the focus going back to the button are the browser's (appshell-phone.spec.ts). jsdom
// runs none of that: `stubPopover` gives the panel `showPopover`, which stands in for the button.
const menuButton = (name = "Menu") => screen.getByRole("button", { name });
const panel = () => popoverTargetOf(menuButton());
const openMenu = () => {
  act(() => panel().showPopover());
  expect(popoverOpen(panel())).toBe(true);
};

describe("AppShell phone menu", () => {
  beforeEach(stubPopover);
  afterEach(unstubPopover);

  it("draws no menu without a nav, a subnav or menuControls", () => {
    render(
      <AppShell brand="B" controls="C" header="H">
        x
      </AppShell>,
    );
    expect(screen.queryByRole("button", { name: "Menu" })).toBeNull();
    expect(popovers()).toHaveLength(0);
  });

  it("is a button named Menu by default that targets the closed panel", () => {
    render(<AppShell nav={<nav aria-label="Main">tabs</nav>}>x</AppShell>);
    expect(panel().getAttribute("popover")).toBe("auto");
    expect(popoverOpen(panel())).toBe(false);
    expect(screen.queryByRole("navigation", { name: "Main" })).toBeNull();
    openMenu();
    expect(within(panel()).getByRole("navigation", { name: "Main" })).not.toBeNull();
  });

  it("takes the menu button's name from menuLabel", () => {
    render(
      <AppShell nav="n" menuLabel="Navigatie">
        x
      </AppShell>,
    );
    expect(menuButton("Navigatie")).not.toBeNull();
    expect(screen.queryByRole("button", { name: "Menu" })).toBeNull();
  });

  it("renders the nav once, in the panel, and the subnav's phone copy after it", () => {
    render(
      <AppShell
        nav={<nav aria-label="Main">main-links</nav>}
        subnav={<nav aria-label="Section">section-links</nav>}
      >
        x
      </AppShell>,
    );
    openMenu();
    expect(screen.getAllByRole("navigation", { name: "Main" })).toHaveLength(1);
    const main = within(panel()).getByRole("navigation", { name: "Main" });
    const section = within(panel()).getByRole("navigation", { name: "Section" });
    expect(main.compareDocumentPosition(section) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("draws the menu for a subnav alone", () => {
    render(<AppShell subnav={<nav aria-label="Section">S</nav>}>x</AppShell>);
    openMenu();
    expect(within(panel()).getByRole("navigation", { name: "Section" })).not.toBeNull();
  });

  it("closes when a link in the panel is followed, for a router that does not reload", async () => {
    render(
      <AppShell
        nav={
          <a href="#a" onClick={(e) => e.preventDefault()}>
            A
          </a>
        }
      >
        x
      </AppShell>,
    );
    openMenu();
    await user().click(within(panel()).getByRole("link", { name: "A" }));
    expect(popoverOpen(panel())).toBe(false);
  });

  it("stays open when something other than a link is clicked", async () => {
    render(<AppShell nav={<span>plain</span>}>x</AppShell>);
    openMenu();
    await user().click(within(panel()).getByText("plain"));
    expect(popoverOpen(panel())).toBe(true);
  });
});

describe("AppShell menuControls", () => {
  beforeEach(stubPopover);
  afterEach(unstubPopover);
  const signOut = <button type="button">Sign out</button>;
  const nav = <a href="/builds">Builds</a>;

  it("renders them exactly once, inside the menu, after the nav", () => {
    render(
      <AppShell nav={nav} menuControls={signOut}>
        x
      </AppShell>,
    );
    openMenu();
    expect(screen.getAllByRole("button", { name: "Sign out" })).toHaveLength(1);
    const button = within(panel()).getByRole("button", { name: "Sign out" });
    const link = within(panel()).getByRole("link", { name: "Builds" });
    expect(link.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("gives the Menu with menuControls and no nav or subnav", () => {
    render(<AppShell menuControls={signOut}>x</AppShell>);
    openMenu();
    expect(menuButton()).not.toBeNull();
    expect(within(panel()).getByRole("button", { name: "Sign out" })).not.toBeNull();
  });
});
