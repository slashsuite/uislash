import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  Button,
  StateMachine,
  type StateMachineItem,
  type StateMachineState,
  type StateMachineTransition,
} from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/StateMachine.examples.js";
import { roleMachine } from "./roleMachine";

const meta: Meta = { title: "Data/StateMachine", parameters: { layout: "padded" } };
export default meta;
type S = StoryObj;

const states: StateMachineState[] = [
  { id: "draft", label: "Draft", kind: "initial", owner: "writer" },
  { id: "review", label: "In review", kind: "human", owner: "editor" },
  { id: "published", label: "Published", kind: "terminal" },
  { id: "rejected", label: "Rejected", kind: "failed" },
];
const transitions: StateMachineTransition[] = [
  { from: "draft", to: "review", event: "submit" },
  { from: "review", to: "draft", event: "send back" },
  { from: "review", to: "published", event: "approve" },
  { from: "review", to: "rejected", event: "reject" },
];

/** `n` items with refs `<prefix>-1` upwards, all in `state`. */
const many = (prefix: string, n: number, state: string): StateMachineItem[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `${prefix}-${i + 1}`,
    label: `${prefix} item ${i + 1}`,
    state,
  }));

/** The role machine with nothing in it. */
export const Empty: S = {
  render: () => <StateMachine label="Roles" {...roleMachine} />,
};

/** Many items: a full box packs nine slots and a `+N` that shows the rest. */
export const Busy: S = {
  render: () => (
    <StateMachine
      label="Roles"
      {...roleMachine}
      items={[
        ...many("B", 14, "building"),
        ...many("R", 4, "reviewing"),
        ...many("Q", 6, "queued"),
        ...many("N", 2, "needs_human"),
        ...many("C", 3, "closed"),
        { id: "F-1", label: "Import retried past its cap", state: "failed" },
      ]}
    />
  ),
};

/** One human state with one item in it, linked. */
export const HumanStateWithItem: S = {
  render: () => (
    <StateMachine
      label="Article flow"
      states={states}
      transitions={transitions}
      items={[{ id: "A-12", label: "Spring launch post", state: "review", href: "#a-12" }]}
    />
  ),
};

/** An item whose state the machine does not have lands in its own box, never dropped. */
export const Unplaced: S = {
  render: () => (
    <StateMachine
      label="Article flow"
      states={states}
      transitions={transitions}
      items={[
        { id: "A-12", label: "Spring launch post", state: "draft" },
        { id: "A-9", label: "Archived interview", state: "archived" },
      ]}
    />
  ),
};

/** `active` rings the one state that is current. */
export const Active: S = {
  render: () => (
    <StateMachine
      label="Article flow"
      states={states}
      transitions={transitions}
      active="review"
      items={[{ id: "A-12", label: "Spring launch post", state: "review" }]}
    />
  ),
};

const start: StateMachineItem[] = [
  { id: "T-1", label: "Add the dark theme", state: "idea" },
  { id: "T-2", label: "Fix the date picker", state: "queued" },
  { id: "T-3", label: "Speed up the gate", state: "building" },
  { id: "T-4", label: "Rename the pill tones", state: "reviewing" },
  { id: "T-5", label: "Docs for the gallery", state: "gating" },
];

/** Where an item goes on the `step`th press: one of the transitions out of its state, in turn. */
function next(item: StateMachineItem, step: number): StateMachineItem {
  const out = roleMachine.transitions.filter((t) => t.from === item.state);
  const pick = out[step % Math.max(1, out.length)];
  return pick ? { ...item, state: pick.to } : item;
}

/** Each press moves every item one transition on, all at once: each dot runs along its arrow. */
function Moving() {
  const [step, setStep] = useState(0);
  const [items, setItems] = useState(start);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button
          onClick={() => {
            setItems((current) => current.map((item) => next(item, step)));
            setStep(step + 1);
          }}
        >
          Move every item
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setItems(start);
            setStep(0);
          }}
        >
          Reset
        </Button>
      </div>
      <StateMachine label="Roles" {...roleMachine} items={items} />
    </div>
  );
}

export const Play: S = { render: () => <Moving /> };

const queued: StateMachineState[] = [
  { id: "queued", label: "Queued" },
  { id: "done", label: "Done", kind: "terminal" },
];
const finish: StateMachineTransition[] = [{ from: "queued", to: "done", event: "finish" }];

/** Four machines, one queued box each, holding 0, 1, 9 and 12 items: each box keeps its size. */
export const BoxSizes: S = {
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      {[0, 1, 9, 12].map((n) => (
        <StateMachine
          key={n}
          label={`${n} items`}
          states={queued}
          transitions={finish}
          items={many(`Q${n}`, n, "queued")}
        />
      ))}
    </div>
  ),
};

export const DoKind: S = { render: examples.DoKind };
export const DontKind: S = { render: examples.DontKind };
