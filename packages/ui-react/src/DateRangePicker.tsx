import type { CalendarDate } from "@internationalized/date";
import { type ReactElement, type ReactNode, useContext } from "react";
import {
  Button,
  DateFieldContext,
  DateInput,
  DateRangePicker as AriaDateRangePicker,
  Group,
} from "react-aria-components";
import { cx } from "./cx.js";
import { RangeCalendarPopover, calendarIcon } from "./DateCalendar.js";
import {
  FieldSegment,
  FieldLabel,
  type FieldProps,
  type Read,
  fieldFlags,
  forcedInvalid,
  frameClass,
  iconButtonLook,
  Notes,
} from "./DateField.js";
import { DateLocale } from "./dateLocale.js";
import { pickerButton, useDialogContainer, usePickerFrame } from "./DateFieldCalendar.js";
import { definedProps, type Passthrough } from "./props.js";
import { ShownInput, type ShownRange, useShownRange } from "./shownDate.js";

/** A from and to date: `start` on or before `end`. */
export type DateRange = ShownRange;

/** A ready-made range the app builds from its own today, such as "Last 7 days". */
export type DateRangePreset = { label: string; value: DateRange };

export type DateRangePickerProps = Pick<
  FieldProps,
  "label" | "hint" | "error" | "size" | "minValue" | "maxValue" | "required" | "disabled" | "locale"
> &
  Passthrough & {
    /** The range, or `null` for none. Reported only when both days are complete, real and in order. */
    value?: DateRange | null | undefined;
    /** The range shown first when the picker holds its own value. */
    defaultValue?: DateRange | null | undefined;
    /** Called with the range once both sides make one, and with `null` when they stop making one. */
    onChange?: ((range: DateRange | null) => void) | undefined;
    /** Posts the start as `YYYY-MM-DD` in a form, or `""` while there is no range. */
    startName?: string | undefined;
    /** Posts the end as `YYYY-MM-DD` in a form, or `""` while there is no range. */
    endName?: string | undefined;
    /**
     * Ready-made ranges, a row of buttons above the month. The app builds them from its own today;
     * the picker has none of its own and never reads the clock.
     */
    presets?: readonly DateRangePreset[] | undefined;
    /** Open the calendar on mount. */
    defaultOpen?: boolean | undefined;
    /**
     * The month dropdown's name, for an app in another language.
     * @default Month
     */
    monthLabel?: string | undefined;
    /**
     * The year dropdown's name, for an app in another language.
     * @default Year
     */
    yearLabel?: string | undefined;
    /**
     * The name of the start date's segments, for a screen reader.
     * @default Start date
     */
    startLabel?: string | undefined;
    /**
     * The name of the end date's segments, for a screen reader.
     * @default End date
     */
    endLabel?: string | undefined;
    /**
     * The word between the two dates.
     * @default to
     */
    toLabel?: string | undefined;
    /**
     * The calendar's footer button that empties the range.
     * @default Clear
     */
    clearLabel?: string | undefined;
  };

type Side = ReturnType<typeof useShownRange>["start"];

/**
 * One side's segments, named for a screen reader and read-only while focus leaves it with an
 * impossible day (see `useShownDate`). React Aria hands each side its field props through the
 * `start` and `end` slots; only this side's slot is changed.
 */
function SideInput({
  slot,
  name,
  side,
  onRead,
}: {
  slot: "start" | "end";
  name: string;
  side: Side;
  onRead: (read: Read) => void;
}): ReactNode {
  const field = useContext(DateFieldContext);
  const slots = field && "slots" in field ? field.slots : undefined;
  const own = slots?.[slot] ?? {};
  return (
    <div
      role="group"
      aria-label={name}
      className="flex items-center"
      onBlurCapture={side.onBlurCapture}
    >
      <DateFieldContext.Provider
        value={{
          slots: {
            ...slots,
            [slot]: { ...own, isReadOnly: side.leaving, onBlur: side.onLeft },
          },
        }}
      >
        <DateInput slot={slot} className="flex">
          {(segment) => (
            <FieldSegment segment={segment} {...(segment.type === "day" ? { onRead } : {})} />
          )}
        </DateInput>
      </DateFieldContext.Provider>
    </div>
  );
}

/**
 * A from and to date in one field, each side in the locale's order, and a calendar button that opens one
 * Monday-first month, where two presses pick the range. `presets` adds the app's ready-made ranges
 * above the month. The range is reported only when both sides are complete, real dates within
 * min/max and the start is on or before the end; otherwise `null`.
 */
export function DateRangePicker({
  label,
  hint,
  error,
  disabled,
  required,
  monthLabel = "Month",
  yearLabel = "Year",
  startLabel = "Start date",
  endLabel = "End date",
  toLabel = "to",
  clearLabel = "Clear",
  value,
  defaultValue,
  onChange,
  startName,
  endName,
  presets,
  defaultOpen,
  locale,
  size = "md",
  ...rest
}: DateRangePickerProps): ReactElement {
  const frame = usePickerFrame(size);
  const shown = useShownRange({
    value,
    defaultValue,
    onChange,
    minValue: rest.minValue,
    maxValue: rest.maxValue,
    isRequired: required,
  });
  const { container, findDialog } = useDialogContainer();
  return (
    <DateLocale locale={locale}>
      <AriaDateRangePicker<CalendarDate>
        {...definedProps(rest)}
        {...fieldFlags(disabled, required)}
        {...(defaultOpen === undefined ? {} : { defaultOpen })}
        ref={findDialog}
        value={shown.inner}
        onChange={shown.setInner}
        validate={shown.validate}
        {...forcedInvalid({ impossible: shown.problem, error })}
        granularity="day"
        shouldForceLeadingZeros
        className="flex flex-col gap-1.5"
      >
        {() => (
          <>
            <FieldLabel label={label} required={required} />
            <Group className={(state) => cx(frameClass(state), frame)}>
              <SideInput
                slot="start"
                name={startLabel}
                side={shown.start}
                onRead={shown.onReadStart}
              />
              <span aria-hidden="true" className="px-1 text-slate-500">
                {toLabel}
              </span>
              <SideInput slot="end" name={endLabel} side={shown.end} onRead={shown.onReadEnd} />
              <Button className={cx(iconButtonLook, pickerButton(size), "ml-auto")}>
                {calendarIcon}
              </Button>
            </Group>
            <ShownInput name={startName} shown={shown.startShown} isDisabled={disabled} />
            <ShownInput name={endName} shown={shown.endShown} isDisabled={disabled} />
            <Notes hint={hint} error={error} impossible={shown.problem} bounds={rest} />
            <RangeCalendarPopover
              container={container}
              presets={presets}
              labels={{ monthLabel, yearLabel, clearLabel }}
            />
          </>
        )}
      </AriaDateRangePicker>
    </DateLocale>
  );
}
