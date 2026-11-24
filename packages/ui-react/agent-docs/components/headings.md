## Headings

Group: Text

When to use: Any title on a page: the public headline, the page title, a section, a subsection.

### The one right way
One `PageHeading` names the page, `SectionHeading` its parts and `SubsectionHeading` what is inside a part.
```tsx
import {
  PageHeading,
  SectionHeading,
  Stack,
  SubsectionHeading,
  Text,
} from "@slashsuite/ui-react";

<Stack gap="sm">
  <PageHeading>Quotes</PageHeading>
  <SectionHeading rule>Open</SectionHeading>
  <SubsectionHeading>Awaiting reply</SubsectionHeading>
  <Text>Three quotes are waiting on the customer.</Text>
</Stack>
```

### Do
- A page has one title: `PageHeading` for an app page, `Display` for the headline of a public page. A `PageHeader` already draws the `PageHeading` and its `description`, so use it for the top of a page.
- Name the parts of a page with `SectionHeading`; `rule` puts the hairline under it, with the space either side built in.
- Name what is inside a part with `SubsectionHeading`: `size` `sm` is a form-group caption, `md` (default) a card title in a header bar, `lg` a drawer title. `truncate` cuts one that is too long for its column to a single line.
- Put a `Lead` under a `Display`, and a `Text` under any other heading. `Dialog` and `Drawer` draw their own title from their `title`.
- Pick the heading for its place in the outline, never for its size. `Display` is not a big `SectionHeading`.
- Each heading has its own fixed ink and takes no colour. A heading's meaning is carried by its words, not a colour.
- `as` changes the element, only to keep the outline in order, and never the look.
- `description` on a `SectionHeading` is a muted line under it that says more; it is not part of the heading's name.

### Don't
`PageHeading` is an `h1`, and a page has one. A second one for a section breaks the outline: use `SectionHeading`.
```tsx
import { PageHeading, Stack, Text } from "@slashsuite/ui-react";

<Stack gap="sm">
  <PageHeading>Quotes</PageHeading>
  <Text>Three quotes are waiting on the customer.</Text>
  <PageHeading>Open</PageHeading>
  <Text>Two quotes are open.</Text>
</Stack>
```

`Display` is marketing scale, not a section title: inside a page it dwarfs everything around it. Use `SectionHeading`.
```tsx
import { Display, PageHeading, Stack, Text } from "@slashsuite/ui-react";

<Stack gap="sm">
  <PageHeading>Dashboard</PageHeading>
  <Display as="h2">Recent activity</Display>
  <Text>Nothing has changed since yesterday.</Text>
</Stack>
```

### Accessibility
- Each heading renders a real heading element: `Display` and `PageHeading` an `h1`, `SectionHeading` an `h2`, `SubsectionHeading` an `h3`.
- `as` swaps the element and keeps the look, so the outline can follow the page without a visual change.
- `id`, `aria-*` and `data-*` go on the heading element.
- `Dialog` and `Drawer` draw their title as a `SectionHeading` and name themselves by it; an `EmptyState` does the same.

### Props
### Display
Marketing-scale headline: the one line at the top of a public page. `h1`, text-4xl/tight semibold, primary text, growing to text-6xl on wider screens. `PageHeading` is the title of an ordinary page, a step below; a brochure hero needs a display scale, so it gets its own pinned role rather than callers overriding PageHeading's size.
- as: ElementType. The element to render (each role has a semantic default); the other props follow it.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.

### PageHeading
Page title. `h1`, text-3xl/9 bold (text-4xl/10 from `sm`), tight, primary text: well above the `Lead` under it and the body text after it, so the page's title reads first.
- as: ElementType. The element to render (each role has a semantic default); the other props follow it.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.

### SectionHeading
Top-level section header. `h2`, text-xl/7 semibold, primary text (text-base/6 under an `AppShell density="compact"`, text-2xl/8 semibold tight inside a `Prose`). `rule` sets a hairline under it (the `Divider` line colour) with the space either side of the line built in. `description` is a muted line under the heading, outside the `<h2>`, so the heading's name stays the title; the rule then sits under the description.
- as: ElementType. The element to render (each role has a semantic default); the other props follow it.
- description: ReactNode. A muted line under the heading that says more. It is a paragraph beside the heading, not part of its name.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- rule: boolean. A hairline under the heading, with the space either side of it built in.

### SubsectionHeading
Nested header. `h3`, text-lg/7 semibold, primary text. `size` steps it down to `sm` (text-base, body size set apart by its weight) for a form-group caption or a dense card, or up to `lg` (text-xl) for a drawer title; `md` is the default. Under an `AppShell density="compact"` each is one step down. Inside a `Prose` `md` is text-xl/7 (the h3 of a doc), `sm` text-base/7 (the h4: body size, set apart by its weight) and `lg` text-2xl/8, the size of a `SectionHeading` there. `truncate` keeps it on one line and cuts it with an ellipsis where its container ends, the full text as the `title`.
- as: ElementType. The element to render (each role has a semantic default); the other props follow it.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- size: "sm" | "md" | "lg" (default md). The heading's type size: `sm` is text-base/6, `md` text-lg/7 and `lg` text-xl/7 (one step down
each under an `AppShell density="compact"`).
- truncate: boolean. One line, cut with an ellipsis where the container ends; the full text becomes the `title`.

### Types
- SubsectionHeadingSize: `"sm" | "md" | "lg"`. A SubsectionHeading's type size: `sm` a form-group caption, `md` a card title, `lg` a drawer title.
