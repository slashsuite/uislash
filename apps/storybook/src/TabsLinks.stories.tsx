import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Tabs } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/TabsLinks.examples.js";

const meta: Meta = { title: "Navigation/Tabs" };
export default meta;
type S = StoryObj;

export const DoRail: S = {
  render: examples.DoRail,
};

export const DontRail: S = {
  render: examples.DontRail,
};

export const Links: S = {
  render: () => (
    <Tabs
      label="Main"
      items={[
        { label: "Map", href: "/" },
        { label: "Directory", href: "/stores", selected: true },
        { label: "Events", href: "/events" },
        { label: "About", href: "/about" },
      ]}
    />
  ),
};

/** `orientation="vertical"`: one link per line, for a `SidebarLayout` rail. The same pills and `aria-current`. */
export const Vertical: S = {
  render: () => (
    <div className="w-56">
      <Tabs
        orientation="vertical"
        label="Sections"
        items={[
          { label: "Overview", href: "/" },
          { label: "Button", href: "/button", selected: true },
          { label: "Card", href: "/card" },
          { label: "Tabs", href: "/tabs" },
        ]}
      />
    </div>
  ),
};

/** Each tab's `href` is drawn by the app's own Link through `LinkProvider`, which gets the tab's classes and `aria-current`. */
export const LinksWithRouterLink: S = {
  render: () => (
    <Tabs
      label="Main"
      items={[
        { label: "Quotes", selected: true, href: "/quotes" },
        { label: "Settings", href: "/settings" },
        { label: "Traces", href: "https://example.com/traces", external: true },
      ]}
    />
  ),
};

/** `sm`, `md` (the default, 38px) and `lg`: the control scale. */
export const Sizes: S = {
  render: () => (
    <Stack gap="sm">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Tabs
          key={size}
          label={`Main, ${size}`}
          items={[
            { label: "Map", href: "/" },
            { label: "Directory", href: "/stores", selected: true },
          ]}
        />
      ))}
    </Stack>
  ),
};
