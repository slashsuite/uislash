import type { ReactElement } from "react";
import type { Passthrough } from "./props.js";

/** A colour as six hex digits after a `#`, and nothing else: no name, no function, no CSS. */
const HEX = /^#[0-9a-f]{6}$/i;

/**
 * A small square in a measured colour, with its `label` and its hex `value` beside it in mono: a
 * colour read off a page, a screenshot or a theme. The colour is the data on show, not a look, so
 * it is painted from `value`; anything but a `#rrggbb` value draws an empty swatch and no value.
 * A hairline edges the square, so a colour close to the page still shows. The square is
 * decorative: the label and the value say the colour.
 */
export function ColourSwatch({
  value,
  label,
  ...rest
}: {
  /** The colour, as `#rrggbb`. Anything else draws an empty swatch and leaves the value out. */
  value: string;
  /** What the colour is, as "Background" or "Accent", shown before the value. */
  label: string;
} & Passthrough): ReactElement {
  const valid = HEX.test(value);
  return (
    <span {...rest} className="inline-flex min-w-0 items-center gap-2 font-mono text-sm">
      <span
        aria-hidden="true"
        className="size-4 shrink-0 rounded-sm border border-slate-300 bg-slate-100"
        style={valid ? { backgroundColor: value } : undefined}
      />
      <span className="truncate text-slate-900">{label}</span>
      {valid && <span className="text-slate-600">{value.toLowerCase()}</span>}
    </span>
  );
}
