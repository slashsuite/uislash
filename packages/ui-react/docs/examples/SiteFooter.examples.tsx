import { Caption, MetaList, SiteFooter, Stack, Text, TextLink } from "@slashsuite/ui-react";

/** A site's footer is a `SiteFooter` in `AppShell`'s `footer` slot: the shell draws the one footer landmark around it. */
export const DoFooter = () => (
  <SiteFooter
    links={[
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ]}
    notes={["Hack Cove (Pty) Ltd"]}
  >
    <Text>Email hello@example.com</Text>
  </SiteFooter>
);

/** A footer built from a `Stack` of `Caption`s and a `MetaList` by hand drifts from every other site's. */
export const DontFooter = () => (
  <Stack gap="xs">
    <Text>Email hello@example.com</Text>
    <MetaList>
      <TextLink href="/privacy">Privacy</TextLink>
      <TextLink href="/terms">Terms</TextLink>
    </MetaList>
    <Caption>Hack Cove (Pty) Ltd</Caption>
  </Stack>
);
