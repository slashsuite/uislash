import { Checkbox, Radio, RadioGroup, Stack } from "@slashsuite/ui-react";

/** One of a few options, all visible, is a `RadioGroup`: the group has a name and each option its label. */
export const DoChoice = () => (
  <RadioGroup label="Shop type" defaultValue="vintage">
    <Radio value="vintage" label="Vintage" />
    <Radio value="books" label="Books" />
  </RadioGroup>
);

/** Checkboxes allow several ticks: they cannot say "one of these", and the screen reader hears no group. */
export const DontChoice = () => (
  <Stack gap="sm">
    <Checkbox label="Vintage" defaultChecked />
    <Checkbox label="Books" />
  </Stack>
);
