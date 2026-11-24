import type { ReactElement } from "react";
import * as ui from "./index.js";

const noop = () => undefined;

/** The overlays' cases of `CASES` (`passthrough.harness.tsx`), each given the probe attributes `a`. */
export function overlayCases(a: Record<string, string>): Record<string, () => ReactElement> {
  return {
    BottomSheet: () => (
      <ui.BottomSheet label="Sheet" snaps={[0.25, 0.5]} snap={0} onSnapChange={noop} {...a} />
    ),
    Dialog: () => <ui.Dialog title="T" onClose={noop} {...a} />,
    Drawer: () => <ui.Drawer title="T" onClose={noop} {...a} />,
    Lightbox: () => (
      <ui.Lightbox label="L" onClose={noop} {...a}>
        x
      </ui.Lightbox>
    ),
    ConfirmDialog: () => (
      <ui.ConfirmDialog
        title="T"
        description="d"
        confirm="c"
        onConfirm={noop}
        onClose={noop}
        {...a}
      />
    ),
    FieldDialog: () => (
      <ui.FieldDialog
        title="T"
        label="L"
        placeholder="p"
        hint="h"
        emptyReason="e"
        submit="s"
        busyLabel="b"
        onSubmit={async () => undefined}
        onClose={noop}
        {...a}
      />
    ),
    Popover: () => (
      <ui.Popover label="L" {...a}>
        p
      </ui.Popover>
    ),
    ToastRegion: () => <ui.ToastRegion toasts={[]} onDismiss={noop} {...a} />,
  };
}
