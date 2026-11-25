import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, CenteredLayout, Field, Icon, Input, Text } from "@slashsuite/ui-react";
import { DemoShell, layoutPage } from "../../../../packages/ui-react/docs/examples/DemoShell.js";
import * as examples from "../../../../packages/ui-react/docs/examples/CenteredLayout.examples.js";

/** The one layout whose width differs on purpose: a narrow centred card, asserted on its own terms (e2e/layout.spec.ts). */
const meta: Meta = {
  title: "Page layouts/CenteredLayout",
  parameters: { layout: "fullscreen", bare: true },
  beforeEach: layoutPage,
};
export default meta;
type S = StoryObj;

export const FullPage: S = {
  render: examples.FullPage,
};

export const SignIn: S = {
  render: () => (
    <DemoShell>
      <CenteredLayout title="Sign in" description="Use your Hack Cove account.">
        <Field label="Email" htmlFor="sign-in-email">
          <Input id="sign-in-email" type="email" placeholder="you@example.com" />
        </Field>
        <Button>Continue</Button>
      </CenteredLayout>
    </DemoShell>
  ),
};

export const NotFound: S = {
  render: () => (
    <DemoShell>
      <CenteredLayout title="Page not found" description="It may have moved.">
        <Button variant="outline">Back to builds</Button>
      </CenteredLayout>
    </DemoShell>
  ),
};

/** `mark` is drawn first in the card, above the title: an icon or a large status numeral. It is not a heading. */
export const Mark: S = {
  render: () => (
    <DemoShell>
      <CenteredLayout
        mark={<Icon name="check" size="feature" tone="positive" />}
        title="Email confirmed"
        description="Your Hack Cove account is ready."
      >
        <Button>Continue</Button>
      </CenteredLayout>
    </DemoShell>
  ),
};

export const DoPage: S = {
  render: examples.DoPage,
};

export const DontPage: S = {
  render: examples.DontPage,
};

/** While `loading` the layout owns the wait: the header draws as itself and every part inside waits with it. */
export const Loading: StoryObj<{ loading: boolean }> = {
  args: { loading: true },
  render: ({ loading }) => (
    <DemoShell>
      <CenteredLayout title="Your invite" loading={loading}>
        <Text>{loading ? null : "Mia Botha asked you to join Cove Hardware."}</Text>
      </CenteredLayout>
    </DemoShell>
  ),
};

/** A sign-in page with no `AppShell` around it still sits on the theme's canvas, in its ink: the theme's scope sets both. */
export const WithoutAppShell: S = {
  render: () => (
    <CenteredLayout title="Sign in" description="Use your Hack Cove account.">
      <Field label="Email" htmlFor="bare-sign-in-email">
        <Input id="bare-sign-in-email" type="email" placeholder="you@example.com" />
      </Field>
      <Button>Continue</Button>
    </CenteredLayout>
  ),
};
