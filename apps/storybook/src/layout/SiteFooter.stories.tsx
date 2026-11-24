import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppShell, SiteFooter, Text } from "@slashsuite/ui-react";
import * as examples from "../../../../packages/ui-react/docs/examples/SiteFooter.examples.js";

/** The footer a site puts in `AppShell`'s `footer` slot. */
const meta: Meta = { title: "Layout/SiteFooter", parameters: { layout: "fullscreen" } };
export default meta;
type S = StoryObj;

/** A brand linked home with the contact line beside it, the site's links, then the fine print, in the shell's footer. */
export const Default: S = {
  render: () => (
    <AppShell
      footer={
        <SiteFooter
          brand="PixelSlash"
          brandLabel="PixelSlash home"
          links={[
            { label: "Privacy", href: "#privacy" },
            { label: "Terms", href: "#terms" },
            { label: "GitHub", href: "https://github.com", external: true },
          ]}
          notes={["MIT licence.", "PixelSlash is a Hack Cove product."]}
        >
          <Text>Email hello@example.com</Text>
        </SiteFooter>
      }
    >
      <Text>The page.</Text>
    </AppShell>
  ),
};

export const DoFooter: S = {
  render: examples.DoFooter,
};

export const DontFooter: S = {
  render: examples.DontFooter,
};
