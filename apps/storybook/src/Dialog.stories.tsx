import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type MouseEvent, type ReactNode } from "react";
import { Button, Dialog, Kbd, KeyValue, KeyValueList, Stack, Text } from "@slashsuite/ui-react";
import { sampleScenes } from "../../../packages/ui-react/docs/examples/sampleScene.js";
import * as examples from "../../../packages/ui-react/docs/examples/Dialog.examples.js";
import { openDialog } from "./openByTrigger";

const meta: Meta = { title: "Feedback/Dialog" };
export default meta;
type S = StoryObj;

/** Close through the `<dialog>` so it animates out; `onClose` then unmounts it. Setting the parent's state here would cut the exit animation short. */
const closeDialog = (event: MouseEvent<HTMLElement>) =>
  event.currentTarget.closest("dialog")?.close();

/** Shut until its button opens it (`openDialog` does, as the story loads); Esc or the backdrop closes it, and the focus goes back to the button. */
function Opened({ children }: { children: (close: () => void) => ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-6">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open
      </Button>
      {open && children(() => setOpen(false))}
    </div>
  );
}

export const Default: S = {
  play: openDialog,
  render: () => (
    <Opened>
      {(close) => (
        <Dialog
          title="Delete build"
          description="This removes the build and every snapshot in it."
          onClose={close}
          footer={
            <>
              <Button variant="ghost" onClick={closeDialog}>
                Cancel
              </Button>
              <Button onClick={closeDialog}>Delete</Button>
            </>
          }
        >
          <Text>There is no undo. Reviews already recorded stay in the audit log.</Text>
        </Dialog>
      )}
    </Opened>
  ),
};

/** The shortcut list: a small dialog with a body and nothing to do but read it, so no footer: the close button in the corner is the way out. */
export const Small: S = {
  play: openDialog,
  render: () => (
    <Opened>
      {(close) => (
        <Dialog title="Keyboard shortcuts" width="sm" onClose={close}>
          <KeyValueList>
            <KeyValue label="Next shot">
              <Kbd>j</Kbd>
            </KeyValue>
            <KeyValue label="Previous shot">
              <Kbd>k</Kbd>
            </KeyValue>
            <KeyValue label="Approve">
              <Kbd>a</Kbd>
            </KeyValue>
          </KeyValueList>
        </Dialog>
      )}
    </Opened>
  ),
};

export const TitleOnly: S = {
  play: openDialog,
  render: () => <Opened>{(close) => <Dialog title="Saved" onClose={close} />}</Opened>,
};

export const DoNotice: S = {
  render: examples.DoNotice,
};

export const DontNotice: S = {
  render: examples.DontNotice,
};

export const DoForm: S = {
  render: examples.DoForm,
};

export const DontForm: S = {
  render: examples.DontForm,
};

/** `width="lg"` (640px): a wider form or a table. `sm` is 320px and `md`, the default, 440px. */
export const Large: S = {
  play: openDialog,
  render: () => (
    <Opened>
      {(close) => (
        <Dialog
          title="Import statement"
          description="Check the rows before they are added."
          width="lg"
          onClose={close}
          footer={
            <>
              <Button variant="ghost" onClick={closeDialog}>
                Cancel
              </Button>
              <Button onClick={closeDialog}>Import</Button>
            </>
          }
        >
          <KeyValueList>
            <KeyValue label="Rows">42</KeyValue>
            <KeyValue label="Skipped">3</KeyValue>
          </KeyValueList>
        </Dialog>
      )}
    </Opened>
  ),
};

/**
 * `width="full"`: the whole screen, for media or a player. The body takes the height between the
 * header and the bottom edge, and there is no backdrop to click, so the close button in the corner
 * is the way out.
 */
export const Full: S = {
  play: openDialog,
  render: () => (
    <Opened>
      {(close) => (
        <Dialog
          title="Harbour at dusk"
          description="Anna · Today, 09:12"
          width="full"
          onClose={close}
        >
          <Stack gap="sm">
            <img src={sampleScenes[0]?.src} alt={sampleScenes[0]?.alt} />
            <Text>{sampleScenes[0]?.caption}</Text>
          </Stack>
        </Dialog>
      )}
    </Opened>
  ),
};
