/**
 * Writes `parity.json`, the box each component must draw at each size, from the token tables:
 * `bun scripts/parity.ts`. The test fails when the committed file is stale.
 */
import { writeFileSync } from "node:fs";
import { parityJson } from "../src/parity.js";

writeFileSync(new URL("../parity.json", import.meta.url), parityJson());
