import type { Meta, StoryObj } from "@storybook/react-vite";
import { TableOfContents } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/TableOfContents.examples.js";

/** The headings of a long page as links to their anchors, with the section being read marked. */
const meta: Meta = { title: "Navigation/TableOfContents" };
export default meta;
type S = StoryObj;

/** `items` are the page's `h2`s and `h3`s; an `h3` is indented under its `h2`, and `current` is marked. */
export const Default: S = {
  render: () => (
    <TableOfContents
      items={[
        { id: "install", label: "Install", level: 2 },
        { id: "with-bun", label: "With Bun", level: 3 },
        { id: "usage", label: "Usage", level: 2 },
        { id: "themes", label: "Themes", level: 2 },
      ]}
      current="usage"
    />
  ),
};

/** `label` names the list and the landmark, for an app in another language. */
export const Label: S = {
  render: () => (
    <TableOfContents
      label="Op hierdie bladsy"
      items={[
        { id: "installeer", label: "Installeer", level: 2 },
        { id: "gebruik", label: "Gebruik", level: 2 },
      ]}
      current="installeer"
    />
  ),
};

export const DoCurrent: S = {
  render: examples.DoCurrent,
};

export const DontCurrent: S = {
  render: examples.DontCurrent,
};

export const DoHeadings: S = {
  render: examples.DoHeadings,
};

export const DontHeadings: S = {
  render: examples.DontHeadings,
};
