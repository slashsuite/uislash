## Timeline

Group: Content

When to use: A history of what happened and when: status changes, a record's activity.

### Use instead
- BulletList (bullet-list.md): The items have no order and no time.
- Steps (steps.md): The items are a sequence the reader still has to follow.

### The one right way
A `title` (a Pill or a short label), the `time` already formatted for the reader, and a note under them.
```tsx
import { Pill, Timeline, TimelineItem } from "@slashsuite/ui-react";

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
```

### Do
- Name the list with `label`, and order the `TimelineItem`s yourself, newest or oldest first.
- A `TimelineItem` has a `title` (a `Pill` or a short label), a `time` you have already formatted for the reader, and an optional note as its children.
- `tone` colours the marker dot with the Callout's set (`neutral`, `info`, `positive`, `warn`, `danger`); `neutral` is a plain ring.
- Give the Timeline an `empty`, an `EmptyState`, to draw when there are no items (one muted line here); without one it draws nothing.
- Numbered instructions are `Steps`, not a Timeline.

### Don't
`time` is drawn as given: a raw ISO string reads as machine output. Format it before it gets here.
```tsx
import { Timeline, TimelineItem } from "@slashsuite/ui-react";

<Timeline label="Status history">
  <TimelineItem title="accepted" time="2026-10-12T09:14:00.000Z">
    Client confirmed by phone.
  </TimelineItem>
  <TimelineItem title="sent" time="2026-10-10T16:02:00.000Z" />
</Timeline>
```

A Timeline with no items and no `empty` draws nothing, so the reader cannot tell an empty history from a missing one. Give it an `empty`.
```tsx
import { Timeline } from "@slashsuite/ui-react";

<Timeline label="Status history" />

```

### Accessibility
- `Timeline` is an `<ol>` named by `label` (`aria-label`), and each `TimelineItem` is an `<li>`.
- The marker dot is `aria-hidden`, so `tone` is colour only: say the outcome in the `title`.
- `time` is plain text, as you formatted it.

### Props
### Timeline
A vertical list of events, newest or oldest first as the caller orders them. A named `<ol>` of `TimelineItem`s on a rail; with no children it draws `empty` (an `EmptyState`, one muted line here) instead of an empty list. While `loading` with no items it draws three items of bones, never `empty`.
- empty: ReactNode. Drawn in place of the list when there are no items: an `EmptyState`.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- label: string (required). Names the list (`aria-label`), e.g. "Status history".
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.

### TimelineItem
One event: a `title` (a `Pill`, a heading), a `time` the app has already formatted, and the `children` as a note under them. `tone` colours the marker dot with the Callout's set. While `loading` an empty `title` is a bone.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- time: ReactNode. When, already formatted by the app, small and muted beside the title.
- title: ReactNode (required). What happened: text, a `Pill` or a heading.
- tone: "neutral" | "info" | "positive" | "warn" | "danger" (default neutral). The marker dot's colour. Defaults to `neutral`, a plain ring. Say it in the text too: colour alone says nothing to a screen reader.
