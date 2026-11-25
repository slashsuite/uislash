import type { ReactElement } from "react";
import { cx } from "./cx.js";
import { Icon } from "./Icon.js";
import type { Passthrough } from "./props.js";

type StepState = "done" | "current" | "upcoming";

// The current step is told apart by more than colour: its marker is outlined in the accent and its
// label is medium weight; a done step's marker is filled and holds a tick.
const MARKER: Record<StepState, string> = {
  done: "border-violet-600 bg-violet-600 text-violet-50",
  current: "border-violet-600 bg-white text-violet-700",
  upcoming: "border-slate-300 bg-white text-slate-500",
};
const LABEL: Record<StepState, string> = {
  done: "text-slate-600",
  current: "font-medium text-slate-900",
  upcoming: "text-slate-600",
};

function stateOf(index: number, current: number): StepState {
  if (index < current) return "done";
  return index === current ? "current" : "upcoming";
}

/**
 * Where the reader is in a fixed run of steps (checkout, a setup flow): each step done, current
 * or still to come. An ordered list named by `label`, across from `sm` and down on a phone.
 * `current` is the step in progress, from 1; past the last step every step is done. It shows
 * progress and does not navigate: the flow's own buttons move between steps.
 */
export function Stepper({
  steps,
  current,
  label,
  doneLabel = "done",
  ...rest
}: {
  /** The steps' names, in order: "Cart", "Shipping", "Payment", "Review". Short, one or two words. */
  steps: readonly string[];
  /** The step in progress, from 1. Past the last step, every step is done. */
  current: number;
  /** The list's accessible name: "Checkout progress". */
  label: string;
  /**
   * What a screen reader hears after a done step's name, for an app in another language.
   * @default done
   */
  doneLabel?: string | undefined;
} & Passthrough): ReactElement {
  const last = steps.length - 1;
  return (
    <ol
      {...rest}
      aria-label={label}
      className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center"
    >
      {steps.map((step, index) => {
        const state = stateOf(index + 1, current);
        return (
          <li
            key={index}
            aria-current={state === "current" ? "step" : undefined}
            className={cx("flex min-w-0 items-center gap-2", index < last && "sm:flex-1")}
          >
            <span
              aria-hidden="true"
              className={cx(
                "flex size-7 shrink-0 items-center justify-center rounded-full border-2 font-medium tabular-nums",
                MARKER[state],
              )}
            >
              {state === "done" ? <Icon name="check" size="sm" /> : index + 1}
            </span>
            <span className={LABEL[state]}>
              {step}
              {state === "done" && <span className="sr-only"> ({doneLabel})</span>}
            </span>
            {index < last && (
              <span
                aria-hidden="true"
                className={cx(
                  "hidden h-0 min-w-4 flex-1 border-t-2 sm:block",
                  state === "done" ? "border-violet-600" : "border-slate-300",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
