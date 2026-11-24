import { describe, expect, it } from "vitest";
import { fromXState } from "./fromXState.js";

/**
 * A small machine as xstate v5's `createMachine` takes it: a nested state with its own id, a final
 * one, meta, and every way a state moves on (`on`, `always`, `after`, `invoke`).
 */
const config = {
  id: "order",
  initial: "cart",
  states: {
    cart: { on: { CHECKOUT: "paying", ADD: undefined }, after: { 60000: "abandoned" } },
    abandoned: { type: "final" },
    paying: {
      meta: { label: "Paying", owner: "billing" },
      on: {
        PAID: { target: "#order.shipping", meta: { label: "paid" } },
        DECLINED: [{ target: "failed" }, { target: ".retry" }],
      },
      invoke: { src: "charge", onDone: "#packing", onError: "failed" },
      states: { retry: {} },
    },
    shipping: {
      meta: { kind: "human", owner: "warehouse" },
      initial: "packing",
      states: { packing: { id: "packing" }, sent: {} },
      on: { DELIVERED: { target: "done" }, LOST: "shipping.packing", RETURN: "nowhere" },
    },
    delivered: { always: "done" },
    done: { type: "final" },
    failed: { type: "final", meta: { kind: "failed", label: "Payment failed" } },
  },
};

describe("fromXState", () => {
  it("reads a small machine's states and transitions", () => {
    expect(fromXState(config)).toMatchSnapshot();
  });

  it("reads a machine object by its config", () => {
    expect(fromXState({ config })).toEqual(fromXState(config));
  });

  it("reads the start from `initial`'s object form", () => {
    const out = fromXState({ ...config, initial: { target: "paying" } });
    expect(out.states.filter((s) => s.kind === "initial").map((s) => s.id)).toEqual(["paying"]);
  });

  it("lets `state` adjust each state it reads", () => {
    const out = fromXState(config, {
      state: ({ id, node, state }) => ({ ...state, label: `${id}:${String(node.type)}` }),
    });
    expect(out.states.map((s) => s.label)).toEqual([
      "cart:undefined",
      "abandoned:final",
      "paying:undefined",
      "shipping:undefined",
      "delivered:undefined",
      "done:final",
      "failed:final",
    ]);
  });
});
