## FormLayout

Group: Page layouts

When to use: Creating or editing a record on a page of its own.

### Use instead
- FormRow (form-row.md): Fields sit side by side inside the form: a `FormGrid`, or a `FormRow` to edit one record on a line.
- Stack (stack.md): The form sits in a `Card` on a page that is not the form: `Stack as="form"`.
- FieldDialog (field-dialog.md): One text value is asked for over the page, such as a new name.

### The one right way
The fields go in `children`; Save and Cancel go in `actions`, at the end of the form.
```tsx
import { Button, Card, Field, FormLayout, Input, Stack } from "@slashsuite/ui-react";

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
```

### Full page
A whole form page: the shell with its brand and nav, then the layout with the fields in `children` and Save and Cancel in `actions`.
```tsx
import {
  AppShell,
  Button,
  Card,
  Field,
  FormLayout,
  Input,
  Tabs,
  Stack,
} from "@slashsuite/ui-react";

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
```

### Do
- The fields are the `children`, grouped in `Card`s; the layout spaces them in a reading-width column.
- Save and Cancel go in `actions`, at the end of the form: a `type="submit"` Button first, then a ghost Cancel. The header has no `actions` here.
- Handle the submit with `onSubmit`: other props go on the `<form>` itself.
- A failed submit (the server refused it, no connection) is `error`: an alert directly above the `actions`. An error about one field is that `Field`'s `error`.
- A form in a small panel is a `Dialog` or `FieldDialog`; a sign-in is `CenteredLayout`.

### Don't
- Do not put Save in the header of a `ListLayout`: that is not a form.

`ListLayout` is not a form: Save sits in the header, away from the fields, and nothing submits on Enter. Use `FormLayout`.
```tsx
import { Button, Card, Field, Input, ListLayout, Stack } from "@slashsuite/ui-react";

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
```

### Accessibility
- The root is a real `<form>`: Enter in a field submits it, and a `type="submit"` Button submits it.
- The title is the page's `h1`.
- Give each control a `Field`, so every input has a label.

### Props
### FormLayout
A form page: header (no header `actions`), then a `max-w-3xl` column that starts at the Container's start edge (it is not re-centred), with an `actions` row at the end. `error` is the submit's failure, a danger `Callout` (an alert) directly above that row. Other props go on the `<form>`. While `loading` it owns the wait and passes it to everything inside, the header too.
- actions: ReactNode. The row at the end of the form: its submit and cancel buttons.
- breadcrumbs: ReactNode. A `Breadcrumbs` above the title.
- description: ReactNode. The lede under the title: a `Lead`, so it outranks the body text after it.
- error: ReactNode. What went wrong with the whole submit (the server refused it, no connection), announced as an
alert directly above the `actions`. An error about one field is that `Field`'s `error`.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- tabs: ReactNode. A `Tabs` (or similar) under the title.
- title: ReactNode (required). The page's `h1`.
