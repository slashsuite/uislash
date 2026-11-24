import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  ButtonGroup,
  Checkbox,
  Field,
  Fieldset,
  FormGrid,
  Input,
} from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/Fieldset.examples.js";

const meta: Meta = { title: "Forms/Fieldset" };
export default meta;
type S = StoryObj;

/** Several checkboxes that answer one question, named by the group's label. */
export const Checkboxes: S = {
  render: () => (
    <Fieldset label="What is wrong?" hint="Tick all that apply.">
      <Checkbox label="Wrong opening hours" />
      <Checkbox label="Wrong address" />
      <Checkbox label="Closed for good" />
    </Fieldset>
  ),
};

/** A set of fields that belong together, laid out by a `FormGrid` inside, the format as the hint. */
export const Fields: S = {
  render: () => (
    <Fieldset label="Opening hours" hint="HH:MM to HH:MM; leave a day blank when it is closed.">
      <FormGrid>
        <Field label="Monday to Friday">
          <Input defaultValue="09:00 to 17:00" />
        </Field>
        <Field label="Saturday">
          <Input defaultValue="09:00 to 13:00" />
        </Field>
      </FormGrid>
    </Fieldset>
  ),
};

/** The filter chips of one facet: a `ButtonGroup` of outline, small, pressed Buttons. */
export const Chips: S = {
  render: () => (
    <Fieldset label="Type of shop">
      <ButtonGroup>
        <Button variant="outline" size="sm" pressed={false}>
          Charity
        </Button>
        <Button variant="outline" size="sm" pressed>
          Vintage
        </Button>
        <Button variant="outline" size="sm" pressed={false}>
          Books
        </Button>
        <Button variant="outline" size="sm" pressed={false}>
          Furniture
        </Button>
      </ButtonGroup>
    </Fieldset>
  ),
};

/** The group's error replaces its hint, in red, and is announced. */
export const Invalid: S = {
  render: () => (
    <Fieldset label="What is wrong?" hint="Tick all that apply." error="Pick at least one.">
      <Checkbox label="Wrong opening hours" />
      <Checkbox label="Wrong address" />
      <Checkbox label="Closed for good" />
    </Fieldset>
  ),
};

/** `disabled` disables every control inside. */
export const Disabled: S = {
  render: () => (
    <Fieldset label="What is wrong?" disabled>
      <Checkbox label="Wrong opening hours" defaultChecked />
      <Checkbox label="Closed for good" />
    </Fieldset>
  ),
};

export const DoGroup: S = {
  render: examples.DoGroup,
};

export const DontGroup: S = {
  render: examples.DontGroup,
};

export const DoFacets: S = {
  render: examples.DoFacets,
};

export const DontFacets: S = {
  render: examples.DontFacets,
};

export const DoRadio: S = {
  render: examples.DoRadio,
};

export const DontRadio: S = {
  render: examples.DontRadio,
};
