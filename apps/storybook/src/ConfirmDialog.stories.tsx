import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button, ConfirmDialog } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/ConfirmDialog.examples.js";

const meta: Meta = { title: "Feedback/ConfirmDialog" };
export default meta;
type S = StoryObj;

/** An action that never settles: the confirm button stays busy until Cancel or Esc. */
const never = () => new Promise<never>(() => {});

/** Open when the story loads; the button opens it again after it closes. */
function Opened({ onConfirm }: { onConfirm: () => void | Promise<unknown> }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="p-6">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Delete build
      </Button>
      {open && (
        <ConfirmDialog
          title="Delete build?"
          description="This removes the build and every snapshot in it."
          confirm="Delete"
          busyLabel="Deleting…"
          onConfirm={onConfirm}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

/** Open on Cancel. Delete goes busy and stays so, since its action never settles. */
export const Default: S = {
  render: () => <Opened onConfirm={never} />,
};

/** An action that is not destructive: `tone="neutral"` draws the confirm button in the main colour. */
export const Neutral: S = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div className="p-6">
        <Button variant="outline" onClick={() => setOpen(true)}>
          Archive project
        </Button>
        {open && (
          <ConfirmDialog
            title="Archive project?"
            description="It leaves the project list. You can restore it from Settings."
            confirm="Archive"
            tone="neutral"
            onConfirm={() => undefined}
            onClose={() => setOpen(false)}
          />
        )}
      </div>
    );
  },
};

/** Delete rejects: its message shows as an alert above the buttons, and the dialog stays open. */
export const Rejects: S = {
  render: () => (
    <Opened
      onConfirm={() => Promise.reject(new Error("The build is locked by a running review."))}
    />
  ),
};

export const DoConfirm: S = {
  render: examples.DoConfirm,
};

export const DontConfirm: S = {
  render: examples.DontConfirm,
};
