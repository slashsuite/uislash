import { createContext, type ReactElement, type ReactNode, useContext, useId } from "react";
import {
  FieldError,
  Label,
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  Text,
} from "react-aria-components";
import { cx } from "./cx.js";
import { controlText, useFieldType, useTypeStep } from "./density.js";
import { ErrorLine, Hint, RequiredMark } from "./Field.js";
import { TOUCH_TARGET } from "./target.js";
import { definedProps, type Passthrough } from "./props.js";
import type { Size } from "./size.js";
import { WaitingChoice } from "./fieldWait.js";
import {
  type ChoiceVariant,
  OPTION_CARD,
  OPTION_CARD_CHOSEN,
  OPTION_CARD_HOVER,
  OPTION_CARD_TITLE,
} from "./optionCard.js";
import { BusyLabel, busy, type LoadingProps, LoadingScope, useLoading } from "./skeleton.js";

/**
 * A radio's circle, its dot and its drop onto the label's first line, by the group's `size`. The
 * label's type is a control's of that size (`controlText`), whose line height the drop is set for.
 */
const SIZE: Record<Size, { circle: string; dot: string; gap: string }> = {
  sm: { circle: "mt-px h-3.5 w-3.5", dot: "h-1.5 w-1.5", gap: "gap-2" },
  md: { circle: "mt-0.5 h-4 w-4", dot: "h-2 w-2", gap: "gap-2.5" },
  lg: { circle: "mt-0.5 h-5 w-5", dot: "h-2.5 w-2.5", gap: "gap-3" },
};

/** The group's `size` and `variant`, read by each `Radio` in it. */
const RadioLook = createContext<{ size: Size; variant: ChoiceVariant }>({
  size: "md",
  variant: "plain",
});

/**
 * A named group of radios, one chosen. The `label` names the group; `hint` is a muted line under
 * the options that says more (the group's description); an `error` adds a red line with an alert
 * icon under it, announced politely, and marks the group invalid. `required` puts a red asterisk
 * after the label. Give it `value` and `onChange`, or
 * `defaultValue` and let it keep the choice. `name` posts the choice in a form.
 * The arrow keys move between the radios and choose, and the group is one tab stop. `size` sizes
 * every radio in the group, the same scale as a `Checkbox`. `variant="card"` draws each radio as an
 * option card: a bordered box, its label the title and its hint the description, the chosen one
 * with an accent edge. While `loading` the labels are drawn and each circle is a bone.
 */
export function RadioGroup({
  label,
  hint,
  error,
  size = "md",
  variant = "plain",
  disabled,
  required,
  loading,
  loadingLabel,
  children,
  ...rest
}: {
  /** The group's visible name, above the options. */
  label: ReactNode;
  /** A muted line under the options that says more; it describes the group, and stays while `error` shows. */
  hint?: ReactNode;
  /** A red line under the hint, with an alert icon; marks the group invalid. Like `Field`'s `error`. */
  error?: ReactNode;
  /** The `value` of the chosen radio. */
  value?: string;
  /** The `value` chosen to begin with, when the group keeps its own choice. */
  defaultValue?: string;
  /** Called with the chosen radio's `value`. */
  onChange?: (value: string) => void;
  /** The form field the choice posts under. */
  name?: string;
  /** Disables every radio. */
  disabled?: boolean | undefined;
  /** Marks the choice required: a red asterisk after the label, the group is `aria-required`, and a form will not submit with no option chosen. */
  required?: boolean | undefined;
  /**
   * The size of every radio in the group: `sm` is `text-xs` and a smaller circle, `lg` `text-base`
   * and a larger one.
   * @default md
   */
  size?: Size;
  /**
   * `plain` is a column of circles and their words. `card` makes each radio a bordered box the
   * width of the group, its label a title and its `hint` the description: for a few options that
   * each need a line of explaining (a plan, a delivery speed). The whole card is the click target.
   * @default plain
   */
  variant?: ChoiceVariant;
  /** The `Radio`s. */
  children: ReactNode;
} & LoadingProps &
  Passthrough): ReactElement {
  const { loading: waiting, owner } = useLoading(loading);
  const type = useFieldType();
  return (
    <AriaRadioGroup
      {...definedProps(rest)}
      {...(error ? { isInvalid: true } : {})}
      {...(disabled ? { isDisabled: true } : {})}
      {...(required ? { isRequired: true } : {})}
      className="flex flex-col gap-2"
    >
      <Label className={cx(type.label, "font-medium text-slate-700")}>
        {label}
        <RequiredMark required={required} />
      </Label>
      {/* react-aria's group drops `aria-busy` from its root's props, so the options carry the wait. */}
      <div {...busy(owner, waiting)} className="flex flex-col gap-2.5">
        <RadioLook.Provider value={{ size, variant }}>
          <LoadingScope loading={waiting}>{children}</LoadingScope>
        </RadioLook.Provider>
        <BusyLabel owner={owner} loading={waiting} label={loadingLabel} />
      </div>
      {hint ? (
        <Text slot="description" className={cx("text-slate-500", type.note)}>
          {hint}
        </Text>
      ) : null}
      <FieldError>
        <ErrorLine error={error} />
      </FieldError>
    </AriaRadioGroup>
  );
}

function ringTone(invalid: boolean, selected: boolean): string {
  if (invalid) return "border-red-200";
  return cx(selected ? "border-violet-600" : "border-slate-300", "hover:border-violet-400");
}

/** A card radio's box: red-edged when the group is invalid, with the hover edge while enabled. */
function cardTone(invalid: boolean, off: boolean): string {
  if (invalid) return cx(OPTION_CARD, "border-red-200");
  return cx(OPTION_CARD, !off && OPTION_CARD_HOVER);
}

/** The props of a `Radio`. */
type RadioProps = {
  /** The text beside the circle. */
  label: ReactNode;
  /** A muted line under the label that says more. It is the radio's `aria-describedby`. */
  hint?: ReactNode;
  /** What the group's `value` becomes when this one is chosen. */
  value: string;
  /** Disables this radio alone. */
  disabled?: boolean | undefined;
} & Passthrough;

/** One option of a `RadioGroup`: a `label` and, under it, an optional `hint`. Click the label or the circle. While `loading` the circle is a bone. */
export function Radio({
  loading,
  loadingLabel,
  ...props
}: RadioProps & LoadingProps): ReactElement {
  const { size: step, variant } = useContext(RadioLook);
  const size = SIZE[step];
  const text = controlText(step, useTypeStep(), false);
  if (useLoading(loading).loading) {
    return (
      <WaitingChoice
        own={loading}
        loadingLabel={loadingLabel}
        label={props.label}
        look={cx(size.gap, text, variant === "card" && OPTION_CARD)}
        shape={cx(size.circle, "rounded-full")}
        attrs={props}
      />
    );
  }
  return <ShownRadio {...props} />;
}

/** A radio with its circle drawn. */
function ShownRadio({
  label,
  hint,
  value,
  disabled,
  "aria-describedby": describedBy,
  ...rest
}: RadioProps): ReactElement {
  const descriptionId = useId();
  const { size: step, variant } = useContext(RadioLook);
  const card = variant === "card";
  const size = SIZE[step];
  const text = controlText(step, useTypeStep(), false);
  return (
    <AriaRadio
      {...definedProps(rest)}
      value={value}
      {...(describedBy || hint
        ? {
            "aria-describedby": [describedBy, hint ? descriptionId : undefined]
              .filter(Boolean)
              .join(" "),
          }
        : {})}
      {...(disabled ? { isDisabled: true } : {})}
      className={({ isDisabled: off, isInvalid }) =>
        cx(
          "flex cursor-pointer items-start has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-violet-600",
          TOUCH_TARGET,
          !card && "rounded-md",
          size.gap,
          off && "cursor-not-allowed opacity-50",
          card && cardTone(isInvalid, off),
        )
      }
    >
      {({ isSelected, isInvalid }) => (
        <>
          {card && isSelected ? <span aria-hidden="true" className={OPTION_CARD_CHOSEN} /> : null}
          <span
            aria-hidden="true"
            className={cx(
              "flex shrink-0 items-center justify-center rounded-full border bg-white transition",
              size.circle,
              ringTone(isInvalid, isSelected),
            )}
          >
            {isSelected ? <span className={cx("rounded-full bg-violet-600", size.dot)} /> : null}
          </span>
          <span className="flex flex-col gap-0.5">
            <span className={cx("text-slate-700", text, card && OPTION_CARD_TITLE)}>{label}</span>
            {hint ? <Hint id={descriptionId}>{hint}</Hint> : null}
          </span>
        </>
      )}
    </AriaRadio>
  );
}
