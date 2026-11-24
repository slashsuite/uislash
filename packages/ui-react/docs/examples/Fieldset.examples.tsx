import {
  Button,
  ButtonGroup,
  Checkbox,
  Cluster,
  Fieldset,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@slashsuite/ui-react";

/** Checkboxes for one question go in a `Fieldset`, so a screen reader hears the question on entering the group. */
export const DoGroup = () => (
  <Fieldset label="What is wrong?">
    <Checkbox label="Wrong opening hours" />
    <Checkbox label="Closed for good" />
  </Fieldset>
);

/** Bold text over loose checkboxes looks like a group, but the question is not their name. */
export const DontGroup = () => (
  <Stack gap="xs">
    <Text strong>What is wrong?</Text>
    <Checkbox label="Wrong opening hours" />
    <Checkbox label="Closed for good" />
  </Stack>
);

/** One `Fieldset` per facet, stacked: each keeps its own name and its own row of chips. */
export const DoFacets = () => (
  <Stack gap="sm">
    <Fieldset label="Type of shop">
      <ButtonGroup>
        <Button variant="outline" size="sm" pressed>
          Vintage
        </Button>
        <Button variant="outline" size="sm" pressed={false}>
          Books
        </Button>
      </ButtonGroup>
    </Fieldset>
    <Fieldset label="Open">
      <ButtonGroup>
        <Button variant="outline" size="sm" pressed={false}>
          Now
        </Button>
        <Button variant="outline" size="sm" pressed>
          Saturdays
        </Button>
      </ButtonGroup>
    </Fieldset>
  </Stack>
);

/** Chips with no group have no name: a screen reader hears a row of buttons and not what they filter. */
export const DontFacets = () => (
  <Cluster gap="xs" wrap>
    <Button variant="outline" size="sm" pressed>
      Vintage
    </Button>
    <Button variant="outline" size="sm" pressed={false}>
      Books
    </Button>
    <Button variant="outline" size="sm" pressed={false}>
      Now
    </Button>
  </Cluster>
);

/** One choice of several is a `RadioGroup`, which is its own named group. */
export const DoRadio = () => (
  <RadioGroup label="Kind" defaultValue="layout">
    <Radio value="layout" label="Layout" />
    <Radio value="colour" label="Colour" />
  </RadioGroup>
);

/** A `RadioGroup` inside a `Fieldset` is two names for one question. */
export const DontRadio = () => (
  <Fieldset label="Detection">
    <RadioGroup label="Kind" defaultValue="layout">
      <Radio value="layout" label="Layout" />
      <Radio value="colour" label="Colour" />
    </RadioGroup>
  </Fieldset>
);
