import { useState } from "react";
import {
  Button,
  Drawer,
  Field,
  Input,
  KeyValue,
  KeyValueList,
  Stack,
  Text,
} from "@slashsuite/ui-react";

/** A record or a form beside the page: the title names it, the body scrolls and the actions stay pinned in `footer`. */
export const DoRecord = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open HC-65
      </Button>
      {open && (
        <Drawer
          title="HC-65 · Tabs"
          onClose={() => setOpen(false)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Save</Button>
            </>
          }
        >
          <KeyValueList>
            <KeyValue label="Status">In progress</KeyValue>
            <KeyValue label="Owner">Jacobus</KeyValue>
          </KeyValueList>
        </Drawer>
      )}
    </>
  );
};

/** A yes-or-no question is a `Dialog`: a full-height panel for one confirmation is more than it asks. */
export const DontRecord = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Delete build
      </Button>
      {open && (
        <Drawer
          title="Delete build?"
          width="sm"
          onClose={() => setOpen(false)}
          footer={<Button onClick={() => setOpen(false)}>Delete</Button>}
        >
          <Text>This removes the build and every snapshot in it.</Text>
        </Drawer>
      )}
    </>
  );
};

/** The actions go in `footer`, so Save stays in view while the body scrolls. */
export const DoFooter = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Rename
      </Button>
      {open && (
        <Drawer
          title="Rename"
          width="sm"
          onClose={() => setOpen(false)}
          footer={<Button onClick={() => setOpen(false)}>Save</Button>}
        >
          <Field label="Name" htmlFor="drawer-rename">
            <Input id="drawer-rename" defaultValue="Hack Cove" />
          </Field>
        </Drawer>
      )}
    </>
  );
};

/** A Save in the body scrolls out of view with a long form and leaves the footer empty. */
export const DontFooter = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Rename
      </Button>
      {open && (
        <Drawer title="Rename" width="sm" onClose={() => setOpen(false)}>
          <Stack>
            <Field label="Name" htmlFor="drawer-rename-body">
              <Input id="drawer-rename-body" defaultValue="Hack Cove" />
            </Field>
            <Button onClick={() => setOpen(false)}>Save</Button>
          </Stack>
        </Drawer>
      )}
    </>
  );
};
