import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Card, Field, FormLayout, Input, Stack } from "@slashsuite/ui-react";
import { DemoShell, layoutPage } from "../../../../packages/ui-react/docs/examples/DemoShell.js";
import { FormPage } from "./pages";
import * as examples from "../../../../packages/ui-react/docs/examples/FormLayout.examples.js";

/** The `max-w-3xl` column starts at the title's x: the e2e checks it against the list page's. */
const meta: Meta = {
  title: "Page layouts/FormLayout",
  parameters: { layout: "fullscreen", bare: true },
  beforeEach: layoutPage,
};
export default meta;
type S = StoryObj;

export const FullPage: S = {
  render: examples.FullPage,
};

export const NewQuote: S = {
  render: () => (
    <DemoShell>
      <FormPage />
    </DemoShell>
  ),
};

/** A failed save is the layout's `error`: an alert directly above Save and Cancel. */
export const WithError: S = {
  render: () => (
    <FormLayout
      title="New client"
      description="Who is the quote for?"
      onSubmit={(event) => event.preventDefault()}
      error="Could not save the client: you are offline."
      actions={
        <>
          <Button type="submit">Save client</Button>
          <Button variant="ghost">Cancel</Button>
        </>
      }
    >
      <Card title="Client">
        <Stack>
          <Field label="Full name">
            <Input placeholder="Naledi Mokoena" />
          </Field>
          <Field label="Email">
            <Input type="email" placeholder="naledi@example.com" />
          </Field>
        </Stack>
      </Card>
    </FormLayout>
  ),
};

/** A closing remark about the whole form is the layout's `note`: a muted line set apart under the actions. */
export const WithNote: S = {
  render: () => (
    <FormLayout
      title="Ask for a repair"
      description="Tell us what broke."
      onSubmit={(event) => event.preventDefault()}
      note="We reply within two working days. A repair under R500 goes ahead without a quote."
      actions={
        <>
          <Button type="submit">Send request</Button>
          <Button variant="ghost">Cancel</Button>
        </>
      }
    >
      <Card title="Item">
        <Stack>
          <Field label="What is it?" required>
            <Input placeholder="Kettle" />
          </Field>
          <Field label="Your email" required>
            <Input type="email" placeholder="naledi@example.com" />
          </Field>
        </Stack>
      </Card>
    </FormLayout>
  ),
};

export const DoForm: S = {
  render: examples.DoForm,
};

export const DontForm: S = {
  render: examples.DontForm,
};

/** While `loading` the layout owns the wait: the header draws as itself and every part inside waits with it. */
export const Loading: StoryObj<{ loading: boolean }> = {
  args: { loading: true },
  render: ({ loading }) => (
    <DemoShell>
      <FormLayout title="Edit quote" loading={loading}>
        <Field label="Customer">
          <Input defaultValue="Cove Hardware" />
        </Field>
      </FormLayout>
    </DemoShell>
  ),
};
