import { BulletItem, BulletList, Stack, Text } from "@slashsuite/ui-react";

/** A list is a `BulletList` of `BulletItem`s: the list owns the discs, the indent and the gap. */
export const DoItems = () => (
  <BulletList>
    <BulletItem>Moved the nightly build from cron to a queue.</BulletItem>
    <BulletItem>Cut the cold start from nine seconds to two.</BulletItem>
    <BulletItem>Wrote the runbook the team still uses.</BulletItem>
  </BulletList>
);

/** Hyphens typed into paragraphs are not a list: no discs, no indent and no list for a screen reader. */
export const DontItems = () => (
  <Stack gap="xs">
    <Text>- Moved the nightly build from cron to a queue.</Text>
    <Text>- Cut the cold start from nine seconds to two.</Text>
    <Text>- Wrote the runbook the team still uses.</Text>
  </Stack>
);
