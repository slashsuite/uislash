import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  Avatar,
  Caption,
  Pill,
  SortableItem,
  SortableList,
  type SortableMove,
  SortableSection,
  Stack,
} from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/SortableList.examples.js";

const meta: Meta = { title: "Data/SortableList" };
export default meta;
type S = StoryObj;

type Task = { id: string; title: string; owner?: string; tag?: string };
type Band = { id: string; title: string; tasks: Task[] };

const urgent: Band = {
  id: "urgent",
  title: "Urgent",
  tasks: [
    { id: "t1", title: "Restore the nightly backup", owner: "Ada Lovelace", tag: "ops" },
    { id: "t2", title: "Renew the TLS certificate", tag: "ops" },
    { id: "t3", title: "Fix the failing payment webhook", owner: "Grace Hopper", tag: "bug" },
  ],
};
const high: Band = {
  id: "high",
  title: "High",
  tasks: [
    { id: "t4", title: "Ship the invoice export", owner: "Ada Lovelace", tag: "feature" },
    { id: "t5", title: "Answer the landlord about the lease" },
    { id: "t6", title: "Book the car service", tag: "home" },
    { id: "t7", title: "Review the quote template", owner: "Grace Hopper" },
    { id: "t8", title: "Archive last year's receipts", tag: "admin" },
  ],
};
const queue: Band[] = [urgent, high, { id: "low", title: "Low", tasks: [] }];

/** What the app does with a move: take the task out, then put it in its new section and place. */
function applyMove(bands: Band[], move: SortableMove): Band[] {
  const task = bands.flatMap((band) => band.tasks).find((t) => t.id === move.id);
  if (!task || move.target?.id === move.id) return bands;
  const without = bands.map((band) => ({
    ...band,
    tasks: band.tasks.filter((t) => t.id !== move.id),
  }));
  return without.map((band) => {
    if (band.id !== move.section) return band;
    const tasks = [...band.tasks];
    const at = move.target ? tasks.findIndex((t) => t.id === move.target?.id) : tasks.length;
    tasks.splice(move.target?.position === "after" ? at + 1 : at, 0, task);
    return { ...band, tasks };
  });
}

function Meta({ task }: { task: Task }) {
  return (
    <>
      {task.tag && <Pill>{task.tag}</Pill>}
      {task.owner && <Avatar name={task.owner} size="xs" />}
    </>
  );
}

function Queue({ label, start }: { label: string; start: Band[] }) {
  const [bands, setBands] = useState(start);
  const [moves, setMoves] = useState<SortableMove[]>([]);
  return (
    <Stack gap="sm">
      <SortableList
        label={label}
        onReorder={(move) => {
          setMoves((done) => [...done, move]);
          setBands((now) => applyMove(now, move));
        }}
      >
        {bands.map((band) => (
          <SortableSection key={band.id} id={band.id} title={band.title}>
            {band.tasks.map((task) => (
              <SortableItem key={task.id} id={task.id} title={task.title}>
                {(task.tag || task.owner) && <Meta task={task} />}
              </SortableItem>
            ))}
          </SortableSection>
        ))}
      </SortableList>
      <Caption data-moves={JSON.stringify(moves)}>
        {moves.length === 0 ? "No moves yet." : `${moves.length} moved.`}
      </Caption>
    </Stack>
  );
}

/**
 * A priority queue: tasks in bands, the next task on top. Drag a row, or Tab to the list, move to a
 * row's grip with the arrow keys, press Enter, move with the arrow keys and press Enter to drop. The
 * story applies each move to its own data, as an app does. "Low" is empty and still takes a drop.
 */
export const Default: S = {
  render: () => (
    <div className="max-w-xl">
      <Queue label="Task queue" start={queue} />
    </div>
  ),
};

/** Two lists on one page: neither takes the other's items. */
export const TwoLists: S = {
  render: () => (
    <div className="grid max-w-3xl grid-cols-2 gap-4">
      <Queue label="Home queue" start={[{ ...urgent, id: "home", title: "Home" }]} />
      <Queue
        label="Work queue"
        start={[
          {
            id: "work",
            title: "Work",
            tasks: [
              { id: "w1", title: "Plan the sprint" },
              { id: "w2", title: "Write the release notes" },
            ],
          },
        ]}
      />
    </div>
  ),
};

/**
 * A narrow list whose titles do not fit: each is cut with an ellipsis, and a cut title shows in full
 * in a tooltip on hover, when its row has keyboard focus, or on a tap.
 */
export const LongTitles: S = {
  render: () => (
    <div className="max-w-xs">
      <Queue
        label="Long titles"
        start={[
          {
            id: "long",
            title: "Inbox",
            tasks: [
              {
                id: "l1",
                title: "Reconcile the March bank statement against the ledger export",
                tag: "admin",
              },
              { id: "l2", title: "Call the plumber about the leak under the kitchen sink" },
              { id: "l3", title: "Short one" },
            ],
          },
        ]}
      />
    </div>
  ),
};

export const DoReorder: S = {
  render: examples.DoReorder,
};

export const DontReorder: S = {
  render: examples.DontReorder,
};
