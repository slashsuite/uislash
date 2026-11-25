import { type ReactElement, type ReactNode, useState } from "react";
import { FlowView, type ViewNode, type ViewTone } from "./FlowDiagram.js";
import { Pill, type PillTone } from "./Pill.js";
import type { Passthrough } from "./props.js";
import { Bone, BusyLabel, busy, type LoadingProps, useLoading } from "./skeleton.js";
import { dotArea, dotLayer, placeOf, slotsFor, UNPLACED, useMoves } from "./stateMachineDots.js";
import { useFlowLayout } from "./useFlowLayout.js";

/**
 * What a state is: `initial` (where things start), `normal`, `human` (waiting on a person),
 * `terminal` (done, nothing leaves it) or `failed` (stopped on an error).
 */
export type StateMachineKind = "initial" | "normal" | "human" | "terminal" | "failed";

/** One state: its `id` (what a transition's `from` and `to` and an item's `state` name), its `label`, its `kind`, and the role that `owner`s it. */
export type StateMachineState = {
  id: string;
  label: string;
  /** @default normal */
  kind?: StateMachineKind | undefined;
  /** The role or lane that acts in this state (`reviewer`, `billing`), shown as a tag on it. */
  owner?: string | undefined;
};

/** One move between states, with the `event` that makes it, shown on the arrow. */
export type StateMachineTransition = { from: string; to: string; event?: string | undefined };

/** The machine: its states and the transitions between them. `fromXState` makes one from an xstate machine. */
export type StateMachineDefinition = {
  states: readonly StateMachineState[];
  transitions: readonly StateMachineTransition[];
};

/**
 * A thing in the machine: its short `id` (a ref, shown by its dot), its full `label` (the dot's
 * name and tooltip), the `state` it is in, and an optional `href` its dot links to.
 */
export type StateMachineItem = {
  id: string;
  label: string;
  state: string;
  href?: string | undefined;
};

/** Each kind's box tone, and the tag that says it in words. */
const KIND_TONE: Record<StateMachineKind, ViewTone> = {
  initial: "neutral",
  normal: "neutral",
  human: "warn",
  terminal: "muted",
  failed: "danger",
};
const KIND_TAG: Record<StateMachineKind, { text: string; tone: PillTone } | null> = {
  initial: { text: "start", tone: "neutral" },
  normal: null,
  human: { text: "human", tone: "warn" },
  terminal: { text: "end", tone: "neutral" },
  failed: { text: "failed", tone: "danger" },
};

/**
 * A box's tags: what kind of state it is, who owns it, and how many items it holds. The row is
 * always there: a box with no items keeps an invisible count tag in it, so an empty box and a full
 * one are the same height.
 */
function boxTags(
  tag: { text: string; tone: PillTone } | null,
  owner: string | undefined,
  count: number,
): ReactNode {
  return (
    <span className="flex flex-wrap items-center justify-center gap-1">
      {tag && (
        <Pill size="sm" tone={tag.tone}>
          {tag.text}
        </Pill>
      )}
      {owner && <Pill size="sm">{owner}</Pill>}
      {count > 0 ? (
        <Pill size="sm" tone="accent" dot>
          {count === 1 ? "1 item" : `${count} items`}
        </Pill>
      ) : (
        <span aria-hidden="true" className="flex invisible">
          <Pill size="sm" tone="accent" dot>
            0 items
          </Pill>
        </span>
      )}
    </span>
  );
}

/**
 * What a box holds under its label: its tags, and the dot area it always reserves (the full grid,
 * even empty), so a box keeps its size whatever its item count.
 */
function boxContent(state: StateMachineState | null, count: number, slots: number): ReactNode {
  const tags = boxTags(state ? KIND_TAG[state.kind ?? "normal"] : null, state?.owner, count);
  return (
    <>
      {tags}
      <span aria-hidden="true" className="mx-auto mt-1 block" style={dotArea(slots)} />
    </>
  );
}

/** The items each box holds: its state's, and the unplaced box's for an unknown state. */
function itemsByBox(
  items: readonly StateMachineItem[],
  known: ReadonlySet<string>,
): Map<string, StateMachineItem[]> {
  const placed = placeOf(items, known);
  const inBox = new Map<string, StateMachineItem[]>();
  for (const item of items) {
    const box = placed.get(item.id) ?? UNPLACED;
    inBox.set(box, [...(inBox.get(box) ?? []), item]);
  }
  return inBox;
}

/** The boxes to draw: one per state, and the unplaced box when an item is in no state. */
function boxesFor(
  states: readonly StateMachineState[],
  inBox: ReadonlyMap<string, readonly StateMachineItem[]>,
  open: ReadonlySet<string>,
): ViewNode[] {
  const slots = (id: string) => slotsFor(inBox.get(id)?.length ?? 0, open.has(id));
  const boxes: ViewNode[] = states.map((s) => ({
    id: s.id,
    label: s.label,
    tone: KIND_TONE[s.kind ?? "normal"],
    content: boxContent(s, inBox.get(s.id)?.length ?? 0, slots(s.id)),
  }));
  const unplaced = inBox.get(UNPLACED)?.length ?? 0;
  if (unplaced === 0) return boxes;
  return [
    ...boxes,
    {
      id: UNPLACED,
      label: "Not in any state",
      tone: "warn",
      content: boxContent(null, unplaced, slots(UNPLACED)),
    },
  ];
}

/** Which boxes show all their dots, and the switch that opens or closes one. */
function useOpenBoxes(opened: () => void): [ReadonlySet<string>, (id: string) => void] {
  const [open, setOpen] = useState<ReadonlySet<string>>(new Set());
  const toggle = (id: string) => {
    opened();
    setOpen((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  };
  return [open, toggle];
}

/**
 * A state machine, drawn, with the things moving through it: each state a box, each transition an
 * arrow named by its event, laid out like a `FlowDiagram`. A state's `kind` sets its look and a tag
 * that says it: `human` takes the warn tone, `failed` the danger tone, `terminal` is muted, and
 * `initial` is tagged start. Its `owner` is a tag beside it.
 *
 * Each of the `items` is a coloured dot with its short `id`, in the box of its `state`, which
 * counts them; a box shows up to nine and a `+N` for the rest. The dot's name and tooltip is its
 * full `label`, and with an `href` it is a link. An item whose state is not in the machine goes in
 * a box of its own, "Not in any state", so nothing is dropped. When an item's state changes, its
 * dot runs along the arrow between the two (straight across when there is none); with reduced
 * motion it moves at once. `active` rings the one state that is current.
 *
 * `fromXState` makes `states` and `transitions` from an xstate machine.
 */
export function StateMachine({
  label,
  states,
  transitions,
  items = [],
  active,
  loading,
  loadingLabel,
  ...rest
}: {
  /** What the machine is: its accessible name. */
  label: string;
  /** The states, each with a unique `id`. */
  states: readonly StateMachineState[];
  /** The moves between them. One whose `from` or `to` is not a state is not drawn. */
  transitions: readonly StateMachineTransition[];
  /** The things in the machine, each in the state its `state` names. */
  items?: readonly StateMachineItem[] | undefined;
  /** The `id` of the one state to ring as current. */
  active?: string | undefined;
} & LoadingProps &
  Passthrough): ReactElement {
  const { loading: waiting, owner } = useLoading(loading);
  const known = new Set(states.map((s) => s.id));
  const { moves, done, clear } = useMoves(items, known);
  const [open, toggle] = useOpenBoxes(clear);
  const inBox = itemsByBox(items, known);
  const nodes = boxesFor(states, inBox, open);
  const edges = transitions.map((t) => ({ from: t.from, to: t.to, label: t.event }));
  const { canvas, drawn } = useFlowLayout(nodes, edges, "down");

  if (waiting && states.length === 0) {
    return (
      <figure {...rest} {...busy(owner, waiting)} aria-label={label} className="flex flex-col">
        <Bone shape="block h-48 rounded-lg" />
        <BusyLabel owner={owner} loading={waiting} label={loadingLabel} />
      </figure>
    );
  }

  const names = new Map(nodes.map((n) => [n.id, n.label]));
  return (
    <FlowView
      {...rest}
      label={label}
      nodes={nodes}
      edges={edges}
      active={active}
      layer={(layout) => dotLayer(layout, { inBox, names, open, toggle, moves, done })}
      canvas={canvas}
      drawn={drawn}
      fit
    />
  );
}
