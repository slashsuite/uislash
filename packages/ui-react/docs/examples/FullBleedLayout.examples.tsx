import {
  AppShell,
  Card,
  EmptyState,
  FullBleedLayout,
  KeyValue,
  KeyValueList,
  Tabs,
  Overline,
  Text,
} from "@slashsuite/ui-react";

/** A whole viewer page: the shell with `bleed`, then the layout with the viewer in `children` and the facts in `aside`. The `EmptyState` stands in for the app's own viewer. */
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
    bleed
  >
    <FullBleedLayout
      aside={
        <>
          <Overline as="h2">Snapshot</Overline>
          <KeyValueList>
            <KeyValue label="Story">Button / Primary</KeyValue>
            <KeyValue label="Changed">0.4%</KeyValue>
          </KeyValueList>
        </>
      }
    >
      <EmptyState title="Snapshot viewer">
        <Text>Your viewer goes here and fills the width.</Text>
      </EmptyState>
    </FullBleedLayout>
  </AppShell>
);

/** A viewer that needs the whole width (a snapshot, a canvas, a player) fills it, with the facts in the `aside`. */
export const DoViewer = () => (
  <FullBleedLayout
    aside={
      <>
        <Overline as="h2">Snapshot</Overline>
        <KeyValueList>
          <KeyValue label="Story">Button / Primary</KeyValue>
          <KeyValue label="Changed">0.4%</KeyValue>
        </KeyValueList>
      </>
    }
  >
    <Text>The snapshot fills the width.</Text>
  </FullBleedLayout>
);

/** `FullBleedLayout` adds no padding unless `padded`, so an ordinary page lands on the screen edge. A page with a title is a `ListLayout` or `DetailLayout`. */
export const DontViewer = () => (
  <FullBleedLayout>
    <Card title="Quotes">
      <Text>Every quote you have sent.</Text>
    </Card>
  </FullBleedLayout>
);
