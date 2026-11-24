## Dialog

Group: Feedback

When to use: A confirmation or a short form the reader must answer before they go on.

### Use instead
- Drawer (drawer.md): A record or a long form is worked on beside the page.
- FieldDialog (field-dialog.md): Only one text value is asked for.
- BottomSheet (bottom-sheet.md): Content sits over a map or a canvas that must stay usable: not modal.
- Lightbox (lightbox.md): One photo or video is shown at full size.

### The one right way
A confirmation is a title that names the action, one line of consequence, and Cancel beside the action. It is rendered only while open.
```tsx
import { useState } from "react";
import { Button, Dialog } from "@slashsuite/ui-react";

function Example() {
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
}
```

### Do
- Render it only while it is open: `{open && <Dialog … onClose={() => setOpen(false)} />}`. It opens itself on mount.
- A `title` that names the action, a `description` with the consequence, and the actions in `footer`: Cancel as `variant="ghost"` first, then the one action, `tone="danger"` when it destroys something.
- A form is the Dialog's own `onSubmit`: the body, the error and the footer are one form, so the footer's `Button type="submit"` and Enter in a field submit it, with no form id and no `form` attribute. The footer is Cancel (`variant="ghost"`), then the one submit button. With `onSubmit`, put no `<form method="dialog">` in the footer: it would nest a form.
- An error about one field is that `Field`'s `error`. An error about the whole submit (the server refused it, a conflict, no connection) is the Dialog's `error`: an alert between the body and the footer, beside the button that was pressed however tall the body is.
- A tall body scrolls inside the dialog, which is never taller than the screen: the title, the description and the footer stay on screen, so the actions are always in reach. There is nothing to set.
- One text field is a `FieldDialog`. A record or a long form is a `Drawer`. A message that needs no answer is a `Callout` in the page, or a `Toast` when it should not move the page.
- It fades and slides in, and out again on close, but a `<dialog>` only animates out while it is still in the DOM. So `onClose` is called once the exit has finished: put `setOpen(false)` there and nowhere else. Esc, the backdrop and a `<form method="dialog">` close it that way already. Your own Cancel or action button closes it by calling `.close()` on its `<dialog>`, which a click handler finds with `event.currentTarget.closest("dialog")`. A button that calls `setOpen(false)` itself unmounts the dialog at once, and it vanishes with no exit animation.
- After async work (a save), keep the `<dialog>` from the event before the `await` (`const dialog = event.currentTarget.closest("dialog")`) and call `dialog?.close()` when it resolves.

### Don't
With no Cancel and no consequence, the only way out of the dialog is the one button that destroys the build.
```tsx
import { useState } from "react";
import { Button, Dialog } from "@slashsuite/ui-react";

function Example() {
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
}
```

A modal for a message makes the reader dismiss it before they can carry on.
```tsx
import { useState } from "react";
import { Button, Dialog } from "@slashsuite/ui-react";

function Example() {
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
}
```

A form id in the body, a `form` attribute on the button, and a hand-made error line under the fields, away from the button that was pressed.
```tsx
import { useState } from "react";
import { Button, Dialog, Field, Input, Stack, Text } from "@slashsuite/ui-react";

function Example() {
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
}
```

### Accessibility
- A Dialog is the browser's own `<dialog>` opened with `showModal()`: the page behind goes inert, focus stays inside it and Esc closes it.
- The fade and slide are switched off under `prefers-reduced-motion: reduce`, and then it closes at once.
- It is named by its `title`, an `h2`, through `aria-labelledby`.
- A click on the backdrop closes it, and so does a submit of a `<form method="dialog">`; every close calls `onClose`.
- The browser focuses the first focusable element in it when it opens; put `autoFocus` on the button that should have focus first.
- A tall body that holds nothing focusable, such as plain text, takes a tab stop so the arrow keys can scroll it. A tall form keeps its first focus on its first field.

### Props
### Dialog
A modal on the browser's own `<dialog>`: it is opened with `showModal()` on mount, so render it only while it is open. The page behind goes inert, Esc closes it and focus stays inside; a click on the backdrop (the `<dialog>` element itself, not its contents) closes it too. A windowed dialog is never taller than the screen: a tall body scrolls and the title and footer stay on screen.
- description: ReactNode. A muted line under the title.
- error: ReactNode. What went wrong with the whole submit (the server refused it, no connection): a danger
`Callout`, announced as an alert, between the body and the footer, so it stays beside the
buttons however tall the body is. An error about one field is that `Field`'s `error`.
- footer: ReactNode. Actions under the body, right-aligned: Cancel (`variant="ghost"`), then the one main action.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- onClose: () => void (required). Called when the dialog closes: Esc, a click on the backdrop, or a `<form method="dialog">` submit.
- onSubmit: ((event: FormEvent<HTMLFormElement>) => void | Promise<unknown>). Makes the dialog a form: one `<form noValidate>` holds the body, the `error` and the footer,
so a `Button type="submit"` in the footer or Enter in a field submits it, with no `form`
attribute or id. The default is prevented before this runs, and a rejection is yours to
catch and show as `error`. Put no `<form method="dialog">` in the footer of a form dialog:
it would nest a form.
- title: ReactNode (required). The dialog's accessible name, shown as its heading.
- width: "sm" | "md" | "lg" | "full" (default md). The panel's width: `sm` (320px) is a list, `md` (440px) holds a form, `lg` (640px) a wider
form or a table. `full` fills the whole screen, for media or a player: the body takes the
height between the header and the footer and scrolls if it is taller. It has no backdrop to
click, so give it a close action in the `footer` (a `<form method="dialog">` button).

A single photo or video is a `Lightbox`.
