import { Prose } from "@slashsuite/ui-react";
import { ProseDoc } from "./ProseDoc.js";

/** A docs page or an article wraps its body in `Prose`: body 16, the h4 at body size in semibold, the h3 at 20 and the h2 at 24. */
export const DoDocs = () => (
  <Prose>
    <ProseDoc />
  </Prose>
);

/** Without `Prose` the same page has the dense app sizes: the h2 and the h3 are one size, only 2px above the body. */
export const DontDocs = () => <ProseDoc />;
