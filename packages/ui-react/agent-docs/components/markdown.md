## Markdown

Group: Text

When to use: Text that arrives as markdown, such as an agent's summary, shown on a page.

### The one right way
`Markdown` renders `##` and `###` headings, `-` bullets, `**bold**` and plain paragraphs, as text nodes and never as HTML.
```tsx
import { Markdown } from "@slashsuite/ui-react";

<Markdown
  md={
    "## What I did\n- **HC-142** shipped the EmptyState\n- Fixed the Pill label wrap\n\n" +
    "### Next\nReview the Steps copy."
  }
/>
```

### Do
- Pass the markdown as `md`. It renders `##` as a label heading, `###` as a subheading, lines starting `- ` or `* ` as bullets, `**bold**` and plain paragraphs.
- Nothing else is supported: no `#` title, numbered list, link, code span, table or HTML. Those show as plain text.
- The text becomes React nodes and never HTML, so untrusted text cannot inject markup.
- Text you write yourself is not markdown: use `Text`, `BulletList` and the heading components.

### Don't
A `#` title, a numbered list, a link or a code span is not supported: each shows as literal text.
```tsx
import { Markdown } from "@slashsuite/ui-react";

<Markdown
  md={
    "# What I did\n1. Shipped the EmptyState\n2. Fixed the Pill\n\n" +
    "See [the ticket](https://example.com) and `bun install`."
  }
/>
```

### Accessibility
- `##` renders an `h2` and `###` an `h3`, bullets render a `ul` with `li`s, bold a `strong` and a paragraph a `p`.
- The headings start at `h2`, so the page needs its own `h1` above.
- `aria-*` and `data-*` go on the root.

### Props
### Markdown
A small, safe Markdown renderer for short notes: `## ` and `### ` headings, `- ` or `* ` bullets, `**bold**` and paragraphs. Text is rendered as React nodes, never as HTML. While `loading` with no `md` yet it draws a paragraph of bones.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- md: string | undefined (required). The Markdown source; while `loading`, none yet is a paragraph of bones.
