## AppShell

Group: Layout

When to use: Every page of an app sits in one `AppShell`; it is the only place the page canvas, the font and the header live.

### The one right way
`AppShellBrand` makes the logo and the label one link, so the whole brand is the way home; `collapse` leaves only the logo below `sm`.
```tsx
import { Avatar, AppShellBrand } from "@slashsuite/ui-react";

<AppShellBrand href="#" logo={<Avatar name="Quotes" size="sm" />} label="Quotes" collapse />
```

### Do
- Fill the slots and write no wrapper: `brand`, `nav` (`Tabs` of links), `controls` (a picker, a `ColourSchemeToggle`), then an optional `subnav` row and `footer`.
- `brand` is an `AppShellBrand`: logo and label in one link. `collapse` leaves only the logo below `sm`. `logoSize` is `sm` (20px), `md` (24px, the default, an `Avatar size="sm"`) or `lg` (32px); an `<img>` or `<svg>` logo fills it.
- A header control that only matters on a wide screen, such as the viewer's name, goes in a `Show from="sm"` (or `md`, `lg`) in `controls`; put a `Cluster` inside it to keep an avatar and a name together.
- Header, main and footer each sit in a `Container`, so a page never sets its own width or padding.
- `controls` stay in the row at every width, so keep them few (a theme toggle, the viewer's avatar). Pickers and actions that do not fit a phone row go in `menuControls`: from `md` they sit in the row after `controls`, and below `md` they are at the top of the Menu.
- `nav` and `subnav` fold into one Menu button below `md`, and the `nav` also from `md` whenever it does not fit the row, so a nav of any length stays reachable with no sideways scroll; `menuLabel` renames the button (`Menu` by default), for a translated app.
- Put `appShellRootClassFor(scheme)` on the app's own `<html>`. `AppShell` never touches `<html>`.
- A theme sets the canvas colour and the font, and the shell turns on font smoothing (`antialiased`); the app writes no page background, font or smoothing rule.

### Don't
- Do not add a `Container` inside the shell.

A logo and a name as two separate links are two targets, and the logo link has no name. Put both in `AppShellBrand`.
```tsx
import { Avatar, Cluster, TextLink } from "@slashsuite/ui-react";

<Cluster gap="xs">
  <a href="#">
    <Avatar name="Quotes" size="sm" />
  </a>
  <TextLink href="#">Quotes</TextLink>
</Cluster>
```

A link written by hand round the logo and the label, navigating in its own click handler, is a wrapper per link with no brand focus ring. Set the router once on `LinkProvider` and give `AppShellBrand` its `href`.
```tsx
import { Avatar, Cluster, Text } from "@slashsuite/ui-react";

<a
  href="#/"
  onClick={(event) => {
    event.preventDefault();
    history.pushState(null, "", "#/");
  }}
>
  <Cluster gap="xs">
    <Avatar name="Quotes" size="sm" />
    <Text as="span">Quotes</Text>
  </Cluster>
</a>
```

Shown at every width, the name pushes the nav and the toggle off a phone's header row.
```tsx
import { Avatar, Cluster, Text } from "@slashsuite/ui-react";

<Cluster gap="xs">
  <Avatar name="Ada Lovelace" size="sm" />
  <Text>Ada Lovelace</Text>
</Cluster>
```

A hand-written `scroll-margin` guesses the header's height and goes stale when a subnav or the notch changes it. Leave the offset to the shell.
```tsx
import { Stack, Text, TextLink } from "@slashsuite/ui-react";

<Stack gap="sm">
  <TextLink href="#plans">See pricing</TextLink>
  <section id="plans" style={{ scrollMarginTop: 80 }}>
    <Text strong>Pricing</Text>
    <Text>Pay for what you review.</Text>
  </section>
</Stack>
```

### Accessibility
- The header is a `<header>` (the banner landmark), main is `<main>` and the footer is `<footer>`.
- `AppShellBrand` is one link named by its `label`; the logo is `aria-hidden`. With `collapse` the label is visually hidden below `sm` and still names the link.
- On a phone `nav` and `subnav` sit behind one Menu button, a native disclosure: it opens with no JavaScript, from the keyboard (Enter or Space) and for a screen reader, Escape closes it and returns to the button, and following a link closes it. The panel is not in the header's flow, so the header is the same height on every page.
- `menuControls` render once, in the Menu below `md` and in the row from `md`, so a field keeps its value and its label names one control. A crowded `controls` clips beside the Menu button, never over it, so the nav stays reachable.
- From `md` a `nav` too wide for the header row folds into the Menu instead of scrolling, and comes back when the screen is wide enough. A `subnav` row that is wider than the screen scrolls sideways and never wraps; a link that takes focus scrolls into view, and the side with more to reach fades out.
- Give `nav` and `subnav` `Tabs` of links, so each is a labelled `<nav>`.

### Props
### AppShell
The page frame: it paints the page canvas and sets the type face, ink and font smoothing (`antialiased`), so an app writes no page-background or font rule of its own (a theme remaps the canvas and the font stacks). A sticky one-row header, an optional second `subnav` row, the main area and an optional footer. Header, main and footer each sit in a `Container`, so pages never set their own width or padding. `bleed` drops main's Container (the header keeps its own), for a layout that needs the whole width (`FullBleedLayout`). Main is a flex column. `SidebarLayout` needs no `bleed`: its rail and canvas share the header's Container. The header row is laid out by its slots, left to right: `brand`, `nav`, then `header` (anything the slots do not cover), then `controls`, pushed to the end. An app writes no wrapper or styling for any of them: an item that only fits a wide screen goes in a `Show from`. A bar that sticks under the header as the page scrolls is a `StickyBar`. On a phone (below `md`) the header is one 56px row at every page: `brand`, `header`, `controls` and a "Menu" button (`menuLabel`), and `nav` and `subnav` move into that menu, so every link is reachable and nothing scrolls sideways. The menu is a native `<details>`, so it works with the keyboard, with a screen reader and on a page that never hydrates. From `md` the header is the row, and the `subnav` row, as they are, except that a `nav` too wide for the row folds into the Menu and comes back when the screen is wide enough (measured, with script; a `subnav` never folds, it scrolls sideways with a fade). The edges need nothing from the app: with `viewport-fit=cover` every Container clears the safe-area insets at the sides, the header the top one and the shell the bottom one; and an element with an `id` anywhere inside lands below the sticky header when a link or focus scrolls to it. `controls` stay in the row at every width, so keep them few (a theme toggle, the viewer's avatar); on a phone a crowded `controls` clips, and the Menu button is never the part cut off. Pickers and actions that do not fit a phone row go in `menuControls`: rendered once, they sit in the row after `controls` from `md`, and below `md` at the top of the Menu, above `nav` and `subnav`.
- bleed: boolean (default false). Main without a Container, for a full-bleed layout.

For a layout that needs the whole width, such as `FullBleedLayout`; `SidebarLayout` needs no
`bleed`.
- brand: ReactNode. The brand: a logo and a name, in the header's brand type, with the gap between them. `AppShellBrand` makes both one link.
- controls: ReactNode. The end of the row: a picker, a theme toggle. Gap-2, vertically centred; no child shrinks, and a full-width control (a `Select` at its default) sizes to its content.
- density: "compact". The app's type step, set once here and nowhere else: `compact` sets text, headings and controls
one step down everywhere inside, for an app's dense chrome. Left out, text is 16px, as a site's.
- footer: ReactNode. The page footer: small muted text in a `Container`, under a hairline. Hidden in print with `printChrome={false}`.
- header: ReactNode. The escape hatch: a free node in the header row, after `brand` and `nav`.

Only for a node no other slot covers: prefer `brand`, `nav` and `controls`.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- menuControls: ReactNode. Pickers and actions that do not fit a phone row, such as a project `Select` and a Sign out
`Button`. From `md` they sit in the row after `controls`; below `md` they are at the top of the
Menu, above `nav` and `subnav`. Rendered once, so a field keeps its state and ids stay unique.
`controls` stay in the row at every width, so keep those few.
- menuLabel: string (default Menu). The phone menu button's name, for an app in another language. Only drawn below `md`, and only
when `nav`, `subnav` or `menuControls` is given.
- nav: ReactNode. The main navigation, e.g. a `Tabs` of links (it is already a `<nav>`). Below `md` it is in the menu.
- printChrome: boolean (default true). Whether a print shows the header and footer. `false` prints only the page: the header and
footer are hidden, and main's Container drops its padding (the page margin is then `@page`'s).

The screen is unchanged.
- subnav: ReactNode. A second fixed-height row under the header from `md`, e.g. a `Tabs` of links. Below `md` it is in the menu with `nav`.

### AppShellBrand
The `brand` slot as one link: a logo and a label inside the same `<a>`, so the whole brand is the way home. The label names the link; the logo is decoration and hidden from assistive tech. `collapse` shows only the logo below `sm`, the label staying in the accessible name. An in-app `href` is drawn by the app's router link through `LinkProvider`.
- collapse: boolean (default false). Below `sm` only the logo shows; the label is visually hidden and still names the link. Needs a `logo`.
- href: string (required). Where the brand links, usually the app's home (`/`).

With a router it goes through the app's `LinkProvider`, like every link.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- label: ReactNode (required). The name beside the logo. It is the link's accessible name.
- logo: ReactNode. The mark before the label, e.g. an `Avatar` or an `<img>`.
- logoSize: "sm" | "md" | "lg" (default md). The logo slot's box: sm 20px, md 24px (the default, an `Avatar size="sm"`), lg 32px. An `<img>` or `<svg>` logo fills it.

### Types
- AppShellDensity: `"compact"`. The type step an app sets once on its `AppShell`: `compact` is one step down for the whole app.

### Functions
- appShellRootClassFor: `appShellRootClassFor(scheme: ColourScheme, schemes?: ColourSchemeClasses): string`. Everything the app's `<html>` takes from the scheme the server knows: that scheme's class and the class that always reserves the scrollbar, so centred content does not shift between a short page and a long one.
```tsx
<html className={appShellRootClassFor(scheme, schemes)}>
```
