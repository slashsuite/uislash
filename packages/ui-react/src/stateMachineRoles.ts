import type { CategoryTone } from "./StackedBar.js";
import type { StateMachineState, StateMachineTransition } from "./StateMachine.js";

/** The categorical scale in its order: the colours a role takes, `cat1` first. */
const ROLE_TONES: readonly CategoryTone[] = [
  "cat1",
  "cat2",
  "cat3",
  "cat4",
  "cat5",
  "cat6",
  "cat7",
  "cat8",
];

/**
 * Each role's colour. The roles are the states' owners in state order, then any transition actor
 * that owns no state, in transition order. A role in `pinned` takes its pinned tone; every other
 * takes the next tone in `cat1` to `cat8` order that no role is pinned to, wrapping past the last.
 * So the same definition and pins always give the same colours.
 */
export function toneByRole(
  states: readonly StateMachineState[],
  transitions: readonly StateMachineTransition[],
  pinned: Readonly<Record<string, CategoryTone>> = {},
): Map<string, CategoryTone> {
  const roles = [
    ...new Set(
      [...states.map((s) => s.owner), ...transitions.map((t) => t.actor)].filter(
        (r): r is string => r !== undefined && r !== "",
      ),
    ),
  ];
  const taken = new Set(Object.values(pinned));
  const free = ROLE_TONES.filter((t) => !taken.has(t));
  const pool = free.length > 0 ? free : ROLE_TONES;
  const tones = new Map<string, CategoryTone>();
  let next = 0;
  for (const role of roles) {
    const pin = Object.hasOwn(pinned, role) ? pinned[role] : undefined;
    tones.set(role, pin ?? pool[next++ % pool.length] ?? "cat1");
  }
  return tones;
}

/** The role a transition's line is coloured by: its `actor`, else the owner of its `from` state. */
export function moverOf(
  transition: StateMachineTransition,
  owners: ReadonlyMap<string, string | undefined>,
): string | undefined {
  return transition.actor || owners.get(transition.from) || undefined;
}
