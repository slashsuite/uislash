import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pill, Timeline, TimelineItem, EmptyState } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/Timeline.examples.js";

const meta: Meta = { title: "Content/Timeline" };
export default meta;
type S = StoryObj;

export const StatusHistory: S = {
  render: () => (
    <div className="max-w-md">
      <Timeline label="Status history">
        <TimelineItem title={<Pill tone="positive">accepted</Pill>} time="12 Oct 2026, 09:14">
          Client confirmed by phone.
        </TimelineItem>
        <TimelineItem title={<Pill tone="warn">sent</Pill>} time="10 Oct 2026, 16:02" />
        <TimelineItem title={<Pill tone="neutral">draft</Pill>} time="10 Oct 2026, 15:40">
          Created from the intake form.
        </TimelineItem>
      </Timeline>
    </div>
  ),
};

/** `tone` colours the marker dot with the Callout's set; the default `neutral` is a plain ring. */
export const Tones: S = {
  render: () => (
    <div className="max-w-md">
      <Timeline label="Renovation">
        <TimelineItem tone="positive" title="Paid" time="12 Oct 2026" />
        <TimelineItem tone="info" title="Booked" time="10 Oct 2026" />
        <TimelineItem tone="warn" title="Delayed" time="8 Oct 2026">
          Waiting on the tiles.
        </TimelineItem>
        <TimelineItem tone="danger" title="Rejected" time="5 Oct 2026" />
        <TimelineItem title="Planned" time="1 Oct 2026" />
      </Timeline>
    </div>
  ),
};

export const Empty: S = {
  render: () => (
    <div className="max-w-md">
      <Timeline label="Status history" empty={<EmptyState title="No history yet." />} />
    </div>
  ),
};

export const DoEvents: S = {
  render: examples.DoEvents,
};

export const DontEvents: S = {
  render: examples.DontEvents,
};

export const DoNoEvents: S = {
  render: examples.DoNoEvents,
};

export const DontNoEvents: S = {
  render: examples.DontNoEvents,
};

/** While `loading`, a timeline with no items is three items of bones, never its empty state. */
export const Loading: StoryObj<{ loading: boolean }> = {
  args: { loading: true },
  render: ({ loading }) => (
    <Timeline
      label="Status history"
      loading={loading}
      empty={<EmptyState title="No history yet" />}
    >
      {loading ? null : <TimelineItem title="Quote sent" time="Today" tone="info" />}
    </Timeline>
  ),
};
