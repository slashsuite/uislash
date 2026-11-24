import { Caption, Code, MetaList, Text as Prose, TextLink } from "@slashsuite/ui-react";

/** A row of facts is a `MetaList`; an item is text, a `Code` or a `TextLink`. */
export const DoFacts = () => (
  <MetaList>
    <TextLink href="#hc-145">hc-145</TextLink>
    <Code>0f9d376</Code>
    <span>26 Oct 2026</span>
  </MetaList>
);

/** Dots typed into one string are one item to a screen reader and can wrap onto the end of a line. */
export const DontFacts = () => <Caption>hc-145 · 0f9d376 · 26 Oct 2026</Caption>;

/** A row of links is a `MetaList nowrap`: it spaces them, wraps them and hides the separator from a screen reader. */
export const DoFooter = () => (
  <MetaList>
    <TextLink href="#privacy">Privacy</TextLink>
    <TextLink href="#terms">Terms</TextLink>
    <TextLink href="#contact">Contact</TextLink>
  </MetaList>
);

/** Separators typed by hand are read aloud and can wrap onto the end of a line. */
export const DontFooter = () => (
  <Prose as="p">
    <TextLink href="#privacy">Privacy</TextLink> | <TextLink href="#terms">Terms</TextLink> |{" "}
    <TextLink href="#contact">Contact</TextLink>
  </Prose>
);
