## ProseLayout

Group: Page layouts

When to use: Privacy, terms, help or any page that is mostly paragraphs.

### The one right way
Text pages (privacy, terms, help) are one reading column; the header sits inside it.
```tsx
import { ProseLayout, SectionHeading, Text } from "@slashsuite/ui-react";

<ProseLayout title="Privacy" description="How we handle your data.">
  <SectionHeading>What we keep</SectionHeading>
  <Text>We keep your account details and the quotes you send, and nothing else.</Text>
  <SectionHeading>Who sees it</SectionHeading>
  <Text>Only you and the people you invite to your organisation.</Text>
</ProseLayout>
```

### Full page
A whole text page: the shell with its brand and nav, then one reading column with the header inside it.
```tsx
import { AppShell, Tabs, ProseLayout, SectionHeading, Text } from "@slashsuite/ui-react";

<AppShell
  brand={<a href="#">Hack Cove</a>}
  nav={
    <Tabs
      label="Main"
      items={[
        { label: "Quotes", href: "#quotes", selected: true },
        { label: "Clients", href: "#clients" },
      ]}
    />
  }
>
  <ProseLayout title="Privacy" description="How we handle your data.">
    <SectionHeading>What we keep</SectionHeading>
    <Text>We keep your account details and the quotes you send, and nothing else.</Text>
    <SectionHeading>Who sees it</SectionHeading>
    <Text>Only you and the people you invite to your organisation.</Text>
  </ProseLayout>
</AppShell>
```

### Do
- The text is the `children`: `SectionHeading`s and `Text` paragraphs, spaced `md` apart.
- `gap` picks another spacing from the same scale (`xs` to `xl`) for the whole page; the default is right for most pages.
- The header sits inside the column, so its `actions` stay beside the text.
- The `description` is the page's lede, set larger than the paragraphs after it, and the title above it is the strongest text on the page.
- `width` is `narrow` (the reading column, the default), `wide` or `full`. Use `wide` for a page that is not long prose, such as pricing, so it does not leave the right third empty; a paragraph and the lede keep their reading measure.
- Data or cards in a grid are not prose: use `ListLayout` or `CardGrid`.

### Don't
`ListLayout` is for lists: its content runs the full width, so lines of text get too long to read. Use `ProseLayout`.
```tsx
import { Card, ListLayout, Text } from "@slashsuite/ui-react";

<ListLayout title="Privacy" description="How we handle your data.">
  <Card>
    <Text>
      We keep your account details and the quotes you send, and nothing else. Only you and the
      people you invite to your organisation can see them.
    </Text>
  </Card>
</ListLayout>
```

### Accessibility
- The title is the page's `h1`.
- Use `SectionHeading` for sections so the outline runs h1 then h2.
- `data-*` and `aria-*` go on the column's wrapper.

### Props
### ProseLayout
A text page: header, then `children` stacked `gap` apart (`md` by default), all in one column that starts at the Container's start edge (it is not re-centred, so the title does not jump). `width` sets the column: `narrow` (`max-w-3xl`, the default) is a reading measure; `wide` (`max-w-5xl`) and `full` (the Container's whole width) suit a page that is not long prose, such as a pricing page. Paragraphs (`Text`) and the header's lede keep their own reading measure whatever the width. Unlike `FormLayout` the header sits inside the column, so its `actions` stay beside the text instead of at the Container's far edge. While `loading` it owns the wait and passes it to everything inside, the header too.
- actions: ReactNode. Right of the title on `sm` and up, below it on a phone.
- breadcrumbs: ReactNode. A `Breadcrumbs` above the title.
- description: ReactNode. The lede under the title: a `Lead`, so it outranks the body text after it.
- gap: "sm" | "md" | "lg" | "xs" | "xl" (default md). The space between blocks: `xs` gap-2, `sm` gap-4, `md` gap-6, `lg` gap-8, `xl` gap-12 (gap-16 from `sm`).
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- tabs: ReactNode. A `Tabs` (or similar) under the title.
- title: ReactNode (required). The page's `h1`.
- width: "narrow" | "full" | "wide" (default narrow). The column's width: `narrow` max-w-3xl, `wide` max-w-5xl, `full` the Container's width.
