import {
  AppShell,
  Card,
  ListLayout,
  Tabs,
  ProseLayout,
  SectionHeading,
  Text,
} from "@slashsuite/ui-react";

/** A whole text page: the shell with its brand and nav, then one reading column with the header inside it. */
export const FullPage = () => (
  <AppShell
    brand={<a href="#">Hack Cove</a>}
    nav={
      <Tabs
        label="Main"
        items={[
          { label: "Quotes", href: "#quotes", selected: true },
          { label: "Clients", href: "#clients" },
        ]}
      />
    }
  >
    <ProseLayout title="Privacy" description="How we handle your data.">
      <SectionHeading>What we keep</SectionHeading>
      <Text>We keep your account details and the quotes you send, and nothing else.</Text>
      <SectionHeading>Who sees it</SectionHeading>
      <Text>Only you and the people you invite to your organisation.</Text>
    </ProseLayout>
  </AppShell>
);

/** Text pages (privacy, terms, help) are one reading column; the header sits inside it. */
export const DoArticle = () => (
  <ProseLayout title="Privacy" description="How we handle your data.">
    <SectionHeading>What we keep</SectionHeading>
    <Text>We keep your account details and the quotes you send, and nothing else.</Text>
    <SectionHeading>Who sees it</SectionHeading>
    <Text>Only you and the people you invite to your organisation.</Text>
  </ProseLayout>
);

/** `ListLayout` is for lists: its content runs the full width, so lines of text get too long to read. Use `ProseLayout`. */
export const DontArticle = () => (
  <ListLayout title="Privacy" description="How we handle your data.">
    <Card>
      <Text>
        We keep your account details and the quotes you send, and nothing else. Only you and the
        people you invite to your organisation can see them.
      </Text>
    </Card>
  </ListLayout>
);
