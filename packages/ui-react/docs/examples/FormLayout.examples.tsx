import {
  AppShell,
  Button,
  Card,
  Field,
  FormLayout,
  Input,
  ListLayout,
  Tabs,
  Stack,
} from "@slashsuite/ui-react";

/** A whole form page: the shell with its brand and nav, then the layout with the fields in `children` and Save and Cancel in `actions`. */
export const FullPage = () => (
  <AppShell
    brand={<a href="#">Hack Cove</a>}
    nav={
      <Tabs
        label="Main"
        items={[
          { label: "Quotes", href: "#quotes", selected: true },
          { label: "Clients", href: "#clients" },
        ]}
      />
    }
  >
    <FormLayout
      title="New client"
      description="Who is the quote for?"
      onSubmit={(event) => event.preventDefault()}
      actions={
        <>
          <Button type="submit">Save client</Button>
          <Button variant="ghost">Cancel</Button>
        </>
      }
    >
      <Card title="Client">
        <Stack>
          <Field label="Full name">
            <Input placeholder="Naledi Mokoena" />
          </Field>
          <Field label="Email">
            <Input type="email" />
          </Field>
        </Stack>
      </Card>
    </FormLayout>
  </AppShell>
);

/** The fields go in `children`; Save and Cancel go in `actions`, at the end of the form. */
export const DoForm = () => (
  <FormLayout
    title="New client"
    description="Who is the quote for?"
    onSubmit={(event) => event.preventDefault()}
    actions={
      <>
        <Button type="submit">Save client</Button>
        <Button variant="ghost">Cancel</Button>
      </>
    }
  >
    <Card title="Client">
      <Stack>
        <Field label="Full name">
          <Input placeholder="Naledi Mokoena" />
        </Field>
        <Field label="Email">
          <Input type="email" placeholder="naledi@example.com" />
        </Field>
      </Stack>
    </Card>
  </FormLayout>
);

/** `ListLayout` is not a form: Save sits in the header, away from the fields, and nothing submits on Enter. Use `FormLayout`. */
export const DontForm = () => (
  <ListLayout
    title="New client"
    description="Who is the quote for?"
    actions={<Button>Save client</Button>}
  >
    <Card title="Client">
      <Stack>
        <Field label="Full name">
          <Input placeholder="Naledi Mokoena" />
        </Field>
        <Field label="Email">
          <Input type="email" placeholder="naledi@example.com" />
        </Field>
      </Stack>
    </Card>
  </ListLayout>
);
