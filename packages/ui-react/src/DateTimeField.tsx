import type { CalendarDateTime, DateValue } from "@internationalized/date";
import type { ReactElement } from "react";
import { type FieldProps, labelClass } from "./DateField.js";
import { SegmentedField } from "./SegmentedField.js";
import { WaitingField } from "./fieldWait.js";
import { DATE_TIME } from "./shownDate.js";
import { type LoadingProps, useLoading } from "./skeleton.js";

export type DateTimeFieldProps = Omit<
  FieldProps,
  "value" | "defaultValue" | "onChange" | "minValue" | "maxValue" | "name"
> &
  LoadingProps & {
    /** The date and time shown, controlled, with `onChange`; `null` is an empty field. */
    value?: CalendarDateTime | null | undefined;
    /** The date and time shown first when the field holds its own value. */
    defaultValue?: CalendarDateTime | null | undefined;
    /**
     * Called with the date and time once every segment is filled, the day exists and it is within
     * `minValue`/`maxValue`, and with `null` when it stops being one.
     */
    onChange?: ((value: CalendarDateTime | null) => void) | undefined;
    /** The earliest date and time the field takes; earlier ones are invalid. */
    minValue?: DateValue | null | undefined;
    /** The latest date and time the field takes; later ones are invalid. */
    maxValue?: DateValue | null | undefined;
    /**
     * Posts the date and time in a form as `YYYY-MM-DDTHH:mm` (24-hour) under this key, or an empty
     * string, whatever the `locale`.
     */
    name?: string | undefined;
  };

/**
 * A segmented date and time input, to the minute: the date in the order of its `locale` (by default
 * the browser's), then hours and minutes on the clock the locale uses, 24-hour in en-GB and with
 * AM/PM in en-US. Values are `CalendarDateTime`s; `name` posts it as `YYYY-MM-DDTHH:mm`. It has no
 * calendar. While `loading` the label is drawn and the field is a bone of its height.
 */
export function DateTimeField({
  loading,
  loadingLabel,
  ...field
}: DateTimeFieldProps): ReactElement {
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
  return <SegmentedField {...field} kind={DATE_TIME} />;
}
