import { describe, expectTypeOf, it } from "vitest";
import type {
  CategoryTone,
  CellAlign,
  EmptySize,
  HeadingLevel,
  KeyValueAlign,
  SelectItem,
  SwitchButton,
  SwitchLink,
} from "./index.js";

// The types a public prop is written in are public too, so a consumer can name one. These imports
// fail the typecheck if one stops being exported from the package's entry.

describe("public prop types", () => {
  it("exports the value types of public props", () => {
    expectTypeOf<HeadingLevel>().toEqualTypeOf<2 | 3 | 4 | 5 | 6>();
    expectTypeOf<EmptySize>().toEqualTypeOf<"sm" | "md">();
    expectTypeOf<CellAlign>().toEqualTypeOf<"start" | "center" | "end">();
    expectTypeOf<KeyValueAlign>().toEqualTypeOf<"end" | "start">();
    expectTypeOf<CategoryTone>().toEqualTypeOf<
      "cat1" | "cat2" | "cat3" | "cat4" | "cat5" | "cat6" | "cat7" | "cat8"
    >();
  });

  it("exports the item types of public props", () => {
    expectTypeOf<SelectItem>().toHaveProperty("value");
    expectTypeOf<SwitchButton>().toHaveProperty("value");
    expectTypeOf<SwitchLink>().toHaveProperty("href");
  });
});
