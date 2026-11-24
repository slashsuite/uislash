import { type ReactNode, useId } from "react";
import { ErrorLine, noteDescribedBy } from "./Field.js";

/** Whether a note is set: `null`, `undefined`, `false` and `""` draw nothing. */
const given = (note: ReactNode): boolean => note != null && note !== false && note !== "";

/** The ids of a choice's two note lines. */
export type NoteIds = { hint: string; error: string };

/**
 * The label, with its notes under it when there are any: the muted hint, and under it the error
 * (an alert icon and red text, announced politely) when set. The hint stays while the error shows.
 */
export function Words({
  label,
  hint,
  error,
  ids,
}: {
  label: ReactNode;
  hint: ReactNode;
  error: ReactNode;
  ids: NoteIds | undefined;
}): ReactNode {
  if (ids === undefined) return label;
  return (
    <span className="flex flex-col gap-0.5">
      <span>{label}</span>
      {given(hint) ? (
        <span id={ids.hint} className="text-xs text-slate-500">
          {hint}
        </span>
      ) : null}
      {given(error) ? <ErrorLine id={ids.error} error={error} /> : null}
    </span>
  );
}

/**
 * The notes' ids (none without a hint or an error), the control's whole `aria-describedby` (the
 * caller's, then the hint, then the error), and whether it is invalid (an error is set), as in a
 * `Field`.
 */
export function useNote(hint: ReactNode, error: ReactNode, describedBy: string | undefined) {
  const own = { hint: useId(), error: useId() };
  const invalid = given(error);
  const ids = invalid || given(hint) ? own : undefined;
  const notes = noteDescribedBy(given(hint), invalid, own);
  return {
    ids,
    describedIds: [describedBy, notes].filter(Boolean).join(" "),
    invalid,
  };
}
