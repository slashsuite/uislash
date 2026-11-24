import { Caption, Card, Divider, Stack, Text } from "@slashsuite/ui-react";

/** A `Divider` is one hairline between two parts of a page, here the content and its footer. The space around it is the `Stack`'s. */
export const DoFooter = () => (
  <Stack gap="lg">
    <Text>The last paragraph of a page.</Text>
    <Divider />
    <Caption>Hack Cove (Pty) Ltd</Caption>
  </Stack>
);

/** A `Divider` and a footer placed by hand inside a `Card`: the card's own `footer` draws that strip, its line and its spacing. */
export const DontFooter = () => (
  <Card title="Quote 12">
    <Stack gap="lg">
      <Text>Two lines, R 1 200.</Text>
      <Divider />
      <Caption>Total R 1 200</Caption>
    </Stack>
  </Card>
);

/** Bordered blocks need no rule between them: the Stack's gap separates them. */
export const DoCards = () => (
  <Stack>
    <Card title="Build 412">
      <Text>3 changed</Text>
    </Card>
    <Card title="Build 411">
      <Text>No changes</Text>
    </Card>
  </Stack>
);

/** A `Divider` between two Cards is a second line on top of their borders and the gap. */
export const DontCards = () => (
  <Stack>
    <Card title="Build 412">
      <Text>3 changed</Text>
    </Card>
    <Divider />
    <Card title="Build 411">
      <Text>No changes</Text>
    </Card>
  </Stack>
);
