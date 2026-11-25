import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, CallToAction, Stack } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/CallToAction.examples.js";

const meta: Meta = { title: "Content/CallToAction" };
export default meta;
type S = StoryObj;

/** With an overline, a sentence and two actions; then the bare form, a title and one action. */
export const Default: S = {
  render: () => (
    <Stack gap="md">
      <CallToAction
        overline="Ready when you are"
        title="Start your first review today"
        description="Free for open source, and a minute to set up."
        actions={
          <>
            <Button href="#start">Get started</Button>
            <Button href="#pricing" variant="outline">
              See pricing
            </Button>
          </>
        }
      />
      <CallToAction title="Talk to us" actions={<Button href="#contact">Contact us</Button>} />
    </Stack>
  ),
};

export const DoClose: S = {
  render: examples.DoClose,
};

export const DontClose: S = {
  render: examples.DontClose,
};
