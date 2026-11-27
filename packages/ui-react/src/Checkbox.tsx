import type { ChangeEvent, ComponentPropsWithoutRef, ReactElement, ReactNode, Ref } from "react";
import { INVALID_EDGE, INVALID_EDGE_WITHIN } from "./control.js";
import { cx, focusRing } from "./cx.js";
import { controlText, useTypeStep } from "./density.js";
import { useNote, Words } from "./labelWords.js";
import type { Unstyled } from "./props.js";
import type { Size } from "./size.js";
import { TOUCH_TARGET } from "./target.js";
import { WaitingChoice } from "./fieldWait.js";
import { type LoadingProps, useLoading } from "./skeleton.js";
import { useBlocked } from "./blocked.js";
import {
  type ChoiceVariant,
  OPTION_CARD,
  OPTION_CARD_CHOSEN,
  OPTION_CARD_HOVER,
  OPTION_CARD_TITLE,
} from "./optionCard.js";

/**
 * The label's gap, the box, and the box's drop onto the label's first line, by `size`. The label's
 * type is a control's of that size (`controlText`), whose line height the drop is set for.
 */
const SIZE: Record<Size, { gap: string; box: string; start: string }> = {
  sm: { gap: "gap-1.5", box: "h-3.5 w-3.5", start: "mt-px" },
  md: { gap: "gap-2", box: "h-4 w-4", start: "mt-0.5" },
  lg: { gap: "gap-2.5", box: "h-5 w-5", start: "mt-0.5" },
};

/** The mark over a checked box: a tick, or a dash for a mixed one. */
const MARK = {
  tick: {
    path: "M4 8.5l2.5 2.5L12 5.5",
    shown: "group-has-[input:checked:not(:indeterminate)]/checkbox:visible",
  },
  dash: { path: "M4.5 8h7", shown: "group-has-[input:indeterminate]/checkbox:visible" },
};

/**
 * The mark over the box: the tick when it is checked, the dash when it is mixed (`indeterminate`).
 * Both read the input's own state, so an uncontrolled Checkbox changes with no re-render.
 */
function Tick({
  size,
  onFirstLine,
  mark,
}: {
  size: Size;
  onFirstLine: boolean;
  mark: keyof typeof MARK;
}): ReactElement {
  /* The checked box: a filled accent square at the input's own place (an absolutely
    positioned flex child sits where the first flex item would, so it needs no insets), shown
    by the label's `:has(:checked)` so an uncontrolled Checkbox changes with no re-render.
    Inside a Card or table row the input is lifted to `z-10` by `liftInteractive` (cx.ts), and
    it comes later in the DOM, so the tick ranks `z-20` there to paint over it. Scoped to the
    `isolate` ancestor like the Input icon (InputShell.tsx), so it never outranks a sticky bar. */
  return (
    <span
      aria-hidden="true"
      className={cx(
        SIZE[size].box,
        onFirstLine && SIZE[size].start,
        "pointer-events-none invisible absolute in-[.isolate]:z-20 block rounded border border-violet-600 bg-violet-600 text-violet-50",
        MARK[mark].shown,
      )}
    >
      <svg viewBox="0 0 16 16" fill="none" className="h-full w-full">
        <path
          d={MARK[mark].path}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/**
 * The label round the box: faded and not-allowed unless the box is enabled. Written as
 * `has-enabled` so the label carries no `disabled` class text: the disabled state belongs on the
 * input. A blocked box is enabled (it keeps its focus) and fades as a disabled one does. A card
 * draws its box and takes the focus ring from the input.
 */
function labelLook(blocked: boolean, card: boolean): string {
  return cx(
    "group/checkbox inline-flex items-start text-slate-700",
    TOUCH_TARGET,
    blocked
      ? "cursor-not-allowed opacity-50"
      : "cursor-not-allowed opacity-50 has-enabled:cursor-pointer has-enabled:opacity-100",
    card &&
      cx(
        OPTION_CARD,
        OPTION_CARD_HOVER,
        INVALID_EDGE_WITHIN,
        "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-violet-600",
      ),
  );
}

/** A ticked card's accent edge, shown by the input's own state so an uncontrolled card needs no re-render. */
function CardEdge(): ReactElement {
  return (
    <span
      aria-hidden="true"
      className={cx(OPTION_CARD_CHOSEN, "invisible group-has-[input:checked]/checkbox:visible")}
    />
  );
}

/** A card's label, in the card title's weight. */
function CardTitle({ label }: { label: ReactNode }): ReactNode {
  return label == null ? label : <span className={OPTION_CARD_TITLE}>{label}</span>;
}

/** The props of a `Checkbox`. */
type CheckboxProps = {
  /** The text beside the box. Leave it out for a bare box (a table cell) and name it with `aria-label`. */
  label?: ReactNode;
  /** A muted line under the label that says more. It is the box's `aria-describedby`. */
  hint?: ReactNode;
  /** A red line under the hint, with an alert icon, announced politely; makes the box `aria-invalid`. */
  error?: ReactNode;
  /**
   * The label's text size and the box with it.
   * @default md
   */
  size?: Size | undefined;
  /** Called with the new checked state when the person ticks or clears the box. */
  onChange?: ((checked: boolean) => void) | undefined;
  /**
   * Why the box cannot be changed: it dims and is blocked (`aria-disabled`; a click and Space
   * change nothing) while it stays in the tab order, and the reason is its tooltip on hover,
   * keyboard focus and a tap, read out as its description.
   */
  disabledReason?: string | undefined;
  /**
   * Mixed: some of what the box stands for is chosen and some is not, as a select-all box over a
   * partly chosen list. It draws a dash and is read as "mixed"; a click checks it. The caller owns
   * it: work it out from the list on every render.
   * @default false
   */
  indeterminate?: boolean | undefined;
  /**
   * `plain` is the box and its words. `card` puts them in a bordered box the width of its parent,
   * the label a title and the `hint` its description: for a few options that each need a line of
   * explaining. The whole card is the click target, and a ticked one takes an accent edge.
   * @default plain
   */
  variant?: ChoiceVariant | undefined;
  /** The `<input>`, for focus control. */
  ref?: Ref<HTMLInputElement> | undefined;
} & Unstyled<Omit<ComponentPropsWithoutRef<"input">, "type" | "size" | "width" | "onChange">>;

/**
 * A checkbox with its label. It is a real `<input type="checkbox">`, drawn by the library (an
 * empty outlined box, then a filled accent one with a check mark) so it reads the same in every
 * theme and browser. Every prop but the label goes on the input, and `ref` reaches it.
 * `size="sm"` is `text-sm` and a smaller box, for a dense row; `size="lg"` is `text-base` and a
 * larger box. Leave `label` out for a bare box in a table cell, and name it with `aria-label`. The
 * box sits on the label's first line, so a label that wraps reads from the box. `hint` is a muted
 * line under the label that says more, like a `Field`'s; `error` adds a red line under it, with an alert
 * icon, and makes the box `aria-invalid` and red-edged. The note is the box's `aria-describedby`.
 * `onChange` gets the new checked state; take `checked` with it, or `defaultChecked` alone.
 * `indeterminate` draws a dash for a select-all box over a partly chosen list. `variant="card"`
 * draws it as an option card: a bordered box with the label as its title and the hint under it. Under a finger the
 * hit area grows to 44px.
 * While `loading` the label is drawn and the box is a bone of its size.
 */
export function Checkbox({
  loading,
  loadingLabel,
  ...props
}: CheckboxProps & LoadingProps): ReactElement {
  const step = useTypeStep();
  if (useLoading(loading).loading) {
    const size = props.size ?? "md";
    return (
      <WaitingChoice
        own={loading}
        loadingLabel={loadingLabel}
        label={props.label}
        look={cx(
          SIZE[size].gap,
          controlText(size, step, false),
          props.variant === "card" && OPTION_CARD,
        )}
        shape={cx(SIZE[size].box, props.label != null && SIZE[size].start, "rounded")}
        attrs={props}
      />
    );
  }
  return <ShownCheckbox {...props} />;
}

/** A checkbox with its box drawn. */
function ShownCheckbox({
  label,
  hint,
  error,
  size = "md",
  onChange,
  disabledReason,
  indeterminate = false,
  variant,
  ref,
  "aria-describedby": describedBy,
  ...rest
}: CheckboxProps): ReactElement {
  const { ids: noteIds, describedIds, invalid } = useNote(hint, error, describedBy);
  const step = useTypeStep();
  const {
    props: guard,
    tooltip,
    blocked,
  } = useBlocked(disabledReason, {
    ...rest,
    "aria-describedby": describedIds || undefined,
  });
  const card = variant === "card";
  return (
    <>
      <label
        className={cx(labelLook(blocked, card), SIZE[size].gap, controlText(size, step, false))}
      >
        {card ? <CardEdge /> : null}
        <Tick size={size} onFirstLine={label != null} mark="tick" />
        {indeterminate ? <Tick size={size} onFirstLine={label != null} mark="dash" /> : null}
        <input
          type="checkbox"
          className={cx(
            SIZE[size].box,
            "shrink-0",
            label != null && SIZE[size].start,
            "appearance-none rounded border border-slate-300 bg-white hover:border-violet-400",
            INVALID_EDGE,
            !card && focusRing,
          )}
          aria-invalid={invalid}
          {...rest}
          ref={(node: HTMLInputElement | null) => {
            if (node) node.indeterminate = indeterminate;
            if (typeof ref === "function") return ref(node);
            if (ref) ref.current = node;
            return undefined;
          }}
          {...guard}
          {...(onChange
            ? {
                onChange: (event: ChangeEvent<HTMLInputElement>) => {
                  if (!blocked) onChange(event.target.checked);
                },
              }
            : {})}
        />
        <Words
          label={card ? <CardTitle label={label} /> : label}
          hint={hint}
          error={error}
          ids={noteIds}
        />
      </label>
      {tooltip}
    </>
  );
}
