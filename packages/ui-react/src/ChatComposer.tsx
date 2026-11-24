import {
  type FormEvent,
  type KeyboardEvent,
  type ReactElement,
  useId,
  useRef,
  useState,
} from "react";
import { Button } from "./Button.js";
import { Cluster, ClusterGrow } from "./Cluster.js";
import { Field } from "./Field.js";
import type { Passthrough } from "./props.js";
import { TextareaControl } from "./Textarea.js";

/**
 * An IME is still composing. Safari ends the composition before the Enter's keydown, so there
 * `isComposing` is already false and only the 229 keyCode tells the commit from a real Enter.
 */
function isComposing({ nativeEvent }: KeyboardEvent<HTMLTextAreaElement>): boolean {
  return nativeEvent.isComposing || nativeEvent.keyCode === 229;
}

/**
 * The composer's text, and whether the last send found it empty; `type` sets the text and clears that.
 * `send` sends the trimmed text and clears the box, or marks it empty; it does nothing while `busy`.
 */
function useComposerText(busy: boolean, onSend: (text: string) => void) {
  const [text, setText] = useState("");
  const [empty, setEmpty] = useState(false);
  const type = (next: string) => {
    setText(next);
    setEmpty(false);
  };
  const send = () => {
    if (busy) return;
    const trimmed = text.trim();
    if (trimmed === "") {
      setEmpty(true);
      return;
    }
    onSend(trimmed);
    setText("");
  };
  return { text, type, empty, send };
}

/** The composer's one submit button: Send, or Stop while a reply can be stopped. */
function SendOrStop({
  stop,
  disabled,
  sendLabel = "Send",
  stopLabel = "Stop",
}: {
  stop: boolean;
  disabled: boolean;
  sendLabel: string | undefined;
  stopLabel: string | undefined;
}): ReactElement {
  return (
    <Button type="submit" variant={stop ? "outline" : "primary"} disabled={disabled}>
      {stop ? stopLabel : sendLabel}
    </Button>
  );
}

/**
 * The box a message is typed into, with its button beside it. It keeps its own text, and the box
 * grows with it from 2 rows to 8. Enter sends the trimmed text and clears the box; Shift+Enter is a
 * newline. Send stays enabled on an empty box: sending empty or whitespace-only text sends nothing
 * and shows `emptyReason` under the box until the next keystroke. While `busy` a reply is on its way: the button is Stop, Enter does not send, and typing
 * carries on with the text kept for the next send.
 */
export function ChatComposer({
  label,
  placeholder,
  disabled = false,
  busy = false,
  onSend,
  onStop,
  sendLabel,
  stopLabel,
  emptyReason = "Write a message first.",
  ...rest
}: {
  /** The box's name for assistive tech; it is not drawn. */
  label: string;
  /** The hint inside the empty box. */
  placeholder?: string | undefined;
  /** Disables the box and the button. For a chat that cannot take a message at all, not for a reply in flight: that is `busy`. */
  disabled?: boolean | undefined;
  /**
   * A reply is on its way: the button is Stop and Enter does not send. With no `onStop`, the button
   * stays a disabled Send and no Stop is drawn.
   */
  busy?: boolean | undefined;
  /** Called with the trimmed text. */
  onSend: (text: string) => void;
  /** Called when the reader presses Stop. */
  onStop?: (() => void) | undefined;
  /**
   * The button's word, for sending.
   * @default Send
   */
  sendLabel?: string | undefined;
  /**
   * The button's word, while `busy`.
   * @default Stop
   */
  stopLabel?: string | undefined;
  /**
   * Shown under the box when Send is pressed on an empty box.
   * @default Write a message first.
   */
  emptyReason?: string | undefined;
} & Passthrough): ReactElement {
  const id = useId();
  const box = useRef<HTMLTextAreaElement>(null);
  const { text, type, empty, send } = useComposerText(busy, onSend);
  const stop = busy && onStop !== undefined;

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey || isComposing(event)) return;
    event.preventDefault();
    send();
  };
  // One submit button that is Send or Stop, so it is the same element across the swap and keeps its
  // focus. Send goes back to the box, to type the next message or the missing one.
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) {
      onStop?.();
      return;
    }
    send();
    box.current?.focus();
  };

  return (
    <form {...rest} onSubmit={onSubmit}>
      <Cluster align="end" gap="sm">
        <ClusterGrow>
          <Field label={label} htmlFor={id} labelHidden error={empty ? emptyReason : undefined}>
            <TextareaControl
              ref={box}
              id={id}
              size="md"
              width="full"
              mono={false}
              grow
              value={text}
              placeholder={placeholder}
              disabled={disabled}
              onChange={(event) => type(event.target.value)}
              onKeyDown={onKeyDown}
            />
          </Field>
        </ClusterGrow>
        <SendOrStop
          stop={stop}
          disabled={disabled || (busy && !stop)}
          sendLabel={sendLabel}
          stopLabel={stopLabel}
        />
      </Cluster>
    </form>
  );
}
