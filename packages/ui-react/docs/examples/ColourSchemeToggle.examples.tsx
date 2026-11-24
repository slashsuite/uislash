import { applyColourScheme, Button, ButtonGroup, ColourSchemeToggle } from "@slashsuite/ui-react";

/** One `ColourSchemeToggle` in the page header: it switches `<html>`, remembers the choice and shows the scheme you would switch to. */
export const DoSwitch = () => <ColourSchemeToggle />;

/** Two hand-rolled buttons forget the choice, and nothing shows which scheme is on. */
export const DontSwitch = () => (
  <ButtonGroup label="Colour scheme">
    <Button variant="outline" size="sm" onClick={() => applyColourScheme("light")}>
      Light
    </Button>
    <Button variant="outline" size="sm" onClick={() => applyColourScheme("dark")}>
      Dark
    </Button>
  </ButtonGroup>
);

/** A light theme with a class of its own (`my-light` here) is named in `schemes`, so the toggle swaps both classes. */
export const DoSchemes = () => <ColourSchemeToggle schemes={{ light: "my-light", dark: "dark" }} />;

/** Without `schemes` the toggle only adds and removes `dark`, so the light theme's own class is never put back. */
export const DontSchemes = () => <ColourSchemeToggle />;
