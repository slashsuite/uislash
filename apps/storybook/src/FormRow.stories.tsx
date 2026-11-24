import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Field,
  FormGrid,
  FormRow,
  FormRowField,
  Input,
  Select,
  Stack,
  Textarea,
} from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/FormRow.examples.js";

const meta: Meta = { title: "Forms/FormRow" };
export default meta;
type S = StoryObj;

/** Fields side by side, widths in proportion to `span` (1 to 4), the action after them. Under `md` they stack. */
export const InlineEdit: S = {
  render: () => (
    <FormRow actions={<Button>Save</Button>}>
      <FormRowField label="Description" htmlFor="row-desc" span={2}>
        <Input id="row-desc" defaultValue="Kitchen renovation" />
      </FormRowField>
      <FormRowField label="Category" htmlFor="row-cat">
        <Select
          id="row-cat"
          defaultValue="home"
          items={[
            { value: "home", label: "Home" },
            { value: "car", label: "Car" },
          ]}
        />
      </FormRowField>
      <FormRowField label="Amount" htmlFor="row-amount">
        <Input id="row-amount" defaultValue="12,400.00" numeric />
      </FormRowField>
    </FormRow>
  ),
};

/** A `hint` or an `error` sits under the whole row, not under one field, so the controls stay level. */
export const NoteUnderTheRow: S = {
  render: () => (
    <Stack>
      <FormRow hint="Press Save to apply the change." actions={<Button>Save</Button>}>
        <FormRowField label="Description" htmlFor="hint-desc" span={3}>
          <Input id="hint-desc" defaultValue="Kitchen renovation" />
        </FormRowField>
        <FormRowField label="Amount" htmlFor="hint-amount">
          <Input id="hint-amount" defaultValue="12,400.00" numeric />
        </FormRowField>
      </FormRow>
      <FormRow error="Amount is required." actions={<Button>Save</Button>}>
        <FormRowField label="Description" htmlFor="err-desc" span={3}>
          <Input id="err-desc" defaultValue="Kitchen renovation" />
        </FormRowField>
        <FormRowField label="Amount" htmlFor="err-amount">
          <Input id="err-amount" />
        </FormRowField>
      </FormRow>
    </Stack>
  ),
};

/** `span` 1 to 4 is the share of the row: a `span` 3 field is three times as wide as the `span` 1 beside it. */
export const Spans: S = {
  render: () => (
    <Stack>
      {([1, 2, 3, 4] as const).map((span) => (
        <FormRow key={span}>
          <FormRowField label="Span 1" htmlFor={`span-a-${span}`}>
            <Input id={`span-a-${span}`} />
          </FormRowField>
          <FormRowField label={`Span ${span}`} htmlFor={`span-b-${span}`} span={span}>
            <Input id={`span-b-${span}`} />
          </FormRowField>
        </FormRow>
      ))}
    </Stack>
  ),
};

/** `FormGrid` is two columns from `md`; a `Field` with `span="full"` and a `FormRow` run across both. */
export const TwoColumnForm: S = {
  render: () => (
    <FormGrid>
      <Field label="First name" htmlFor="grid-first">
        <Input id="grid-first" />
      </Field>
      <Field label="Last name" htmlFor="grid-last">
        <Input id="grid-last" />
      </Field>
      <Field label="Notes" htmlFor="grid-notes" span="full" hint="Only you see these.">
        <Textarea id="grid-notes" />
      </Field>
      <FormRow actions={<Button variant="outline">Add</Button>}>
        <FormRowField label="Item" htmlFor="grid-item" span={3}>
          <Input id="grid-item" />
        </FormRowField>
        <FormRowField label="Qty" htmlFor="grid-qty">
          <Input id="grid-qty" numeric />
        </FormRowField>
      </FormRow>
    </FormGrid>
  ),
};

export const DoInlineEdit: S = {
  render: examples.DoInlineEdit,
};

export const DontInlineEdit: S = {
  render: examples.DontInlineEdit,
};

export const DoTwoColumns: S = {
  render: examples.DoTwoColumns,
};

export const DontTwoColumns: S = {
  render: examples.DontTwoColumns,
};

/** While `loading` each label is drawn and each control is a bone of its height. */
export const Loading: StoryObj<{ loading: boolean }> = {
  args: { loading: true },
  render: ({ loading }) => (
    <FormRow>
      <FormRowField label="Street" htmlFor="loading-street" span={2} loading={loading}>
        <Input id="loading-street" defaultValue="12 Harbour Road" />
      </FormRowField>
      <FormRowField label="Code" htmlFor="loading-code" loading={loading}>
        <Input id="loading-code" defaultValue="7975" />
      </FormRowField>
    </FormRow>
  ),
};
