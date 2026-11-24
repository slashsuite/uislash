import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppShell, AppShellBrand, NavigationProgress, Tabs, Text } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/NavigationProgress.examples.js";

const meta: Meta = { title: "Feedback/NavigationProgress", parameters: { layout: "fullscreen" } };
export default meta;
type S = StoryObj<{ loading: boolean }>;

/**
 * The bar in its shown state, fixed to the top edge of the viewport and over the AppShell header.
 * It draws what `loading` says; the stylesheet holds it invisible for the first 150ms.
 * A real app passes the router's pending flag; here it is a story arg.
 */
export const Default: S = {
  parameters: { bare: true },
  args: { loading: true },
  render: ({ loading }) => (
    <>
      <NavigationProgress loading={loading} />
      <AppShell
        brand={<AppShellBrand href="#" label="Quotes" />}
        nav={
          <Tabs
            label="Main"
            items={[
              { label: "Home", href: "#", selected: true },
              { label: "Stores", href: "#stores" },
              { label: "Events", href: "#events" },
            ]}
          />
        }
      >
        <Text>The page the reader is leaving. The bar runs along the very top.</Text>
      </AppShell>
    </>
  ),
};

export const DoPending: S = {
  render: examples.DoPending,
};

export const DontPending: S = {
  render: examples.DontPending,
};
