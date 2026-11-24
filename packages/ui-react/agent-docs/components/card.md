## Card

Group: Content

When to use: A titled block of related content: a record, a status, a list, an empty state.

### Use instead
- Callout (callout.md): The status is a message of a line or two, with at most one action.

### The one right way
`status` puts a Pill directly beside the title; `actions` stays at the far end.
```tsx
import { Card, Pill, Text } from "@slashsuite/ui-react";

<Card title="PixelSlash" status={<Pill tone="warn">Coming soon</Pill>}>
  <Text tone="muted">Visual review for every pull request.</Text>
</Card>
```

### Do
- Name the Card with `title`; add a `count` or a `status` and they sit beside the title.
- `titleStyle="name"` sets the title in sentence case and the primary ink, for a card that is a thing with a name (a shop, a listing, an event). The default `overline` is the small uppercase label of a panel (Status, Activity). Count, status, actions and `bar` work with both.
- `actions` sit at the far end of the header; use `bar` to put the header in a tinted strip.
- Space several Cards with a `Stack` or a `CardGrid`; never stack them with nothing between.
- `flush` is for a table that runs edge to edge, and it needs a `bar` for its title.
- A Card with `href` is one link; a `TextLink` or `Button` inside it sits above that link and is clickable on its own, and a click elsewhere on the card follows the link.
- `CardGrid` takes `columns` 2, 3 or 4, or `columns="auto"` with `minWidth` `sm` or `md` to fill by width; `align="start"` stops cards stretching to the tallest in their row.
- An empty state is an `EmptyState`, inside the card or on its own, where it draws its own dashed frame.

### Don't
A hand-built title row drifts from every other Card's: use `title` and `status`.
```tsx
import { Card, Pill, SubsectionHeading, Text } from "@slashsuite/ui-react";

<Card>
  <SubsectionHeading>PixelSlash</SubsectionHeading>
  <Pill tone="warn">Coming soon</Pill>
  <Text tone="muted">Visual review for every pull request.</Text>
</Card>
```

Cards with nothing between them butt together. Space them with `Stack` or `CardGrid`.
```tsx
import { Card, Text } from "@slashsuite/ui-react";

<>
  <Card title="Open" count={3}>
    <Text tone="muted">Three things to do.</Text>
  </Card>
  <Card title="Done" count={12}>
    <Text tone="muted">Twelve things finished.</Text>
  </Card>
</>
```

### Accessibility
- A titled Card is a `<section>` named by its `title` (`aria-labelledby` points at the heading), a card with only an `aria-label` a `<section>` named by it, and any other a `<div>`; `as="article"` makes it an `article`. Your own `aria-label` or `aria-labelledby` wins. The title is an `h2` on the page and an `h3` in a `Section`; `level` sets it by hand.
- `id`, `data-*` and `aria-*` go on the root element. On a link card too: the link inside it keeps only its own `aria-label`, `aria-labelledby` and `aria-current`, and is named by the card's text.
- On a link card the `badge` is inside the link, so it is part of the link's name; on a panel it is read after the content.
- `attention` is colour only: say why in the card's title or text.
- The `icon` is decorative and `aria-hidden`: the title says what the card is.

### Props
### Card
A bordered panel with an optional title, count and status. A titled card is a `section` named by its title, one with only an `aria-label` a `section` too, any other a `div`, and `as="article"` makes it an `article`. Two opt-in forms for data views: `flush` drops the padding and clips the corners, for a table that runs edge to edge; `bar` puts the title, count and `actions` in a tinted strip across the top, over the body. A flush card has no padding for a `title`, so give it a `bar`. An empty state is an `EmptyState`, which draws its own dashed frame. Inside a card a `Stack` is `xs` apart, and the title's heading level is one below the heading that holds the card. `size="sm"` is the dense padding and `size="lg"` the roomy one, the same on a `ListRow` and a `FileDrop`. `tone` is the Callout's set, for a data panel that carries a status (a soft fill and border, no shadow); a message is still a `Callout`, and `bar` has no tone. A titled panel is named by its title: the root gets `aria-labelledby` pointing at the heading, unless the caller passes its own `aria-label` or `aria-labelledby`, which wins. Other props (`id`, `data-*`, `aria-*`) go on the root. The root is `relative`, so a `TextLink stretch` inside it covers the card. A card with an `id` is an anchor target: `#id` scrolls it clear of the sticky header (and a `subnav`) and outlines it in the accent colour while it is the target. `icon` is one of the library's icons at feature size in the accent colour, above the title: the mark of a feature card. It sits in the padded body, so `bar` and `flush` have none. `footer` is a tinted strip across the bottom, under a hairline, for the card's own actions or a total; in a `CardGrid` it stays at the foot of a card that is stretched to the row's height. It suits a panel, not a card that is a link. `fill` makes a panel take its parent's full height (the parent sets it): the title or bar stays put and the body scrolls. Not on a link card. `href` makes the whole card one link: a hover border and the focus ring, with the link stretched over the card, so it takes no `actions`, `footer` or `as`. A `TextLink`, `Button` or `Checkbox` in the body sits above the link and is clickable on its own. An in-app `href` is drawn by the app's router link through `LinkProvider`. `external` opens it in a new tab. On a link card `id`, `data-*` and the describing `aria-*` (`aria-describedby`, `aria-details`, …) go on the card root, not the link; the link's own `aria-label`, `aria-labelledby` and `aria-current` stay on the link. The link is named by the card's text (title, body, `badge`) through the root's id, which is generated when the caller gives none. While `loading` a card with no children draws three lines of text bones, a `flush` one three `ListRow` bones; what it has (its title, its children) draws as usual.
- actions: ReactNode. Buttons or links at the end of the header: in the strip with `bar`, else beside the title.
- as: "article". `article` for a card that stands alone as a piece of content (a post, a listing). Left out, a
titled card is a `section` named by its title, one with only an `aria-label` a `section` named
by that, and any other a `div`. Not on a card that is a link.
- attention: boolean. The warn tone's strong border in place of the card's own, for the one card in a set that needs
a look (a run that differed). It keeps the card's fill. Name why in the card too (a `Pill` in
`badge`, or the body); the border alone says nothing to a screen reader.

Add `tone="warn"` for the warn surface too.
- badge: ReactNode. A `Pill` (or any small node) pinned in the top corner at the end edge, over the content and
inside the radius, with no change to the layout. On a card that is a link it is part of the
link's name, and a link or button in it is clickable on its own.

Use it for a category (`Pill tone="info"`) or a flag on the thing itself.
- bar: boolean. Put the title, count and actions in a tinted strip above the body, edge to edge.
- count: number. A small number beside the title (how many rows the card holds). Needs a `title`.
- external: boolean. Opens in a new tab: adds `target="_blank"` and `rel="noreferrer"`.
- fill: boolean. Take the parent's full height: the title or bar stays put and the body scrolls. The parent sets
the height.

For a panel in a fixed-height layout, such as a sheet over a map. Put links or controls in the
body, so a keyboard can reach and scroll it.
- flush: boolean. No padding and `overflow-hidden`: the body (a table, a list) fills the card.
- footer: ReactNode. A tinted strip across the bottom of the card, under a hairline, for the card's own actions or a total. It stays at the foot when the card is stretched in a `CardGrid`.
- href: string. Makes the whole card one link to this URL, with no `actions`, `footer` or `as`; an in-app path
goes through the app's `LinkProvider`.
- icon: "page" | "grid" | "search" | "table" | "type" | "diff" | "baseline" | "review" | "ci" | "self-host" | "privacy" | "capture" | "branch" | "theme" | "speed" | "chevron-right" | "chevron-down" | "close" | "external-link" | "settings" | "bell" | "check" | "plus" | "more" | "window" | "card" | "pointer" | "field" | "compass" | "briefcase". One of the library's icons, drawn at feature size in the accent colour above the title: the
mark of a feature card. Ignored with `bar` and `flush`.

Pick it by the idea it stands for.
- inset: ReactNode. A band across the card, edge to edge inside its padding, under the title and above the
children: a `ProgressBar` or a strip of colour that runs the card's full width.

A bordered sub-card inside a card is a nested `Card tone="neutral"`, not a hand-built box.
- level: 2 | 3 | 4 | 5 | 6 (default one below the heading that holds the card: 2 on the page, 3 in a `Section`). The title's heading level, 2 to 6. It does not change how the title looks.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- size: "sm" | "md" | "lg" (default md). `sm` is dense padding on the body, heading and bar, and makes a `Button`, `IconButton` or `Pill`
inside with no `size` of its own `sm` too; `lg` is one step roomier than `md`.

`sm` suits a dense dashboard, `lg` a card that stands alone.
- status: ReactNode. A `Pill` (or any node) directly beside the title and count, not at the far end like `actions`. Needs a `title`.
- title: string. The card's heading (a small uppercase label unless `titleStyle` says otherwise). It names the card, which is then a `section`.
- titleStyle: "name" | "overline" (default overline). How the `title` is set. `overline` is the small uppercase label of a panel; `name` is the same
heading in sentence case and the primary ink, for a card whose title is a name (a shop, a listing,
an event). Count, status, actions, `bar` and `size` work the same with both.
- tone: "neutral" | "info" | "positive" | "warn" | "danger". A soft fill and border in the Callout's tones, for a data panel with a status. Ignored with `bar`.
