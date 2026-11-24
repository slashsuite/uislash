import type { CalendarDate } from "@internationalized/date";
import { type ReactElement, type ReactNode, useCallback, useContext, useState } from "react";
import {
  Button,
  DatePicker as AriaDatePicker,
  DateFieldContext,
  DateInput,
  Group,
} from "react-aria-components";
import { cx } from "./cx.js";
import { CalendarPopover, type CalendarLabels, calendarIcon } from "./DateCalendar.js";
import {
  FieldSegment,
  FieldLabel,
  type FieldProps,
  fieldFlags,
  forcedInvalid,
  Notes,
  frameClass,
  iconButtonLook,
} from "./DateField.js";
import { DateLocale } from "./dateLocale.js";
import { definedProps } from "./props.js";
import { DATE, ShownInput, useShownDate } from "./shownDate.js";
import { type ResponsiveSize, type Size, sizeClass } from "./size.js";
import { controlText, useTypeStep } from "./density.js";

/** The picker's padding and calendar button, by `size` (its type is `controlText`'s). The button sets the height, so the padding is less than a `DateField`'s. */
const PICKER_FRAME: Record<Size, string> = {
  sm: "py-0.5 pl-2 pr-0.5",
  md: "py-1 pl-2.5 pr-1",
  lg: "py-1.5 pl-3 pr-1.5",
};
const PICKER_FRAME_MD: Record<Size, string> = {
  sm: "md:py-0.5 md:pl-2 md:pr-0.5",
  md: "md:py-1 md:pl-2.5 md:pr-1",
  lg: "md:py-1.5 md:pl-3 md:pr-1.5",
};
const PICKER_BUTTON: Record<Size, string> = { sm: "h-5 w-5", md: "h-7 w-7", lg: "h-8 w-8" };
const PICKER_BUTTON_MD: Record<Size, string> = {
  sm: "md:h-5 md:w-5",
  md: "md:h-7 md:w-7",
  lg: "md:h-8 md:w-8",
};

/** The picker's tables and their `md:` twins (each `_MD` is its table from the `md` breakpoint up), for the data test. */
export const pickerSizeTables = {
  frame: PICKER_FRAME,
  frameMd: PICKER_FRAME_MD,
  button: PICKER_BUTTON,
  buttonMd: PICKER_BUTTON_MD,
};

/** The calendar button's box at `size`. */
export function pickerButton(size: Size | ResponsiveSize): string {
  return sizeClass(PICKER_BUTTON, PICKER_BUTTON_MD, size);
}

/** The picker's frame at `size`: its gap and padding, and the type of a control at the type step in force. */
export function usePickerFrame(size: Size | ResponsiveSize): string {
  const pad = sizeClass(PICKER_FRAME, PICKER_FRAME_MD, size);
  return cx("gap-1", pad, controlText(size, useTypeStep(), true));
}

/**
 * The picker's input, read-only while `leaving`. Only the field: a read-only picker would also
 * disable the calendar button that focus may be moving to.
 */
function PickerInput({
  leaving,
  onLeft,
  children,
}: {
  leaving: boolean;
  onLeft: () => void;
  children: ReactNode;
}): ReactElement {
  const field = useContext(DateFieldContext);
  return (
    <DateFieldContext.Provider value={{ ...field, isReadOnly: leaving, onBlur: onLeft }}>
      {children}
    </DateFieldContext.Provider>
  );
}

/**
 * The modal `<dialog>` a picker sits in, if any, for its popover's `container`: pass `findDialog` as the
 * picker's `ref`.
 */
export function useDialogContainer(): {
  container: Element | undefined;
  findDialog: (el: HTMLDivElement | null) => void;
} {
  const [container, setContainer] = useState<Element | undefined>(undefined);
  const findDialog = useCallback(
    (el: HTMLDivElement | null) => setContainer(el?.closest("dialog") ?? undefined),
    [],
  );
  return { container, findDialog };
}

/** The body of `<DateField calendar>`: the field with a calendar button that opens a month view in a popover. */
export function CalendarDateField({
  label,
  hint,
  error,
  disabled,
  required,
  labels,
  value,
  defaultValue,
  onChange,
  name,
  locale,
  size = "md",
  ...rest
}: FieldProps & { defaultOpen?: boolean; labels: CalendarLabels }): ReactElement {
  const frame = usePickerFrame(size);
  const bounds = { minValue: rest.minValue, maxValue: rest.maxValue };
  const { inner, setInner, shown, impossible, onRead, validate, leaving, onBlurCapture, onLeft } =
    useShownDate({ value, defaultValue, onChange, ...bounds, isRequired: required }, DATE);
  const { container, findDialog } = useDialogContainer();
  return (
    <DateLocale locale={locale}>
      <AriaDatePicker<CalendarDate>
        {...definedProps(rest)}
        {...fieldFlags(disabled, required)}
        ref={findDialog}
        value={inner}
        onChange={setInner}
        validate={validate}
        {...forcedInvalid({ impossible, error })}
        granularity="day"
        shouldForceLeadingZeros
        className="flex flex-col gap-1.5"
      >
        {() => (
          <>
            <FieldLabel label={label} required={required} />
            <Group className={(state) => cx(frameClass(state), frame)}>
              <div className="contents" onBlurCapture={onBlurCapture}>
                <PickerInput leaving={leaving} onLeft={onLeft}>
                  <DateInput className="flex flex-1">
                    {(segment) => (
                      <FieldSegment
                        segment={segment}
                        {...(segment.type === "day" ? { onRead } : {})}
                      />
                    )}
                  </DateInput>
                </PickerInput>
              </div>
              <Button className={cx(iconButtonLook, pickerButton(size))}>{calendarIcon}</Button>
            </Group>
            <ShownInput name={name} shown={shown} isDisabled={disabled} />
            <Notes hint={hint} error={error} impossible={impossible} bounds={bounds} />
            <CalendarPopover container={container} labels={labels} />
          </>
        )}
      </AriaDatePicker>
    </DateLocale>
  );
}
