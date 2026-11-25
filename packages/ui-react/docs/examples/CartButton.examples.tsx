import { useState } from "react";
import { CartButton, Drawer, Text } from "@slashsuite/ui-react";

/** The cart opens in a `Drawer`, and the button carries the drawer's state in `aria-expanded`. */
export const DoDrawer = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <CartButton
        count={2}
        total="R800"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="cart"
      />
      {open && (
        <Drawer id="cart" title="Your cart" onClose={() => setOpen(false)}>
          <Text>Two prints, R800.</Text>
        </Drawer>
      )}
    </>
  );
};

/** An icon with a bare number says "2" to a screen reader: two of what, and where? */
export const DontDrawer = () => (
  <button type="button">
    <span aria-hidden="true">🛒</span> 2
  </button>
);
