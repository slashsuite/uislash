import { Button, CopyButton } from "@slashsuite/ui-react";

/** `CopyButton` writes `text` to the clipboard and swaps its label to `copiedLabel`. */
export const DoClipboard = () => (
  <CopyButton text="hc_live_9f2c41" label="Copy token" copiedLabel="Token copied" />
);

/** A hand-rolled copy Button gives no feedback and does not survive a refused clipboard. */
export const DontClipboard = () => (
  <Button
    variant="ghost"
    size="sm"
    onClick={() => {
      void navigator.clipboard.writeText("hc_live_9f2c41");
    }}
  >
    Copy token
  </Button>
);
