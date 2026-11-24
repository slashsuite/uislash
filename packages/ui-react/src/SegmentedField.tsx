import type { CalendarDate, CalendarDateTime, DateValue } from "@internationalized/date";
import type { ReactElement } from "react";
import { DateField as AriaDateField, DateInput } from "react-aria-components";
import { cx } from "./cx.js";
import {
  FIELD_SIZE,
  FieldLabel,
  type FieldProps,
  FieldSegment,
  fieldFlags,
  forcedInvalid,
  frameClass,
  Notes,
} from "./DateField.js";
import { DateLocale } from "./dateLocale.js";
import { controlText, useTypeStep } from "./density.js";
import { definedProps } from "./props.js";
import { type Kind, ShownInput, useShownDate } from "./shownDate.js";

/** A typed field's props: a `DateField`'s, with the value props of its value type and its `kind`. */
export type SegmentedProps<T extends CalendarDate | CalendarDateTime> = Omit<
  FieldProps,
  "value" | "defaultValue" | "onChange" | "minValue" | "maxValue"
> & {
  value?: T | null | undefined;
  defaultValue?: T | null | undefined;
  onChange?: ((value: T | null) => void) | undefined;
  minValue?: DateValue | null | undefined;
  maxValue?: DateValue | null | undefined;
  kind: Kind<T>;
};

/** The typed field without a calendar: a `DateField`, or a `DateTimeField` with its time segments. */
export function SegmentedField<T extends CalendarDate | CalendarDateTime>({
  kind,
  label,
  hint,
  error,
  disabled,
  required,
  value,
  defaultValue,
  onChange,
  name,
  locale,
  size = "md",
  ...rest
}: SegmentedProps<T>): ReactElement {
  const step = useTypeStep();
  const bounds = { minValue: rest.minValue, maxValue: rest.maxValue };
  const { inner, setInner, shown, impossible, onRead, validate, leaving, onBlurCapture, onLeft } =
    useShownDate({ value, defaultValue, onChange, ...bounds, isRequired: required }, kind);
  return (
    <DateLocale locale={locale}>
      <AriaDateField<DateValue>
        {...definedProps(rest)}
        {...fieldFlags(disabled, required)}
        value={inner}
        onChange={(next) => setInner(kind.narrow(next))}
        validate={validate}
        {...forcedInvalid({ impossible, error })}
        isReadOnly={leaving}
        onBlur={onLeft}
        granularity={kind.granularity}
        shouldForceLeadingZeros
        className="flex flex-col gap-1.5"
      >
        {() => (
          <>
            <FieldLabel label={label} required={required} />
            <div className="contents" onBlurCapture={onBlurCapture}>
              <DateInput
                className={(state) =>
                  cx(frameClass(state), FIELD_SIZE[size], controlText(size, step, true))
                }
              >
                {(segment) => (
                  <FieldSegment segment={segment} {...(segment.type === "day" ? { onRead } : {})} />
                )}
              </DateInput>
            </div>
            <ShownInput name={name} shown={shown} isDisabled={disabled} />
            <Notes
              hint={hint}
              error={error}
              impossible={impossible}
              bounds={bounds}
              time={kind.granularity === "minute"}
            />
          </>
        )}
      </AriaDateField>
    </DateLocale>
  );
}
