## Menu

Group: Actions

When to use: A row, card or header with more actions than fit: put the one main action in view and the rest in a Menu.

### The one right way
A row's secondary actions in one `Menu`, beside its one visible action.
```tsx
import { Button, Card, ListRow, Menu } from "@slashsuite/ui-react";

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
```

### Do
- Keep the one main action in view as a `Button` and put the rest in one `Menu` beside it; a row of several icon buttons is a `Menu`.
- `items` is data: each a `label` with `onSelect`, or a link with `href` (through the app's `LinkProvider`; `external` opens a new tab). `icon` adds a leading glyph from the `Icon` set and `disabled` dims one.
- A destructive item is `tone="danger"` and goes last, so it is never the first thing the arrows reach.
- The default trigger is a ghost three-dot button named by `label`; `trigger="button"` is an outline button reading `label`, for a menu whose name is worth a word ("Export"). `size="sm"` inside a row or a card header.
- In a `ListRow` with `revealOnHover`, the row keeps its actions shown while the menu is open.

### Don't
- Never put the only action of a row in a `Menu`: one action is a `Button` or an `IconButton`.
- Do not hide a reason in the menu: an item that cannot be chosen says why in its label or on the page.

Four ghost buttons in a row crowd it, and every one of them is a tab stop.
```tsx
import { Card, IconButton, ListRow } from "@slashsuite/ui-react";

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
```

A red item first is the one a quick Enter chooses.
```tsx
import { Menu } from "@slashsuite/ui-react";

<Menu
  label="More actions"
  defaultOpen
  items={[
    { label: "Hide chat", tone: "danger", onSelect: () => undefined },
    { label: "Favourite", icon: "plus", onSelect: () => undefined },
    { label: "Settings", icon: "settings", onSelect: () => undefined },
  ]}
/>
```

### Accessibility
- The trigger is a button with `aria-haspopup` and `aria-expanded`, named by `label`; the menu takes the same name.
- Enter, Space or ArrowDown open it on the first item, ArrowUp on the last; the arrows, Home, End and a typed letter move; Enter chooses; Escape closes it, and focus goes back to the trigger.
- A link item is a real link with `role="menuitem"`; a disabled item is skipped by the arrows.
- Inside a `Dialog` the menu opens in the dialog, so it is not inert, and Escape closes only the menu.

### Props
### Menu
A button that opens a short list of actions: the overflow menu at the end of a row, a card header or a page header. Keep the one main action in view beside it and put the rest here, the `danger` one last. `items` are data: each a `label` with `onSelect`, or a link with `href` (`external` for a new tab), an optional leading `icon`, `tone="danger"` and `disabled`. `trigger="icon"` (the default) is a ghost three-dot button named by `label`; `trigger="button"` is an outline button reading `label`. The menu opens below the trigger, aligned to its end, and flips when there is no room. The keyboard is the menu button pattern: Enter, Space or ArrowDown open it on the first item, ArrowUp on the last; the arrows, Home, End and a letter move; Enter chooses; Escape closes, and focus goes back to the trigger. `data-*` and `aria-*` land on the trigger.
- defaultOpen: boolean (default false). Opens on mount, for a story or a test that shows the open menu.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- items: readonly [MenuAction, ...MenuAction[]] (required). The actions, in order.
- label: string (required). The trigger's accessible name and the menu's. With `trigger="button"` it is the visible text.
- size: "sm" | "md" | "lg" (default md). The trigger's height, the same steps as `IconButton` and `Button`: `sm` inside a row or a card
header. The menu's own text does not change with it.
- trigger: "button" | "icon" (default icon). `icon` is a ghost square button holding three dots, the overflow menu; `button` is an outline
`Button` with `label` as its text and a chevron after it, for a menu whose name is worth a word.

### Types
- MenuAction: `{ label: string; icon?: IconName | undefined; tone?: IconButtonTone | undefined; disabled?: boolean | undefined; } & ({ onSelect: () => void; href?: undefined; external?: undefined; } | { onSelect?: undefined; href: string; external?: boolean | undefined; })`. One entry of a `Menu`: an action that runs `onSelect`, or a link to `href`. Never both.
