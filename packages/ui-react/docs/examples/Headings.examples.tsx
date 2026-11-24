import {
  Display,
  Lead,
  PageHeading,
  SectionHeading,
  Stack,
  SubsectionHeading,
  Text,
} from "@slashsuite/ui-react";

/** One `PageHeading` names the page, `SectionHeading` its parts and `SubsectionHeading` what is inside a part. */
export const DoScale = () => (
  <Stack gap="sm">
    <PageHeading>Quotes</PageHeading>
    <SectionHeading rule>Open</SectionHeading>
    <SubsectionHeading>Awaiting reply</SubsectionHeading>
    <Text>Three quotes are waiting on the customer.</Text>
  </Stack>
);

/** `PageHeading` is an `h1`, and a page has one. A second one for a section breaks the outline: use `SectionHeading`. */
export const DontScale = () => (
  <Stack gap="sm">
    <PageHeading>Quotes</PageHeading>
    <Text>Three quotes are waiting on the customer.</Text>
    <PageHeading>Open</PageHeading>
    <Text>Two quotes are open.</Text>
  </Stack>
);

/** `Display` is the one headline at the top of a public page, with a `Lead` under it. */
export const DoHero = () => (
  <Stack gap="xs">
    <Display>Tools for people who build</Display>
    <Lead>The supporting sentence that sits under the headline.</Lead>
  </Stack>
);

/** `Display` is marketing scale, not a section title: inside a page it dwarfs everything around it. Use `SectionHeading`. */
export const DontHero = () => (
  <Stack gap="sm">
    <PageHeading>Dashboard</PageHeading>
    <Display as="h2">Recent activity</Display>
    <Text>Nothing has changed since yesterday.</Text>
  </Stack>
);
