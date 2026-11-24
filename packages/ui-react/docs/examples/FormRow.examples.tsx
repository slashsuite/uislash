import {
  Button,
  Field,
  FormGrid,
  FormRow,
  FormRowField,
  Input,
  Textarea,
} from "@slashsuite/ui-react";

/** A row of controls with proportional widths, `actions` after them, and one `hint` under the whole row. */
export const DoInlineEdit = () => (
  <FormRow hint="Press Save to apply the change." actions={<Button>Save</Button>}>
    <FormRowField label="Description" htmlFor="do-row-desc" span={3}>
      <Input id="do-row-desc" defaultValue="Kitchen renovation" />
    </FormRowField>
    <FormRowField label="Amount" htmlFor="do-row-amount">
      <Input id="do-row-amount" defaultValue="12,400.00" numeric />
    </FormRowField>
  </FormRow>
);

/** A `Field` with its own hint inside a `FormRow` makes its column taller, so the controls drift out of line and the save button with them. */
export const DontInlineEdit = () => (
  <FormRow actions={<Button>Save</Button>}>
    <Field label="Description" htmlFor="dont-row-desc" hint="Shown on the invoice.">
      <Input id="dont-row-desc" defaultValue="Kitchen renovation" />
    </Field>
    <Field label="Amount" htmlFor="dont-row-amount">
      <Input id="dont-row-amount" defaultValue="12,400.00" numeric />
    </Field>
  </FormRow>
);

/** A `FormGrid` is two columns from `md`; a long control takes `span="full"` so it runs across both. */
export const DoTwoColumns = () => (
  <FormGrid>
    <Field label="First name" htmlFor="do-grid-first">
      <Input id="do-grid-first" />
    </Field>
    <Field label="Last name" htmlFor="do-grid-last">
      <Input id="do-grid-last" />
    </Field>
    <Field label="Notes" htmlFor="do-grid-notes" span="full">
      <Textarea id="do-grid-notes" />
    </Field>
  </FormGrid>
);

/** Without `span="full"` a `Textarea` takes half the width and leaves a hole beside it. */
export const DontTwoColumns = () => (
  <FormGrid>
    <Field label="First name" htmlFor="dont-grid-first">
      <Input id="dont-grid-first" />
    </Field>
    <Field label="Last name" htmlFor="dont-grid-last">
      <Input id="dont-grid-last" />
    </Field>
    <Field label="Notes" htmlFor="dont-grid-notes">
      <Textarea id="dont-grid-notes" />
    </Field>
  </FormGrid>
);
