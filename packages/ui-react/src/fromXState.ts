import type {
  StateMachineDefinition,
  StateMachineKind,
  StateMachineState,
  StateMachineTransition,
} from "./StateMachine.js";

/** One transition: a target, or `{ target, meta }`, or a list of them (the first that passes its guard). */
export type XStateTransitionConfig =
  | string
  | undefined
  | {
      target?: string | readonly (string | undefined)[] | undefined;
      meta?: Record<string, unknown> | undefined;
    };

type XStateTransitions = XStateTransitionConfig | readonly XStateTransitionConfig[];

/** One `invoke`: where it goes when the invoked actor is done, and when it fails. */
export type XStateInvokeConfig = {
  onDone?: XStateTransitions;
  onError?: XStateTransitions;
};

/**
 * The part of an xstate v5 state node `fromXState` reads: its `id`, `type` and `meta`, and the
 * ways it moves on (`on`, `always`, `after`, and each `invoke`'s `onDone` and `onError`). Typed by
 * shape, so the package does not depend on xstate.
 */
export type XStateNodeConfig = {
  id?: string | undefined;
  type?: string | undefined;
  meta?: Record<string, unknown> | undefined;
  on?: Record<string, XStateTransitions> | undefined;
  always?: XStateTransitions;
  after?: Record<string, XStateTransitions> | undefined;
  invoke?: XStateInvokeConfig | readonly XStateInvokeConfig[] | undefined;
  /** Its child states: only their `id`s are read, so a target `#id` lands on this state. */
  states?: Record<string, XStateNodeConfig> | undefined;
};

/** Where a machine starts: a state's key, or `{ target }`. */
export type XStateInitial = string | { target: string } | undefined;

/** A machine's config, or what `setup(…).createMachine(config)` returns (it keeps it as `config`). */
export type XStateMachineLike =
  | {
      id?: string | undefined;
      initial?: XStateInitial;
      states?: Record<string, XStateNodeConfig> | undefined;
    }
  | {
      config: {
        id?: string | undefined;
        initial?: XStateInitial;
        states?: Record<string, XStateNodeConfig> | undefined;
      };
    };

/** What `fromXState` makes of one state node before `state` adjusts it. */
export type XStateStateInput = {
  id: string;
  /** The node's own config: its `type`, `meta` and `on`. */
  node: XStateNodeConfig;
  /** The state as read by the default rules. */
  state: StateMachineState;
};

const text = (value: unknown): string | undefined =>
  typeof value === "string" && value !== "" ? value : undefined;

const KINDS: readonly StateMachineKind[] = ["initial", "normal", "human", "terminal", "failed"];

const isKind = (value: unknown): value is StateMachineKind => KINDS.some((kind) => kind === value);

const listOf = <T>(value: T | readonly T[] | undefined): readonly T[] => {
  if (value === undefined) return [];
  return isList(value) ? value : [value];
};

function isList<T>(value: T | readonly T[]): value is readonly T[] {
  return Array.isArray(value);
}

/** Every way a node moves on, each with the event name it is drawn with. */
function movesOf(node: XStateNodeConfig): (readonly [string, XStateTransitions])[] {
  const after = Object.entries(node.after ?? {}).map(([ms, t]) => [`after ${ms}`, t] as const);
  const invoked = listOf(node.invoke).flatMap((i) => [
    ["done", i.onDone] as const,
    ["error", i.onError] as const,
  ]);
  return [...Object.entries(node.on ?? {}), ["always", node.always] as const, ...after, ...invoked];
}

/** A node's kind: its `meta.kind`, else what its `type` and the machine's `initial` say. */
function kindOf(id: string, node: XStateNodeConfig, initial: XStateInitial): StateMachineKind {
  const meta = node.meta?.["kind"];
  if (isKind(meta)) return meta;
  if (node.type === "final") return "terminal";
  const start = typeof initial === "object" ? initial.target : initial;
  return id === start ? "initial" : "normal";
}

/** How a target finds its state: the machine's id, and the top-level state each node `id` is in. */
type Ids = { machine: string; nodes: ReadonlyMap<string, string> };

/**
 * The top-level state a target names: `#machine.review`, `review.waiting` and `#rev` (the `id` of
 * `review` or of a state inside it) are all `review`, and `.waiting` (a child of the state it
 * leaves) is that state. Only the machine's top level is drawn, so a nested target lands on its
 * parent.
 */
function targetState(target: string, from: string, ids: Ids): string {
  if (target.startsWith(".")) return from;
  if (!target.startsWith("#")) return target.split(".")[0] ?? target;
  const [id = "", next] = target.slice(1).split(".");
  if (id === ids.machine) return next ?? "";
  return ids.nodes.get(id) ?? id;
}

/** Each node `id` in `node` and below it, mapped to `top`, the top-level state it is in. */
function nodeIds(top: string, node: XStateNodeConfig, into: Map<string, string>): void {
  if (node.id !== undefined) into.set(node.id, top);
  for (const child of Object.values(node.states ?? {})) nodeIds(top, child, into);
}

function targets(config: XStateTransitionConfig): {
  to: readonly string[];
  meta: Record<string, unknown> | undefined;
} {
  if (config === undefined) return { to: [], meta: undefined };
  if (typeof config === "string") return { to: [config], meta: undefined };
  const target = config.target ?? [];
  const to = typeof target === "string" ? [target] : target.filter((t) => t !== undefined);
  return { to, meta: config.meta };
}

/**
 * Turns an xstate v5 machine (the machine, or its config) into a `StateMachine` definition: one
 * state per top-level state node, one transition per target in each node's `on`.
 *
 * - A state's `label` is its `meta.label`, else its key; its `owner` is `meta.owner`; its `kind`
 *   is `meta.kind` when that is one of the five, else `terminal` for a `type: "final"` node,
 *   `initial` for the machine's `initial`, and `normal` for the rest.
 * - Each `on` event, `always`, each `after` delay and each `invoke`'s `onDone` and `onError` is a
 *   transition. Its `event` is its `meta.label`, else the event's name (`always`, `after 500`,
 *   `done`, `error`), and its `actor` its `meta.actor`. A transition with no target
 *   (it stays where it is), one that stays inside its own state, or one whose target is not a
 *   top-level state is left out.
 * - `state` adjusts each state, for a machine whose meta says it another way: return the state to
 *   draw, given its key, its config and the state the rules above made of it.
 *
 * Only the top level is read: a nested state is drawn as its parent.
 */
export function fromXState(
  machine: XStateMachineLike,
  options: { state?: ((input: XStateStateInput) => StateMachineState) | undefined } = {},
): StateMachineDefinition {
  const config = "config" in machine ? machine.config : machine;
  const nodes = Object.entries(config.states ?? {});
  const keys = new Set(nodes.map(([id]) => id));
  const found = new Map<string, string>();
  for (const [id, node] of nodes) nodeIds(id, node, found);
  // xstate names a machine with no `id` "(machine)".
  const ids: Ids = { machine: config.id ?? "(machine)", nodes: found };
  const states = nodes.map(([id, node]): StateMachineState => {
    const meta = node.meta ?? {};
    const kind = kindOf(id, node, config.initial);
    const owner = text(meta["owner"]);
    const state: StateMachineState = {
      id,
      label: text(meta["label"]) ?? id,
      kind,
      ...(owner === undefined ? {} : { owner }),
    };
    return options.state ? options.state({ id, node, state }) : state;
  });
  const transitions = nodes.flatMap(([from, node]) =>
    movesOf(node).flatMap(([event, on]) =>
      listOf(on).flatMap((one) => {
        const { to, meta } = targets(one);
        const name = text(meta?.["label"]) ?? event;
        const actor = text(meta?.["actor"]);
        return to
          .map((t) => targetState(t, from, ids))
          .filter((t) => t !== from && keys.has(t))
          .map((t): StateMachineTransition => ({
            from,
            to: t,
            event: name,
            ...(actor === undefined ? {} : { actor }),
          }));
      }),
    ),
  );
  return { states, transitions };
}
