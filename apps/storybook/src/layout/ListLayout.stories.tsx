import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, EmptyState, ListLayout } from "@slashsuite/ui-react";
import { DemoShell, layoutPage } from "../../../../packages/ui-react/docs/examples/DemoShell.js";
import { ListPage } from "./pages";
import * as examples from "../../../../packages/ui-react/docs/examples/ListLayout.examples.js";

/** The page stories keep the page title at the logo's x (bar the three asserted in e2e/layout.spec.ts); the visual check shoots each at 1280. */
const meta: Meta = {
  title: "Page layouts/ListLayout",
  parameters: { layout: "fullscreen", bare: true },
  beforeEach: layoutPage,
};
export default meta;
type S = StoryObj;

export const FullPage: S = {
  render: examples.FullPage,
};

export const WithRows: S = {
  render: () => (
    <DemoShell>
      <ListPage />
    </DemoShell>
  ),
};

/** With no children, the `empty` slot takes the list's place; the header and filters stay. */
export const Empty: S = {
  render: () => (
    <DemoShell>
      <ListPage isEmpty />
    </DemoShell>
  ),
};

export const DoRows: S = {
  render: examples.DoRows,
};

export const DontRows: S = {
  render: examples.DontRows,
};

export const DoNothingYet: S = {
  render: examples.DoNothingYet,
};

export const DontNothingYet: S = {
  render: examples.DontNothingYet,
};

/** While `loading` the layout owns the wait: the header draws as itself and every part inside waits with it. */
export const Loading: StoryObj<{ loading: boolean }> = {
  args: { loading: true },
  render: ({ loading }) => (
    <DemoShell>
      <ListLayout title="Quotes" loading={loading} empty={<EmptyState title="No quotes yet" />}>
        {loading ? null : <Card>Q-1043</Card>}
      </ListLayout>
    </DemoShell>
  ),
};
