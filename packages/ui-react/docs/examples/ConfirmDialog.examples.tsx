import { useState } from "react";
import { Button, ConfirmDialog, Dialog } from "@slashsuite/ui-react";

/** A question that names the action, one line of consequence, and Cancel beside the action: it opens on Cancel, so a stray Enter cancels. */
export const DoConfirm = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Delete build
      </Button>
      {open && (
        <ConfirmDialog
          title="Delete build?"
          description="This removes the build and every snapshot in it."
          confirm="Delete"
          busyLabel="Deleting…"
          onConfirm={() => Promise.resolve()}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

/** A hand-built `Dialog` with no Cancel and no consequence: the only way on is the one button that destroys the build, and nothing says what it destroys. */
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
