## TextLink

Group: Text

When to use: A link that sits in text. A link that must look like a button is a `Button` with `href`.

### Use instead
- Button (button.md): The link must look like a button: a `Button` with `href`.

### The one right way
A link in running text is a `TextLink` inside a `Text`.
```tsx
import { Text, TextLink } from "@slashsuite/ui-react";

<Text>
  Questions? Email <TextLink href="mailto:hello@example.com">hello@example.com</TextLink>, or
  read the <TextLink href="#terms">terms</TextLink> first.
</Text>
```

### Do
- Use `TextLink` for every link in running text.
- `external` is for another site: it opens a new tab with `rel="noreferrer"`.
- In an app with a router, set the router's `<Link>` once on a `LinkProvider` and give each `TextLink` its `href`. The library has no router.
- Set the adapter once, at the router. TanStack Router: `InnerWrap: ({ children }) => <LinkProvider link={(p) => <Link to="." {...p} />}>{children}</LinkProvider>` on `createRouter` (`to="."` satisfies the typed `to`; the `href` wins). React Router: `<LinkProvider link={({ href, ...p }) => <Link to={href} {...p} />}>`. Astro: no provider.
- `home` on the same `LinkProvider` is where every status page's "Back to home" goes, `/` by default (`home="https://example.com"` with no `link` for a home on another site). A provider inside another keeps what it does not set.
- Only an in-app path (`/quotes?page=2#top`) reaches the adapter; `external`, `https:`, `mailto:`, `#hash` and a relative path are a plain `<a>`.
- `size` pins the type size to `sm`, `md` or `lg`; left out, the link takes the size of its text. `mono` sets the monospace face for a path or an id.
- `tone` gives the link a meaning's colour (`warn`, `danger`, `positive`, `info`, `muted`), underlined on hover. Use it for a link that is the message, like "3 failed". `underline` underlines it always: set it where the text around the link is as heavy as the link (a `Text strong`, a heading), since colour alone does not mark a link (WCAG 1.4.1); in plain `Text` its weight marks it.

### Don't
- Never write a bare `<a>` for a link in running text.
- Never a render prop or a wrapper component per link. Every part that links (`Button`, `Card`, `ListRow`, `Tabs`, `Breadcrumbs` and the rest) takes `href` and goes through the same `LinkProvider`.

A bare `<a>` has none of the theme's link colour, weight or focus ring.
```tsx
import { Text } from "@slashsuite/ui-react";

<Text>
  Questions? Email <a href="mailto:hello@example.com">hello@example.com</a>, or read the{" "}
  <a href="#terms">terms</a> first.
</Text>
```

`target="_blank"` by hand leaves out the `rel`. Say `external` and the link gets both.
```tsx
import { TextLink } from "@slashsuite/ui-react";

<TextLink href="https://example.com" target="_blank">
  example.com
</TextLink>
```

A router `<Link>` drawn by hand at each link loses the TextLink look and its focus ring: give `TextLink` the `href`, and the app's `LinkProvider` draws the router link.
```tsx
<a href="#terms">Read the terms</a>

```

Two stretched links in one card both claim the whole card, so a click lands on whichever is last. Stretch the one link; the other sits above it.
```tsx
import { Card, TextLink } from "@slashsuite/ui-react";

<Card title="Quote 12">
  <TextLink href="#quote-12" stretch>
    Open the quote
  </TextLink>
  <TextLink href="#client-4" stretch>
    Open the client
  </TextLink>
</Card>
```

### Accessibility
- A `TextLink` is a native `<a>`, so it is in the tab order and opens with Enter.
- It has a focus ring from the component, so the keyboard focus is always visible.
- `external` sets `target="_blank"` and `rel="noreferrer"`.
- Every anchor prop (`aria-*`, `download`, `title`, a handler) goes on the `<a>`; the app's `LinkProvider` adapter receives them as well.

### Props
### TextLink
An inline text link in the accent colour. Every anchor prop goes on the `<a>`; an in-app `href` is drawn by the app's router link through `LinkProvider`. `size` pins the type size (`sm`, `md` or `lg`), `tone` gives it a meaning's colour and `mono` sets the monospace face.
- external: boolean (default false). Opens in a new tab: adds `target="_blank"` and `rel="noreferrer"`.
- href: string (required). Where the link goes; an in-app path goes through the app's `LinkProvider`.
- mono: boolean (default false). The monospace face, for a path, an id or a command.
- size: "sm" | "md" | "lg". The link's own type size: `sm` is `text-xs`, `md` `text-sm` and `lg` `text-base`. Left out, it
takes the size of the text around it: a link inside prose has no default size.
- stretch: boolean (default false). The link covers its nearest `relative` ancestor, so the whole row or card is the click target.

Put it on the one link of a `Card` or a `TableRow` (a table row's first cell): any other link
or button in it sits above the link and is clickable on its own. An action that is not
navigation stays a `Button` in an actions column.
- tone: "neutral" | "info" | "positive" | "warn" | "danger" | "muted" | "accent". A meaning's colour, as on the inline roles: `warn` for a warning link, `danger`, `positive`,
`info` or `muted`. Left out, the link is the accent colour.
- underline: boolean (default false). Always underlined, for a link set inside running text, where colour alone does not mark it (WCAG 1.4.1).

### LinkProvider
Names the app's router link once, so every part that links (`Button`, `IconButton`, `TextLink`, `Pill`, `Card`, `ListRow`, `Breadcrumbs`, `Tabs`, `SegmentedControl`, `AppShellBrand`, `SiteSearch`, `MediaTile`, `Avatar` and the status pages) takes a plain `href` and draws an in-app one (a path from the root, `/quotes?page=2#top`) through the router. It renders no element. - TanStack Router: `createRouter({ routeTree, InnerWrap: ({ children }) => <LinkProvider link={(p) => <Link to="." {...p} />}>{children}</LinkProvider> })`, which also reaches the router's not-found and error components. A registered router's `Link` requires `to`; `to="."` satisfies it, and the `href` wins. - React Router: `<LinkProvider link={({ href, ...p }) => <Link to={href} {...p} />}>` inside the router. - Astro, or no router: no provider; every link is a plain `<a>`. An `external` link, a full URL (`https:`, `mailto:`, `tel:`), a `//` URL, a `#hash` or a relative path never reaches the adapter: the library draws those as a plain `<a>`. `home` is where every status page's "Back to home" goes, `/` by default: the one place an app says it, never a page. A full URL (a home on another site) is a plain `<a>` in the same tab. A provider inside another keeps what it does not set, so `<LinkProvider home="/app">` within the router's provider still draws through the router's link.
- home: string (default "/"). Where the status pages' "Back to home" goes: an in-app path or a full URL.
- link: LinkAdapter. The app's router link, handed `LinkAdapterProps`. Left out, links are plain `<a>` (or the outer provider's).

### Types
- LinkAdapter: `(props: LinkAdapterProps) => ReactNode`. Draws one in-app link: the app's router `<Link>`, handed `LinkAdapterProps`.
- LinkAdapterProps: `{ href: string; className: string; children: ReactNode; aria-current?: boolean | "page" | "time" | "false" | "true" | "step" | "location" | "date"; target?: string; rel?: string; title?: string }`. What the app's `LinkAdapter` receives to draw an in-app link with its router's `<Link>`: the destination as `href` (search and hash included), the component's classes, its label as `children`, and (for a tab that is current, or an option with a tooltip) `aria-current`, `target`, `rel` and `title`. `@slashsuite/ui-react` has no router dependency. An optional field is `?: T`, never `?: T | undefined`, and a key that has no value is left out rather than set to `undefined`. A router's `<Link>` declares its props that way, so under `exactOptionalPropertyTypes` the spread compiles. Any other anchor prop the caller gave the component (`id`, `data-*`, `download`, a handler) arrives too, untyped here, and `<Link>` takes it as its own.
- TextLinkSize: `"sm" | "md" | "lg"`. A TextLink's pinned type size, on the `Size` scale; left out, it takes the size of the text around it.
