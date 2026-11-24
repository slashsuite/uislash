import { useState } from "react";
import { Button, Card, CardGrid, Morph, startPageTransition } from "@slashsuite/ui-react";

/** Each card's `item` is its shop's id, so only the pressed card has a partner on the next page and it morphs. */
export const DoUniqueName = () => {
  const [open, setOpen] = useState<string | undefined>(undefined);
  const letters = ["A", "B"];
  return open ? (
    <Morph name="shop-do" item={open}>
      <Card title={`Shop ${open}`} size="lg">
        <Button variant="outline" onClick={() => startPageTransition(() => setOpen(undefined))}>
          Back
        </Button>
      </Card>
    </Morph>
  ) : (
    <CardGrid columns={2}>
      {letters.map((shop) => (
        <Morph key={shop} name="shop-do" item={shop}>
          <Card title={`Shop ${shop}`}>
            <Button variant="outline" onClick={() => startPageTransition(() => setOpen(shop))}>
              Open Shop {shop}
            </Button>
          </Card>
        </Morph>
      ))}
    </CardGrid>
  );
};

/** Every card shares one `item`, so the page holds the same name twice and the browser skips the morph. */
export const DontUniqueName = () => {
  const [open, setOpen] = useState<string | undefined>(undefined);
  const letters = ["A", "B"];
  return open ? (
    <Morph name="shop-dont" item={"shop"}>
      <Card title={`Shop ${open}`} size="lg">
        <Button variant="outline" onClick={() => startPageTransition(() => setOpen(undefined))}>
          Back
        </Button>
      </Card>
    </Morph>
  ) : (
    <CardGrid columns={2}>
      {letters.map((shop) => (
        <Morph key={shop} name="shop-dont" item={"shop"}>
          <Card title={`Shop ${shop}`}>
            <Button variant="outline" onClick={() => startPageTransition(() => setOpen(shop))}>
              Open Shop {shop}
            </Button>
          </Card>
        </Morph>
      ))}
    </CardGrid>
  );
};

/** The change goes through `startPageTransition`, so the browser has the old and the new page to morph between. */
export const DoTransition = () => {
  const [open, setOpen] = useState<string | undefined>(undefined);
  const letters = ["A", "B"];
  return open ? (
    <Morph name="shop-transition-do" item={open}>
      <Card title={`Shop ${open}`} size="lg">
        <Button variant="outline" onClick={() => startPageTransition(() => setOpen(undefined))}>
          Back
        </Button>
      </Card>
    </Morph>
  ) : (
    <CardGrid columns={2}>
      {letters.map((shop) => (
        <Morph key={shop} name="shop-transition-do" item={shop}>
          <Card title={`Shop ${shop}`}>
            <Button variant="outline" onClick={() => startPageTransition(() => setOpen(shop))}>
              Open Shop {shop}
            </Button>
          </Card>
        </Morph>
      ))}
    </CardGrid>
  );
};

/** A plain state change swaps the page at once: there is no transition to morph. */
export const DontTransition = () => {
  const [open, setOpen] = useState<string | undefined>(undefined);
  const letters = ["A", "B"];
  return open ? (
    <Morph name="shop-transition-dont" item={open}>
      <Card title={`Shop ${open}`} size="lg">
        <Button variant="outline" onClick={() => setOpen(undefined)}>
          Back
        </Button>
      </Card>
    </Morph>
  ) : (
    <CardGrid columns={2}>
      {letters.map((shop) => (
        <Morph key={shop} name="shop-transition-dont" item={shop}>
          <Card title={`Shop ${shop}`}>
            <Button variant="outline" onClick={() => setOpen(shop)}>
              Open Shop {shop}
            </Button>
          </Card>
        </Morph>
      ))}
    </CardGrid>
  );
};
