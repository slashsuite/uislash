import { Caption, Cluster, ProgressBar, Stack, Text } from "@slashsuite/ui-react";

/** Say in words how far along it is, beside the bar. The bar shows the share and the words give the figures. */
export const DoProgress = () => (
  <Stack gap="xs">
    <Cluster justify="between">
      <Text as="span">Kitchen funded</Text>
      <Caption as="span">R 45 000 of R 75 000</Caption>
    </Cluster>
    <ProgressBar value={45000} max={75000} label="Kitchen funded" />
  </Stack>
);

/** A bare bar: nobody can tell what it measures or how much it holds. */
export const DontProgress = () => <ProgressBar value={60} label="Kitchen funded" />;

/** `value` is on the scale of `max` (100 unless you pass one): three of twelve is `value={3} max={12}`. */
export const DoScale = () => <ProgressBar value={3} max={12} label="Months saved" />;

/** A fraction such as `0.25` is read as a quarter of one percent, not a quarter of the bar. */
export const DontScale = () => <ProgressBar value={0.25} label="Months saved" />;
