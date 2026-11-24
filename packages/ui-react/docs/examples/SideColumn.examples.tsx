import { Card, ClusterGrow, Overline, SideColumn, Stack, Text } from "@slashsuite/ui-react";

/** A main area and a side column of a known width are a `SideColumn`: the aside is exactly as wide as `asideWidth`, whatever it holds. */
export const DoFixedColumn = () => (
  <SideColumn
    aside={
      <Card title="Reply agent">
        <Text>Ask for a draft, then edit it before it is sent.</Text>
      </Card>
    }
  >
    <Card title="Thread">
      <Text>The main area takes everything the aside leaves.</Text>
    </Card>
  </SideColumn>
);

/** A `Stack` with `rowFrom` and a `ClusterGrow` sizes the side by its content: a long line makes it wide and takes the room from the main area. */
export const DontFixedColumn = () => (
  <Stack rowFrom="lg">
    <ClusterGrow>
      <Card title="Thread">
        <Text>The main area takes what is left.</Text>
      </Card>
    </ClusterGrow>
    <Card>
      <Overline>Reply agent</Overline>
      <Text>
        Whatever width the aside's text wants is the width it takes, so it changes with its words.
      </Text>
    </Card>
  </Stack>
);
