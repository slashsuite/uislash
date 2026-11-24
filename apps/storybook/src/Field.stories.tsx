import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Checkbox,
  DateField,
  Field,
  FileDrop,
  Input,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Textarea,
} from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/Field.examples.js";

const meta: Meta = { title: "Forms/Field" };
export default meta;
type S = StoryObj;

export const WithInput: S = {
  render: () => (
    <Field label="Display name" hint="Shown on your reviews.">
      <Input />
    </Field>
  ),
};
export const WithError: S = {
  render: () => (
    <Field label="Display name" hint="Shown on your reviews." error="Pick a shorter name.">
      <Input />
    </Field>
  ),
};
/**
 * One invalid look: every control with an `error` has the same red edge, and keeps it under the
 * pointer.
 */
export const InvalidLook: S = {
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <Field label="Input" error="Pick a shorter name.">
        <Input />
      </Field>
      <Field label="Input with an icon" error="Pick a shorter name.">
        <Input icon="search" />
      </Field>
      <Field label="Select" error="Choose a size.">
        <Select
          items={[
            { value: "s", label: "Small" },
            { value: "l", label: "Large" },
          ]}
        />
      </Field>
      <Field label="Textarea" error="Write a few words.">
        <Textarea />
      </Field>
      <DateField label="DateField" error="Pick a date." />
      <Checkbox label="Checkbox" error="Accept the terms." />
      <Switch label="Switch" error="Turn it on." />
      <RadioGroup label="RadioGroup" error="Choose one.">
        <Radio label="One" value="one" />
        <Radio label="Two" value="two" />
      </RadioGroup>
      <Field label="FileDrop" error="Add a file.">
        <FileDrop>Drop a file</FileDrop>
      </Field>
    </div>
  ),
};
/** `required` puts a red asterisk after the label and marks the control required. */
export const Required: S = {
  render: () => (
    <Field label="Email" hint="Receipts go here." required>
      <Input type="email" />
    </Field>
  ),
};
export const WithTextarea: S = {
  render: () => (
    <Field label="Review">
      <Textarea />
    </Field>
  ),
};

export const DoLabel: S = {
  render: examples.DoLabel,
};

export const DontLabel: S = {
  render: examples.DontLabel,
};

export const DoError: S = {
  render: examples.DoError,
};

export const DontError: S = {
  render: examples.DontError,
};

/** `layout="row"` puts the label beside the control, for a compact setting or a drawer row. The hint or error sits under the control. */
export const Row: S = {
  render: () => (
    <div className="flex max-w-md flex-col gap-3">
      <Field label="Rank" layout="row" hint="Lower numbers come first.">
        <Input defaultValue="3" />
      </Field>
      <Field label="Owner" layout="row" error="Pick an owner.">
        <Input />
      </Field>
      <Field label="Notification frequency for shared projects" layout="row">
        <Input />
      </Field>
    </div>
  ),
};

/** `labelHidden` keeps the label for assistive tech and draws no text, for a control whose purpose is plain from what surrounds it. */
export const HiddenLabel: S = {
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <Field label="Search shops" labelHidden>
        <Input type="search" placeholder="Search shops" />
      </Field>
      <Field label="Search shops" labelHidden layout="row" hint="By name or town.">
        <Input type="search" placeholder="Search shops" />
      </Field>
    </div>
  ),
};

/** While `loading` the label is drawn and the control is a bone of its height. */
export const Loading: StoryObj<{ loading: boolean }> = {
  args: { loading: true },
  render: ({ loading }) => (
    <Field label="Display name" hint="Shown on your reviews." loading={loading}>
      <Input defaultValue="Cove Hardware" />
    </Field>
  ),
};
