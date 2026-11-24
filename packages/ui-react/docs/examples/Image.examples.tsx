import { Image } from "@slashsuite/ui-react";
import { sampleCode } from "./sampleCode.js";

/** A picture that must be seen whole, such as a QR code or a logo, is `fit="contain"`. */
export const DoFit = () => (
  <Image src={sampleCode} alt="Pairing code" aspect="3:4" width="md" fit="contain" />
);

/** `cover` crops to the shape: it cuts the corners off a code, which then cannot be scanned. */
export const DontFit = () => (
  <Image src={sampleCode} alt="Pairing code" aspect="16:9" width="md" fit="cover" />
);
