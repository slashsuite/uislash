import type { ReactNode } from "react";
import { Button, Card, IconButton, ListRow, Menu } from "@slashsuite/ui-react";

/** The docs and Storybook show every example of this file in it. Room under the trigger for the open menu, which is laid over the page. */
export const Frame = ({ children }: { children: ReactNode }) => (
  <div className="min-h-72 max-w-md">{children}</div>
);

/** A row's secondary actions in one `Menu`, beside its one visible action. */
export const DoOverflow = () => (
  <Card flush>
    <ListRow
      size="sm"
      actions={
        <>
          <Button size="sm" variant="outline">
            Reply
          </Button>
          <Menu
            size="sm"
            label="More actions"
            items={[
              { label: "Favourite", icon: "plus", onSelect: () => undefined },
              { label: "Settings", icon: "settings", onSelect: () => undefined },
              { label: "Hide chat", tone: "danger", onSelect: () => undefined },
            ]}
          />
        </>
      }
    >
      Ada Lovelace
    </ListRow>
  </Card>
);

/** Four ghost buttons in a row crowd it, and every one of them is a tab stop. */
export const DontOverflow = () => (
  <Card flush>
    <ListRow
      size="sm"
      actions={
        <>
          <IconButton size="sm" variant="ghost" label="Reply" icon="chevron-right" />
          <IconButton size="sm" variant="ghost" label="Favourite" icon="plus" />
          <IconButton size="sm" variant="ghost" label="Settings" icon="settings" />
          <IconButton size="sm" variant="ghost" tone="danger" label="Hide chat" icon="close" />
        </>
      }
    >
      Ada Lovelace
    </ListRow>
  </Card>
);

/** The destructive item is last and `tone="danger"`, so the arrows never land on it first. */
export const DoDestructive = () => (
  <Menu
    label="More actions"
    defaultOpen
    items={[
      { label: "Favourite", icon: "plus", onSelect: () => undefined },
      { label: "Settings", icon: "settings", onSelect: () => undefined },
      { label: "Hide chat", tone: "danger", onSelect: () => undefined },
    ]}
  />
);

/** A red item first is the one a quick Enter chooses. */
export const DontDestructive = () => (
  <Menu
    label="More actions"
    defaultOpen
    items={[
      { label: "Hide chat", tone: "danger", onSelect: () => undefined },
      { label: "Favourite", icon: "plus", onSelect: () => undefined },
      { label: "Settings", icon: "settings", onSelect: () => undefined },
    ]}
  />
);
