/**
 * The testing rules no published plugin has, loaded by oxlint's `jsPlugins` as `ui-testing`.
 * Plain ESM over the ESTree AST oxlint hands an ESLint-style plugin; `.oxlintrc.json` turns each on
 * for the files it belongs to. Every message names the UI testing rule it enforces, by its number
 * and title in README.md ("The UI testing rules").
 */

import { configShape } from "./rules/config-shape.js";
import { noNodeAccess } from "./rules/no-node-access.js";
import {
  noAdhocScreenshot,
  noRaisedTimeout,
  noSelectorActions,
  noStyleAssertions,
  skipNamesTicket,
  testidNeedsReason,
} from "./rules/specs.js";

export default {
  meta: { name: "ui-testing" },
  rules: {
    "no-selector-actions": noSelectorActions,
    "no-style-assertions": noStyleAssertions,
    "skip-names-ticket": skipNamesTicket,
    "config-shape": configShape,
    "no-node-access": noNodeAccess,
    "no-adhoc-screenshot": noAdhocScreenshot,
    "no-raised-timeout": noRaisedTimeout,
    "testid-needs-reason": testidNeedsReason,
  },
};
