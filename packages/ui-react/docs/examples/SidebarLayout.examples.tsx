import {
  AppShell,
  Button,
  Card,
  Tabs,
  PageHeader,
  SidebarLayout,
  Text,
} from "@slashsuite/ui-react";

/** A whole page with a rail: the shell with its brand and nav, then the layout with a vertical `Tabs` in `aside` and the page in `children`. */
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
    <SidebarLayout
      aside={
        <Tabs
          orientation="vertical"
          label="Organisations"
          items={[
            { label: "Hack Cove", href: "#hack-cove", selected: true },
            { label: "Acme", href: "#acme" },
            { label: "Northwind", href: "#northwind" },
          ]}
        />
      }
    >
      <PageHeader
        title="Hack Cove"
        description="3 projects"
        actions={<Button>New project</Button>}
      />
      <Card title="Projects">
        <Text>Storybook, Dashboard, Site.</Text>
      </Card>
    </SidebarLayout>
  </AppShell>
);

/** A vertical pill `Tabs` is the rail: a short list of sections beside the page. */
export const DoSections = () => (
  <SidebarLayout
    aside={
      <Tabs
        orientation="vertical"
        label="Settings"
        items={[
          { label: "Profile", href: "#profile", selected: true },
          { label: "Billing", href: "#billing" },
          { label: "Team", href: "#team" },
        ]}
      />
    }
  >
    <PageHeader title="Profile" description="Your name and email." />
    <Card title="Account">
      <Text>Naledi Mokoena, naledi@example.com</Text>
    </Card>
  </SidebarLayout>
);

/** The default, horizontal pill `Tabs` wraps into a ragged block in the rail. Give the rail `orientation="vertical"`. */
export const DontSections = () => (
  <SidebarLayout
    aside={
      <Tabs
        label="Settings"
        items={[
          { label: "Profile", href: "#profile", selected: true },
          { label: "Billing", href: "#billing" },
          { label: "Team", href: "#team" },
        ]}
      />
    }
  >
    <PageHeader title="Profile" description="Your name and email." />
    <Card title="Account">
      <Text>Naledi Mokoena, naledi@example.com</Text>
    </Card>
  </SidebarLayout>
);
