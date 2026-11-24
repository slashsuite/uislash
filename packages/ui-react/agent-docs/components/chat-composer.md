## ChatComposer

Group: Content

When to use: The foot of a chat, under the `ChatThread`.

### The one right way
While a reply arrives, `busy` keeps the box open and offers Stop.
```tsx
import { ChatComposer } from "@slashsuite/ui-react";

<ChatComposer label="Message" busy onSend={() => undefined} onStop={() => undefined} />
```

### Do
- Give it a `label` and `onSend`. It keeps its own text and calls `onSend` with it trimmed, then clears the box.
- Enter sends and Shift+Enter is a newline. Empty or whitespace-only text does not send, and Send is disabled.
- `busy` is a reply on its way: the button is Stop and calls `onStop`, Enter does not send, and the reader can go on typing. With no `onStop`, Send stays disabled and no Stop is drawn.
- `disabled` is for a chat that cannot take a message at all; it disables the box and the button.
- `sendLabel` and `stopLabel` are the button's words, Send and Stop by default.

### Don't
`disabled` during a reply takes the box away from a reader mid-thought, with no way to stop the reply.
```tsx
import { ChatComposer } from "@slashsuite/ui-react";

<ChatComposer label="Message" disabled onSend={() => undefined} />

```

### Accessibility
- `label` is the box's name, in a visually hidden `<label>`.
- Enter during an IME composition commits the text and does not send.
- After Send is pressed the focus goes back to the box, since the button has just been disabled under it.

### Props
### ChatComposer
The box a message is typed into, with its button beside it. It keeps its own text. Enter sends the trimmed text and clears the box; Shift+Enter is a newline; empty or whitespace-only text does not send. While `busy` a reply is on its way: the button is Stop, Enter does not send, and typing carries on with the text kept for the next send.
- busy: boolean (default false). A reply is on its way: the button is Stop and Enter does not send. With no `onStop`, the button
stays a disabled Send and no Stop is drawn.
- disabled: boolean (default false). Disables the box and the button. For a chat that cannot take a message at all, not for a reply in flight: that is `busy`.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- label: string (required). The box's name for assistive tech; it is not drawn.
- onSend: (text: string) => void (required). Called with the trimmed text.
- onStop: (() => void). Called when the reader presses Stop.
- placeholder: string. The hint inside the empty box.
- sendLabel: string (default Send). The button's word, for sending.
- stopLabel: string (default Stop). The button's word, while `busy`.
