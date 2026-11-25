import { createContext, createElement, type ReactElement, type ReactNode, useContext } from "react";

/**
 * Whether a part sits inside a `Card`: an `EmptyState` draws its own dashed frame only when it
 * stands alone. Internal: not exported from the package.
 */
const CardContext = createContext(false);

/** Marks `children` as inside a card, or, with `value={false}`, as out of one: a modal opened from a card. */
export function InCard({
  value = true,
  children,
}: {
  value?: boolean;
  children: ReactNode;
}): ReactElement {
  return createElement(CardContext.Provider, { value }, children);
}

/** `true` inside a `Card`. */
export function useInCard(): boolean {
  return useContext(CardContext);
}

/**
 * Whether a card sits directly in a `CardGrid align="regions"`: it is then a subgrid of the cell's
 * three rows. A card resets it to `false` for what it holds, so a nested card keeps its own layout.
 * Internal: not exported from the package.
 */
const RegionsContext = createContext(false);

/** Sets whether the cards in `children` line up their regions with their neighbours'. */
export function InRegions({
  value,
  children,
}: {
  value: boolean;
  children: ReactNode;
}): ReactElement {
  return createElement(RegionsContext.Provider, { value }, children);
}

/** `true` for a card directly in a `CardGrid align="regions"`. */
export function useRegions(): boolean {
  return useContext(RegionsContext);
}
