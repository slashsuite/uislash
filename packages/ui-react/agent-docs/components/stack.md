## Stack

Group: Layout

When to use: Any blocks that follow each other: space is a Stack's `gap`, never a margin on a block.

### Use instead
- FormLayout (form-layout.md): The whole page is one form: header, fields, then Save and Cancel.
- FormRow (form-row.md): Fields sit side by side: a `FormGrid` of `Field`s, or a `FormRow` to edit one record on a line.

### The one right way
Blocks that follow each other go in a `Stack`: the gap is one step of the scale, `md` by default.
```tsx
import { Card, Stack, Text } from "@slashsuite/ui-react";

<Stack>
  <Card title="Build 412">
    <Text>3 changed</Text>
  </Card>
  <Card title="Build 411">
    <Text>No changes</Text>
  </Card>
</Stack>
```

### Do
- `gap` is a scale: `xs` between lines of text, `sm` inside a group, `md` between blocks, `lg` between groups, `xl` between a page's top-level blocks (the one responsive page rhythm). Left out, it comes from where the Stack sits: `xs` inside a `Card`, `Dialog`, `Drawer`, `BottomSheet`, `Callout` or `ListRow`, `md` on the page.
- `width` caps the column at the start edge: `compact` (one card or one picture's column), `narrow` (a reading measure), `wide`, `full`, or `default` for the parent's width. It is never re-centred. A width cap on any one block is a `Stack` around it: `<Stack width="compact"><Card>...</Card></Stack>`.
- `as` is `div` (default), `section`, `form`, `ul` or `ol`. `as="form"` takes the form props and spaces its fields; `as="ul"` and `as="ol"` draw no markers and their children are `<li>`s, and take `empty`, an `EmptyState` drawn as one muted line when the list has no children.
- A titled group is a `Section`: `title`, `actions` beside it, then the blocks, spaced as a `Stack`. It takes `gap` and `width` as `Stack` does. `rule` draws a hairline under the title row, `actions` included. Its title is an `h2` on the page, one level below the section that holds it, and a `Card` or `EmptyState` inside it is one below that; `level` sets it by hand.
- A small titled group (a panel's "Flaky" block, a card's "Ignore areas") is `Section size="sm"`: a small all-caps title, its blocks `xs` apart, `actions` at the end of the title row.
- `rowFrom` (`sm`, `md` or `lg`) turns the column into a row from that breakpoint and leaves it a column below: a main block beside a side column on a wide screen, stacked on a phone. Put the block that takes the width left in a `ClusterGrow`.
- A row that is a row at every width is a `Cluster`, not a Stack.
- `overline` puts a small label above a `Section`'s title, in the same `<header>`, and `description` a line under it that is not part of the heading's name.

### Don't
- Never build a landing section from an `Overline`, a `Display` and a `Lead` by hand: it is unnamed and drifts from every other one.
- Do not build a small titled group from `Stack as="section"` and an `Overline as="h2"`: it is unnamed and its gap is a guess. It is `Section size="sm"`.

Blocks in a bare `div` touch each other. Space is the Stack's job, never left to the blocks.
```tsx
import { Card, Text } from "@slashsuite/ui-react";

<div>
  <Card title="Build 412">
    <Text>3 changed</Text>
  </Card>
  <Card title="Build 411">
    <Text>No changes</Text>
  </Card>
</div>
```

A heading row built by hand is not tied to its group: nothing names the region and the row's spacing is a guess. Use `Section`.
```tsx
import { Button, Card, Cluster, SectionHeading, Stack, Text } from "@slashsuite/ui-react";

<Stack gap="sm">
  <Cluster justify="between">
    <SectionHeading>Recent builds</SectionHeading>
    <Button variant="outline">All builds</Button>
  </Cluster>
  <Card>
    <Text>Build 412 · 3 changed</Text>
  </Card>
  <Card>
    <Text>Build 411 · no changes</Text>
  </Card>
</Stack>
```

The same cards in a plain Stack are two unrelated blocks: no list, no count, nothing to jump by.
```tsx
import { Card, Stack, Text } from "@slashsuite/ui-react";

<Stack gap="sm">
  <Card>
    <Text>Build 412 · 3 changed</Text>
  </Card>
  <Card>
    <Text>Build 411 · no changes</Text>
  </Card>
</Stack>
```

Left to the page, a small card stretches across it and its few lines float in a wide box.
```tsx
import { Card, KeyValue, KeyValueList, Stack } from "@slashsuite/ui-react";

<Stack>
  <Card title="Opening hours" size="sm">
    <KeyValueList>
      <KeyValue label="Mon to Fri">08:00 to 17:00</KeyValue>
      <KeyValue label="Saturday">08:00 to 13:00</KeyValue>
      <KeyValue label="Sunday">Closed</KeyValue>
    </KeyValueList>
  </Card>
</Stack>
```

Built from a `Stack as="section"` and an `Overline as="h2"`, the group is an unnamed section whose gap is a guess.
```tsx
import { Button, Card, Cluster, Overline, Stack, Text } from "@slashsuite/ui-react";

<Card>
  <Stack gap="sm">
    <Stack as="section" gap="xs">
      <Cluster justify="between">
        <Overline as="h2">Flaky</Overline>
        <Button variant="ghost" size="sm">
          Rerun
        </Button>
      </Cluster>
      <Text>checkout.spec.ts failed once in the last 20 runs.</Text>
    </Stack>
    <Stack as="section" gap="xs">
      <Overline as="h2">Ignore areas</Overline>
      <Text>The clock in the header and the avatar.</Text>
    </Stack>
  </Stack>
</Card>
```

An `Overline`, a `Display as="h2"` and a `Lead` by hand: nothing names the region and the spacing drifts from every other landing section.
```tsx
import { Card, Display, Lead, Overline, Stack, Text } from "@slashsuite/ui-react";

<Stack as="section" gap="lg">
  <Stack gap="sm">
    <header>
      <Overline mono>Fit</Overline>
      <Display as="h2">Built for agents.</Display>
    </header>
    <Lead>A site from props alone, in every theme.</Lead>
  </Stack>
  <Card>
    <Text>Each tool answers one question about a change.</Text>
  </Card>
</Stack>
```

### Accessibility
- `Section` is a `<section>` named by its `title` (`aria-labelledby`), so it is a region; with no `title` give it an `aria-label`.
- A `Stack` with `as="ul"` or `as="ol"` is a real list: give it an `aria-label` when more than one list is on the page. `as="ul" divided` is still a list; the lines are only drawn.
- `as="form"` is a `<form>`; give it an `aria-label` or let a heading name it.
- A `div` Stack adds no role.

### Props
### Stack
A vertical column of blocks a fixed `gap` apart: `xs` between lines of text (a heading and the line under it), `sm` inside a group, `md` between blocks, `lg` between groups, `xl` between a page's top-level blocks (`gap-12`, `sm:gap-16`: the one responsive page rhythm). Left out, the gap comes from where the Stack sits: `xs` inside a `Card`, `Dialog`, `Drawer`, `BottomSheet`, `Callout` or `ListRow`, and `md` on the page. `width` caps the column: `compact` is the width of one card or one picture's column (28rem), `narrow` is a reading measure, `wide` is wider again, `full` is the parent's whole width and `default` sets nothing. A capped Stack starts at its parent's start edge (it is never re-centred), so its first line lines up with every other block on the page. A width cap on any one block (a `Card`, an `Image`) is a Stack around it. `align="start"` keeps each child at its own width, capped at the column's (a `Button` under a form's fields); left out, every child spans the column. `divided` draws a line between each pair of children and sets them touching, with no gap: it is for rows that carry their own padding (`ListRow`s in a `Card flush`). Space and a line between blocks is a `Divider` in the Stack instead. `rowFrom` turns the column into a row from `sm`, `md` or `lg` (a column below it): the blocks sit side by side, `gap` apart, and a `ClusterGrow` around one of them takes the width left. Without it the Stack is always a column; a row that is a row at every width is a `Cluster`. `as` is a closed set: `div` (default), `section`, `form`, `ul` or `ol`. A `form` takes the form props (`onSubmit`, `action`, `method`, `noValidate`, ...). A `ul` or `ol` is drawn with no markers and its children are `<li>`s, as in `BulletList` and `Timeline`: the Stack does not wrap them, so a child is one list item and `Text as="li"` or a bare `<li>` both work. A `ul` or `ol` takes `empty` (an `EmptyState`, one muted line here), drawn in place of the list when it has no children.
- align: "start" | "stretch" (default stretch). Where the children sit across the column: `stretch` spans it, `start` keeps each child at its
own width (a `Button` under a form's fields).
- as: "div" | "form" | "ol" | "section" | "ul". The element: `div`, `section`, `form` (takes the form's props), `ul` or `ol` (no markers; each child is an `<li>`).
- divided: boolean. A line between each pair of children, which then touch (no gap): rows that carry their own
padding. Space and a line between blocks is a `Divider` in the Stack instead.

Such as `ListRow`s in a `Card flush`.
- empty: ReactNode. Drawn in place of the list when it has no children: an `EmptyState`.
- gap: "sm" | "md" | "lg" | "xs" | "xl" (default xs inside a `Card`, `Dialog`, `Drawer`, `BottomSheet`, `Callout` or `ListRow`, else md). The space between blocks: `xs` gap-2, `sm` gap-4, `md` gap-6, `lg` gap-8, `xl` gap-12 (gap-16 from `sm`).
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- rowFrom: "sm" | "md" | "lg". Turns the column into a row from this breakpoint (`sm`, `md` or `lg`), a column below it: a main
area beside a side column on a wide screen, stacked on a phone. In the row the blocks sit side by side
the same `gap` apart and are as tall as the tallest; wrap the one that takes the width left in a
`ClusterGrow`. Left out, the Stack is always a column.
- width: "compact" | "narrow" | "full" | "default" | "wide" (default default). Caps the column: `compact` max-w-md (one card or one picture's column), `narrow` max-w-3xl (a
reading measure), `wide` max-w-5xl, `full` the parent's whole width, `default` sets nothing.

### Section
A `<section>` Stack with an optional title (which names it) and `actions`. Its blocks are `gap` apart, from where it sits as in a `Stack`. `level` is the title's heading level, one below the heading that holds the section (an `h2` on the page), and a heading inside it (a `Card`'s title) is one below that. A line between two sections is a `Divider` in the `Stack` that holds them. `size` picks the scale: - `md` (default): a page's section. A `SectionHeading` title with `actions` at the end of its row; `rule` draws a hairline under the row, `overline` a small label above the title and `description` a muted line under it. - `sm`: the small titled group inside a page, a card, a drawer or a side panel (a panel's "Flaky" block, a card's "Ignore areas"): the title small and all-caps like a `Card`'s, the blocks `xs` apart. Never build one from a `Stack as="section"` and an `Overline`. - `lg`: a landing page's section under the `Hero`: a mono `overline` kicker, the title at display size, `description` as a `Lead` and `actions` under it as its calls to action, the opening capped at the reading measure at the start edge, the blocks `lg` apart. It ignores the prose scale.
- actions: ReactNode. Buttons or links: at the end of the title row, or under the description at `size="lg"`.
- description: ReactNode. The line under the title, outside the heading: a muted line at `md`, a `Lead` at `lg`.
- gap: "sm" | "md" | "lg" | "xs" | "xl" (default xs at `size="sm"`, lg at `size="lg"`; else xs inside a `Card`, `Dialog`, `Drawer`, `BottomSheet`, `Callout` or `ListRow`, else md). The space between blocks: `xs` gap-2, `sm` gap-4, `md` gap-6, `lg` gap-8, `xl` gap-12 (gap-16 from `sm`).
- id: string. Makes the section a link target: `#<id>` scrolls to its heading, which stops below the sticky
AppShell header, as every `id` inside the shell does; write no `scroll-margin`. Needs a `title`:
with no title the heading that carries it is not rendered.
The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- level: 2 | 3 | 4 | 5 | 6 (default one below the heading that holds the section: 2 on the page). The title's heading level, 2 to 6. It does not change how the title looks.
- overline: ReactNode. A small label above the title, in the same `<header>` (mono at `size="lg"`). Needs a `title`.
- rule: boolean (default false). A hairline under the title row across the section's width, `actions` included. Needs a
`title` or `actions`.
- size: "sm" | "md" | "lg" (default md). `sm` a small titled group inside a page, a card or a panel, its title small and all-caps
and its blocks `xs` apart; `md` a page's section; `lg` a landing page's section, a display
title under a mono kicker, a `Lead`, then its calls to action.

A landing page's section under the `Hero` is `size="lg"`: its opening is capped at the
reading measure at the start edge and its blocks sit `lg` apart. A feature card in it is
a `Card href icon titleStyle="name"` in a `CardGrid`; text beside code is a `SideColumn`.
- title: ReactNode. The heading at the top, which names the section.
- width: "compact" | "narrow" | "full" | "default" | "wide" (default default). Caps the column: `compact` max-w-md (one card or one picture's column), `narrow` max-w-3xl (a
reading measure), `wide` max-w-5xl, `full` the parent's whole width, `default` sets nothing.

### Types
- SectionSize: `"sm" | "md" | "lg"`. A `Section`'s scale: `sm` a small titled group, `md` a page's section, `lg` a landing page's section.
- StackAlign: `"start" | "stretch"`. Where a Stack's children sit across the column: `stretch` spans it, `start` keeps each child's own width.
- StackGap: `"sm" | "md" | "lg" | "xs" | "xl"`. The space between a `Stack`'s blocks, on the gap scale: `xs` 8px, `sm` 16px, `md` 24px, `lg` 32px, `xl` 48px (64px from `sm`).
- StackRowFrom: `"sm" | "md" | "lg"`. The breakpoint from which a `Stack` turns from a column into a row: `sm`, `md` or `lg`.
- StackWidth: `"compact" | "narrow" | "default" | "wide" | "full"`. A `Stack`'s width cap at the start edge: `compact`, `narrow` (a reading measure), `default`, `wide` or `full`.
