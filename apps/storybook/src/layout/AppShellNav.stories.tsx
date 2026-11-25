import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AppShell,
  AppShellBrand,
  Button,
  ColourSchemeToggle,
  PageHeader,
  Tabs,
} from "@slashsuite/ui-react";
import { layoutPage } from "../../../../packages/ui-react/docs/examples/DemoShell.js";

/** The header's nav measured against its row: the visual check shoots it at 1280, where it fits. */
const meta: Meta = {
  title: "Layout/AppShell",
  parameters: { layout: "fullscreen", bare: true },
  beforeEach: layoutPage,
};
export default meta;
type S = StoryObj;

const tenLinks = [
  "Overview",
  "Builds",
  "Snapshots",
  "Reviews",
  "Projects",
  "Members",
  "Baselines",
  "Billing",
  "Audit",
  "Settings",
];

/**
 * A nav of ten links, too wide for the row at a tablet's width. From `md` the nav sits in the row
 * while it fits; when it does not, it folds into the Menu, as on a phone, and comes back once the
 * screen is wide enough. Pick Tablet in the viewport toolbar to see the Menu, then go back to the
 * full width to see the links return.
 */
export const NavFolds: S = {
  render: () => (
    <AppShell
      brand={<AppShellBrand href="#" label="Hack Cove" />}
      nav={
        <Tabs
          label="Main"
          items={tenLinks.map((label, i) => ({ label, href: `#${label}`, selected: i === 0 }))}
        />
      }
      controls={<ColourSchemeToggle />}
    >
      <PageHeader
        title="Overview"
        description="Ten links: in the row when they fit, else in the Menu."
      />
    </AppShell>
  ),
};

/**
 * The same ten links with a `subnav` and a Sign out in `menuControls`. When the nav folds, Sign out
 * folds with it, at the foot of the Menu; the subnav is its own row and never folds. From `md`, Tab
 * goes brand, nav, Sign out, the theme toggle: the order the row shows.
 */
export const NavFoldsWithSubnav: S = {
  render: () => (
    <AppShell
      brand={<AppShellBrand href="#" label="Hack Cove" />}
      nav={
        <Tabs
          label="Main"
          items={tenLinks.map((label, i) => ({ label, href: `#${label}`, selected: i === 0 }))}
        />
      }
      menuControls={<Button variant="outline">Sign out</Button>}
      controls={<ColourSchemeToggle />}
      subnav={
        <Tabs
          label="Section"
          items={["Summary", "Runs", "Artifacts"].map((label, i) => ({
            label,
            href: `#${label}`,
            selected: i === 0,
          }))}
        />
      }
    >
      <PageHeader
        title="Overview"
        description="The nav and Sign out fold into the Menu; the subnav row stays."
      />
    </AppShell>
  ),
};
