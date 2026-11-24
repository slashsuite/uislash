import { Caption, Cluster, SplitBar, Stack } from "@slashsuite/ui-react";

/** Give `names` so a screen reader hears whose share is whose, and draw the names under the bar for everyone else. */
export const DoParties = () => (
  <Stack gap="xs">
    <SplitBar a={35} b={65} label="Pot split" names={["Debt", "Renos"]} />
    <Cluster justify="between">
      <Caption as="span">Debt 35%</Caption>
      <Caption as="span">Renos 65%</Caption>
    </Cluster>
  </Stack>
);

/** No `names` and nothing under the bar: the two colours are never explained, and a screen reader hears two bare percentages. */
export const DontParties = () => <SplitBar a={35} b={65} label="Pot split" />;
