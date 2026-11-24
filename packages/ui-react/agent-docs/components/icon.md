## Icon

Group: Actions

When to use: A glyph beside text or inside a control: a flag in a row, a camera in a Button, or a feature icon (`name` at `feature` size) that stands for an idea.

### The one right way
A bare `<svg>` goes in an `Icon`, which sizes and tones it, and a Button beside text needs nothing more.
```tsx
import { Button, Icon } from "@slashsuite/ui-react";

<Button variant="outline">
  <Icon>
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 6.5h3l1.5-2h5L14 6.5h3v9H3Z" strokeLinejoin="round" />
      <circle cx="10" cy="11" r="2.75" />
    </svg>
  </Icon>
  Capture
</Button>
```

### Do
- `name` picks one of the library's icons, all on one grid and one stroke: `diff`, `baseline`, `review`, `ci`, `self-host`, `privacy`, `capture`, `branch`, `theme`, `speed`, `search`, `chevron-right`, `chevron-down`, `close`, `external-link`, `settings`, `bell`, `check`, `plus`, `more`, `grid`, `window`, `type`, `card`, `pointer`, `field`, `table`, `compass`, `page` and `briefcase`. Each is named for its idea or action, not a product. Prefer one to drawing your own.
- For a glyph the set lacks, put a bare `<svg>` (with a `viewBox`, no size or colour classes) in an `Icon`; it fills the box.
- `size` is `sm` (14px), `md` (16px, the default), `lg` (20px) or `feature` (32px), for an icon that stands for an idea on its own. A feature card takes its icon through `Card`'s `icon`.
- `tone` is a text tone: `neutral`, `muted`, `accent`, `info`, `positive`, `warn` or `danger`. Left out, the icon takes the colour of the text around it, so draw the glyph with `currentColor`.
- An icon that is a button is an `IconButton`.

### Don't
A bare `<svg>` with its own size and colour is a one-off: each one picks its own size and colour, and none follows the theme's muted text.
```tsx
import { Button } from "@slashsuite/ui-react";

<Button variant="outline">
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="#5ec8ff"
    strokeWidth="1.6"
    width="18"
    height="18"
  >
    <path d="M3 6.5h3l1.5-2h5L14 6.5h3v9H3Z" strokeLinejoin="round" />
    <circle cx="10" cy="11" r="2.75" />
  </svg>
  Capture
</Button>
```

### Accessibility
- An Icon is decorative and `aria-hidden` by default: the text beside it says what it means.
- An icon that carries meaning on its own takes a `label`, which makes it `role="img"` with that name.

### Props
### Icon
One inline icon, sized to a fixed box (sm 14px, md 16px, lg 20px, `feature` 32px) and drawn in `currentColor`, so it takes the text colour around it unless a `tone` says otherwise. `name` picks one of the library's own icons, all drawn on one grid with one stroke: feature ideas (`diff`, `baseline`, `review`, `ci`, `self-host`, `privacy`, `capture`, `branch`, `theme`, `speed`, `search`) and UI glyphs (`chevron-right`, `chevron-down`, `close`, `external-link`, `settings`, `bell`, `check`, `plus`, `more`) and the ideas the docs sections stand for (`grid`, `window`, `type`, `card`, `pointer`, `field`, `table`, `compass`, `page`, `briefcase`); without a name, a bare `<svg>` child fills the box. It is decorative (`aria-hidden`) by default; a `label` makes it an image with that name, for an icon that carries meaning no text beside it says.
- children: ReactNode. The `<svg>`, drawn in `currentColor`; it fills the box.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- label: string. Names the icon (`role="img"`). Without one the icon is hidden from assistive tech.
- name: "page" | "grid" | "search" | "table" | "type" | "diff" | "baseline" | "review" | "ci" | "self-host" | "privacy" | "capture" | "branch" | "theme" | "speed" | "chevron-right" | "chevron-down" | "close" | "external-link" | "settings" | "bell" | "check" | "plus" | "more" | "window" | "card" | "pointer" | "field" | "compass" | "briefcase". One of the library's icons, named for the idea it stands for.
- size: Size | ResponsiveSize | "feature" (default md). The box: sm 14px, md 16px (the default), lg 20px, `feature` 32px for an icon that stands for an idea on its own (a feature card). `{ base, md }` (sm, md, lg) changes at the `md` breakpoint (48rem), as the icon in a Button of that size does.
- tone: "neutral" | "info" | "positive" | "warn" | "danger" | "muted" | "accent". A text tone. Left out, the icon takes the colour of the text around it.

### Types
- IconName: `"baseline" | "diff" | "review" | "ci" | "self-host" | "privacy" | "capture" | "branch" | "theme" | "speed" | "search" | "chevron-right" | "chevron-down" | "close" | "external-link" | "settings" | "bell" | "check" | "plus" | "more" | "grid" | "window" | "type" | "card" | "pointer" | "field" | "table" | "compass" | "page" | "briefcase"`. The names of the icon set: feature ideas, then UI glyphs, then the ideas the docs sections stand for.
