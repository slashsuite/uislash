import {
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type Ref,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocale } from "react-aria-components";
import { CONTROL_WIDTH, type ControlProps, controlHeight } from "./control.js";
import { cx, focusRing } from "./cx.js";
import { controlText, useTypeStep } from "./density.js";
import { useFieldControl } from "./fieldControl.js";
import type { Unstyled } from "./props.js";

type SliderProps = ControlProps & {
  /**
   * How the value beside the track is written, in the locale of the app's `I18nProvider` or else
   * the browser's: `{ style: "percent" }` (for a value from 0 to 1), `{ style: "currency",
   * currency: "EUR" }`, `{ style: "unit", unit: "kilogram" }`. Assistive tech reads it the same way.
   */
  formatOptions?: Intl.NumberFormatOptions | undefined;
  /** The number it holds, controlled, with `onChange`. */
  value?: number | undefined;
  /** The number it starts with, uncontrolled. Without one it starts halfway, as the browser's does. */
  defaultValue?: number | undefined;
  /** The `<input>` itself, for focus control. */
  ref?: Ref<HTMLInputElement> | undefined;
} & Unstyled<
    Omit<
      ComponentPropsWithoutRef<"input">,
      "size" | "width" | "type" | "value" | "defaultValue" | "children"
    >
  >;

/** A number bound for the range: the given one, or the browser's default. */
function bound(given: number | string | undefined, fallback: number): number {
  const value = Number(given);
  return given === undefined || Number.isNaN(value) ? fallback : value;
}

/** Sets both the input's own ref and the consumer's. */
function bothRefs(
  own: { current: HTMLInputElement | null },
  theirs: Ref<HTMLInputElement> | undefined,
): (el: HTMLInputElement | null) => void {
  return (el) => {
    own.current = el;
    if (typeof theirs === "function") theirs(el);
    else if (theirs) theirs.current = el;
  };
}

/** The number the range shows: the caller's `value`, else its own, read from the input as it moves. */
function useShownValue(
  value: number | undefined,
  defaultValue: number | undefined,
  inputRef: { current: HTMLInputElement | null },
): [number | undefined, (event: ChangeEvent<HTMLInputElement>) => void] {
  const [own, setOwn] = useState(defaultValue);
  // With no `defaultValue` the browser picks the start (halfway, on a step), so read it once mounted.
  useEffect(() => {
    if (own === undefined && inputRef.current) setOwn(inputRef.current.valueAsNumber);
  }, [own, inputRef]);
  return [value ?? own, (event) => setOwn(event.currentTarget.valueAsNumber)];
}

/**
 * A range slider for one number between `min` and `max` (0 and 100 unless given), in steps of
 * `step`: the browser's own `<input type="range">` in the accent colour, with its value written
 * beside the track (`formatOptions` sets how) and read out the same way. Put it in a `Field`, which
 * names it and draws the hint and the error, as an `Input`. Arrow keys, Page Up, Page Down, Home and
 * End move it. `size` sets its height and the value's type, to line up with an `Input` of that size;
 * `width` is an `Input`'s. `onChange` is the input's own, on every move. The `ref` reaches the `<input>`.
 */
export function Slider({
  formatOptions,
  value,
  defaultValue,
  size = "md",
  width = "full",
  ref,
  onChange,
  ...own
}: SliderProps): ReactElement {
  const step = useTypeStep();
  const field = useFieldControl(own);
  const inputRef = useRef<HTMLInputElement>(null);
  const attach = useMemo(() => bothRefs(inputRef, ref), [ref]);
  const [shown, track] = useShownValue(value, defaultValue, inputRef);
  const { locale } = useLocale();
  const format = useMemo(
    () => new Intl.NumberFormat(locale, formatOptions),
    [locale, formatOptions],
  );
  const written = shown === undefined ? "" : format.format(shown);
  // The longer of the two ends, drawn unseen under the value, keeps the track still as the value changes.
  const widest = [bound(own.min, 0), bound(own.max, 100)]
    .map((end) => format.format(end))
    .reduce((a, b) => (b.length > a.length ? b : a));
  return (
    <div
      className={cx(
        "flex items-center gap-3",
        controlHeight(size),
        width === "auto" ? "inline-flex" : CONTROL_WIDTH[width],
      )}
    >
      <input
        {...own}
        {...field}
        ref={attach}
        type="range"
        {...(value === undefined ? { defaultValue } : { value })}
        aria-valuetext={written || undefined}
        onChange={(event) => {
          track(event);
          onChange?.(event);
        }}
        className={cx(
          "h-full min-w-0 flex-1 cursor-pointer rounded-lg accent-violet-600 disabled:cursor-not-allowed disabled:opacity-50",
          focusRing,
        )}
      />
      <span
        aria-hidden="true"
        className={cx(
          "grid shrink-0 text-right tabular-nums text-slate-700",
          controlText(size, step, false),
        )}
      >
        <span className="invisible [grid-area:1/1]">{widest}</span>
        <span className="[grid-area:1/1]">{written}</span>
      </span>
    </div>
  );
}
