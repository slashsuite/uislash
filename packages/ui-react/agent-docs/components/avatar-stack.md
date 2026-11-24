## AvatarStack

Group: Content

When to use: Who is in something (a team, the reviewers, the people on a page) where one row says it.

### The one right way
With many people, `max` keeps the row short and the "+N" says how many more there are.
```tsx
import { AvatarStack } from "@slashsuite/ui-react";

<AvatarStack
  items={[
    { name: "Ada Lovelace" },
    { name: "Grace Hopper" },
    { name: "Linus Torvalds" },
    { name: "Margaret Hamilton" },
    { name: "Dennis Ritchie" },
    { name: "Ken Thompson" },
  ]}
  max={4}
/>
```

### Do
- Pass `items`, each with the full `name` and an optional local `src`, as for `Avatar`.
- Each avatar overlaps the one before it, in a ring in the page colour that keeps them apart. Draw no ring or overlap of your own.
- `max` shows the first `max` and a "+N" chip of the same size and shape for the rest; leave it off to show everyone.
- `size` and `shape` are `Avatar`'s and apply to every avatar and the chip: `square` for a stack of orgs or teams.

### Don't
Avatars side by side are a row of separate marks: they take the width of the whole team and read as a list, not a group.
```tsx
import { Avatar, Cluster } from "@slashsuite/ui-react";

<Cluster gap="xs">
  <Avatar name="Ada Lovelace" />
  <Avatar name="Grace Hopper" />
  <Avatar name="Linus Torvalds" />
  <Avatar name="Margaret Hamilton" />
  <Avatar name="Dennis Ritchie" />
  <Avatar name="Ken Thompson" />
</Cluster>
```

### Accessibility
- The stack is one `role="img"` named by the people in it ("Ada Lovelace, Grace Hopper and 3 more"); the avatars inside are hidden from a screen reader.
- The +N chip is hidden from a screen reader (the name already counts the rest) and its `title` lists who it stands for.
- `aria-*` and `data-*` props go on the root element.

### Props
### AvatarStack
Members as a row of overlapping avatars, each in a ring in the page colour that separates it from the next. With `max`, the first `max` show and a "+N" chip of the same size and shape stands for the rest. The row is one image to assistive tech, named by the people in it. While `loading` with no `items` yet it draws three avatar bones.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- items: readonly AvatarStackPerson[] (required). Who is in the stack, in order. Give each person's full name, as for `Avatar`.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- max: number. How many avatars show before a "+N" chip takes the rest. Without it every person shows.
- shape: "round" | "square" (default round). `square` for a stack of orgs or teams, as `Avatar`'s `shape`.
- size: "sm" | "md" | "lg" | "xs" | "xl" | "2xl" | "3xl" (default md). The size of every avatar and of the chip, as `Avatar`'s `size`.

### Types
- AvatarStackPerson: `{ name: string; src?: string }`. One member of an `AvatarStack`: the same `name` and optional local `src` an `Avatar` takes.
