import { describe, expect, it } from "vitest";
import { buttonSizeTables } from "./Button.js";
import { controlSizeTables } from "./control.js";
import { fieldSizeTables } from "./DateField.js";
import { pickerSizeTables } from "./DateFieldCalendar.js";
import { controlText, controlTextTables, fieldTypeTable } from "./density.js";
import { iconSizeTables } from "./Icon.js";
import { iconButtonSizeTables } from "./IconButton.js";
import { shellSizeTables } from "./InputShell.js";
import { searchSizeTables } from "./SearchInput.js";
import { segmentSizeTables } from "./SegmentedControl.js";
import { type Size, sizeClass } from "./size.js";

const SIZES: Size[] = ["sm", "md", "lg"];

/** Each class of a table entry with `md:` in front: what its twin must hold, written out in full. */
function prefixed(entry: string): string {
  return entry
    .split(" ")
    .map((part) => `md:${part}`)
    .join(" ");
}

const pairs: Array<[string, Record<Size, string>, Record<Size, string>]> = [
  ["Button padding", buttonSizeTables.box, buttonSizeTables.boxMd],
  ["IconButton size", iconButtonSizeTables.size, iconButtonSizeTables.sizeMd],
  ["SegmentedControl padding", segmentSizeTables.size, segmentSizeTables.sizeMd],
  ["Icon box", iconSizeTables.box, iconSizeTables.boxMd],
  ["control text", controlTextTables.text.default, controlTextTables.textMd.default],
  ["compact control text", controlTextTables.text.compact, controlTextTables.textMd.compact],
  ["control leading", controlTextTables.leading, controlTextTables.leadingMd],
  ["control vertical padding", controlSizeTables.padY, controlSizeTables.padYMd],
  ["control horizontal padding", controlSizeTables.padX, controlSizeTables.padXMd],
  ["control icon gutter", controlSizeTables.padIcon, controlSizeTables.padIconMd],
  ["control height", controlSizeTables.height, controlSizeTables.heightMd],
  ["input icon", shellSizeTables.icon, shellSizeTables.iconMd],
  ["input prefix", shellSizeTables.prefix, shellSizeTables.prefixMd],
  ["search padding", searchSizeTables.pad, searchSizeTables.padMd],
  ["search padding with an icon", searchSizeTables.padIcon, searchSizeTables.padIconMd],
  ["search clear button", searchSizeTables.clearBox, searchSizeTables.clearBoxMd],
  ["search clear icon", searchSizeTables.clearIcon, searchSizeTables.clearIconMd],
  ["date field padding", fieldSizeTables.pad, fieldSizeTables.padMd],
  ["date picker frame", pickerSizeTables.frame, pickerSizeTables.frameMd],
  ["date picker button", pickerSizeTables.button, pickerSizeTables.buttonMd],
];

describe("the md: twin of each size table", () => {
  it.each(pairs)("%s: every entry is the base entry with md: on each class", (_n, base, twin) => {
    for (const size of SIZES) expect(twin[size]).toBe(prefixed(base[size]));
  });
});

describe("sizeClass", () => {
  const [, base, twin] = pairs[0]!;
  it("returns the table entry unchanged for a plain size", () => {
    for (const size of SIZES) expect(sizeClass(base, twin, size)).toBe(base[size]);
  });

  it("joins the base entry and the twin's md entry for a responsive size", () => {
    expect(sizeClass(base, twin, { base: "md", md: "lg" })).toBe(`${base.md} ${twin.lg}`);
  });
});

describe("controlText's touch floor", () => {
  const FLOOR = "pointer-coarse:text-base";

  it("holds a typed-in field at 16px on touch when its md size is smaller", () => {
    expect(controlText({ base: "lg", md: "sm" }, undefined, true)).toContain(FLOOR);
  });

  it("holds when the base size is smaller", () => {
    expect(controlText({ base: "sm", md: "lg" }, undefined, true)).toContain(FLOOR);
  });

  it("is left out when both sizes are 16px or more", () => {
    expect(controlText({ base: "md", md: "lg" }, undefined, true)).not.toContain(FLOOR);
  });

  it("is left out of a control nobody types in", () => {
    expect(controlText({ base: "sm", md: "sm" }, undefined, false)).not.toContain(FLOOR);
  });
});

describe("field words", () => {
  it.each(["default", "compact"] as const)(
    "at the %s step, a label is the type of a md control and a note of a sm one",
    (step) => {
      expect(fieldTypeTable[step].label).toBe(controlTextTables.text[step].md);
      expect(fieldTypeTable[step].note).toBe(controlTextTables.text[step].sm);
    },
  );
});
