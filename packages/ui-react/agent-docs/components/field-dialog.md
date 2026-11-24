## FieldDialog

Group: Feedback

When to use: Asking for a single name or value: new project, rename, a label.

### Use instead
- FormLayout (form-layout.md): The form has several fields and a page of its own.
- Dialog (dialog.md): More than one field, or a question with no field.
- Drawer (drawer.md): A record or a long form with several fields.

### The one right way
One value to ask for is a `FieldDialog`: it blocks an empty submit, shows the busy state and puts a rejection under the field.
```tsx
import { useState } from "react";
import { Button, FieldDialog } from "@slashsuite/ui-react";

function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        New project
      </Button>
      {open && (
        <FieldDialog
          title="New project"
          description="Projects hold your builds and their reviews."
          label="Name"
          placeholder="my-project"
          hint="Letters, numbers and dashes."
          emptyReason="Type a name first."
          submit="Create"
          busyLabel="Creating…"
          onSubmit={() => Promise.resolve()}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
```

### Do
- Render it only while it is open, and give every string it shows: `title`, `label`, `placeholder`, `hint`, `emptyReason`, `submit` and `busyLabel`, and a `description` under the title when the question needs a sentence.
- `onSubmit` gets the trimmed value and returns a promise. Resolving closes the dialog; rejecting shows the error message under the field and keeps the dialog open.
- More than one field is a `Dialog` with `onSubmit` holding its `Field`s, or a `Drawer`.

### Don't
A `Dialog` with a hand-built field has no empty check, no busy state and no error line, and each copy drifts from the next.
```tsx
import { useState } from "react";
import { Button, Dialog, Field, Input } from "@slashsuite/ui-react";

function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        New project
      </Button>
      {open && (
        <Dialog
          title="New project"
          onClose={() => setOpen(false)}
          footer={<Button onClick={() => setOpen(false)}>Create</Button>}
        >
          <Field label="Name" htmlFor="project-name">
            <Input id="project-name" placeholder="my-project" />
          </Field>
        </Dialog>
      )}
    </>
  );
}
```

### Accessibility
- It is a `Dialog`: native `<dialog>`, page behind inert, focus kept inside, Esc closes, named by its `title`.
- The input has focus when it opens and is named by `label`.
- While the field is empty the submit button is disabled and its `emptyReason` is the button's title and the field's hint.
- While `onSubmit` is pending the button is busy (`aria-busy`); a rejection shows in the field's error line, which is `role="alert"`.

### Props
### FieldDialog
A `Dialog` with one text field and Cancel / submit buttons. Render it only while open.
- busyLabel: string (required). What the submit button says while `onSubmit` runs.
- description: string. A muted line under the title.
- emptyReason: string (required). Said when the field is empty and the submit button is blocked.
- hint: string (required). A muted line under the field; `emptyReason` takes its place while the field is empty.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- label: string (required). The visible label above the field, which names it.
- onClose: () => void (required). Called when the dialog closes: Cancel, Esc, the backdrop, or a resolved `onSubmit`.
- onSubmit: (value: string) => Promise<unknown> (required). Gets the trimmed value. Resolving closes the dialog; a rejection shows its message in it.
- placeholder: string (required). The field's placeholder.
- submit: string (required). The submit button's text.
- title: string (required). The dialog's heading and accessible name.
