## FileDrop

Group: Forms

When to use: Uploading a file: a statement, a photo, an import.

### The one right way
Name the file the zone wants in its prompt, restrict it with `accept`, and show the chosen file's name from `onChange`.
```tsx
import { useState } from "react";
import { FileDrop } from "@slashsuite/ui-react";

function Example() {
  const [name, setName] = useState("");
  return (
    <FileDrop accept=".csv" onChange={(event) => setName(event.target.files?.[0]?.name ?? "")}>
      {name === "" ? "Drop a bank statement here or click to choose" : name}
    </FileDrop>
  );
}
```

### Do
- Say what the zone wants in its children, and restrict the type with `accept`.
- Show the chosen file's name in the children from `onChange`; the zone does not do it for you.
- `size="sm"` is a compact chip or tile, `size="lg"` a roomy drop zone; `md` is the default.
- `multiple`, `name` and `disabled` go on the zone like any file input; say why it is disabled in its `Field` hint.
- Put a `FileDrop` in a `Field` when it needs a label of its own above it.

### Don't
A prompt that never changes leaves the person unsure the file was taken, and with no `accept` any file is.
```tsx
import { FileDrop } from "@slashsuite/ui-react";

<FileDrop>Drop here</FileDrop>

```

### Accessibility
- A real `<input type="file">` covers the whole zone, invisible, so a click opens the file dialog, a dragged file is taken as by any file input, and the browser's keyboard handling applies.
- The zone is a `<label>`, so its children are the input's accessible name.
- The zone shows the keyboard focus ring while the input has focus.
- In a `Field`, the `Field` around it adds its label to the input's name and its hint or error as `aria-describedby`, and an error marks the input `aria-invalid` and turns the dashed edge red.

### Props
### FileDrop
A dashed drop zone around a file input. The input covers the whole zone, invisible, so a click opens the file dialog and a file dragged onto it is taken by the browser as it is by any file input. `children` is the prompt; show the chosen file's name there from `onChange`. The label also shows the keyboard focus ring, the input being invisible. Every prop (`accept`, `multiple`, `name`, `disabled`, `onChange`) goes on the input.
- accept: string (native). The file types it takes, as on `<input type="file">`: `"image/*"`, `".pdf"`.
- disabled: boolean (native). Disables the drop zone; say why in its `Field` hint.
- multiple: boolean (native). Takes several files at once.
- name: string (native). The key the files post under in a form.
- size: "sm" | "md" | "lg" (default md). `sm` is a compact chip or tile: dense padding; `lg` is one step roomier than `md`.
