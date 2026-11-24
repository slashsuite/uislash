## ChatMessage

Group: Content

When to use: A message from a person or an assistant inside a `ChatThread`.

### The one right way
A reply still arriving says so with `streaming`: the caret, and `aria-busy` for a screen reader.
```tsx
import { ChatMessage } from "@slashsuite/ui-react";

<ChatMessage role="assistant" author="Helper" streaming>
  Start by sweating the leeks in
</ChatMessage>
```

### Do
- `role` picks the side: `user` on the right, `assistant` on the left.
- `author` is required and is for a screen reader. To show a sender and a time, pass them, already formatted, as `meta`, the small line above the bubble.
- The children are the body and it does not call `Markdown` for you: pass plain text, which keeps its line breaks, or a `Markdown` or an `Image`.
- `actions` is a row under the bubble on the message's own side: copy, retry, a row of reaction `Pill`s. It is always in view, never only on hover.
- `streaming` marks a reply still arriving, with a caret after the body. With no children it draws the bubble with the caret alone: the pending state.

### Don't
Dots typed into the body say nothing to a screen reader, and are read out as text when it is done.
```tsx
import { ChatMessage } from "@slashsuite/ui-react";

<ChatMessage role="assistant" author="Helper">
  Start by sweating the leeks in...
</ChatMessage>
```

A button in the body reads as part of what was said, and is copied with it.
```tsx
import { Button, ChatMessage, Text } from "@slashsuite/ui-react";

<ChatMessage role="assistant" author="Helper">
  <Text>The pantry did not answer.</Text>
  <Button size="sm" variant="ghost">
    Retry
  </Button>
</ChatMessage>
```

### Accessibility
- It is an `<article>`. `author` comes first in the DOM, visually hidden, because alignment tells a screen reader nothing.
- `streaming` sets `aria-busy`. The caret is `aria-hidden`, and it pulses only for a reader who has not asked for reduced motion.
- A message is not announced as it arrives: that is the `ChatThread`'s `announce`.

### Props
### ChatMessage
One message in a chat: a bubble on the sender's side, with an optional line above it and a row of actions under it. `children` is the body as the caller wants it (plain text, which keeps its line breaks, a `Markdown`, an `Image`). `streaming` marks a reply still arriving; with no children it draws the caret alone, the pending state.
- actions: ReactNode. A row under the bubble on the message's own side: copy, retry, a row of reaction `Pill`s.
- author: string (required). Who sent it, read first by a screen reader and drawn nowhere: alignment alone tells a screen reader nothing. Show a sender with `meta`.
- children: ReactNode. The body. It may be empty while `streaming`.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- meta: ReactNode. A small line above the bubble: a sender and a time, already formatted.
- role: "user" | "assistant" (required). Whose side it sits on: `user` on the right on the inset fill, `assistant` on the left on the surface.
- streaming: boolean (default false). The reply is still arriving: sets `aria-busy` and draws a caret after the body, which pulses
unless the reader asks for reduced motion.
