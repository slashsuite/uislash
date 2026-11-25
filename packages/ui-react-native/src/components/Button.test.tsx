import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { nativeThemes } from "../../test/themes.js";
import { ThemeProvider } from "../theme/ThemeProvider.js";
import { Button } from "./Button.js";

const theme = nativeThemes[0];
if (theme === undefined) throw new Error("no theme");

const styleOf = (element: Element): Record<string, unknown> =>
  JSON.parse(element.getAttribute("data-style") ?? "{}") as Record<string, unknown>;

describe("Button", () => {
  it("draws the primary look of the theme in force, and its label in the variant's text", () => {
    render(
      <ThemeProvider theme={theme}>
        <Button data-testid="save">Save</Button>
      </ThemeProvider>,
    );
    const button = screen.getByTestId("save");
    expect(styleOf(button).backgroundColor).toBe(theme.utilities["bg-violet-600"]?.backgroundColor);
    const label = screen.getByText("Save");
    expect(styleOf(label).color).toBe(theme.utilities["text-violet-50"]?.color);
    expect(label.getAttribute("data-max-scale")).toBe("1.3");
  });

  it("presses with onClick and shows the pressed colour while held", () => {
    const onClick = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <Button data-testid="go" onClick={onClick}>
          Go
        </Button>
      </ThemeProvider>,
    );
    const button = screen.getByTestId("go");
    fireEvent.pointerDown(button);
    const pressed = theme.states.pressed["bg-violet-700"] ?? theme.utilities["bg-violet-700"];
    expect(styleOf(button).backgroundColor).toBe(pressed?.backgroundColor);
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("reads a blocked Button's reason as its hint and does not press", () => {
    const onClick = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <Button data-testid="pay" disabledReason="Add a card first" onClick={onClick}>
          Pay
        </Button>
      </ThemeProvider>,
    );
    const button = screen.getByTestId("pay");
    expect(button.getAttribute("data-hint")).toBe("Add a card first");
    expect(JSON.parse(button.getAttribute("data-state") ?? "{}")).toMatchObject({ disabled: true });
    expect(styleOf(button).backgroundColor).toBe(theme.utilities["bg-slate-100"]?.backgroundColor);
  });

  it("swaps a busy Button's label and says it is busy", () => {
    render(
      <ThemeProvider theme={theme}>
        <Button data-testid="save" busy="Saving">
          Save
        </Button>
      </ThemeProvider>,
    );
    expect(screen.getByText("Saving")).toBeDefined();
    expect(JSON.parse(screen.getByTestId("save").getAttribute("data-state") ?? "{}")).toMatchObject(
      {
        busy: true,
        disabled: true,
      },
    );
  });

  it("is a toggle with `pressed` on an outline Button", () => {
    render(
      <ThemeProvider theme={theme}>
        <Button data-testid="chip" variant="outline" pressed>
          Open
        </Button>
      </ThemeProvider>,
    );
    expect(JSON.parse(screen.getByTestId("chip").getAttribute("data-state") ?? "{}")).toMatchObject(
      {
        checked: true,
      },
    );
  });

  it("throws outside a ThemeProvider, since native has no default look", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(() => render(<Button>Save</Button>)).toThrow(/ThemeProvider/);
  });
});
