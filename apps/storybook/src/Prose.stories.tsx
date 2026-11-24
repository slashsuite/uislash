import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  CodeBlock,
  CodeExample,
  CopyLine,
  Overline,
  Prose,
  SectionHeading,
  Stack,
  Text,
} from "@slashsuite/ui-react";
import { ProseDoc } from "../../../packages/ui-react/docs/examples/ProseDoc.js";
import * as examples from "../../../packages/ui-react/docs/examples/Prose.examples.js";

const meta: Meta = { title: "Text/Prose" };
export default meta;
type S = StoryObj;

export const DoDocs: S = {
  render: examples.DoDocs,
};

export const DontDocs: S = {
  render: examples.DontDocs,
};

/** The same short doc inside `Prose` (left) and without it (right). */
export const Compare: S = {
  render: () => (
    <div className="grid grid-cols-2 gap-10">
      <Stack gap="sm">
        <Overline>Inside Prose</Overline>
        <Prose>
          <ProseDoc />
        </Prose>
      </Stack>
      <Stack gap="sm">
        <Overline>Without Prose</Overline>
        <ProseDoc />
      </Stack>
    </div>
  ),
};

/** A `CodeExample` inside `Prose`: the text around it is body size, its demo stays at the app size, so the demo looks as the component does anywhere else. */
export const CodeExampleInProse: S = {
  render: () => (
    <div className="max-w-xl">
      <Prose>
        <Stack gap="md">
          <SectionHeading>Primary action</SectionHeading>
          <Text>
            The page has one primary button; the demo below is drawn at the app size, and the code
            under it (a `CodeExample`, a `CodeBlock`, a `CopyLine`) keeps its own line height.
          </Text>
          <CodeExample
            code={'<Button variant="primary">Save</Button>\n<Text>Saved a moment ago</Text>'}
          >
            <Stack gap="sm">
              <Button variant="primary">Save</Button>
              <Text>Saved a moment ago</Text>
            </Stack>
          </CodeExample>
          <CodeBlock label="bash" language="bash">
            bun add @slashsuite/ui-react
          </CodeBlock>
          <CopyLine text="bun add @slashsuite/themes" />
        </Stack>
      </Prose>
    </div>
  ),
};
