## SortableList

Group: Data

When to use: A list the user puts in order, such as a priority queue: tasks under priority bands, the next one on top.

### The one right way
The list reports a move and the app applies it to its own data, so a drag or the keyboard reorders it.
```tsx
import { useState } from "react";
import { SortableItem, SortableList } from "@slashsuite/ui-react";

function Example() {
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
}
```

### Do
- Map your data straight to the parts: a `SortableList` with a `label`, a `SortableSection` per group (`id`, `title`) and a `SortableItem` per row (`id`, `title`). Each item is a direct child of its section, and each section a direct child of the list; an item wrapped in your own component is not counted or placed.
- `onReorder` reports each drop as `{ id, section, target }`: the item that moved, the section it lands in, and `{ id, position }`, the item it was dropped before or after. Apply it to your own data and render again. The list never reorders itself.
- Moving an item into another section is how the user changes its group, such as a ticket's priority: read `section`, not the old one.
- An empty section shows a quiet "Drop here" row and still takes a drop. A drop there reports `{ id, section }` with no `target`.
- Put a meta line in a `SortableItem`'s children: `Pill`s, an `Avatar`. The row is the drag target, so do not put buttons or links in it.
- A list with no groups takes `SortableItem`s directly, and its moves have no `section`. Two lists on one page never take each other's items.

### Don't
- Do not add up and down buttons to rows: the drag and the keyboard already move an item, and buttons cannot move it into another section.

Up and down buttons on every row are a wall of controls, and they cannot move a task into another band.
```tsx
import { Button, Card, ListRow } from "@slashsuite/ui-react";

<Card flush>
  {["Ship the invoice export", "Book the car service", "Review the quote"].map(
    (task, index) => (
      <ListRow
        key={task}
        divided={index > 0}
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
    ),
  )}
</Card>
```

### Accessibility
- The list is a grid with one row per item. Tab moves into it, and the arrow keys move between rows.
- To move an item from the keyboard: on its row, press the Right arrow to reach its grip handle, named "Reorder <title>", and press Enter. Each Up or Down arrow moves the drop line one gap, across section headings and into an empty section's "Drop here" row, and Enter drops. Escape cancels, leaves the order as it was and puts focus back on the handle. Tab does not leave the list during a move: it steps between the page's drop areas, and only Enter or Escape ends it.
- While an item is moved, a screen reader announces it by its `title` and announces each drop position.
- A pointer drags the row itself, and on a touch screen a long press starts the drag; the handle is for the keyboard and screen readers.
- Section headings are row headers with the section's title, and the "Drop here" row cannot be focused or dragged.

### Props
### SortableList
A list the user puts in order: items under section headings, moved by dragging a row or from the keyboard (each row's grip handle, Enter, the arrow keys, Enter to drop, Escape to cancel). A drop reports `onReorder` with the item, the section it lands in and the item it lands next to; the app applies it to its own data. The list never reorders itself: it shows what its children say. Its children are `SortableSection`s, or `SortableItem`s directly for a list with no sections, each a direct child (map your data straight to them). Moving an item into another section is how the app changes its group, such as a ticket's priority. Two lists on one page never take each other's items.
- children: ReactNode (required). `SortableSection`s, or `SortableItem`s for a list with no sections.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- label: string (required). The list's accessible name, read by a screen reader.
- onReorder: (move: SortableMove) => void (required). Called once per drop with the move; apply it to your data.

### SortableSection
One group of a `SortableList` under a heading that shows its title and how many items it holds. An empty section still takes a drop: it shows a quiet "Drop here" row in place of items.
- children: ReactNode. Its `SortableItem`s, each a direct child. With none it shows a quiet `emptyLabel` row.
- emptyLabel: string (default Drop here). The quiet row an empty section shows, where a drop lands.
- id: string. The section's id, reported as `section` in a move that lands in it.
The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- title: string (required). The heading over its items.

### SortableItem
One row of a `SortableList`: a grip handle, the title, and an optional meta line under it. A pointer drags the row itself; the handle ("Reorder <title>") is how a keyboard or screen reader starts a move.
- children: ReactNode. A meta line under the title: `Pill`s, an `Avatar`.
- id: string. The item's id, reported in a move.
The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- title: string (required). Its one line; also what a screen reader announces while it is dragged.

### Types
- SortableMove: `{ id: string; section?: string; target?: { id: string; position: "before" | "after" } }`. A move the user made: which item, the section it lands in, and the item it lands next to.
