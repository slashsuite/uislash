import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  DateRangePicker,
  type DateRange,
  type DateRangePreset,
  Dialog,
  fromISODate,
} from "@slashsuite/ui-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import * as examples from "../../../packages/ui-react/docs/examples/DateRangePicker.examples.js";

/**
 * The calendar popover portals to <body>, outside the toolbar's theme frame. An app puts its theme's
 * scope class on <html>, so do the same here while a calendar story is mounted.
 */
function HtmlScope({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const classes = [...(ref.current?.closest("[data-theme]")?.classList ?? [])];
    document.documentElement.classList.add(...classes);
    return () => document.documentElement.classList.remove(...classes);
  });
  return <div ref={ref}>{children}</div>;
}

const meta: Meta = {
  title: "Forms/DateRangePicker",
  decorators: [
    (Story) => (
      <HtmlScope>
        <examples.Frame>
          <Story />
        </examples.Frame>
      </HtmlScope>
    ),
  ],
};
export default meta;
type S = StoryObj;

function range(start: string, end: string): DateRange {
  const [from, to] = [fromISODate(start), fromISODate(end)];
  if (!from || !to) throw new Error(`not a range: ${start} to ${end}`);
  return { start: from, end: to };
}

const october = range("2026-10-01", "2026-10-31");

/**
 * What an app builds from its own today. A story passes a fixed day so nothing here depends on the
 * clock; an app passes `today(getLocalTimeZone())`.
 */
function lastDays(today: DateRange["end"]): DateRangePreset[] {
  return [7, 30, 90].map((days) => ({
    label: `Last ${days} days`,
    value: { start: today.subtract({ days: days - 1 }), end: today },
  }));
}

const octoberPresets = lastDays(october.end);

/**
 * Type into the `index`th segment the way a browser does: one `beforeinput` per character, a
 * microtask apart so React renders between keystrokes.
 */
async function typeDigits(canvasElement: HTMLElement, index: number, digits: string) {
  canvasElement.querySelectorAll<HTMLElement>('[role="spinbutton"]')[index]?.focus();
  for (const data of digits) {
    await new Promise<void>((resolve) => queueMicrotask(resolve));
    document.activeElement?.dispatchEvent(
      new InputEvent("beforeinput", {
        data,
        inputType: "insertText",
        bubbles: true,
        cancelable: true,
      }),
    );
  }
}

export const Default: S = {
  render: () => <DateRangePicker label="Report period" defaultValue={october} />,
};

/** The calendar open: the two ends filled, the days between them a light band. */
export const Open: S = {
  render: () => (
    <div className="min-h-112">
      <DateRangePicker label="Report period" defaultValue={october} defaultOpen />
    </div>
  ),
};

/** The app's ready-made ranges above the month, built from a fixed day here. */
export const WithPresets: S = {
  render: () => (
    <div className="min-h-128">
      <DateRangePicker
        label="Report period"
        defaultValue={october}
        presets={octoberPresets}
        defaultOpen
      />
    </div>
  ),
};

/** 31/02/2026 does not exist: after focus leaves, the end keeps the typed day, with the message. */
export const Impossible: S = {
  render: () => (
    <DateRangePicker
      label="Report period"
      locale="en-GB"
      defaultValue={range("2026-02-01", "2026-02-28")}
    />
  ),
  play: async ({ canvasElement }) => {
    await typeDigits(canvasElement, 3, "31");
    await new Promise<void>((resolve) => queueMicrotask(resolve));
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  },
};

/** An `error` from outside, a server's say: shown in place of the hint, and the range is invalid. */
export const ExternalError: S = {
  render: () => (
    <DateRangePicker
      label="Report period"
      hint="Up to one quarter."
      defaultValue={october}
      error="Reports run for 2026 only."
    />
  ),
};

/** `minValue` and `maxValue` bound the range: an end typed past `maxValue` is invalid once focus leaves, with the message. */
export const OutOfRange: S = {
  render: () => (
    <DateRangePicker
      label="Report period"
      locale="en-GB"
      minValue={fromISODate("2026-01-01") ?? undefined}
      maxValue={fromISODate("2026-10-15") ?? undefined}
      defaultValue={october}
    />
  ),
  play: async ({ canvasElement }) => {
    await typeDigits(canvasElement, 3, "31");
    await new Promise<void>((resolve) => queueMicrotask(resolve));
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  },
};

export const Disabled: S = {
  render: () => <DateRangePicker label="Report period" defaultValue={october} disabled />,
};

/** `sm`, `md` (the default) and `lg`, on the scale of a `DateField`. */
export const Sizes: S = {
  render: () => (
    <>
      {(["sm", "md", "lg"] as const).map((size) => (
        <DateRangePicker
          key={size}
          label={`Report period, ${size}`}
          size={size}
          defaultValue={october}
        />
      ))}
    </>
  ),
};

/** Open when the story loads; the button opens it again. */
function Opened({ children }: { children: (close: () => void) => ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="p-6">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open
      </Button>
      {open && children(() => setOpen(false))}
    </div>
  );
}

/** A range picker in a modal Dialog: the calendar must still open above it and pick a range. */
export const InDialog: S = {
  render: () => (
    <Opened>
      {(close) => (
        <Dialog title="Filter the timeline" onClose={close}>
          <DateRangePicker label="Period" defaultValue={october} />
        </Dialog>
      )}
    </Opened>
  ),
};

export const DoPresets: S = {
  render: examples.DoPresets,
};

export const DontPresets: S = {
  render: examples.DontPresets,
};
