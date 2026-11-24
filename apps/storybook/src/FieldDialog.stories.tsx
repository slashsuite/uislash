import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button, FieldDialog } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/FieldDialog.examples.js";

const meta: Meta = { title: "Feedback/FieldDialog" };
export default meta;
type S = StoryObj;

/** A submit that never settles: the dialog stays on its busy state until Cancel or Esc. */
const never = () => new Promise<never>(() => {});

/** Open when the story loads; the button opens it again after it closes. */
function Opened({ onSubmit }: { onSubmit: (value: string) => Promise<unknown> }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="p-6">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open
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
          onSubmit={onSubmit}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

/** Empty, with Create enabled: an empty submit reports `emptyReason` on the field. A submit stays busy until Cancel. */
export const Default: S = {
  render: () => <Opened onSubmit={never} />,
};
/** A name typed and submitted, the submit still pending: the button shows its busy label. */
export const Pending: S = {
  render: () => <Opened onSubmit={never} />,
  play: async ({ canvasElement }) => {
    const field = canvasElement.ownerDocument.querySelector<HTMLInputElement>("dialog[open] input");
    if (!field) throw new Error("no open FieldDialog");
    Reflect.set(HTMLInputElement.prototype, "value", "my-project", field);
    field.dispatchEvent(new Event("input", { bubbles: true }));
    // React flushes that input's update in a microtask queued before this one: the value is in state.
    await new Promise<void>((resolve) => queueMicrotask(resolve));
    field.form?.requestSubmit();
  },
};
/** Submitted empty: the field is invalid, `emptyReason` is its error under the hint, and it has the focus. */
export const EmptySubmit: S = {
  render: () => <Opened onSubmit={never} />,
  play: ({ canvasElement }) => {
    const form = canvasElement.ownerDocument.querySelector("dialog[open] form");
    if (!(form instanceof HTMLFormElement)) throw new Error("no open FieldDialog");
    form.requestSubmit();
  },
};
/** Type a name and submit: the dialog closes. */
export const Resolves: S = {
  render: () => <Opened onSubmit={() => Promise.resolve()} />,
};
/** Submit rejects: the message replaces the hint as the field's error and the dialog stays open. */
export const Rejects: S = {
  render: () => <Opened onSubmit={() => Promise.reject(new Error("That name is taken."))} />,
};

export const DoOneField: S = {
  render: examples.DoOneField,
};

export const DontOneField: S = {
  render: examples.DontOneField,
};
