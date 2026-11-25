/**
 * The parity manifest: the box every renderer must draw for each component and size, in logical px,
 * read from the token tables (never written by hand). `scripts/parity.ts` writes it to
 * `parity.json`; its test fails when the file is stale, so a token change shows up as a diff of
 * the manifest that both renderers are measured against.
 */
import { BUTTON_BOX, BUTTON_SHAPE, type ButtonSize } from "./button.js";
import { CONTROL_LEADING } from "./control.js";

/** Tailwind's spacing step: `p-1` is 0.25rem, 4px at the default root size. */
const SPACING_PX = 4;
/** Tailwind v4's radius scale, in px. */
const RADIUS_PX: Record<string, number> = {
  "rounded-sm": 4,
  "rounded-md": 6,
  "rounded-lg": 8,
  "rounded-xl": 12,
  "rounded-full": 9999,
};

/** The px of the first `<prefix>-<n>` spacing class in `classes`, or 0 when there is none. */
export function spacingPx(classes: string, prefix: string): number {
  const step = new RegExp(`(?:^|\\s)${prefix}-(\\d+(?:\\.\\d+)?)(?=\\s|$)`).exec(classes)?.[1];
  return step === undefined ? 0 : Number(step) * SPACING_PX;
}

/** The px of the radius class in `classes`, or 0 when there is none. */
export function radiusPx(classes: string): number {
  const radius = classes.split(/\s+/).find((name) => name in RADIUS_PX);
  return radius === undefined ? 0 : (RADIUS_PX[radius] ?? 0);
}

/** One size of a component's box, in logical px. */
export type BoxMetrics = {
  height: number;
  paddingX: number;
  paddingY: number;
  gap: number;
  radius: number;
  borderWidth: number;
};

/** The manifest: component, then size, then its box. */
export type ParityManifest = { version: 1; components: Record<string, Record<string, BoxMetrics>> };

function buttonBox(size: ButtonSize): BoxMetrics {
  const box = BUTTON_BOX[size];
  const borderWidth = /(?:^|\s)border(?=\s|$)/.test(BUTTON_SHAPE) ? 1 : 0;
  const paddingY = spacingPx(box, "py");
  return {
    height: spacingPx(CONTROL_LEADING[size], "leading") + 2 * paddingY + 2 * borderWidth,
    paddingX: spacingPx(box, "px"),
    paddingY,
    gap: spacingPx(box, "gap"),
    radius: radiusPx(BUTTON_SHAPE),
    borderWidth,
  };
}

const SIZES: readonly ButtonSize[] = ["sm", "md", "lg"];

/** The manifest from the tables as they are now. */
export function parityManifest(): ParityManifest {
  return {
    version: 1,
    components: {
      Button: Object.fromEntries(SIZES.map((size) => [size, buttonBox(size)])),
    },
  };
}

/** The manifest as the file holds it: two-space JSON with a trailing newline. */
export const parityJson = (): string => `${JSON.stringify(parityManifest(), null, 2)}\n`;
