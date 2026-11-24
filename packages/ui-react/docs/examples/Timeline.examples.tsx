import { Pill, Timeline, TimelineItem, EmptyState } from "@slashsuite/ui-react";

/** A `title` (a Pill or a short label), the `time` already formatted for the reader, and a note under them. */
export const DoEvents = () => (
  <Timeline label="Status history">
    <TimelineItem
      tone="positive"
      title={<Pill tone="positive">accepted</Pill>}
      time="12 Oct 2026, 09:14"
    >
      Client confirmed by phone.
    </TimelineItem>
    <TimelineItem title={<Pill tone="warn">sent</Pill>} time="10 Oct 2026, 16:02" />
  </Timeline>
);

/** `time` is drawn as given: a raw ISO string reads as machine output. Format it before it gets here. */
export const DontEvents = () => (
  <Timeline label="Status history">
    <TimelineItem title="accepted" time="2026-10-12T09:14:00.000Z">
      Client confirmed by phone.
    </TimelineItem>
    <TimelineItem title="sent" time="2026-10-10T16:02:00.000Z" />
  </Timeline>
);

/** With no items, `empty` is drawn in place of the list. */
export const DoNoEvents = () => (
  <Timeline label="Status history" empty={<EmptyState title="No history yet." />} />
);

/** A Timeline with no items and no `empty` draws nothing, so the reader cannot tell an empty history from a missing one. Give it an `empty`. */
export const DontNoEvents = () => <Timeline label="Status history" />;
