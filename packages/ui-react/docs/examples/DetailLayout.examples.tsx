import {
  AppShell,
  Button,
  Card,
  DetailLayout,
  KeyValue,
  KeyValueList,
  ListLayout,
  Tabs,
  Text,
} from "@slashsuite/ui-react";

/** A whole record page: the shell with its brand and nav, then the layout with the record in `children` and its facts in `aside`. */
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
    <DetailLayout
      title="Quote Q-1042"
      description="Naledi Mokoena"
      actions={<Button variant="outline">Edit</Button>}
      aside={
        <Card title="Details">
          <KeyValueList>
            <KeyValue label="Status">Sent</KeyValue>
            <KeyValue label="Premium">R 1 240 / mo</KeyValue>
          </KeyValueList>
        </Card>
      }
    >
      <Card title="Cover">
        <Text>Life cover of R 1 500 000, to age 65.</Text>
      </Card>
      <Card title="Notes">
        <Text>The client asked to be debited on the 25th.</Text>
      </Card>
    </DetailLayout>
  </AppShell>
);

/** The record's content is the main column; the facts about it go in `aside`. */
export const DoRecord = () => (
  <DetailLayout
    title="Quote Q-1042"
    description="Naledi Mokoena"
    actions={<Button variant="outline">Edit</Button>}
    aside={
      <Card title="Details">
        <KeyValueList>
          <KeyValue label="Status">Sent</KeyValue>
          <KeyValue label="Premium">R 1 240 / mo</KeyValue>
        </KeyValueList>
      </Card>
    }
  >
    <Card title="Cover">
      <Text>Life cover of R 1 500 000, to age 65.</Text>
    </Card>
  </DetailLayout>
);

/** `ListLayout` has no aside, so the facts become one more block under the content. Use `DetailLayout` for a record. */
export const DontRecord = () => (
  <ListLayout
    title="Quote Q-1042"
    description="Naledi Mokoena"
    actions={<Button variant="outline">Edit</Button>}
  >
    <Card title="Cover">
      <Text>Life cover of R 1 500 000, to age 65.</Text>
    </Card>
    <Card title="Details">
      <KeyValueList>
        <KeyValue label="Status">Sent</KeyValue>
        <KeyValue label="Premium">R 1 240 / mo</KeyValue>
      </KeyValueList>
    </Card>
  </ListLayout>
);
