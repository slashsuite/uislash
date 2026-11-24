## ChatThread

Group: Content

When to use: Holding the messages and tool calls of a chat, an agent log or a message thread.

### The one right way
Nothing to show yet is the thread's `empty`, which goes away with the first message.
```tsx
import { ChatThread, EmptyState } from "@slashsuite/ui-react";

<ChatThread label="New chat" empty={<EmptyState title="No messages yet" level={3} />} />
```

### Do
- Name it with `label`. Its children are `ChatMessage`s and anything else that belongs in the conversation (a tool call is a bordered `Disclosure` whose `summary` names the tool and carries a `Pill` for how it went), in order, oldest first.
- It starts at the bottom and stays there as content grows, a streamed reply included. When the reader scrolls up it leaves them where they are; scrolling back to the bottom (within 32px) follows again. You write no scrolling of your own.
- `height` caps it: `sm`, `md` (default) or `lg`. `fill` takes the height of a parent that sets one, for a whole-page chat.
- `empty` is what it draws with no children, an `EmptyState`, at its full size.
- Set `announce` when a message is finished ("Helper replied"), not on each token.
- An approval is a `Callout` with `Button`s in its `actions`, placed in the thread, not a component of its own. So is a notice beside a message.
- It knows nothing about where messages come from: no fetch, no AI SDK. Map your own messages to its children.

### Don't
A made-up message is not an empty state: a screen reader reads it as something somebody said.
```tsx
import { ChatMessage, ChatThread } from "@slashsuite/ui-react";

<ChatThread label="New chat">
  <ChatMessage role="assistant" author="Helper">
    No messages yet
  </ChatMessage>
</ChatThread>
```

### Accessibility
- The box is `role="region"` named by `label`, with `tabIndex={0}`, so a keyboard can reach it and scroll it with the arrow keys. Use a different `label` for each thread on a page.
- It is deliberately not `role="log"` and has no `aria-live`: a live region round streamed text reads every token aloud. `announce` goes in a visually hidden `aria-live="polite"` element beside the box.
- Following the bottom is instant, never a smooth scroll.

### Props
### ChatThread
The scrolling box of a chat: its children are the messages, tool cards and anything else, a gap apart. It follows the newest content unless the reader has scrolled up. It is a named region and a tab stop, so a keyboard can scroll it. It is deliberately not a live region, which would read every streamed token aloud: set `announce` when a message is finished.
- announce: string. Text a screen reader reads out politely when it changes. Set it when a message is finished, not on each token.
- empty: ReactNode. Drawn instead when there are no children: an `EmptyState`.
- height: "sm" | "md" | "lg" | "fill" (default md). The tallest it gets before it scrolls: `sm` 20rem, `md` 28rem, `lg` 40rem. `fill` takes the
height of a parent that sets one.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- label: string (required). Names the region.
