import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColourSwatch } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/ColourSwatch.examples.js";

const meta: Meta = { title: "Content/ColourSwatch" };
export default meta;
type S = StoryObj;

/** A swatch with its label and its hex value; a colour near the page's own still shows by its hairline. White and black are there to show that edge. */
export const Default: S = {
  render: () => (
    <div className="flex flex-col gap-2">
      <ColourSwatch value="#1e293b" label="Background" />
      <ColourSwatch value="#38bdf8" label="Accent" />
      <ColourSwatch value="#ffffff" label="Paper" />
      <ColourSwatch value="#000000" label="Ink" />
    </div>
  ),
};

/** Anything but `#rrggbb` draws an empty swatch and leaves the value out. */
export const Invalid: S = {
  render: () => (
    <div className="flex flex-col gap-2">
      <ColourSwatch value="red" label="A colour name" />
      <ColourSwatch value="#369" label="Three digits" />
    </div>
  ),
};

export const DoValue: S = {
  render: examples.DoValue,
};

export const DontValue: S = {
  render: examples.DontValue,
};
