import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColourSchemeToggle } from "@slashsuite/ui-react";
import { resetColourScheme, startColourScheme } from "./resetColourScheme";
import * as examples from "../../../packages/ui-react/docs/examples/ColourSchemeToggle.examples.js";

const meta: Meta = { title: "Actions/ColourSchemeToggle" };
export default meta;
type S = StoryObj;

export const DoSwitch: S = {
  beforeEach: resetColourScheme,
  render: examples.DoSwitch,
};

export const DontSwitch: S = {
  beforeEach: resetColourScheme,
  render: examples.DontSwitch,
};

export const DoSchemes: S = {
  beforeEach: resetColourScheme,
  render: examples.DoSchemes,
};

export const DontSchemes: S = {
  beforeEach: resetColourScheme,
  render: examples.DontSchemes,
};

// The icon follows the class on <html>, so on a dark page it shows the sun from the first frame, with no `initial`; the story starts light. Clicking is interactive-only.
export const Default: S = {
  beforeEach: resetColourScheme,
  render: () => <ColourSchemeToggle />,
};

/** An app whose light scheme has a class of its own passes `schemes`; clicking swaps the two. Same snapshot: the class is what changes. */
export const CustomClasses: S = {
  beforeEach: resetColourScheme,
  render: () => <ColourSchemeToggle schemes={{ light: "my-light", dark: "dark" }} />,
};

/** `sm`, `md` (the default) and `lg`, the `IconButton` sizes. */
export const Sizes: S = {
  beforeEach: resetColourScheme,
  render: () => (
    <div className="flex items-center gap-2">
      {(["sm", "md", "lg"] as const).map((size) => (
        <ColourSchemeToggle key={size} size={size} />
      ))}
    </div>
  ),
};

/** `defaultValue="dark"` is the scheme the server rendered, for an app whose pages render dark. A server that renders dark also puts the dark class on `<html>`, as this story does, so the server, the hydrating client and the page all draw the sun, the switch to light. The toggle follows the class on `<html>`, not `defaultValue`, once it runs. */
export const DefaultDark: S = {
  beforeEach: () => startColourScheme("dark"),
  render: () => <ColourSchemeToggle defaultValue="dark" />,
};
