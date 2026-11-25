/**
 * Writes `ui-react.json`, the data the plugin reads: the components `@slashsuite/ui-react`
 * exports, the palette (`packages/ui-react/palette.json`) and the colour and element tables, read
 * from this checkout through the same code `tools/ui-review` uses, so the two can never list
 * different things. It runs before the tests, before the pack check and in `prepack`, so the
 * tarball always carries the list of the commit it was packed from. The file is not committed.
 */
import { readFileSync, renameSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { componentsOf, paletteOf } from "../../../tools/ui-review/src/context.js";
import {
  INPUT_TYPES,
  NAMED_COLOURS,
  PLAIN_INPUTS,
  RAW_ELEMENTS,
} from "../../../tools/ui-review/src/tables.js";

const repo = resolve(import.meta.dirname, "..", "..", "..");
const read = (path: string) => readFileSync(resolve(repo, path), "utf8");

const data = {
  components: [...componentsOf(read("packages/ui-react/src/index.ts"))].toSorted(),
  palette: Object.fromEntries(paletteOf(read("packages/ui-react/palette.json"))),
  namedColours: NAMED_COLOURS,
  rawElements: RAW_ELEMENTS,
  inputTypes: INPUT_TYPES,
  plainInputs: PLAIN_INPUTS,
};

// Written whole and renamed into place: the tests and the pack check may run at once, and a reader
// must never see a half-written file.
const out = resolve(import.meta.dirname, "..", "ui-react.json");
writeFileSync(`${out}.${process.pid}`, `${JSON.stringify(data)}\n`);
renameSync(`${out}.${process.pid}`, out);
