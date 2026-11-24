import type { ReactElement, ReactNode } from "react";
import {
  Button,
  FieldError,
  Group,
  Input,
  NumberField as AriaNumberField,
  Text,
} from "react-aria-components";
import { CONTROL_WIDTH, type ControlProps, type ControlSize, controlHeight } from "./control.js";
import { cx } from "./cx.js";
import { fieldFlags, FieldLabel, frameClass, useLabelClass } from "./DateField.js";
import { controlText, useFieldType, useTypeStep } from "./density.js";
import { ErrorLine } from "./Field.js";
import { WaitingField } from "./fieldWait.js";
import { iconGlyph } from "./icons.js";
import { definedProps, type Passthrough } from "./props.js";
import { type ResponsiveSize, sizeClass } from "./size.js";
import { type LoadingProps, useLoading } from "./skeleton.js";

export type NumberFieldProps = {
  /** The field's visible label, above it. Without one, name the field with `aria-label`. */
  label?: ReactNode;
  /** A muted line under the field that says more; it stays while an error shows under it. */
  hint?: ReactNode;
  /** Marks the field invalid and shows this in red under the hint, announced politely. */
  error?: ReactNode;
  /** The number shown, controlled, with `onChange`. `NaN` is an empty field. */
  value?: number | undefined;
  /** The number it starts with, uncontrolled. */
  defaultValue?: number | undefined;
  /** Called with the new number when it is committed (a step, or leaving the field); `NaN` when it is cleared. */
  onChange?: ((value: number) => void) | undefined;
  /** The smallest number allowed: the minus button stops there, and a smaller typed one is raised to it. */
  minValue?: number | undefined;
  /** The largest number allowed: the plus button stops there, and a larger typed one is lowered to it. */
  maxValue?: number | undefined;
  /**
   * How far one press of a button or an arrow key moves the number; a typed number snaps to it.
   * @default 1
   */
  step?: number | undefined;
  /**
   * How the number is written, in the locale of the app's `I18nProvider` or else the browser's:
   * `{ style: "currency", currency: "EUR" }`, `{ style: "percent" }`, `{ maximumFractionDigits: 2 }`.
   * The person types in the same format.
   */
  formatOptions?: Intl.NumberFormatOptions | undefined;
  /** Posts the number in a form under this key, as plain digits whatever the format. */
  name?: string | undefined;
  /** Disables the field and its buttons. */
  disabled?: boolean | undefined;
  /** Marks the number required: the field is `aria-required`, and an empty one is invalid. */
  required?: boolean | undefined;
  /**
   * The name of the minus button, for an app in another language.
   * @default Decrease
   */
  decrementLabel?: string | undefined;
  /**
   * The name of the plus button, for an app in another language.
   * @default Increase
   */
  incrementLabel?: string | undefined;
} & ControlProps &
  LoadingProps &
  Passthrough;

/** A stepper button's width, by `size`: square with the field's height. */
const STEP_BOX: Record<ControlSize, string> = { sm: "w-6.5", md: "w-9.5", lg: "w-11.5" };
const STEP_BOX_MD: Record<ControlSize, string> = {
  sm: "md:w-6.5",
  md: "md:w-9.5",
  lg: "md:w-11.5",
};
/** A stepper button's icon, by `size`. */
const STEP_ICON: Record<ControlSize, string> = {
  sm: "[&>svg]:size-3.5",
  md: "[&>svg]:size-4",
  lg: "[&>svg]:size-5",
};
const STEP_ICON_MD: Record<ControlSize, string> = {
  sm: "md:[&>svg]:size-3.5",
  md: "md:[&>svg]:size-4",
  lg: "md:[&>svg]:size-5",
};

/** The stepper's size tables and their `md:` twins, for the data test. */
export const numberSizeTables = {
  box: STEP_BOX,
  boxMd: STEP_BOX_MD,
  icon: STEP_ICON,
  iconMd: STEP_ICON_MD,
};

const STEP_LOOK =
  "flex shrink-0 cursor-pointer items-center justify-center self-stretch text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50";

/** A minus or plus button. React Aria keeps it out of the tab order: the arrow keys step the number. */
function StepButton({
  slot,
  label,
  size,
}: {
  slot: "decrement" | "increment";
  label: string;
  size: ControlSize | ResponsiveSize;
}): ReactElement {
  return (
    <Button
      slot={slot}
      aria-label={label}
      className={cx(
        STEP_LOOK,
        slot === "decrement" ? "rounded-l-lg" : "rounded-r-lg",
        sizeClass(STEP_BOX, STEP_BOX_MD, size),
        sizeClass(STEP_ICON, STEP_ICON_MD, size),
      )}
    >
      {iconGlyph(slot === "decrement" ? "minus" : "plus")}
    </Button>
  );
}

/** The hint and, under it, the error line: the given `error`, or React Aria's own message. */
function NumberNotes({ hint, error }: { hint: ReactNode; error: ReactNode }): ReactElement {
  const { note } = useFieldType();
  return (
    <>
      {hint ? (
        <Text slot="description" className={cx("text-slate-500", note)}>
          {hint}
        </Text>
      ) : null}
      <FieldError className="block">
        {(validation) => <ErrorLine error={error || validation.validationErrors.join(" ")} />}
      </FieldError>
    </>
  );
}

/** A number field drawn: the label, the minus button, the number, the plus button, the notes. */
function ShownNumberField({
  label,
  hint,
  error,
  disabled,
  required,
  size = "md",
  width = "full",
  decrementLabel = "Decrease",
  incrementLabel = "Increase",
  ...rest
}: Omit<NumberFieldProps, keyof LoadingProps>): ReactElement {
  const step = useTypeStep();
  return (
    <AriaNumberField
      {...definedProps(rest)}
      {...fieldFlags(disabled, required)}
      {...(error ? { isInvalid: true } : {})}
      className={cx("flex flex-col gap-1.5", CONTROL_WIDTH[width])}
    >
      <FieldLabel label={label} required={required} />
      <Group className={(state) => cx(frameClass(state), controlHeight(size))}>
        <StepButton slot="decrement" label={decrementLabel} size={size} />
        <Input
          className={cx(
            "h-full min-w-0 flex-1 bg-white text-center tabular-nums text-slate-900 outline-none",
            controlText(size, step, true),
          )}
        />
        <StepButton slot="increment" label={incrementLabel} size={size} />
      </Group>
      <NumberNotes hint={hint} error={error} />
    </AriaNumberField>
  );
}

/**
 * A number with a minus and a plus button either side of it, for a quantity, a count or an amount:
 * React Aria's `NumberField`. The person types the number or steps it by `step` with the buttons,
 * the arrow keys, Page Up and Page Down; `minValue` and `maxValue` stop the buttons and clamp a
 * typed number when the field is left. `formatOptions` writes it as a currency, a percent or with
 * fixed decimals in the app's locale, and the person types in that format. `label`, `hint`, `error`,
 * `required` and `disabled` are a `DateField`'s; `size` and `width` an `Input`'s. While `loading`
 * the label is drawn and the field is a bone of its height.
 */
export function NumberField({ loading, loadingLabel, ...field }: NumberFieldProps): ReactElement {
  const labelClass = useLabelClass();
  if (useLoading(loading).loading) {
    return (
      <WaitingField
        own={loading}
        loadingLabel={loadingLabel}
        label={field.label}
        look={labelClass}
        size={field.size}
        attrs={field}
      />
    );
  }
  return <ShownNumberField {...field} />;
}
