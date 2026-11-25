import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Card,
  CardGrid,
  CardGridRow,
  EmptyState,
  PageHeader,
  StatTile,
  Text,
} from "@slashsuite/ui-react";
import { DemoShell, layoutPage } from "../../../../packages/ui-react/docs/examples/DemoShell.js";
import { StatTiles } from "./pages";
import * as examples from "../../../../packages/ui-react/docs/examples/CardGrid.examples.js";

/** One column on a phone, two from `sm`, `columns` from `lg`; `columns="auto"` fills by a minimum card width. */
const meta: Meta = {
  title: "Layout/CardGrid",
  parameters: { layout: "fullscreen", bare: true },
  beforeEach: layoutPage,
};
export default meta;
type S = StoryObj;

export const FullPage: S = {
  render: examples.FullPage,
};

/** With no children the grid draws its `empty`, an `EmptyState` at its full size. */
export const Empty: S = {
  render: () => (
    <DemoShell>
      <CardGrid empty={<EmptyState title="No projects yet." />}>{[]}</CardGrid>
    </DemoShell>
  ),
};

export const FourColumns: S = {
  render: () => (
    <DemoShell>
      <PageHeader title="Business" description="This month at a glance." />
      <StatTiles columns={4} />
    </DemoShell>
  ),
};

export const ThreeColumns: S = {
  render: () => (
    <DemoShell>
      <PageHeader title="Business" description="This month at a glance." />
      <StatTiles columns={3} />
    </DemoShell>
  ),
};

export const TwoColumns: S = {
  render: () => (
    <DemoShell>
      <PageHeader title="Business" description="This month at a glance." />
      <StatTiles columns={2} />
    </DemoShell>
  ),
};

const shots = [
  ["Dashboard", "One line."],
  [
    "Settings",
    "A longer note that wraps onto a couple of lines, so the cards beside it are different heights.",
  ],
  ["Billing", "Two short lines\nof text."],
  ["Members", "One line."],
  ["Audit log", "One line."],
] as const;

function Shots({ minWidth, align }: { minWidth?: "sm" | "md"; align?: "start" | "stretch" }) {
  return (
    <DemoShell>
      <PageHeader title="Shots" description="As many per row as the width allows." />
      <CardGrid columns="auto" minWidth={minWidth} align={align}>
        {shots.map(([title, note]) => (
          <Card key={title} title={title}>
            <p className="text-sm text-slate-700">{note}</p>
          </Card>
        ))}
      </CardGrid>
    </DemoShell>
  );
}

/** `columns="auto"`: as many per row as fit, none narrower than `md` (17rem, the default). */
export const AutoFill: S = { render: () => <Shots /> };

/** `minWidth="sm"` (12rem) fits more, smaller cards per row. */
export const AutoFillSmall: S = { render: () => <Shots minWidth="sm" /> };

/** `align="start"` keeps each card its own height instead of stretching to the tallest in the row. */
export const AlignStart: S = { render: () => <Shots align="start" /> };

/** `align="regions"` lines up each card's title, body and footer across the row (subgrid), so a short title's body starts level with a long one's. */
export const AlignRegions: S = {
  render: () => (
    <DemoShell>
      <PageHeader title="Plans" description="Pick the one that fits." />
      <CardGrid columns={3} align="regions">
        <Card title="Free" footer={<Button>Start free</Button>}>
          <Text tone="muted">One site, community help.</Text>
        </Card>
        <Card
          title="Studio, for small teams who ship every week"
          footer={<Button>Start a trial</Button>}
        >
          <Text tone="muted">Five sites, shared themes and email help on weekdays.</Text>
        </Card>
        <Card title="Agency" footer={<Button>Talk to us</Button>}>
          <Text tone="muted">Every site you run.</Text>
        </Card>
      </CardGrid>
    </DemoShell>
  ),
};

/** `minColumns={2}` keeps two tiles to a row on a phone, for small tiles such as stats. */
export const TwoOnAPhone: S = {
  render: () => (
    <DemoShell>
      <PageHeader title="Business" description="This month at a glance." />
      <CardGrid columns={4} minColumns={2}>
        <StatTile label="Open" value="12" />
        <StatTile label="Won" value="8" tone="positive" />
        <StatTile label="Lost" value="3" tone="danger" />
        <StatTile label="Stale" value="2" />
      </CardGrid>
    </DemoShell>
  ),
};

/** `CardGridRow` holds one child across the whole row, such as a wide card above the tiles. In an `as="ul"` grid it is its own list item. */
export const FullRow: S = {
  render: () => (
    <DemoShell>
      <PageHeader title="Business" description="This month at a glance." />
      <CardGrid columns={3}>
        <CardGridRow>
          <Card title="Revenue">
            <Text tone="muted">Up 12% on last month.</Text>
          </Card>
        </CardGridRow>
        <StatTile label="Open" value="12" />
        <StatTile label="Won" value="8" tone="positive" />
        <StatTile label="Lost" value="3" tone="danger" />
      </CardGrid>
      <CardGrid as="ul" columns={3} aria-label="Shops">
        <CardGridRow>
          <Card title="Cove Hardware">Harbour Road, open every day.</Card>
        </CardGridRow>
        <Card title="Long Street">Open until six.</Card>
        <Card title="Kloof Street">Open until five.</Card>
        <Card title="Bree Street">Closed on Sundays.</Card>
      </CardGrid>
    </DemoShell>
  ),
};

/** `as="ul"` makes the grid a list and each child a list item, for tiles that are a set of like things a screen reader should count. The look is the same. */
export const AsList: S = {
  render: () => (
    <DemoShell>
      <PageHeader title="Business" description="This month at a glance." />
      <CardGrid as="ul" columns={3} aria-label="This month">
        <StatTile label="Open" value="12" />
        <StatTile label="Won" value="8" tone="positive" />
        <StatTile label="Lost" value="3" tone="danger" />
      </CardGrid>
    </DemoShell>
  ),
};

export const DoTiles: S = {
  render: examples.DoTiles,
};

export const DontTiles: S = {
  render: examples.DontTiles,
};

export const DoAuto: S = {
  render: examples.DoAuto,
};

export const DontAuto: S = {
  render: examples.DontAuto,
};

/** While `loading` it owns the wait, and every part inside waits with it. */
export const Loading: StoryObj<{ loading: boolean }> = {
  args: { loading: true },
  render: ({ loading }) => (
    <CardGrid loading={loading} empty={<EmptyState title="No shops yet" />}>
      {loading ? null : <Card title="Cove Hardware">Harbour Road</Card>}
    </CardGrid>
  ),
};
