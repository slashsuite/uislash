import { type ReactNode, useState } from "react";
import { Button, Callout, Stack, Text, type Toast, ToastRegion } from "@slashsuite/ui-react";

/** The docs and Storybook show every example of this file in it. Room above the region, which is fixed to the bottom of the viewport. */
export const Frame = ({ children }: { children: ReactNode }) => (
  <div className="min-h-80">{children}</div>
);

/** A confirmation is a toast the app adds to the list it holds: it leaves on its own after five seconds. */
export const DoSaved = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  return (
    <>
      <Button
        onClick={() =>
          setToasts((all) => [
            ...all,
            { id: crypto.randomUUID(), tone: "positive", title: "Saved" },
          ])
        }
      >
        Save
      </Button>
      <ToastRegion
        toasts={toasts}
        onDismiss={(id) => setToasts((all) => all.filter((toast) => toast.id !== id))}
      />
    </>
  );
};

/** A save notice pushed into the page flow moves the form under the reader and never leaves. */
export const DontSaved = () => (
  <Stack gap="sm">
    <Callout tone="positive">Details saved</Callout>
    <Text>The form the reader was filling in, now a line lower.</Text>
  </Stack>
);

/** A notice with an action keeps it in `actions`: it stays until the action or Dismiss. */
export const DoAction = () => {
  const [toasts, setToasts] = useState<Toast[]>([
    {
      id: "update",
      tone: "info",
      title: "Update available",
      body: "Reload to get the new version.",
      actions: <Button size="sm">Reload</Button>,
    },
  ]);
  return (
    <ToastRegion
      toasts={toasts}
      onDismiss={(id) => setToasts((all) => all.filter((toast) => toast.id !== id))}
    />
  );
};

/**
 * An action put in `body` is not an action to the region: the toast still leaves after five
 * seconds, taking the button with it before the reader reaches it.
 */
export const DontAction = () => (
  <ToastRegion
    onDismiss={() => undefined}
    toasts={[
      {
        id: "update",
        tone: "info",
        title: "Update available",
        body: <Button size="sm">Reload</Button>,
      },
    ]}
  />
);
