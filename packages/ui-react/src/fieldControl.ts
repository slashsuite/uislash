import { createContext, useContext } from "react";

/** What a `Field` tells the control inside it. Internal: not exported from the package. */
export type FieldControlContext = {
  /** The control's id, which the Field's label names. */
  id: string;
  /** The ids of the notes the Field draws (the hint, then the error), none when it draws neither. */
  describedBy: string | undefined;
  /** `true` when the Field shows an error. */
  invalid: boolean;
  /** `true` when the Field is `required`. */
  required: boolean;
};

export const FieldContext = createContext<FieldControlContext | undefined>(undefined);

type ControlA11y = {
  id?: string | undefined;
  "aria-describedby"?: string | undefined;
  "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling" | undefined;
  required?: boolean | undefined;
};

/**
 * Merges the enclosing `Field`'s id, note and invalid state into a control's own props. Inside a
 * `Field` the id is the Field's, so its label always names the control; the caller's
 * `aria-describedby` comes first and the Field's note after it; the caller's `aria-invalid` wins.
 * With no error the control says `aria-invalid="false"` outright, so a browser does not read an
 * empty required control as invalid before anyone has typed. A `required` Field makes the control
 * `required`, unless the caller set it. Outside a `Field` it returns the props unchanged.
 */
export function useFieldControl(own: ControlA11y): ControlA11y {
  const field = useContext(FieldContext);
  if (field === undefined) {
    return {
      id: own.id,
      "aria-describedby": own["aria-describedby"],
      "aria-invalid": own["aria-invalid"],
      required: own.required,
    };
  }
  const describedBy = [own["aria-describedby"], field.describedBy].filter(Boolean).join(" ");
  return {
    id: field.id,
    "aria-describedby": describedBy === "" ? undefined : describedBy,
    "aria-invalid": own["aria-invalid"] ?? field.invalid,
    required: own.required ?? (field.required || undefined),
  };
}
