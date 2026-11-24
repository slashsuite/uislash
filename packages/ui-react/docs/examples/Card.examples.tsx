import { Card, Pill, Stack, SubsectionHeading, Text } from "@slashsuite/ui-react";

/** `status` puts a Pill directly beside the title; `actions` stays at the far end. */
export const DoStatus = () => (
  <Card title="PixelSlash" status={<Pill tone="warn">Coming soon</Pill>}>
    <Text tone="muted">Visual review for every pull request.</Text>
  </Card>
);

/** A hand-built title row drifts from every other Card's: use `title` and `status`. */
export const DontStatus = () => (
  <Card>
    <SubsectionHeading>PixelSlash</SubsectionHeading>
    <Pill tone="warn">Coming soon</Pill>
    <Text tone="muted">Visual review for every pull request.</Text>
  </Card>
);

/** A `Stack` spaces the Cards; the gap is the one the whole library uses. */
export const DoSpacing = () => (
  <Stack>
    <Card title="Open" count={3}>
      <Text tone="muted">Three things to do.</Text>
    </Card>
    <Card title="Done" count={12}>
      <Text tone="muted">Twelve things finished.</Text>
    </Card>
  </Stack>
);

/** Cards with nothing between them butt together. Space them with `Stack` or `CardGrid`. */
export const DontSpacing = () => (
  <>
    <Card title="Open" count={3}>
      <Text tone="muted">Three things to do.</Text>
    </Card>
    <Card title="Done" count={12}>
      <Text tone="muted">Twelve things finished.</Text>
    </Card>
  </>
);
