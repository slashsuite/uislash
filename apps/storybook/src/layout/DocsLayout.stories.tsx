import type { Meta, StoryObj } from "@storybook/react-vite";
import { DocsLayout, Prose, Section, Text } from "@slashsuite/ui-react";
import { DemoShell, layoutPage } from "../../../../packages/ui-react/docs/examples/DemoShell.js";
import * as examples from "../../../../packages/ui-react/docs/examples/DocsLayout.examples.js";

/**
 * A docs page: the docs nav as the rail (folded behind "Docs" below `md`), the page's title, its
 * "On this page" list (a disclosure below `xl`, a sticky column from `xl`), the article and the
 * previous and next links. The visual check shoots each at 1280, where the list is its column.
 */
const meta: Meta = {
  title: "Page layouts/DocsLayout",
  parameters: { layout: "fullscreen", bare: true },
  beforeEach: layoutPage,
};
export default meta;
type S = StoryObj;

export const FullPage: S = {
  render: examples.FullPage,
};

/** A page with one heading: there is no "On this page" list, and no neighbours. */
export const NoContents: S = {
  render: () => (
    <DemoShell>
      <DocsLayout
        nav={[{ items: [{ label: "All docs", href: "#docs", selected: true }] }]}
        navLabel="Docs"
        title="All docs"
        contents={[{ id: "start", label: "Start here", level: 2 }]}
      >
        <Prose>
          <Section id="start" title="Start here">
            <Text>Install the CLI, then run your first build.</Text>
          </Section>
        </Prose>
      </DocsLayout>
    </DemoShell>
  ),
};

export const DoDocs: S = {
  render: examples.DoDocs,
};

export const DontDocs: S = {
  render: examples.DontDocs,
};
