import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Card,
  Divider,
  Field,
  Input,
  ListRow,
  Section,
  Stack,
  Text,
} from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/StackDocs.examples.js";

/** The docs examples for `Stack` and `Section`. */
const meta: Meta = { title: "Layout/Stack" };
export default meta;
type S = StoryObj;

export const DoGap: S = {
  render: examples.DoGap,
};

export const DontGap: S = {
  render: examples.DontGap,
};

/** `rule` draws a hairline under the title row, across its full width with the actions, for a section that must read as set apart from what follows. */
export const SectionRule: S = {
  render: () => (
    <Section rule title="Recent builds" actions={<Button variant="outline">All builds</Button>}>
      <Card title="Build 412">
        <Text>3 changed</Text>
      </Card>
    </Section>
  ),
};

export const DoSectionTitle: S = {
  render: examples.DoSectionTitle,
};

export const DontSectionTitle: S = {
  render: examples.DontSectionTitle,
};

export const DoList: S = {
  render: examples.DoList,
};

export const DontList: S = {
  render: examples.DontList,
};

export const DoWidth: S = {
  render: examples.DoWidth,
};

export const DontWidth: S = {
  render: examples.DontWidth,
};

/** A column whose children keep their own width is `align="start"`: the button under the fields is as wide as its label. */
export const DoAlign: S = {
  render: () => (
    <Stack width="narrow" gap="sm" align="start">
      <Field label="Shop name" htmlFor="stack-align-name">
        <Input id="stack-align-name" placeholder="Corner Books" />
      </Field>
      <Button>Save shop</Button>
    </Stack>
  ),
};

/** In a stretched column the button spans it, as wide as the fields; never wrap it in a bare `div` to stop that. */
export const DontAlign: S = {
  render: () => (
    <Stack width="narrow" gap="sm">
      <Field label="Shop name" htmlFor="stack-align-name-dont">
        <Input id="stack-align-name-dont" placeholder="Corner Books" />
      </Field>
      <Button>Save shop</Button>
    </Stack>
  ),
};

/** Rows with a line between are a `Stack as="ul" divided` in a `Card flush`: the Stack owns the lines. */
export const DoDivided: S = {
  render: () => (
    <Card flush>
      <Stack as="ul" divided aria-label="Builds">
        <li>
          <ListRow secondary="3 changed">Build 412</ListRow>
        </li>
        <li>
          <ListRow secondary="No changes">Build 411</ListRow>
        </li>
        <li>
          <ListRow secondary="1 changed">Build 410</ListRow>
        </li>
      </Stack>
    </Card>
  ),
};

/** A `Divider` after every row adds space around each line, and the rows are no list. */
export const DontDivided: S = {
  render: () => (
    <Card flush>
      <ListRow secondary="3 changed">Build 412</ListRow>
      <Divider />
      <ListRow secondary="No changes">Build 411</ListRow>
      <Divider />
      <ListRow secondary="1 changed">Build 410</ListRow>
    </Card>
  ),
};

/** `align="start"` at phone width: a long paragraph, a long unbroken token and a button, none wider than the page. */
export const AlignStart: S = {
  parameters: { layout: "padded" },
  render: () => (
    <Stack align="start" gap="sm">
      <Text>
        A long paragraph that wraps across the column, so its own width is the column's and it never
        pushes the page sideways on a phone.
      </Text>
      <Text breakWords>
        tok_demo_0123456789abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz
      </Text>
      <Button>Copy the key</Button>
    </Stack>
  ),
};

export const DoSmallSection: S = {
  render: examples.DoSmallSection,
};

export const DontSmallSection: S = {
  render: examples.DontSmallSection,
};

export const DoLandingSection: S = {
  render: examples.DoLandingSection,
};

export const DontLandingSection: S = {
  render: examples.DontLandingSection,
};
