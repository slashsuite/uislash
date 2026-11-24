import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Card,
  DetailLayout,
  KeyValue,
  KeyValueList,
  Text,
  StatTile,
} from "@slashsuite/ui-react";
import { DemoShell, layoutPage } from "../../../../packages/ui-react/docs/examples/DemoShell.js";
import { DetailPage } from "./pages";
import * as examples from "../../../../packages/ui-react/docs/examples/DetailLayout.examples.js";

/** Main two thirds and aside one third from `lg`; the aside stacks below main under it. `sticky` keeps the aside in view under the header from `lg` as a long page scrolls. */
const meta: Meta = {
  title: "Page layouts/DetailLayout",
  parameters: { layout: "fullscreen", bare: true },
  beforeEach: layoutPage,
};
export default meta;
type S = StoryObj;

export const FullPage: S = {
  render: examples.FullPage,
};

export const MainAndAside: S = {
  render: () => (
    <DemoShell>
      <DetailPage />
    </DemoShell>
  ),
};

const longMain = Array.from({ length: 12 }, (_, i) => (
  <Card key={i} title={`Block ${i + 1}`}>
    <Text>A block of a long record. The aside stays in view while this scrolls.</Text>
  </Card>
));

/** `sticky` on a long page: from `lg` the aside sticks under the header; taller than the room left, it scrolls itself. Below `lg` it stacks. */
export const StickyAside: S = {
  render: () => (
    <DemoShell>
      <DetailLayout
        title="Quote Q-1042"
        description="Naledi Mokoena"
        actions={<Button variant="outline">Edit</Button>}
        sticky
        aside={
          <Card title="Details">
            <KeyValueList>
              <KeyValue label="Status">Sent</KeyValue>
              <KeyValue label="Premium">R 1 240 / mo</KeyValue>
            </KeyValueList>
          </Card>
        }
      >
        {longMain}
      </DetailLayout>
    </DemoShell>
  ),
};

const notes = Array.from({ length: 18 }, (_, i) => (
  <Text key={i}>
    Note {i + 1}: the client asked for a call back about the cover, and for the quote to be sent by
    email, not post.
  </Text>
));

/**
 * A sticky aside of plain text, no links or fields: taller than the room left, it scrolls itself,
 * and since nothing in it takes the keyboard it takes a tab stop, so the arrow keys can scroll it.
 * `asideLabel` names the aside and that stop.
 */
export const StickyAsideText: S = {
  render: () => (
    <DemoShell>
      <DetailLayout
        title="Quote Q-1042"
        description="Naledi Mokoena"
        actions={<Button variant="outline">Edit</Button>}
        sticky
        asideLabel="Quote notes"
        aside={notes}
      >
        {longMain}
      </DetailLayout>
    </DemoShell>
  ),
};

export const DoRecord: S = {
  render: examples.DoRecord,
};

export const DontRecord: S = {
  render: examples.DontRecord,
};

/** While `loading` the layout owns the wait: the header draws as itself and every part inside waits with it. */
export const Loading: StoryObj<{ loading: boolean }> = {
  args: { loading: true },
  render: ({ loading }) => (
    <DemoShell>
      <DetailLayout
        title="Q-1043"
        loading={loading}
        aside={<StatTile label="Total" value={loading ? undefined : "R 18 400"} />}
      >
        <Card title="Notes">{loading ? null : "Cove Hardware asked for a second quote."}</Card>
      </DetailLayout>
    </DemoShell>
  ),
};
