import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Cluster, Input, Stack, StickyBar, Text } from "@slashsuite/ui-react";
import { DemoShell, layoutPage } from "../../../packages/ui-react/docs/examples/DemoShell.js";
import * as examples from "../../../packages/ui-react/docs/examples/StickyBar.examples.js";

const meta: Meta = {
  title: "Layout/StickyBar",
  parameters: { bare: true },
  beforeEach: layoutPage,
};
export default meta;
type S = StoryObj;

const filters = (
  <Cluster justify="between">
    <Input aria-label="Filter builds" placeholder="Filter builds" width="auto" />
    <Button size="sm" variant="outline">
      Accept all
    </Button>
  </Cluster>
);

const rows = Array.from({ length: 40 }, (_, index) => <Text key={index}>Build {40 - index}</Text>);

/** A bar at the top of an `AppShell bleed` page: it spans the page and sticks under the header as the page scrolls. */
export const Default: S = {
  render: () => (
    <DemoShell bleed>
      <StickyBar>{filters}</StickyBar>
      <div className="px-4 py-4 sm:px-6">
        <Stack gap="sm">{rows}</Stack>
      </div>
    </DemoShell>
  ),
};

export const DoBar: S = {
  render: examples.DoBar,
};

export const DontBar: S = {
  render: examples.DontBar,
};
