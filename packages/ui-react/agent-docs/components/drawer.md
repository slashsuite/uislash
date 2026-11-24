## Drawer

Group: Feedback

When to use: A record or a form the reader works on beside the page, with actions that stay in view.

### Use instead
- Dialog (dialog.md): A question, or a short form, must be answered before going on.
- BottomSheet (bottom-sheet.md): Content sits over a map or a canvas that must stay usable: not modal.
- FieldDialog (field-dialog.md): Only one text value is asked for.

### The one right way
A record or a form beside the page: the title names it, the body scrolls and the actions stay pinned in `footer`.
```tsx
import { useState } from "react";
import { Button, Drawer, KeyValue, KeyValueList } from "@slashsuite/ui-react";

function Example() {
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
}
```

### Do
- Render it only while it is open: `{open && <Drawer … onClose={() => setOpen(false)} />}`. It opens itself on mount.
- Use it for a record to read or edit, or a form with several fields; a yes-or-no question is a `Dialog`.
- The actions go in `footer`, pinned under the body, which scrolls between the header and the footer.
- `width` is `sm`, `md` (the default) or `lg`; choose by the content, `sm` for one field and `lg` for a table. `description` is a muted line under the title, as on a `Dialog`.
- Set `closeLabel` to the reader's language when the page is not in English.
- It slides out again on close, but only while it is still in the DOM, so `onClose` is called once the exit has finished: put `setOpen(false)` there and nowhere else. Esc, the scrim and the close button close it that way already. A Cancel or Save button in the `footer` closes it by calling `.close()` on its `<dialog>`, which a click handler finds with `event.currentTarget.closest("dialog")`. A button that calls `setOpen(false)` itself unmounts the drawer at once, with no exit animation. After async work, keep the `<dialog>` from the event before the `await` and call `.close()` when it resolves.

### Don't
A yes-or-no question is a `Dialog`: a full-height panel for one confirmation is more than it asks.
```tsx
import { useState } from "react";
import { Button, Drawer, Text } from "@slashsuite/ui-react";

function Example() {
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
}
```

A Save in the body scrolls out of view with a long form and leaves the footer empty.
```tsx
import { useState } from "react";
import { Button, Drawer, Field, Input, Stack } from "@slashsuite/ui-react";

function Example() {
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
}
```

### Accessibility
- A Drawer is the browser's own `<dialog>` opened with `showModal()`: the page behind goes inert, focus stays inside it and Esc closes it.
- It is named by its `title`, an `h2`, through `aria-labelledby`.
- The header's close button is an `IconButton` named by `closeLabel` ("Close" by default); a click on the scrim closes it too.
- Closing, or unmounting it, hands focus back to the element that opened it.
- The slide in and out is switched off under `prefers-reduced-motion: reduce`, and then it closes at once.

### Props
### Drawer
A modal slide-over anchored to the right edge, on the browser's own `<dialog>`: it is opened with `showModal()` on mount, so render it only while it is open. The page behind goes inert, Esc closes it and focus stays inside; a click on the scrim (the `<dialog>` element itself, not its contents) closes it too. The header holds the title, an optional `description` under it and a close button; the body scrolls between it and an optional pinned `footer`.
- closeLabel: string (default Close). The accessible name of the close button.
- description: ReactNode. A muted line under the title, as on a `Dialog`.
- footer: ReactNode. Actions pinned under the scrolling body, right-aligned.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- onClose: () => void (required). Called when the drawer closes: Esc, a click on the scrim or the close button.
- title: ReactNode (required). The drawer's accessible name, shown as its heading.
- width: "sm" | "md" | "lg" (default md). The panel's width: `md` holds a form or a record; `sm` (320px) is narrower and `lg` (640px) wider.
