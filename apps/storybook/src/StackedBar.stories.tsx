import type { Meta, StoryObj } from "@storybook/react-vite";
import { Legend, StackedBar, type StackedSegment, type VizTone } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/StackedBar.examples.js";

const CATS: VizTone[] = ["cat1", "cat2", "cat3", "cat4", "cat5", "cat6", "cat7", "cat8"];

const meta: Meta = { title: "Data/StackedBar", parameters: { layout: "padded" } };
export default meta;
type S = StoryObj;

const snapshot: StackedSegment[] = [
  { label: "Changed", value: 24, tone: "warn" },
  { label: "New", value: 9, tone: "info" },
  { label: "Removed", value: 4, tone: "danger" },
  { label: "Same", value: 163, tone: "muted" },
];

/** Any number of parts, each a `VizTone` (`neutral`, `muted`, `accent`, `info`, `positive`, `warn`, `danger`), sized by its share. The consumer maps its own roles to tones. */
export const Default: S = {
  render: () => (
    <div className="max-w-md">
      <StackedBar items={snapshot} label="Screenshots by status" />
    </div>
  ),
};

/** `legend` draws the key under the bar: each part's label and value, so colour is never the only signal. */
export const WithLegend: S = {
  render: () => (
    <div className="max-w-md">
      <StackedBar items={snapshot} label="Screenshots by status" legend />
    </div>
  ),
};

const buildMix: StackedSegment[] = [
  { label: "Changed", value: 24, tone: "warn" },
  { label: "New", value: 9, tone: "info" },
  { label: "Removed", value: 4, tone: "danger" },
  { label: "Unmeasured", value: 31, tone: "neutral" },
  { label: "Same", value: 132, tone: "muted" },
];

/** Five parts that stay apart: `neutral` is a grey distinct from `muted`, so "unmeasured" and "same" never collide. */
export const BuildMix: S = {
  render: () => (
    <div className="max-w-md">
      <StackedBar items={buildMix} label="Build by status" legend />
    </div>
  ),
};

/** The remainder that matters least is `quiet`: no fill, the track showing through, and always the key under it. */
export const QuietRemainder: S = {
  render: () => (
    <div className="max-w-md">
      <StackedBar
        items={[
          { label: "Changed", value: 4, tone: "warn" },
          { label: "Failed", value: 2, tone: "danger" },
          { label: "Same", value: 132, tone: "muted" },
          { label: "Not measured", value: 31, tone: "quiet" },
        ]}
        label="Build by status"
      />
    </div>
  ),
};

export const Sizes: S = {
  render: () => (
    <div className="flex max-w-md flex-col gap-3">
      <StackedBar items={snapshot} size="sm" label="sm, 6px" />
      <StackedBar items={snapshot} label="md, 8px (the default)" />
      <StackedBar items={snapshot} size="lg" label="lg, 12px" />
    </div>
  ),
};

export const Edges: S = {
  render: () => (
    <div className="flex max-w-md flex-col gap-3">
      <StackedBar items={snapshot.map((s) => ({ ...s, value: 0 }))} label="Nothing yet" />
      <StackedBar
        items={[
          { label: "Passed", value: 1, tone: "positive" },
          { label: "Failed", value: 999, tone: "danger" },
        ]}
        label="A sliver stays visible"
      />
    </div>
  ),
};

/** `Legend` alone is the key for colours drawn elsewhere (a `TableRow stripe`, a chart). */
export const LegendOnly: S = {
  render: () => (
    <Legend
      items={[
        { label: "Changed", tone: "warn" },
        { label: "New", tone: "info" },
        { label: "Removed", tone: "danger" },
        { label: "Same", tone: "muted" },
      ]}
    />
  ),
};

/** `accent` is the seventh tone, and `swatch="dashed"` is a dashed ring with no fill: the key for an outline drawn over the chart. */
export const LegendSwatches: S = {
  render: () => (
    <Legend
      items={[
        { label: "Current", tone: "accent" },
        { label: "Snapshot", tone: "accent", swatch: "dashed" },
        { label: "Unmeasured", tone: "neutral" },
        { label: "Unmeasured overlay", tone: "neutral", swatch: "dashed" },
        { label: "Changed", tone: "warn", swatch: "dashed", detail: 24 },
      ]}
    />
  ),
};

export const DoLegend: S = {
  render: examples.DoLegend,
};

export const DontLegend: S = {
  render: examples.DontLegend,
};

const shops = [
  { label: "Vintage", value: 14 },
  { label: "Books", value: 9 },
  { label: "Furniture", value: 7 },
  { label: "Clothing", value: 12 },
  { label: "Records", value: 4 },
  { label: "Toys", value: 5 },
  { label: "Art", value: 3 },
  { label: "Kitchen", value: 6 },
];

/** Eight categories in the categorical scale, `cat1` to `cat8` in order, named by the legend. */
export const Categories: S = {
  render: () => (
    <StackedBar
      items={shops.map((shop, i) => ({ ...shop, tone: CATS[i] ?? "cat1" }))}
      label="Shops by category"
      legend
    />
  ),
};

export const DoCategories: S = {
  render: examples.DoCategories,
};

export const DontCategories: S = {
  render: examples.DontCategories,
};

/** While `loading` the bar is one bone and the key keeps its names; a key with no entries is bones. */
export const Loading: StoryObj<{ loading: boolean }> = {
  args: { loading: true },
  render: ({ loading }) => (
    <div className="flex max-w-md flex-col gap-4">
      <StackedBar
        loading={loading}
        legend
        label="Screenshots by status"
        items={[
          { label: "Changed", value: 24, tone: "warn" },
          { label: "Same", value: 163, tone: "muted" },
        ]}
      />
      <Legend loading={loading} items={loading ? [] : [{ label: "Current", tone: "accent" }]} />
    </div>
  ),
};
