import { Button, Card, EmptyState, Stack, Text } from "@slashsuite/ui-react";

/** An empty page says what belongs here and offers the first step as the primary action. */
export const DoNextStep = () => (
  <EmptyState title="No builds yet" actions={<Button>Create a project</Button>}>
    <Text>Builds appear here once a project has uploaded its first capture.</Text>
  </EmptyState>
);

/** A bare "Nothing here" is a dead end: it does not say what belongs here or what to do next. */
export const DontNextStep = () => <EmptyState title="Nothing here" />;

/** An empty list inside a card gives its `empty` slot an `EmptyState`, which the list draws as one muted line. */
export const DoInline = () => (
  <Card title="Builds">
    <Stack as="ul" empty={<EmptyState title="No builds yet." />}>
      {[]}
    </Stack>
  </Card>
);

/** A muted `Text` written by hand is a second empty look, and it stays on screen when the list fills. */
export const DontInline = () => (
  <Card title="Builds">
    <Text tone="muted">No builds yet.</Text>
  </Card>
);
