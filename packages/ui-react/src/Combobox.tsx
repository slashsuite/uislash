import type { ReactElement, ReactNode } from "react";
import {
  Button,
  ComboBox as AriaComboBox,
  FieldError,
  Group,
  Input,
  ListBox,
  ListBoxItem,
  Popover,
  Text,
} from "react-aria-components";
import { CONTROL_WIDTH, type ControlProps, controlHeight } from "./control.js";
import { cx } from "./cx.js";
import { fieldFlags, FieldLabel, frameClass, iconButtonLook, useLabelClass } from "./DateField.js";
import { pickerButton, useDialogContainer } from "./DateFieldCalendar.js";
import { controlText, useFieldType, useTypeStep } from "./density.js";
import { ErrorLine } from "./Field.js";
import { WaitingField } from "./fieldWait.js";
import { iconGlyph } from "./icons.js";
import { definedProps, type Passthrough } from "./props.js";
import type { SelectItem } from "./Select.js";
import { type LoadingProps, useLoading } from "./skeleton.js";

export type ComboboxProps = {
  /** The field's visible label, above it. Without one, name the field with `aria-label`. */
  label?: ReactNode;
  /** A muted line under the field that says more; it stays while an error shows under it. */
  hint?: ReactNode;
  /** Marks the field invalid and shows this in red under the hint, announced politely. */
  error?: ReactNode;
  /** The choices, in order; typing filters them by label. */
  items: readonly SelectItem[];
  /** The chosen item's `value`, controlled, with `onChange`. `null` is nothing chosen. */
  value?: string | null | undefined;
  /** The item's `value` it starts with, uncontrolled. */
  defaultValue?: string | null | undefined;
  /** Called with the chosen item's `value`, or `null` when the choice is cleared. */
  onChange?: ((value: string | null) => void) | undefined;
  /** Posts the chosen item's `value` in a form under this key. */
  name?: string | undefined;
  /** Disables the field and its button. */
  disabled?: boolean | undefined;
  /** Marks a choice required: the field is `aria-required`, and an empty one is invalid. */
  required?: boolean | undefined;
  /**
   * The line the list shows when nothing matches what was typed, for an app in another language.
   * @default No matches
   */
  emptyLabel?: string | undefined;
} & ControlProps &
  LoadingProps &
  Passthrough;

/** An option's look, from React Aria's state: hovered or keyed, chosen, blocked. */
function optionClass(state: { isFocused: boolean; isSelected: boolean; isDisabled: boolean }) {
  return cx(
    "rounded-md px-2 py-1.5 outline-none",
    state.isFocused && "bg-slate-100",
    state.isSelected && "font-medium",
    state.isDisabled ? "cursor-not-allowed text-slate-400" : "cursor-pointer",
    !state.isDisabled && (state.isSelected ? "text-violet-700" : "text-slate-900"),
  );
}

/** The hint and, under it, the error line: the given `error`, or React Aria's own message. */
function ComboNotes({ hint, error }: { hint: ReactNode; error: ReactNode }): ReactElement {
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

/** A combobox drawn: the label, the input with its chevron, the notes and the list in a popover. */
function ShownCombobox({
  label,
  hint,
  error,
  disabled,
  required,
  items,
  value,
  defaultValue,
  onChange,
  name,
  emptyLabel = "No matches",
  size = "md",
  width = "full",
  ...rest
}: Omit<ComboboxProps, keyof LoadingProps>): ReactElement {
  const step = useTypeStep();
  const { container, findDialog } = useDialogContainer();
  return (
    <AriaComboBox
      {...fieldFlags(disabled, required)}
      {...(error ? { isInvalid: true } : {})}
      {...(value === undefined ? {} : { selectedKey: value })}
      {...(defaultValue === undefined ? {} : { defaultSelectedKey: defaultValue })}
      {...(name ? { name, formValue: "key" as const } : {})}
      onSelectionChange={(key) => onChange?.(key === null ? null : String(key))}
      defaultItems={items}
      menuTrigger="focus"
      allowsEmptyCollection
      ref={findDialog}
      className={cx("flex flex-col gap-1.5", CONTROL_WIDTH[width])}
    >
      <FieldLabel label={label} required={required} />
      <Group className={(state) => cx(frameClass(state), controlHeight(size), "pr-1")}>
        <Input
          {...definedProps(rest)}
          className={cx(
            "h-full min-w-0 flex-1 rounded-lg bg-white px-3 text-slate-900 outline-none",
            controlText(size, step, true),
          )}
        />
        <Button className={cx(iconButtonLook, pickerButton(size), "cursor-pointer")}>
          {iconGlyph("chevron-down")}
        </Button>
      </Group>
      <ComboNotes hint={hint} error={error} />
      <Popover
        {...(container ? { UNSTABLE_portalContainer: container } : {})}
        placement="bottom start"
        className="w-(--trigger-width) rounded-xl border border-slate-200 bg-white p-1 shadow-lg"
      >
        <ListBox<SelectItem>
          className={cx("max-h-72 overflow-auto outline-none", controlText(size, step, true))}
          renderEmptyState={() => <p className="px-2 py-1.5 text-slate-500">{emptyLabel}</p>}
        >
          {(item) => (
            <ListBoxItem
              id={item.value}
              textValue={item.label}
              isDisabled={item.disabled ?? false}
              className={optionClass}
            >
              {item.label}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </AriaComboBox>
  );
}

/**
 * A text field that filters a list of choices as the person types, for a choice from more items
 * than a `Select` reads well (a country, a time zone, a teammate): React Aria's `ComboBox`. Typing
 * narrows the list by label; arrow keys move through it, Enter picks, Escape closes it. The chevron
 * opens the whole list. Its value is the chosen item's `value`, posted under `name`. `label`, `hint`,
 * `error`, `required` and `disabled` are a `DateField`'s; `size` and `width` an `Input`'s. Inside a
 * modal `Dialog` the list draws in the dialog. While `loading` the label is drawn and the field is a
 * bone of its height.
 */
export function Combobox({ loading, loadingLabel, ...field }: ComboboxProps): ReactElement {
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
  return <ShownCombobox {...field} />;
}
