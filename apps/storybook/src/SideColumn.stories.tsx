import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Card, Input, SideColumn, Stack, Text } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/SideColumn.examples.js";

/** A main area beside a fixed-width side column from `lg`; the aside stacks under the main area below it. */
const meta: Meta = { title: "Layout/SideColumn", parameters: { layout: "padded" } };
export default meta;
type S = StoryObj;

const thread = (
  <Card title="Thread">
    <Stack gap="sm">
      <Text>Naledi: Can you move the debit order to the 25th?</Text>
      <Text>You: Done, it starts next month.</Text>
      <Input aria-label="Reply" placeholder="Write a reply" />
    </Stack>
  </Card>
);

const agent = (
  <Card title="Reply agent">
    <Stack gap="sm">
      <Text tone="muted">Ask for a draft, then edit it before it is sent.</Text>
      <Button variant="outline">Suggest a reply</Button>
    </Stack>
  </Card>
);

/** From `lg` the aside is `md` wide (24rem, the default) and `children` take the room left. */
export const Default: S = {
  render: () => (
    <SideColumn aside={agent}>
      <Stack gap="sm">{thread}</Stack>
    </SideColumn>
  ),
};

const WIDTHS = { xs: "12rem", sm: "18rem", md: "24rem" } as const;

/** `asideWidth` is `xs` (12rem), `sm` (18rem) or `md` (24rem, the default). */
export const Widths: S = {
  render: () => (
    <Stack>
      {(["xs", "sm", "md"] as const).map((width) => (
        <SideColumn
          key={width}
          asideWidth={width}
          aside={
            <Card title={`asideWidth ${width}`}>
              <Text>{WIDTHS[width]}</Text>
            </Card>
          }
        >
          <Card title="Main">
            <Text>Takes the room left.</Text>
          </Card>
        </SideColumn>
      ))}
    </Stack>
  ),
};

/**
 * `fold` folds the aside behind a disclosure named by `asideLabel`, closed, below `lg`, so the main
 * area comes first on a phone. From `lg` it is the same column, always shown, with no toggle. The
 * aside stays mounted while folded.
 */
export const FoldedAside: S = {
  render: () => (
    <SideColumn aside={agent} asideLabel="Ask the reply agent" fold>
      <Stack gap="sm">{thread}</Stack>
    </SideColumn>
  ),
};

/** `side="start"`: from `lg` the aside is on the left, and first in reading order, so below `lg` it stacks above the main area. */
export const Start: S = {
  render: () => (
    <SideColumn
      side="start"
      asideWidth="xs"
      aside={
        <Card title="Filters">
          <Text>A 12rem column on the left from lg.</Text>
        </Card>
      }
    >
      {thread}
    </SideColumn>
  ),
};

/** `asideWidth="third"`: from `lg` the aside is one third of the row and the main area two thirds, the split `DetailLayout` draws. */
export const Third: S = {
  render: () => (
    <SideColumn asideWidth="third" aside={agent}>
      {thread}
    </SideColumn>
  ),
};

/** `sticky`: from `lg` the aside stays under the header as the long main area scrolls. Scroll the canvas at a wide viewport. */
export const Sticky: S = {
  render: () => (
    <SideColumn asideWidth="third" sticky aside={agent}>
      <Stack>
        {Array.from({ length: 8 }, (_, i) => (
          <Card key={i} title={`Message ${i + 1}`}>
            <Text>A long thread, so the page scrolls past the aside.</Text>
          </Card>
        ))}
      </Stack>
    </SideColumn>
  ),
};

export const DoFixedColumn: S = {
  render: examples.DoFixedColumn,
};

export const DontFixedColumn: S = {
  render: examples.DontFixedColumn,
};
