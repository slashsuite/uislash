## Hero

Group: Layout

When to use: The first block of a site's landing page, and nowhere else: every other page opens with a `PageHeader`.

### The one right way
A landing page opens with one `Hero`: the overline, the title and the lede, over the theme's glow.
```tsx
import { Hero, Lead } from "@slashsuite/ui-react";

<Hero overline="Products" title="Software we make.">
  <Lead>A component library and the tools we build it with.</Lead>
</Hero>
```

### Do
- One `Hero` per page, and only on the landing page: it is the page's top block. Inner pages use `PageHeader`.
- Pass `title` and, if it has one, `overline`; put a `Lead` in `children`, then the page's first actions in a `Cluster` if there are any: a primary `Button` and an `outline` or `ghost` one in the default tone, or a `TextLink`. That is the text the theme's contrast check holds over the glow.
- The glow is always on and takes no prop. Its colours and its strength are the theme's, so a paper theme keeps it faint.
- It caps itself at a reading measure at the parent's start edge, and the glow is clipped to it, so a phone never scrolls sideways. Put it as the first child of the page's `Stack`.

### Don't
- Never build the block from an `Overline`, a `Display` and a `Lead` by hand: the hand-built one has no glow and drifts from the one top block.

An overline, a `Display` and a `Lead` put together by hand drift from the one top block, and have no glow. Use `Hero`.
```tsx
import { Display, Lead, Overline, Stack } from "@slashsuite/ui-react";

<Stack gap="sm" width="narrow">
  <header>
    <Overline mono>Products</Overline>
    <Display>Software we make.</Display>
  </header>
  <Lead>A component library and the tools we build it with.</Lead>
</Stack>
```

A `Hero` on an inner page shouts over the content it heads. Use `PageHeader`.
```tsx
import { Hero, Lead } from "@slashsuite/ui-react";

<Hero title="Members">
  <Lead>Who can see this project.</Lead>
</Hero>
```

### Accessibility
- The title is the page's `<h1>`, in a `<header>` with the overline.
- The glow is `aria-hidden="true"` and takes no pointer; the text sits above it and holds AA contrast over it in every theme.
- The glow drifts only under `prefers-reduced-motion: no-preference`; with reduced motion it stands still. It is plain markup and CSS, so it renders on the server and needs no script.

### Props
### Hero
A landing page's top block: an overline, the display title (the page's `h1`) and the lede under it, over a soft glow of three tilted ribbons that drift slowly behind the text. The glow is always there and its colours and strength are the theme's (the palette's `glow` role), so a paper theme keeps it faint. It is anchored to the text's own column (`max-w-3xl`, at the parent's start edge), never the viewport, and clipped to it, so nothing scrolls sideways on a phone. It is `aria-hidden`, and the text sits above it. Under `prefers-reduced-motion: reduce` it stands still. Pure markup and one inline stylesheet: it works rendered on the server with no script. One per page, on a landing page; every other page opens with a `PageHeader`.
- children: ReactNode. What follows the title: a `Lead`, and the page's first actions if it has any.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- overline: ReactNode. The small label above the title, set in the monospace face.
- title: ReactNode (required). The page's `h1`, at display size.
