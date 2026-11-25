import { type ReactElement, type ReactNode, useContext } from "react";
import { cx } from "./cx.js";
import { EmptySlot } from "./emptySlot.js";
import { TableContext } from "./tableColumns.js";
import { BODY_LINE, PAD, STACK, stackRole } from "./tableRow.js";
import { Bone } from "./skeleton.js";

/**
 * A table body's one row when it has no rows: a cell across every column the head declares, holding
 * `empty` at the slot's small size. Internal to `TableBody`.
 */
export function EmptyRow({ children }: { children: ReactNode }): ReactElement {
  const { columns, size, stack } = useContext(TableContext);
  return (
    <tr {...stackRole(stack, "row")} className={cx(BODY_LINE, stack && STACK.row)}>
      <td
        {...stackRole(stack, "cell")}
        colSpan={columns ?? 1}
        className={cx(PAD[size].cell, "text-center", stack && STACK.block)}
      >
        <EmptySlot size="sm">{children}</EmptySlot>
      </td>
    </tr>
  );
}

/** The bones of a body cell: one line of text not here yet. */
export const CELL_BONE = "block h-[0.6lh] w-3/4 rounded";

/**
 * A loading table body's rows when it has none yet: five, each with one bone cell per column the
 * head declares (one across the row with no head). Internal to `TableBody`.
 */
export function BoneRows(): ReactElement {
  const { columns, size, stack } = useContext(TableContext);
  const cells = Array.from({ length: columns ?? 1 }, (_, i) => i);
  return (
    <>
      {[0, 1, 2, 3, 4].map((row) => (
        <tr key={row} {...stackRole(stack, "row")} className={cx(BODY_LINE, stack && STACK.row)}>
          {cells.map((cell) => (
            <td
              key={cell}
              {...stackRole(stack, "cell")}
              className={cx(PAD[size].cell, stack && STACK.block)}
            >
              <Bone shape={CELL_BONE} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
