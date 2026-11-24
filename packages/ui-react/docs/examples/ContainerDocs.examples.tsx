import { Card, Container, Text } from "@slashsuite/ui-react";

/** One `Container` is the content edge: everything inside it starts at the same x. */
export const DoOneEdge = () => (
  <Container as="section" aria-label="Billing">
    <Card title="Plan">
      <Text>Team, billed monthly.</Text>
    </Card>
  </Container>
);

/** A `Container` inside a `Container` pads the content twice, so it no longer lines up with the page. `AppShell` already wraps its main in one. */
export const DontOneEdge = () => (
  <Container as="section" aria-label="Billing">
    <Container>
      <Card title="Plan">
        <Text>Team, billed monthly.</Text>
      </Card>
    </Container>
  </Container>
);
