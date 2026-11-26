import type {
  StateMachineDefinition,
  StateMachineKind,
  StateMachineState,
} from "@slashsuite/ui-react";
import role from "./role-state-machine.json";

/** How the fixture says a state's kind: its `terminal` and `human_required` flags. */
function kindOf(state: (typeof role.states)[number]): StateMachineKind {
  if (state.terminal) return state.id === "failed" ? "failed" : "terminal";
  return state.human_required ? "human" : "normal";
}

/** A real role machine (20 states, 38 transitions), from a public repo's docs, as a definition. */
export const roleMachine: StateMachineDefinition = {
  states: role.states.map((s): StateMachineState => ({
    id: s.id,
    label: s.label,
    kind: kindOf(s),
    owner: s.role,
  })),
  transitions: role.transitions.map((t) => ({ from: t.from, to: t.to, event: t.label })),
};
