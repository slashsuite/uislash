import { useState } from "react";
import { Button, Callout, Dialog, Field, Input, Stack, Text } from "@slashsuite/ui-react";

/** A confirmation is a title that names the action, one line of consequence, and Cancel beside the action. It is rendered only while open. */
export const DoConfirm = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Delete build
      </Button>
      {open && (
        <Dialog
          title="Delete build"
          description="This removes the build and every snapshot in it."
          onClose={() => setOpen(false)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button tone="danger" onClick={() => setOpen(false)}>
                Delete
              </Button>
            </>
          }
        />
      )}
    </>
  );
};

/** With no Cancel and no consequence, the only way out of the dialog is the one button that destroys the build. */
export const DontConfirm = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Delete build
      </Button>
      {open && (
        <Dialog
          title="Are you sure?"
          onClose={() => setOpen(false)}
          footer={
            <Button tone="danger" onClick={() => setOpen(false)}>
              Delete
            </Button>
          }
        />
      )}
    </>
  );
};

/** A result that needs no answer is a `Callout` in the page, where it does not take the page away. */
export const DoNotice = () => (
  <Stack gap="sm">
    <Button variant="outline">Save</Button>
    <Callout tone="positive">Your review is saved.</Callout>
  </Stack>
);

/** A modal for a message makes the reader dismiss it before they can carry on. */
export const DontNotice = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Save
      </Button>
      {open && (
        <Dialog
          title="Saved"
          description="Your review is saved."
          onClose={() => setOpen(false)}
          footer={<Button onClick={() => setOpen(false)}>OK</Button>}
        />
      )}
    </>
  );
};

/** The fields and buttons in one form, from the Dialog's `onSubmit`, Cancel then Create: Create or Enter in a field submits, and a failed submit is the Dialog's `error`, above the buttons. */
export const DoForm = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | undefined>();
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        New flag
      </Button>
      {open && (
        <Dialog
          title="New flag"
          onClose={() => setOpen(false)}
          onSubmit={() => setError("Could not create the flag: the key is taken.")}
          error={error}
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </>
          }
        >
          <Stack>
            <Field label="Key">
              <Input defaultValue="new-checkout" />
            </Field>
            <Field label="Name">
              <Input defaultValue="New checkout" />
            </Field>
          </Stack>
        </Dialog>
      )}
    </>
  );
};

/** A form id in the body, a `form` attribute on the button, and a hand-made error line under the fields, away from the button that was pressed. */
export const DontForm = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        New flag
      </Button>
      {open && (
        <Dialog
          title="New flag"
          onClose={() => setOpen(false)}
          footer={
            <Button type="submit" form="new-flag-form">
              Create
            </Button>
          }
        >
          <form id="new-flag-form" onSubmit={(event) => event.preventDefault()}>
            <Stack>
              <Field label="Key">
                <Input defaultValue="new-checkout" />
              </Field>
              <Text tone="danger">Could not create the flag: the key is taken.</Text>
            </Stack>
          </form>
        </Dialog>
      )}
    </>
  );
};
