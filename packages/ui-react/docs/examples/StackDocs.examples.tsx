import {
  Button,
  Card,
  Cluster,
  Display,
  KeyValue,
  KeyValueList,
  Lead,
  Overline,
  Section,
  SectionHeading,
  Stack,
  Text,
} from "@slashsuite/ui-react";

/** Blocks that follow each other go in a `Stack`: the gap is one step of the scale, `md` by default. */
export const DoGap = () => (
  <Stack>
    <Card title="Build 412">
      <Text>3 changed</Text>
    </Card>
    <Card title="Build 411">
      <Text>No changes</Text>
    </Card>
  </Stack>
);

/** Blocks in a bare `div` touch each other. Space is the Stack's job, never left to the blocks. */
export const DontGap = () => (
  <div>
    <Card title="Build 412">
      <Text>3 changed</Text>
    </Card>
    <Card title="Build 411">
      <Text>No changes</Text>
    </Card>
  </div>
);

/** A titled group is a `Section`: the title, the actions beside it and the blocks under it, as one named region. */
export const DoSectionTitle = () => (
  <Section title="Recent builds" actions={<Button variant="outline">All builds</Button>}>
    <Card>
      <Text>Build 412 · 3 changed</Text>
    </Card>
    <Card>
      <Text>Build 411 · no changes</Text>
    </Card>
  </Section>
);

/** A heading row built by hand is not tied to its group: nothing names the region and the row's spacing is a guess. Use `Section`. */
export const DontSectionTitle = () => (
  <Stack gap="sm">
    <Cluster justify="between">
      <SectionHeading>Recent builds</SectionHeading>
      <Button variant="outline">All builds</Button>
    </Cluster>
    <Card>
      <Text>Build 412 · 3 changed</Text>
    </Card>
    <Card>
      <Text>Build 411 · no changes</Text>
    </Card>
  </Stack>
);

/** A list of things is `Stack as="ul"` with an `li` per item: the spacing of a Stack and a list that assistive tech announces. */
export const DoList = () => (
  <Stack as="ul" gap="sm" aria-label="Builds">
    <li>
      <Card>
        <Text>Build 412 · 3 changed</Text>
      </Card>
    </li>
    <li>
      <Card>
        <Text>Build 411 · no changes</Text>
      </Card>
    </li>
  </Stack>
);

/** The same cards in a plain Stack are two unrelated blocks: no list, no count, nothing to jump by. */
export const DontList = () => (
  <Stack gap="sm">
    <Card>
      <Text>Build 412 · 3 changed</Text>
    </Card>
    <Card>
      <Text>Build 411 · no changes</Text>
    </Card>
  </Stack>
);

/** A width cap on one block is a `Stack` around it: `width="compact"` is one card's width, at the left edge. */
export const DoWidth = () => (
  <Stack width="compact">
    <Card title="Opening hours" size="sm">
      <KeyValueList>
        <KeyValue label="Mon to Fri">08:00 to 17:00</KeyValue>
        <KeyValue label="Saturday">08:00 to 13:00</KeyValue>
        <KeyValue label="Sunday">Closed</KeyValue>
      </KeyValueList>
    </Card>
  </Stack>
);

/** Left to the page, a small card stretches across it and its few lines float in a wide box. */
export const DontWidth = () => (
  <Stack>
    <Card title="Opening hours" size="sm">
      <KeyValueList>
        <KeyValue label="Mon to Fri">08:00 to 17:00</KeyValue>
        <KeyValue label="Saturday">08:00 to 13:00</KeyValue>
        <KeyValue label="Sunday">Closed</KeyValue>
      </KeyValueList>
    </Card>
  </Stack>
);

/** A small titled group inside a card or a panel is `Section size="sm"`: a region named by its small title, its lines `xs` apart, an action at the end of the title row. */
export const DoSmallSection = () => (
  <Card>
    <Stack gap="sm">
      <Section
        size="sm"
        title="Flaky"
        actions={
          <Button variant="ghost" size="sm">
            Rerun
          </Button>
        }
      >
        <Text>checkout.spec.ts failed once in the last 20 runs.</Text>
      </Section>
      <Section size="sm" title="Ignore areas">
        <Text>The clock in the header and the avatar.</Text>
      </Section>
    </Stack>
  </Card>
);

/** Built from a `Stack as="section"` and an `Overline as="h2"`, the group is an unnamed section whose gap is a guess. */
export const DontSmallSection = () => (
  <Card>
    <Stack gap="sm">
      <Stack as="section" gap="xs">
        <Cluster justify="between">
          <Overline as="h2">Flaky</Overline>
          <Button variant="ghost" size="sm">
            Rerun
          </Button>
        </Cluster>
        <Text>checkout.spec.ts failed once in the last 20 runs.</Text>
      </Stack>
      <Stack as="section" gap="xs">
        <Overline as="h2">Ignore areas</Overline>
        <Text>The clock in the header and the avatar.</Text>
      </Stack>
    </Stack>
  </Card>
);

/** A landing page's section is `Section size="lg"`: the kicker, the display title and the lede in one region named by its title. */
export const DoLandingSection = () => (
  <Section
    size="lg"
    overline="Fit"
    title="Built for agents."
    description="A site from props alone, in every theme."
  >
    <Card>
      <Text>Each tool answers one question about a change.</Text>
    </Card>
  </Section>
);

/** An `Overline`, a `Display as="h2"` and a `Lead` by hand: nothing names the region and the spacing drifts from every other landing section. */
export const DontLandingSection = () => (
  <Stack as="section" gap="lg">
    <Stack gap="sm">
      <header>
        <Overline mono>Fit</Overline>
        <Display as="h2">Built for agents.</Display>
      </header>
      <Lead>A site from props alone, in every theme.</Lead>
    </Stack>
    <Card>
      <Text>Each tool answers one question about a change.</Text>
    </Card>
  </Stack>
);
