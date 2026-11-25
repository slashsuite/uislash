import {
  AppShell,
  Button,
  ButtonGroup,
  Card,
  EmptyState,
  Fieldset,
  ListLayout,
  Tabs,
  PageHeader,
  Pill,
  Stack,
  Text,
} from "@slashsuite/ui-react";

/** A whole list page: the shell with its brand and nav, then the layout with its filters and rows. */
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
    <ListLayout
      title="Quotes"
      description="Every quote you have sent."
      actions={<Button>New quote</Button>}
      filters={
        <Fieldset label="Status">
          <ButtonGroup>
            <Button variant="outline" size="sm" pressed>
              All
            </Button>
            <Button variant="outline" size="sm" pressed={false}>
              Sent
            </Button>
            <Button variant="outline" size="sm" pressed={false}>
              Accepted
            </Button>
          </ButtonGroup>
        </Fieldset>
      }
    >
      <Card title="Naledi Mokoena" titleStyle="name">
        <Text>Q-1042 · R 1 240 / mo</Text>
      </Card>
      <Card title="Pieter van Wyk" titleStyle="name">
        <Text>Q-1041 · R 860 / mo</Text>
      </Card>
    </ListLayout>
  </AppShell>
);

/** `filters` sit under the header, then the rows: one `Card` per item. */
export const DoRows = () => (
  <ListLayout
    title="Quotes"
    description="Every quote you have sent."
    actions={<Button>New quote</Button>}
    filters={
      <Fieldset label="Status">
        <ButtonGroup>
          <Button variant="outline" size="sm" pressed>
            All
          </Button>
          <Button variant="outline" size="sm" pressed={false}>
            Sent
          </Button>
        </ButtonGroup>
      </Fieldset>
    }
  >
    <Card title="Naledi Mokoena" status={<Pill tone="positive">Accepted</Pill>}>
      <Text>Q-1042 · R 1 240 / mo</Text>
    </Card>
    <Card title="Pieter van Wyk" status={<Pill tone="neutral">Sent</Pill>}>
      <Text>Q-1041 · R 860 / mo</Text>
    </Card>
  </ListLayout>
);

/** A one-off header and stack drifts from every other list page; `ListLayout` is the one header, filters and list. */
export const DontRows = () => (
  <Stack>
    <PageHeader title="Quotes" description="Every quote you have sent." />
    <Card title="Naledi Mokoena">
      <Text>Q-1042 · R 1 240 / mo</Text>
    </Card>
  </Stack>
);

/** `empty` takes the list's place when there are no children: say what is missing and what to do. */
export const DoNothingYet = () => (
  <ListLayout
    title="Quotes"
    description="Every quote you have sent."
    empty={
      <EmptyState title="No quotes yet" actions={<Button>New quote</Button>}>
        <Text>Quotes you send show up here.</Text>
      </EmptyState>
    }
  />
);

/** A muted line as `empty` says nothing is here and offers no way forward: a dead end. */
export const DontNothingYet = () => (
  <ListLayout
    title="Quotes"
    description="Every quote you have sent."
    empty={<Text tone="muted">No quotes yet.</Text>}
  />
);
