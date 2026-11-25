import { type ReactElement, type ReactNode, useEffect, useId, useRef, useState } from "react";
import { hasReason } from "./blocked.js";
import { cx, focusRing } from "./cx.js";
import { controlText, type TypeStep, useTypeStep } from "./density.js";
import { useScrollEdges } from "./scrollEdges.js";
import type { Size } from "./size.js";
import { type SwitchButton, Switcher, type SwitchLink, type SwitchProps } from "./switcher.js";

/** A button tab; its `panel` is the view it shows, rendered by Tabs under (or beside) the row. */
export type TabButton = SwitchButton & {
  /**
   * The view this tab shows. Tabs renders it as the tab's `tabpanel`, labelled by the tab, and
   * hides it while another tab is current; the browser's find in page still reaches a hidden one
   * and switches to its tab.
   */
  panel?: ReactNode;
};

/** One tab of a Tabs row: a button with a `value`, or a link with an `href`; never both kinds in one row. */
export type Tab = TabButton | SwitchLink;

// Every underline tab is `font-medium`, so choosing one does not widen it and shift the row. The
// focus ring is drawn inside the tab, since the row scrolls and would clip one drawn outside.
const BASE =
  "border-b-2 px-1 py-2 font-medium transition focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-600";
const ON = "border-violet-600 text-violet-700";
const OFF = "border-transparent text-slate-600";
const OFF_LIVE = "hover:text-violet-700";

// The rule under the row; the tab list inside it sits over the rule by a pixel, so the current
// tab's underline covers it.
const UNDERLINE_RULE = "border-b border-slate-200";
// One line that never wraps: a row wider than its box scrolls sideways, with no scrollbar, and
// fades out on the side that has more (a mask, so it follows any theme; it flips right to left).
// While the keyboard's focus is in the row the fade is off, so a focused tab at an edge stays whole.
const UNDERLINE_ROW =
  "-mb-px flex gap-x-4 overflow-x-auto whitespace-nowrap text-sm [scrollbar-width:none] *:shrink-0 [--fade-dir:to_right] rtl:[--fade-dir:to_left] data-more-start:[--fade-start:1.5rem] data-more-end:[--fade-end:1.5rem] data-more:[mask-image:linear-gradient(var(--fade-dir),transparent,#000_var(--fade-start,0px),#000_calc(100%_-_var(--fade-end,0px)),transparent)] data-more:has-focus-visible:[mask-image:none]";

// A transparent border, so a pill is as tall as a `Button` of the same size; the current pill's
// border shows, so it is told apart by its outline as well as its fill.
const PILL = `rounded-lg border transition ${focusRing}`;

/** A pill's padding, by `size`; its text is a control's (`controlText`), so it lines up with a `Button`. */
const PILL_SIZE: Record<Size, string> = {
  sm: "px-2.5 py-1",
  md: "px-3 py-2",
  lg: "px-4 py-2.5",
};

/**
 * The classes of one pill tab at the type `step` in force. Every pill is `font-medium`, so the
 * current one is no wider than it was; it has a fill and an outline. A `disabled` one drops the
 * hover fill.
 */
export function pillTabClass(
  active: boolean,
  disabled = false,
  size: Size = "md",
  step?: TypeStep,
): string {
  return cx(
    PILL,
    PILL_SIZE[size],
    controlText(size, step, false),
    "font-medium",
    active ? "border-slate-300 bg-slate-100 text-slate-900" : "border-transparent text-slate-600",
    !active && !disabled && "hover:bg-slate-100",
  );
}

export type TabsProps = SwitchProps<TabButton> &
  (
    | {
        /**
         * `horizontal` is a row of underline tabs over a bottom rule, one line that scrolls
         * sideways when it is too wide; `vertical` is the pill rail, a column at the rail's width
         * for a `SidebarLayout` aside, where the up and down arrows move between button tabs.
         * @default horizontal
         */
        orientation?: "horizontal";
        /** Only the vertical rail takes a `size`. */
        size?: undefined;
      }
    | {
        orientation: "vertical";
        /**
         * The pills' height and text, on the scale of a `Button`.
         * @default md
         */
        size?: Size;
      }
  );

/**
 * One tab's panel. Hidden while its tab is not current; where the browser has it, hidden
 * `until-found`, so find in page reaches the text and `beforematch` switches to the tab. That is
 * applied after hydration (React renders `hidden` as a boolean), and not for a disabled tab.
 */
function TabPanel({
  id,
  tabId,
  active,
  findable,
  onFound,
  children,
}: {
  id: string;
  tabId: string;
  active: boolean;
  findable: boolean;
  onFound: () => void;
  children: ReactNode;
}): ReactElement {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = panel.current;
    if (!el || active || !findable || !("onbeforematch" in el)) return undefined;
    el.setAttribute("hidden", "until-found");
    el.addEventListener("beforematch", onFound);
    return () => el.removeEventListener("beforematch", onFound);
  }, [active, findable, onFound]);
  return (
    <div
      ref={panel}
      id={id}
      role="tabpanel"
      aria-labelledby={tabId}
      tabIndex={0}
      hidden={!active}
      className="min-w-0 flex-1 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
    >
      {children}
    </div>
  );
}

const hasPanels = (items: Tab[]): items is TabButton[] =>
  items.some((item) => item.href === undefined && item.panel !== undefined);

/** The tab list on its own: the underline row in its rule, or the pill rail. */
function TabList({
  size,
  stacked,
  ids,
  ...props
}: SwitchProps<TabButton> & {
  size: Size;
  stacked: boolean;
  ids: (index: number) => { tab: string; panel: string } | undefined;
}): ReactElement {
  const step = useTypeStep();
  const [row, setRow] = useState<HTMLElement | null>(null);
  useScrollEdges(stacked ? null : row, "x");
  const list = (
    <Switcher
      {...props}
      parts={{
        group: "tablist",
        item: "tab",
        vertical: stacked,
        stacked,
        root: stacked ? "flex flex-col gap-1" : UNDERLINE_ROW,
        onRoot: setRow,
        ids,
        option: (active, disabled) =>
          stacked
            ? pillTabClass(active, disabled, size, step)
            : cx(BASE, active ? ON : OFF, !active && !disabled && OFF_LIVE),
      }}
    />
  );
  return stacked ? list : <div className={UNDERLINE_RULE}>{list}</div>;
}

/**
 * Tabs for switching a view in place or between pages. Across (the default) they are underline
 * tabs: one line over a bottom rule, the current tab underlined in the accent, scrolling sideways
 * with a fade when the row is too wide. `orientation="vertical"` is the pill rail instead, the
 * current tab filled and outlined, for a `SidebarLayout` aside, and takes a `size`. `items` are
 * `{ value, label, panel }` buttons (`value` and `onChange` are the caller's state; the arrow
 * keys, Home and End move between tabs) or links (`href`, an in-app one through `LinkProvider`;
 * `selected` on an item, or `value`, marks the current one, which gets `aria-current`). A button's
 * `panel` is rendered as its `tabpanel`, wired to the tab and hidden while another is current. An
 * item may carry a `count`, and a button one `disabledReason` (it stays reachable by the arrows and
 * its reason is a tooltip) or a bare `disabled`; `disabled` on the row disables every tab. `label`
 * names the tab list.
 */
export function Tabs({
  size = "md",
  orientation = "horizontal",
  ...props
}: TabsProps): ReactElement {
  const stacked = orientation === "vertical";
  const base = useId();
  const items: Tab[] = props.items;
  const panels = hasPanels(items) ? items : undefined;
  const ids = (index: number) =>
    panels?.[index]?.panel === undefined
      ? undefined
      : { tab: `${base}-tab-${index}`, panel: `${base}-panel-${index}` };
  const list = <TabList {...props} size={size} stacked={stacked} ids={ids} />;
  if (!panels || props.onChange === undefined) return list;
  const { value, onChange, disabled } = props;
  return (
    <div className={stacked ? "flex items-start gap-6" : "flex flex-col gap-4"}>
      {list}
      {panels.map((item, index) => {
        const own = ids(index);
        if (!own) return null;
        return (
          <TabPanel
            key={item.value}
            id={own.panel}
            tabId={own.tab}
            active={item.value === value}
            findable={!(disabled || item.disabled || hasReason(item.disabledReason))}
            onFound={() => onChange(item.value)}
          >
            {item.panel}
          </TabPanel>
        );
      })}
    </div>
  );
}
