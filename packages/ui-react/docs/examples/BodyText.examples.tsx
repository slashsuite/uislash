import {
  Button,
  Caption,
  Card,
  EmptyState,
  Overline,
  SectionHeading,
  Stack,
  Text,
} from "@slashsuite/ui-react";

/** Body copy is `Text`, with `Text strong` for emphasis inside it and `Caption` for the fine print. */
export const DoParagraph = () => (
  <Stack gap="xs">
    <Text>
      Invoice{" "}
      <Text as="span" strong>
        INV-204
      </Text>{" "}
      is due on Friday.
    </Text>
    <Caption>Sent 2 minutes ago</Caption>
  </Stack>
);

/** Plain HTML text elements carry no size, weight or colour of the theme. Every run of text is a typography part. */
export const DontParagraph = () => (
  <Stack gap="xs">
    <p>
      Invoice <strong>INV-204</strong> is due on Friday.
    </p>
    <small>Sent 2 minutes ago</small>
  </Stack>
);

/** `tone` says what a run of text means: `positive` for "Saved.", `danger` for an error. */
export const DoMeaning = () => (
  <Stack gap="xs">
    <Text tone="positive">Saved.</Text>
    <Text tone="danger">Could not save: the name is taken.</Text>
  </Stack>
);

/** `muted` and `accent` are the hierarchy of text, not its meaning: an error in the accent ink reads as a link, and in muted grey as nothing at all. */
export const DontMeaning = () => (
  <Stack gap="xs">
    <Text tone="accent">Saved.</Text>
    <Text tone="muted">Could not save: the name is taken.</Text>
  </Stack>
);

/** An `Overline` is the small label above a heading, naming the group it belongs to. */
export const DoLabels = () => (
  <Stack gap="xs">
    <Overline>Billing</Overline>
    <SectionHeading>Invoices</SectionHeading>
  </Stack>
);

/** An `Overline` is a `span`, not a heading: a section titled by one has no place in the page outline. Use `SectionHeading`. */
export const DontLabels = () => (
  <Stack gap="xs">
    <Overline>Invoices</Overline>
    <Text>Two invoices are due this week.</Text>
  </Stack>
);

/** A Card with nothing to show yet holds an `EmptyState size="sm"`: one muted line that says the card is empty. */
export const DoEmptyNote = () => (
  <Card title="Done" count={0}>
    <EmptyState size="sm" title="Nothing finished yet." />
  </Card>
);

/** A muted `Text` looks like the empty line but is only words: it is not an empty state. Use `EmptyState size="sm"`. */
export const DontEmptyNote = () => (
  <Card title="Done" count={0}>
    <Text tone="muted">Nothing finished yet.</Text>
  </Card>
);

/** A whole view with nothing in it, and a way forward, is an `EmptyState` with its `actions`. */
export const DoEmptyView = () => (
  <EmptyState title="No projects yet" actions={<Button>Create a project</Button>}>
    <Text>Projects collect the shots you upload.</Text>
  </EmptyState>
);

/** One muted line is not a view: with a button under it nothing says what the page is for. Use `EmptyState`. */
export const DontEmptyView = () => (
  <Stack>
    <Text tone="muted">No projects yet.</Text>
    <Button>Create a project</Button>
  </Stack>
);
