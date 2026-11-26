import { type ReactElement, type ReactNode, useState } from "react";
import { cx } from "./cx.js";
import { FlowView, type ViewEdge, type ViewNode, type ViewTone } from "./FlowDiagram.js";
import { Pill, type PillTone } from "./Pill.js";
import type { Passthrough } from "./props.js";
import { Bone, BusyLabel, busy, type LoadingProps, useLoading } from "./skeleton.js";
import { type CategoryTone, Legend, VIZ_TONE } from "./StackedBar.js";
import { moverOf, toneByRole } from "./stateMachineRoles.js";
import { dotLayer } from "./stateMachineDots.js";
import {
  boxContentSize,
  MACHINE_SPACING,
  dotArea,
  placeOf,
  slotsFor,
  UNPLACED,
} from "./stateMachineGrid.js";
import { useMoves } from "./stateMachineMoves.js";
import { type SizedNode, useFlowLayout } from "./useFlowLayout.js";

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
  /**
   * The role or lane that acts in this state (`reviewer`, `billing`): a tag on it in the role's
   * colour, and a bar of that colour across the box's top.
   */
  owner?: string | undefined;
};

/**
 * One move between states, with the `event` that makes it, shown on the arrow, and the `actor`,
 * the role that makes the move, whose colour the arrow is drawn in.
 */
export type StateMachineTransition = {
  from: string;
  to: string;
  event?: string | undefined;
  /** The role that makes this move. Left out, it is the `owner` of the `from` state. */
  actor?: string | undefined;
};

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
  human: "neutral",
  terminal: "muted",
  failed: "danger",
};
const KIND_TAG: Record<StateMachineKind, { text: string; tone: PillTone } | null> = {
  initial: { text: "start", tone: "neutral" },
  normal: null,
  human: { text: "human", tone: "neutral" },
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
  owner: { role: string; tone: CategoryTone } | undefined,
  count: number,
): ReactNode {
  return (
    <span className="flex flex-wrap items-center justify-center gap-1">
      {tag && (
        <Pill size="sm" tone={tag.tone}>
          {tag.text}
        </Pill>
      )}
      {owner && (
        <Pill size="sm">
          <span className="inline-flex items-center gap-1">
            <span
              aria-hidden="true"
              className={cx("size-2 shrink-0 rounded-full bg-current", VIZ_TONE[owner.tone])}
            />
            {owner.role}
          </span>
        </Pill>
      )}
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
function boxContent(
  state: StateMachineState | null,
  tone: CategoryTone | undefined,
  count: number,
  slots: number,
): ReactNode {
  const owner = state?.owner && tone ? { role: state.owner, tone } : undefined;
  const tags = boxTags(state ? KIND_TAG[state.kind ?? "normal"] : null, owner, count);
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
  tones: ReadonlyMap<string, CategoryTone>,
): (ViewNode & SizedNode)[] {
  const slots = (id: string) => slotsFor(inBox.get(id)?.length ?? 0, open.has(id));
  const boxes: (ViewNode & SizedNode)[] = states.map((s) => {
    const tone = s.owner ? tones.get(s.owner) : undefined;
    return {
      id: s.id,
      label: s.label,
      tone: KIND_TONE[s.kind ?? "normal"],
      ...(tone ? { accent: VIZ_TONE[tone] } : {}),
      content: boxContent(s, tone, inBox.get(s.id)?.length ?? 0, slots(s.id)),
      contentSize: boxContentSize(slots(s.id)),
    };
  });
  const unplaced = inBox.get(UNPLACED)?.length ?? 0;
  if (unplaced === 0) return boxes;
  return [
    ...boxes,
    {
      id: UNPLACED,
      label: "Not in any state",
      tone: "warn",
      content: boxContent(null, undefined, unplaced, slots(UNPLACED)),
      contentSize: boxContentSize(slots(UNPLACED)),
    },
  ];
}

/** Which boxes show all their dots, and the switch that opens or closes one. */
function useOpenBoxes(): [ReadonlySet<string>, (id: string) => void] {
  const [open, setOpen] = useState<ReadonlySet<string>>(new Set());
  const toggle = (id: string) => {
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
 * arrow named by its event, laid out like a `FlowDiagram`. A state's `kind` is a tag that says it:
 * `human`, `failed` (which also takes the danger tone), `terminal` (muted) and `initial` (start).
 * Every box is one size, the label wrapping inside it, and the boxes sit close.
 *
 * Each role gets its own colour from the categorical scale (`cat1` to `cat8`, remapped by every
 * theme): a state's `owner` is a tag with its role's colour, and a bar of it across the box's top. A
 * transition's arrow is drawn in its `actor`'s colour, else in the colour of the role that owns the
 * state it leaves. The roles take the colours in order, the states' owners first, so the same
 * machine always gets the same colours; `roleTones` pins a role to one. A legend under the machine
 * names each role and its colour.
 *
 * Each of the `items` is a coloured dot with its short `id`, in the box of its `state`, which
 * counts them; a box shows up to six and a `+N` for the rest. The dot's name and tooltip is its
 * full `label`, and with an `href` it is a link. An item whose state is not in the machine goes in
 * a box of its own, "Not in any state", so nothing is dropped. When an item's state changes, its
 * dot runs from its slot along the arrow between the two, in the arrow's colour (straight across,
 * in the colour of the old state's owner, when there is none), into its new slot, and the dots
 * that stay slide into the slots it freed; with reduced motion every dot moves at once. `active`
 * rings the one state that is current.
 *
 * `fromXState` makes `states` and `transitions` from an xstate machine.
 */
export function StateMachine({
  label,
  states,
  transitions,
  items = [],
  active,
  roleTones: pinned,
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
  /**
   * Pins a role to a colour (`{ owner: "cat2" }`). A role left out takes the next colour in order
   * that no role is pinned to.
   */
  roleTones?: Readonly<Record<string, CategoryTone>> | undefined;
} & LoadingProps &
  Passthrough): ReactElement {
  const { loading: waiting, owner } = useLoading(loading);
  const known = new Set(states.map((s) => s.id));
  const [open, toggle] = useOpenBoxes();
  const { moves, done } = useMoves(items, known, open);
  const inBox = itemsByBox(items, known);
  const tones = toneByRole(states, transitions, pinned);
  const nodes = boxesFor(states, inBox, open, tones);
  const owners = new Map(states.map((s) => [s.id, s.owner]));
  const edges = transitions.map((t): ViewEdge => {
    const tone = tones.get(moverOf(t, owners) ?? "");
    return { from: t.from, to: t.to, label: t.event, ...(tone ? { colour: VIZ_TONE[tone] } : {}) };
  });
  // A run takes its arrow's colour; with no arrow, the colour of the role that owns the state it leaves.
  const runColour = (from: string, to: string) => {
    const edge = edges.find((e) => e.from === from && e.to === to);
    if (edge) return edge.colour;
    const tone = tones.get(owners.get(from) ?? "");
    return tone ? VIZ_TONE[tone] : undefined;
  };
  const { canvas, drawn } = useFlowLayout(nodes, edges, "down", {
    uniform: true,
    spacing: MACHINE_SPACING,
  });

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
    <div {...rest} className="flex min-w-0 flex-col gap-2">
      <FlowView
        label={label}
        nodes={nodes}
        edges={edges}
        active={active}
        layer={(layout) => dotLayer(layout, { inBox, names, open, toggle, moves, done, runColour })}
        canvas={canvas}
        drawn={drawn}
        fit
        uniform
      />
      {tones.size > 0 && (
        <div className="flex justify-center">
          <Legend
            items={[...tones].map(([role, tone]) => ({ label: role, tone }))}
            aria-label={`${label}: roles`}
          />
        </div>
      )}
    </div>
  );
}
