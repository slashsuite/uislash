import { Card, Text, TextLink } from "@slashsuite/ui-react";

/** A link in running text is a `TextLink` inside a `Text`. */
export const DoInSentence = () => (
  <Text>
    Questions? Email <TextLink href="mailto:hello@example.com">hello@example.com</TextLink>, or read
    the <TextLink href="#terms">terms</TextLink> first.
  </Text>
);

/** A bare `<a>` has none of the theme's link colour, weight or focus ring. */
export const DontInSentence = () => (
  <Text>
    Questions? Email <a href="mailto:hello@example.com">hello@example.com</a>, or read the{" "}
    <a href="#terms">terms</a> first.
  </Text>
);

/** `external` opens another site in a new tab and adds `rel="noreferrer"` with it. */
export const DoExternal = () => (
  <TextLink href="https://example.com" external>
    example.com
  </TextLink>
);

/** `target="_blank"` by hand leaves out the `rel`. Say `external` and the link gets both. */
export const DontExternal = () => (
  <TextLink href="https://example.com" target="_blank">
    example.com
  </TextLink>
);

/** In an app with a router, set the router's `<Link>` once on a `LinkProvider` and give each link its `href`; here an anchor stands in. */
export const DoRouter = () => <TextLink href="/terms">Read the terms</TextLink>;

/** A router `<Link>` drawn by hand at each link loses the TextLink look and its focus ring: give `TextLink` the `href`, and the app's `LinkProvider` draws the router link. */
export const DontRouter = () => <a href="#terms">Read the terms</a>;

/** `stretch` makes the whole of the nearest `relative` ancestor the click target: a `Card` here, a `TableRow` in a table. */
export const DoStretch = () => (
  <Card title="Quote 12">
    <TextLink href="#quote-12" stretch>
      Open the quote
    </TextLink>
  </Card>
);

/** Two stretched links in one card both claim the whole card, so a click lands on whichever is last. Stretch the one link; the other sits above it. */
export const DontStretch = () => (
  <Card title="Quote 12">
    <TextLink href="#quote-12" stretch>
      Open the quote
    </TextLink>
    <TextLink href="#client-4" stretch>
      Open the client
    </TextLink>
  </Card>
);
