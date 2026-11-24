import type { ComponentPropsWithoutRef, ReactElement, Ref } from "react";
import {
  CONTROL_PAD,
  controlClass,
  type ControlProps,
  type ControlSize,
  type ControlWidth,
} from "./control.js";
import { cx } from "./cx.js";
import { useTypeStep } from "./density.js";
import { useFieldControl } from "./fieldControl.js";
import type { Unstyled } from "./props.js";

export type TextareaProps = ControlProps & {
  /** The monospace face, for pasted CSV or statement text, where the columns must line up. Off by default. */
  mono?: boolean | undefined;
  /** The `<textarea>` itself, for focus control. */
  ref?: Ref<HTMLTextAreaElement> | undefined;
} & Unstyled<Omit<ComponentPropsWithoutRef<"textarea">, "width">>;

/**
 * A box that grows with its text from 2 rows to 8, then scrolls: `field-sizing: content` where the
 * browser has it (newer than the Baseline floor, so feature-detected), else a fixed 2 rows. For the
 * `md` size, whose padding (`py-2`) and border the heights add.
 */
const GROW =
  "supports-[field-sizing:content]:[field-sizing:content] supports-[field-sizing:content]:min-h-[calc(2lh+1rem+2px)] max-h-[calc(8lh+1rem+2px)]";

/** A multi-line text input, styled like `Input`. `rows` defaults to 3. Takes `size`, `width` and `mono` too. The `ref` reaches the `<textarea>`, for focus control. */
export function Textarea({
  size = "md",
  width = "full",
  mono = false,
  ...rest
}: TextareaProps): ReactElement {
  return <TextareaControl {...rest} size={size} width={width} mono={mono} />;
}

/**
 * `Textarea`, plus `grow` for the library's own boxes (`ChatComposer`): a `md` box that grows from 2
 * rows to 8 with its text. Not exported from `index.ts`.
 */
export function TextareaControl({
  size,
  width,
  mono,
  grow = false,
  ...rest
}: Omit<TextareaProps, "size" | "width" | "mono"> & {
  size: ControlSize;
  width: ControlWidth;
  mono: boolean;
  grow?: boolean;
}): ReactElement {
  const step = useTypeStep();
  const field = useFieldControl(rest);
  return (
    <textarea
      rows={grow ? 2 : 3}
      {...rest}
      {...field}
      className={cx(
        controlClass(size, width, step),
        CONTROL_PAD[size].x,
        mono && "font-mono",
        grow && GROW,
      )}
    />
  );
}
