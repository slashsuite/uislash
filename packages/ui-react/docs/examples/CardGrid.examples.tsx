import {
  AppShell,
  Card,
  CardGrid,
  Tabs,
  PageHeader,
  Stack,
  StatTile,
  Text,
} from "@slashsuite/ui-react";

/** A whole dashboard page: the shell with its brand and nav, then a `PageHeader` and a `CardGrid` of tiles. */
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
    <Stack gap="xl">
      <PageHeader title="Business" description="This month at a glance." />
      <CardGrid columns={3}>
        <StatTile label="Open" value="12" />
        <StatTile label="Won" value="8" tone="positive" />
        <StatTile label="Lost" value="3" tone="danger" />
      </CardGrid>
    </Stack>
  </AppShell>
);

/** Tiles go in a `CardGrid`: one column on a phone, two from `sm`, `columns` from `lg`. */
export const DoTiles = () => (
  <CardGrid columns={3}>
    <StatTile label="Open" value="12" />
    <StatTile label="Won" value="8" tone="positive" />
    <StatTile label="Lost" value="3" tone="danger" />
  </CardGrid>
);

/** A `Stack` is one column, so the tiles never sit side by side and the page runs long. Use a `CardGrid`. */
export const DontTiles = () => (
  <Stack>
    <StatTile label="Open" value="12" />
    <StatTile label="Won" value="8" tone="positive" />
    <StatTile label="Lost" value="3" tone="danger" />
  </Stack>
);

/** For cards of any count, `columns="auto"` fits as many per row as the width allows. */
export const DoAuto = () => (
  <CardGrid columns="auto" minWidth="sm" align="start">
    <Card title="Dashboard">
      <Text>Quotes and renewals this week.</Text>
    </Card>
    <Card title="Billing">
      <Text>Invoices and payments.</Text>
    </Card>
    <Card title="Members">
      <Text>Who can sign in.</Text>
    </Card>
  </CardGrid>
);

/** A fixed `columns={4}` for a count that varies leaves the row part empty when there are three. When the count varies, use `columns="auto"`. */
export const DontAuto = () => (
  <CardGrid columns={4} align="start">
    <Card title="Dashboard">
      <Text>Quotes and renewals this week.</Text>
    </Card>
    <Card title="Billing">
      <Text>Invoices and payments.</Text>
    </Card>
    <Card title="Members">
      <Text>Who can sign in.</Text>
    </Card>
  </CardGrid>
);
