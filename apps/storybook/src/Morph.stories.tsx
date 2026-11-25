import type { Meta, StoryObj } from "@storybook/react-vite";
import { useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  Button,
  Card,
  CardGrid,
  Morph,
  PageFade,
  refreshMorphs,
  Stack,
  startPageTransition,
  Text,
} from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/Morph.examples.js";

const meta: Meta = { title: "Feedback/Morph" };
export default meta;
type S = StoryObj;

const shops = [
  { id: "a", name: "Shop A", text: "Vintage denim and boots." },
  { id: "b", name: "Shop B", text: "Books, records and old maps." },
  { id: "c", name: "Shop C", text: "Kitchenware and linen." },
];

type Shop = (typeof shops)[number];

/**
 * A grid of shops and one shop's page. The route change stands in as a state change wrapped in
 * `startPageTransition`; a router's own view-transition option does the same job. Only the card
 * pressed has a partner on the next page, so it grows into the detail while the rest of the page
 * fades, and Back shrinks it into its place. Each story on the docs page uses its own `name`, as
 * two on one page with the same pair would skip the morph. The Do and Dont stories repeat their
 * render in full, as a doc snippet must stand alone.
 */
function Shops() {
  const [open, setOpen] = useState<Shop | undefined>(undefined);
  const go = (next: Shop | undefined) => startPageTransition(() => setOpen(next));
  return (
    <PageFade>
      {open ? (
        <Morph name="shop" item={open.id} data-testid="morph-detail">
          <Card
            title={open.name}
            size="lg"
            footer={
              <Button variant="outline" onClick={() => go(undefined)}>
                Back
              </Button>
            }
          >
            <Stack gap="sm">
              <Text>{open.text}</Text>
              <Text tone="muted">Open Tuesday to Saturday, 09:00 to 17:00.</Text>
            </Stack>
          </Card>
        </Morph>
      ) : (
        <CardGrid>
          {shops.map((shop) => (
            <Morph key={shop.id} name="shop" item={shop.id} data-testid={`morph-${shop.id}`}>
              <Card
                title={shop.name}
                footer={
                  <Button variant="outline" onClick={() => go(shop)}>
                    Open {shop.name}
                  </Button>
                }
              >
                <Text tone="muted">{shop.text}</Text>
              </Card>
            </Morph>
          ))}
        </CardGrid>
      )}
    </PageFade>
  );
}

/**
 * Press a shop: its card grows into the shop's page while the rest fades; Back shrinks it back.
 * With `prefers-reduced-motion: reduce`, or in a browser without View Transitions, it just swaps.
 */
export const Default: S = { render: () => <Shops /> };

const longShops = Array.from({ length: 30 }, (_, i) => ({
  id: String(i + 1),
  name: `Market ${i + 1}`,
  text: "Stalls of second-hand goods, open on Saturdays.",
}));

type LongShop = (typeof longShops)[number];

/**
 * Thirty shops in one long grid. Only the cards near the screen carry a transition name, so the
 * browser captures what is visible, not the whole page, before the morph.
 */
function LongShops() {
  const [open, setOpen] = useState<LongShop | undefined>(undefined);
  const go = (next: LongShop | undefined) => startPageTransition(() => setOpen(next));
  return (
    <PageFade data-testid="long-page">
      {open ? (
        <Morph name="long" item={open.id} data-testid="long-detail">
          <Card
            title={open.name}
            size="lg"
            footer={
              <Button variant="outline" onClick={() => go(undefined)}>
                Back
              </Button>
            }
          >
            <Text as="p">{open.text}</Text>
          </Card>
        </Morph>
      ) : (
        <CardGrid>
          {longShops.map((shop) => (
            <Morph key={shop.id} name="long" item={shop.id} data-testid={`long-${shop.id}`}>
              <Card
                title={shop.name}
                footer={
                  <Button variant="outline" onClick={() => go(shop)}>
                    Open {shop.name}
                  </Button>
                }
              >
                <Text tone="muted">{shop.text}</Text>
              </Card>
            </Morph>
          ))}
        </CardGrid>
      )}
    </PageFade>
  );
}

/** A long list of cards: only those near the screen are named, so the transition stays quick. */
export const LongList: S = { render: () => <LongShops /> };

const restoreShops = Array.from({ length: 40 }, (_, i) => ({
  id: String(i + 1),
  name: `Stall ${i + 1}`,
  text: "Second-hand goods, open on Saturdays.",
}));

type RestoreShop = (typeof restoreShops)[number];

// A router's view transition: the update awaits the route, then renders. `after` runs three
// microtasks later, inside the update, as TanStack Router restores scroll on `onRendered`, and calls
// `refreshMorphs` there, as a consumer does.
const routerTransition = (update: () => void, after = () => {}) => {
  const run = async () => {
    await Promise.resolve();
    flushSync(update);
    await Promise.resolve().then().then();
    after();
  };
  if (typeof document.startViewTransition !== "function") void run();
  else document.startViewTransition(run).ready.catch(() => {});
};

/**
 * Forty stalls in their own scroller, and one stall's page. Back remounts the list at the top and
 * restores the scroll to the stall that was opened, as a router does: in the parent's layout effect
 * (`layout`), or a few microtasks after the commit (`async`, as TanStack Router does). That card is
 * far down when it mounts and on screen at capture, so it must be named by then to shrink back.
 */
function RestoreShops({ name, restore }: { name: string; restore: "layout" | "async" }) {
  const [open, setOpen] = useState<RestoreShop | undefined>(undefined);
  const scroller = useRef<HTMLDivElement>(null);
  const saved = useRef(0);
  useLayoutEffect(() => {
    if (restore === "layout" && !open && scroller.current)
      scroller.current.scrollTop = saved.current;
  }, [open, restore]);
  const go = (next: RestoreShop | undefined) => {
    if (next) saved.current = scroller.current?.scrollTop ?? 0;
    const restoreAfter = () => {
      if (!next && scroller.current) scroller.current.scrollTop = saved.current;
      refreshMorphs();
    };
    routerTransition(() => setOpen(next), restore === "async" ? restoreAfter : () => {});
  };
  return (
    <div ref={scroller} className="h-96 overflow-y-auto">
      {open ? (
        <Morph name={name} item={open.id}>
          <Card
            title={open.name}
            size="lg"
            footer={
              <Button variant="outline" onClick={() => go(undefined)}>
                Back
              </Button>
            }
          >
            <Text as="p">{open.text}</Text>
          </Card>
        </Morph>
      ) : (
        <Stack gap="md">
          {restoreShops.map((shop) => (
            <Morph key={shop.id} name={name} item={shop.id} data-testid={`${name}-${shop.id}`}>
              <Card
                title={shop.name}
                footer={
                  <Button variant="outline" onClick={() => go(shop)}>
                    Open {shop.name}
                  </Button>
                }
              >
                <Text tone="muted">{shop.text}</Text>
              </Card>
            </Morph>
          ))}
        </Stack>
      )}
    </div>
  );
}

export const BackRestoresScroll: S = {
  render: () => <RestoreShops name="restore" restore="layout" />,
};

/** Back restores the list's scroll a few microtasks after the commit, as TanStack Router does, and the stall still shrinks into its place. */
export const BackRestoresScrollAsync: S = {
  render: () => <RestoreShops name="restoreasync" restore="async" />,
};

/**
 * The shops as a list, each card a Morph `as="li"` in a `Stack as="ul"`, under a featured copy of
 * Shop A. The featured copy is `active={false}`, so only the listed card grows into the shop's page.
 */
function ListedShops() {
  const [open, setOpen] = useState<Shop | undefined>(undefined);
  const go = (next: Shop | undefined) => startPageTransition(() => setOpen(next));
  const card = (shop: Shop, label: string) => (
    <Card
      title={shop.name}
      footer={
        <Button variant="outline" onClick={() => go(shop)}>
          {label}
        </Button>
      }
    >
      <Text tone="muted">{shop.text}</Text>
    </Card>
  );
  const featured = shops[0];
  return (
    <PageFade>
      {open ? (
        <Morph name="listed" item={open.id}>
          <Card
            title={open.name}
            size="lg"
            footer={
              <Button variant="outline" onClick={() => go(undefined)}>
                Back
              </Button>
            }
          >
            <Text>{open.text}</Text>
          </Card>
        </Morph>
      ) : (
        <Stack gap="md">
          {featured && (
            <Morph name="listed" item={featured.id} active={false}>
              {card(featured, `Open featured ${featured.name}`)}
            </Morph>
          )}
          <Stack as="ul" gap="md" aria-label="Shops">
            {shops.map((shop) => (
              <Morph key={shop.id} name="listed" item={shop.id} as="li">
                {card(shop, `Open ${shop.name}`)}
              </Morph>
            ))}
          </Stack>
        </Stack>
      )}
    </PageFade>
  );
}

/** A list of cards, each a list item, and a featured copy that does not morph. */
export const InAList: S = { render: () => <ListedShops /> };

export const DoUniqueName: S = {
  render: examples.DoUniqueName,
};

export const DontUniqueName: S = {
  render: examples.DontUniqueName,
};

export const DoTransition: S = {
  render: examples.DoTransition,
};

export const DontTransition: S = {
  render: examples.DontTransition,
};
