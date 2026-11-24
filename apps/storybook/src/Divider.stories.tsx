import type { Meta, StoryObj } from "@storybook/react-vite";
import { Caption, Divider, MetaList, Section, Stack, Text, TextLink } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/Divider.examples.js";

const meta: Meta = { title: "Layout/Divider" };
export default meta;
type S = StoryObj;

export const Rule: S = {
  render: () => (
    <div className="flex max-w-xl flex-col gap-4">
      <Text>Above the rule.</Text>
      <Divider />
      <Text>Below the rule.</Text>
    </div>
  ),
};

export const AboveAFooter: S = {
  render: () => (
    <div className="max-w-xl">
      <Text>The last paragraph of a page.</Text>
      <div className="mt-16">
        <Divider />
      </div>
      <footer className="pt-8">
        <Caption>Hack Cove (Pty) Ltd</Caption>
        <div className="mt-2">
          <MetaList>
            <TextLink href="/privacy">Privacy</TextLink>
            <TextLink href="/terms">Terms</TextLink>
          </MetaList>
        </div>
      </footer>
    </div>
  ),
};

export const DoFooter: S = {
  render: examples.DoFooter,
};

export const DontFooter: S = {
  render: examples.DontFooter,
};

/** A line between two `Section`s of one page is a `Divider` in the `Stack` that holds them: the Stack's gap is the space on both sides. */
export const BetweenSections: S = {
  render: () => (
    <Stack>
      <Section title="Fixed expenses">
        <Text>Rent, insurance and transport, every month.</Text>
      </Section>
      <Divider />
      <Section title="One-off costs">
        <Text>Costs that fall in a single month.</Text>
      </Section>
    </Stack>
  ),
};

export const DoCards: S = {
  render: examples.DoCards,
};

export const DontCards: S = {
  render: examples.DontCards,
};
