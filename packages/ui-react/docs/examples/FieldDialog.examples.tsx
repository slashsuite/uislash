import { useState } from "react";
import { Button, Dialog, Field, FieldDialog, Input } from "@slashsuite/ui-react";

/** One value to ask for is a `FieldDialog`: it blocks an empty submit, shows the busy state and puts a rejection under the field. */
export const DoOneField = () => {
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
};

/** A `Dialog` with a hand-built field has no empty check, no busy state and no error line, and each copy drifts from the next. */
export const DontOneField = () => {
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
};
