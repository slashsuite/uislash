import { Kbd, Text } from "@slashsuite/ui-react";

/** `Kbd` is a key the reader presses: in a sentence, or as the shortcut on a button. */
export const DoKey = () => (
  <Text>
    Press <Kbd>Esc</Kbd> to close this list, or <Kbd>⌘S</Kbd> to save.
  </Text>
);

/** A command is `Code`, not a key. `Kbd` draws a keycap, which says "press this". */
export const DontKey = () => (
  <Text>
    Run <Kbd>bun install</Kbd> to install.
  </Text>
);
