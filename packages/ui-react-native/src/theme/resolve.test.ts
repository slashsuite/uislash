import {
  CONTROL_LEADING,
  FOCUS_RING,
  FOCUS_RING_INSET,
  parityManifest,
  spacingPx,
  type ButtonSize,
  type ButtonTone,
  type ButtonVariant,
} from "@slashsuite/core";
import { describe, expect, it } from "vitest";
import { nativeThemes } from "../../test/themes.js";
import { nativeButtonClass } from "../components/Button.js";
import { pick, resolve, staticUtility } from "./resolve.js";

const VARIANTS: ButtonVariant[] = ["primary", "outline", "ghost", "link", "dashed"];
const SIZES: ButtonSize[] = ["sm", "md", "lg"];
const TONES: ButtonTone[] = ["neutral", "positive", "danger"];
const STATES = ["idle", "blocked", "busy"] as const;

describe("resolve", () => {
  it("finds every theme", () => {
    expect(nativeThemes.length).toBeGreaterThan(1);
  });

  it.each(nativeThemes.map((theme) => [theme.id, theme] as const))(
    "places every class of every Button in %s",
    (_, theme) => {
      const looks = VARIANTS.flatMap((variant) =>
        SIZES.flatMap((size) => TONES.map((tone) => ({ variant, size, tone }))),
      );
      for (const look of looks)
        for (const state of STATES)
          expect(() => resolve(nativeButtonClass(look, state), theme)).not.toThrow();
    },
  );

  it.each(nativeThemes.map((theme) => [theme.id, theme] as const))(
    "colours a primary Button from %s's remaps",
    (_, theme) => {
      const resolved = resolve(
        nativeButtonClass({ variant: "primary", size: "md", tone: "neutral" }),
        theme,
      );
      expect(resolved.box.idle.backgroundColor).toBe(
        theme.utilities["bg-violet-600"]?.backgroundColor,
      );
      expect(resolved.text.idle.color).toBe(theme.utilities["text-violet-50"]?.color);
      const pressed = theme.states.pressed["bg-violet-700"] ?? theme.utilities["bg-violet-700"];
      expect(pick(resolved, { pressed: true }).box.backgroundColor).toBe(pressed?.backgroundColor);
      expect(resolved.box.focused.outlineColor).toBeDefined();
    },
  );

  it("draws each size to the parity manifest's height, with no explicit height", () => {
    const theme = nativeThemes[0];
    if (theme === undefined) throw new Error("no theme");
    const manifest = parityManifest().components.Button ?? {};
    for (const size of SIZES) {
      const { box, text } = pick(
        resolve(nativeButtonClass({ variant: "primary", size, tone: "neutral" }), theme),
      );
      expect(box.height).toBeUndefined();
      expect(text.lineHeight).toBe(spacingPx(CONTROL_LEADING[size], "leading"));
      const height =
        Number(text.lineHeight) + 2 * Number(box.paddingVertical) + 2 * Number(box.borderWidth);
      expect(height).toBe(manifest[size]?.height);
    }
  });

  it("drops what the web alone needs and names it", () => {
    const theme = nativeThemes[0];
    if (theme === undefined) throw new Error("no theme");
    const resolved = resolve("transition cursor-pointer rounded-lg", theme);
    expect(resolved.dropped).toEqual(["transition", "cursor-pointer"]);
    expect(resolved.box.idle.borderRadius).toBe(8);
  });

  it("throws on a class it cannot place, so the set stays closed", () => {
    const theme = nativeThemes[0];
    if (theme === undefined) throw new Error("no theme");
    expect(() => resolve("grid-cols-3", theme)).toThrow(/unknown class "grid-cols-3"/);
    expect(() => resolve("group-hover:bg-white", theme)).toThrow(/no native slot/);
  });

  it("takes a tinted surface's colour with `on`", () => {
    const theme = nativeThemes.find((t) => Object.keys(t.within).length > 0);
    if (theme === undefined) return;
    const [surface, utilities] = Object.entries(theme.within)[0] ?? [];
    const [utility, style] = Object.entries(utilities ?? {})[0] ?? [];
    if (surface === undefined || utility === undefined) return;
    expect(
      resolve(utility, theme, { on: surface }).text.idle.color ??
        resolve(utility, theme, { on: surface }).box.idle,
    ).toEqual(style?.color ?? style);
  });

  it("reads Tailwind's fixed scale", () => {
    expect(staticUtility("px-4")).toEqual({ paddingHorizontal: 16 });
    expect(staticUtility("gap-1.5")).toEqual({ gap: 6 });
    expect(staticUtility("min-h-4")).toEqual({ minHeight: 16 });
    expect(staticUtility("text-sm/5")).toEqual({ fontSize: 14, lineHeight: 20 });
    expect(staticUtility("leading-5")).toEqual({ lineHeight: 20 });
    expect(staticUtility("tabular-nums")).toEqual({ fontVariant: "tabular-nums" });
    expect(staticUtility("grid")).toBeNull();
    expect(staticUtility("w-full")).toEqual({ width: "100%" });
  });

  it("resolves both of core's focus rings, the inset one at a negative offset", () => {
    const theme = nativeThemes[0];
    if (theme === undefined) throw new Error("no theme");
    expect(resolve(FOCUS_RING, theme).box.focused.outlineOffset).toBe(2);
    expect(resolve(FOCUS_RING_INSET, theme).box.focused.outlineOffset).toBe(-2);
  });

  it("works tracking out in px from the font size", () => {
    const theme = nativeThemes[0];
    if (theme === undefined) throw new Error("no theme");
    expect(resolve("text-base tracking-wide", theme).text.idle.letterSpacing).toBeCloseTo(0.4);
  });

  it("gives border-current the text colour", () => {
    const theme = nativeThemes[0];
    if (theme === undefined) throw new Error("no theme");
    const resolved = resolve("border border-current text-violet-600", theme);
    expect(resolved.box.idle.borderColor).toBe(theme.utilities["text-violet-600"]?.color);
  });

  it("applies a theme's compound to the disabled slot only", () => {
    const theme = nativeThemes.find((t) => t.compounds.length > 0);
    if (theme === undefined) return;
    const compound = theme.compounds[0];
    if (compound === undefined) return;
    const resolved = resolve(`${compound.utility} ${compound.requiresAny[0] ?? ""}`, theme);
    expect(resolved.box.disabled).toMatchObject(
      Object.fromEntries(Object.entries(compound.style).filter(([key]) => key !== "color")),
    );
  });
});
