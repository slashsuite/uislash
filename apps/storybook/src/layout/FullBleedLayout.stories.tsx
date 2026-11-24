import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Card,
  Cluster,
  FullBleedLayout,
  KeyValue,
  KeyValueList,
  Overline,
  Text,
  StatTile,
} from "@slashsuite/ui-react";
import { DemoShell, layoutPage } from "../../../../packages/ui-react/docs/examples/DemoShell.js";
import * as examples from "../../../../packages/ui-react/docs/examples/FullBleedLayout.examples.js";

/**
 * Edge-to-edge canvas with an optional right panel that stacks below under `lg`. The canvas has
 * no page title; the e2e asserts the panel on its own terms.
 */
const meta: Meta = {
  title: "Page layouts/FullBleedLayout",
  parameters: { layout: "fullscreen", bare: true },
  beforeEach: layoutPage,
};
export default meta;
type S = StoryObj;

export const FullPage: S = {
  render: examples.FullPage,
};

const snapshotCanvas = (
  <div className="flex h-96 items-center justify-center bg-slate-100">
    <Text>Snapshot viewer: fills the width</Text>
  </div>
);

const snapshotPanel = (
  <>
    <Overline as="h2">Snapshot</Overline>
    <div className="mt-3">
      <KeyValueList>
        <KeyValue label="Story">Button / Primary</KeyValue>
        <KeyValue label="Theme">default</KeyValue>
        <KeyValue label="Changed">0.4%</KeyValue>
      </KeyValueList>
    </div>
  </>
);

export const WithPanel: S = {
  render: () => (
    <DemoShell bleed>
      <FullBleedLayout aside={snapshotPanel}>{snapshotCanvas}</FullBleedLayout>
    </DemoShell>
  ),
};

export const WithoutPanel: S = {
  render: () => (
    <DemoShell bleed>
      <FullBleedLayout>{snapshotCanvas}</FullBleedLayout>
    </DemoShell>
  ),
};

/** `padded` gives the canvas and panel the same page padding as the other layouts, for a full-height body that is not a viewer. */
export const Padded: S = {
  render: () => (
    <DemoShell bleed>
      <FullBleedLayout padded aside={snapshotPanel}>
        <Card title="Quotes">
          <Text>Every quote you have sent.</Text>
        </Card>
      </FullBleedLayout>
    </DemoShell>
  ),
};

const viewerBar = (
  <Cluster justify="between" gap="md">
    <Text>Button / Primary</Text>
    <Button size="sm" variant="outline">
      Accept
    </Button>
  </Cluster>
);

/** `bar` is a full-width row above the canvas and the panel, on the surface with a bottom line, that sticks under the shell's header as the page scrolls. */
export const WithBar: S = {
  render: () => (
    <DemoShell bleed>
      <FullBleedLayout bar={viewerBar} aside={snapshotPanel}>
        {snapshotCanvas}
      </FullBleedLayout>
    </DemoShell>
  ),
};

/** With a `bar`, `padded` pads only what is below it: the bar keeps its own edge. */
export const BarPadded: S = {
  render: () => (
    <DemoShell bleed>
      <FullBleedLayout bar={viewerBar} padded aside={snapshotPanel}>
        <Card title="Quotes">
          <Text>Every quote you have sent.</Text>
        </Card>
      </FullBleedLayout>
    </DemoShell>
  ),
};

export const DoViewer: S = {
  render: examples.DoViewer,
};

export const DontViewer: S = {
  render: examples.DontViewer,
};

/** While `loading` the layout owns the wait: the header draws as itself and every part inside waits with it. */
export const Loading: StoryObj<{ loading: boolean }> = {
  args: { loading: true },
  render: ({ loading }) => (
    <DemoShell bleed>
      <FullBleedLayout padded loading={loading}>
        <StatTile label="Changed" value={loading ? undefined : "24"} />
      </FullBleedLayout>
    </DemoShell>
  ),
};
