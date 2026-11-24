## SiteFooter

Group: Layout

When to use: The footer of a marketing site or a docs site, in `AppShell`'s `footer` slot. An app with no footer leaves the slot empty.

### The one right way
A site's footer is a `SiteFooter` in `AppShell`'s `footer` slot: the shell draws the one footer landmark around it.
```tsx
import { SiteFooter, Text } from "@slashsuite/ui-react";

<SiteFooter
  links={[
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ]}
  notes={["Hack Cove (Pty) Ltd"]}
>
  <Text>Email hello@example.com</Text>
</SiteFooter>
```

### Do
- Put it in `AppShell`'s `footer` slot: `<AppShell footer={<SiteFooter ... />}>`.
- `brand` is the site's mark, linked to `brandHref` (`/` by default) and named by `brandLabel`. `children` is the contact line beside it, at body size.
- `links` are the site's own pages (Privacy, Terms, GitHub, a mail address), one wrapping row; `external` opens one in a new tab. `notes` are lines of fine print under them (a licence, a legal name, a credit), one paragraph each.
- Links go through the app's `LinkProvider`, like every link.

### Don't
- Do not add link columns, a newsletter form or social icons: a site footer is this and nothing else.

A footer built from a `Stack` of `Caption`s and a `MetaList` by hand drifts from every other site's.
```tsx
import { Caption, MetaList, Stack, Text, TextLink } from "@slashsuite/ui-react";

<Stack gap="xs">
  <Text>Email hello@example.com</Text>
  <MetaList>
    <TextLink href="/privacy">Privacy</TextLink>
    <TextLink href="/terms">Terms</TextLink>
  </MetaList>
  <Caption>Hack Cove (Pty) Ltd</Caption>
</Stack>
```

### Accessibility
- It is not a `<footer>`: `AppShell` draws the one `contentinfo` landmark around its slot, so the page has exactly one.
- The brand is one link named by `brandLabel`, or by its own text.
- The links are a list, so a screen reader counts them.

### Props
### SiteFooter
The footer a site puts in `AppShell`'s `footer` slot: the site's mark linked home with a contact line beside it, a row of the site's own links (Privacy, Terms, GitHub), then lines of fine print. It is not a `<footer>`: the shell draws the one `contentinfo` landmark around its slot. No link columns, newsletter form or social icons: a site footer is this and nothing else.
- brand: ReactNode. The site's mark (a wordmark, a logo), linked to `brandHref`. Left out, there is no brand.
- brandHref: string (default /). Where the brand links. Needs `brand`.
- brandLabel: string. Names the brand link for assistive tech ("PixelSlash home"). Needs `brand`.
- children: ReactNode. A sentence at body size beside the brand: the contact line ("Email hello@...").
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- links: SiteFooterLink[] (default []). The site's own links (Privacy, Terms, GitHub, a mail address), one wrapping row.
- notes: ReactNode[] (default []). Lines of fine print under the links (a licence, a trademark, a credit), one paragraph each.

### Types
- SiteFooterLink: `{ label: string; href: string; external?: boolean }`. One link in a `SiteFooter`'s row: its words, where it goes, and whether it opens a new tab.
