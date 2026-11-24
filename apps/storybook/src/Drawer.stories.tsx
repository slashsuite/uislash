import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type MouseEvent, type ReactNode } from "react";
import { Button, Drawer, Field, Input, KeyValue, KeyValueList, Text } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/Drawer.examples.js";

const meta: Meta = { title: "Feedback/Drawer" };
export default meta;
type S = StoryObj;

/** Close through the `<dialog>` so it animates out; `onClose` then unmounts it. Setting the parent's state here would cut the exit animation short. */
const closeDialog = (event: MouseEvent<HTMLElement>) =>
  event.currentTarget.closest("dialog")?.close();

/** Open when the story loads; Esc, the scrim or the close button closes it, and the button opens it again. */
function Opened({ children }: { children: (close: () => void) => ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="p-6">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open
      </Button>
      {open && children(() => setOpen(false))}
    </div>
  );
}

/** A record: facts in the body, with the actions pinned under it. */
export const Default: S = {
  render: () => (
    <Opened>
      {(close) => (
        <Drawer
          title="HC-65 · Tabs"
          onClose={close}
          footer={
            <>
              <Button variant="ghost" onClick={closeDialog}>
                Cancel
              </Button>
              <Button onClick={closeDialog}>Save</Button>
            </>
          }
        >
          <KeyValueList>
            <KeyValue label="Status">In progress</KeyValue>
            <KeyValue label="Owner">Jacobus</KeyValue>
            <KeyValue label="Opened">24 Oct</KeyValue>
          </KeyValueList>
        </Drawer>
      )}
    </Opened>
  ),
};

/** A body taller than the screen scrolls between the header and the footer, which stay put. */
export const LongBody: S = {
  render: () => (
    <Opened>
      {(close) => (
        <Drawer
          title="Activity"
          onClose={close}
          footer={<Button onClick={closeDialog}>Done</Button>}
        >
          <div className="flex flex-col gap-3">
            {Array.from({ length: 40 }, (_, i) => (
              <Text key={i}>Entry {i + 1}: a line of activity in the log.</Text>
            ))}
          </div>
        </Drawer>
      )}
    </Opened>
  ),
};

/** A form drawer: `onSubmit` makes the body and the footer one form, so Enter in a field or Save submits it, and `error` is the whole submit's failure, pinned above the footer. Save here always fails, as it would offline. */
export const Form: S = {
  render: () => {
    const [error, setError] = useState<string | undefined>();
    return (
      <Opened>
        {(close) => (
          <Drawer
            title="Edit flag"
            onClose={close}
            onSubmit={() => setError("Could not save: you are offline.")}
            error={error}
            footer={
              <>
                <Button variant="ghost" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </>
            }
          >
            <Field label="Key" htmlFor="drawer-form-key">
              <Input id="drawer-form-key" defaultValue="beta-search" />
            </Field>
            <Field label="Name" htmlFor="drawer-form-name">
              <Input id="drawer-form-name" defaultValue="Beta search" />
            </Field>
          </Drawer>
        )}
      </Opened>
    );
  },
};

export const Small: S = {
  render: () => (
    <Opened>
      {(close) => (
        <Drawer title="Rename" width="sm" onClose={close}>
          <Field label="Name" htmlFor="drawer-name">
            <Input id="drawer-name" defaultValue="Hack Cove" />
          </Field>
        </Drawer>
      )}
    </Opened>
  ),
};

export const Large: S = {
  render: () => (
    <Opened>
      {(close) => (
        <Drawer title="Compare" width="lg" onClose={close}>
          <Text>A wider panel for a table or a form with two columns.</Text>
        </Drawer>
      )}
    </Opened>
  ),
};

export const DoRecord: S = {
  render: examples.DoRecord,
};

export const DontRecord: S = {
  render: examples.DontRecord,
};

export const DoFooter: S = {
  render: examples.DoFooter,
};

export const DontFooter: S = {
  render: examples.DontFooter,
};
