import { TableOfContents } from "@slashsuite/ui-react";

/** The app tracks the section being read and passes it as `current`, so the reader sees where they are. */
export const DoCurrent = () => (
  <TableOfContents
    items={[
      { id: "install", label: "Install", level: 2 },
      { id: "with-bun", label: "With Bun", level: 3 },
      { id: "with-npm", label: "With npm", level: 3 },
      { id: "usage", label: "Usage", level: 2 },
      { id: "themes", label: "Themes", level: 2 },
    ]}
    current="with-bun"
  />
);

/** With no `current` every entry looks the same, and a reader halfway down a long page cannot tell where they are. */
export const DontCurrent = () => (
  <TableOfContents
    items={[
      { id: "install", label: "Install", level: 2 },
      { id: "with-bun", label: "With Bun", level: 3 },
      { id: "with-npm", label: "With npm", level: 3 },
      { id: "usage", label: "Usage", level: 2 },
      { id: "themes", label: "Themes", level: 2 },
    ]}
  />
);

/** The page's own `h2`s and `h3`s, in its order, with the heading's words as each label. */
export const DoHeadings = () => (
  <TableOfContents
    items={[
      { id: "install", label: "Install", level: 2 },
      { id: "with-bun", label: "With Bun", level: 3 },
      { id: "with-npm", label: "With npm", level: 3 },
      { id: "usage", label: "Usage", level: 2 },
      { id: "themes", label: "Themes", level: 2 },
    ]}
    current="usage"
  />
);

/** A label that is not the heading's words sends the reader to a section they do not recognise when they land. */
export const DontHeadings = () => (
  <TableOfContents
    items={[
      { id: "install", label: "How to get the package into your project", level: 2 },
      { id: "usage", label: "Some notes on using it", level: 2 },
      { id: "themes", label: "Colours", level: 2 },
    ]}
    current="usage"
  />
);
