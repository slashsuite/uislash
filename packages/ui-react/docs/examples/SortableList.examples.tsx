import { useState } from "react";
import { Button, Card, ListRow, SortableItem, SortableList, Stack } from "@slashsuite/ui-react";

/** The list reports a move and the app applies it to its own data, so a drag or the keyboard reorders it. */
export const DoReorder = () => {
  const [tasks, setTasks] = useState([
    "Ship the invoice export",
    "Book the car service",
    "Review the quote",
  ]);
  return (
    <SortableList
      label="Queue"
      onReorder={(move) => {
        const rest = tasks.filter((task) => task !== move.id);
        const after = move.target?.position === "after" ? 1 : 0;
        const at = move.target ? rest.indexOf(move.target.id) + after : rest.length;
        setTasks([...rest.slice(0, at), move.id, ...rest.slice(at)]);
      }}
    >
      {tasks.map((task) => (
        <SortableItem key={task} id={task} title={task} />
      ))}
    </SortableList>
  );
};

/** Up and down buttons on every row are a wall of controls, and they cannot move a task into another band. */
export const DontReorder = () => (
  <Card flush>
    <Stack divided>
      {["Ship the invoice export", "Book the car service", "Review the quote"].map((task) => (
        <ListRow
          key={task}

          actions={
            <>
              <Button size="sm" variant="outline">
                Up
              </Button>
              <Button size="sm" variant="outline">
                Down
              </Button>
            </>
          }
        >
          {task}
        </ListRow>
      ))}
    </Stack>
  </Card>
);
