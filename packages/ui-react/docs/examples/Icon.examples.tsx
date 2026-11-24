import { Button, Icon } from "@slashsuite/ui-react";

/** A bare `<svg>` goes in an `Icon`, which sizes and tones it, and a Button beside text needs nothing more. */
export const DoIcon = () => (
  <Button variant="outline">
    <Icon>
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 6.5h3l1.5-2h5L14 6.5h3v9H3Z" strokeLinejoin="round" />
        <circle cx="10" cy="11" r="2.75" />
      </svg>
    </Icon>
    Capture
  </Button>
);

/** A bare `<svg>` with its own size and colour is a one-off: each one picks its own size and colour, and none follows the theme's muted text. */
export const DontIcon = () => (
  <Button variant="outline">
    <svg viewBox="0 0 20 20" fill="none" stroke="#5ec8ff" strokeWidth="1.6" width="18" height="18">
      <path d="M3 6.5h3l1.5-2h5L14 6.5h3v9H3Z" strokeLinejoin="round" />
      <circle cx="10" cy="11" r="2.75" />
    </svg>
    Capture
  </Button>
);
