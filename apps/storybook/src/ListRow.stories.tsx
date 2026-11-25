import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  Avatar,
  Button,
  Caption,
  Card,
  IconButton,
  ListRow,
  Pill,
  Stack,
  Text,
} from "@slashsuite/ui-react";
import { Collapsible } from "./ListRowCollapsible";
import { samplePhoto } from "./samplePhoto";
import * as examples from "../../../packages/ui-react/docs/examples/ListRow.examples.js";

const meta: Meta = { title: "Data/ListRow" };
export default meta;
type S = StoryObj;

export const Rows: S = {
  render: () => (
    <div className="max-w-md">
      <Card flush>
        <Stack divided>
          <ListRow trailing="R 9 500">Rent</ListRow>
          <ListRow trailing={<Pill tone="warn">due</Pill>}>Insurance</ListRow>
          <ListRow href="#status" trailing="3">
            A link row
          </ListRow>
        </Stack>
      </Card>
    </div>
  ),
};

export const CollapsibleHeader: S = {
  render: () => (
    <div className="max-w-md">
      <Collapsible />
    </div>
  ),
};

/** `size="sm"`: dense padding, for a list that must fit more rows. */
export const Small: S = {
  render: () => (
    <div className="max-w-md">
      <Card size="sm" flush>
        <Stack divided>
          <ListRow size="sm" trailing="R 9 500">
            Rent
          </ListRow>
          <ListRow size="sm" trailing="R 1 850">
            Transport
          </ListRow>
          <ListRow size="sm" href="#status" trailing="3">
            A link row
          </ListRow>
        </Stack>
      </Card>
    </div>
  ),
};

/** A compact bordered list, such as a split's summary: a `Card flush` around plain rows (no `href`, no `onClick`) at `size="sm"` in a `Stack divided`; no hover fill, no click target. */
export const CompactList: S = {
  render: () => (
    <Card flush>
      <Stack divided>
        <ListRow size="sm" trailing="R 1 200">
          Groceries
        </ListRow>
        <ListRow size="sm" trailing="R 640">
          Household
        </ListRow>
      </Stack>
    </Card>
  ),
};

/** `leading` before the label, and `selected` on the row whose detail is open: a violet fill. */
export const LeadingAndSelected: S = {
  render: () => (
    <div className="max-w-md">
      <Card flush>
        <Stack divided>
          <ListRow leading={<Avatar name="Ada Lovelace" size="sm" />} trailing="3 builds">
            Ada Lovelace
          </ListRow>
          <ListRow selected leading={<Avatar name="Grace Hopper" size="sm" />} trailing="1 build">
            Grace Hopper
          </ListRow>
          <ListRow href="#linus" leading={<Avatar name="Linus T" size="sm" />}>
            Linus T
          </ListRow>
        </Stack>
      </Card>
    </div>
  ),
};

/** `focused` marks the row the keyboard cursor is on in a list the app moves through itself (arrow keys): an inset violet ring, apart from `selected`'s fill. */
export const Focused: S = {
  render: () => (
    <div className="max-w-md">
      <Card flush>
        <Stack divided>
          <ListRow trailing="R 9 500">Rent</ListRow>
          <ListRow focused trailing="R 1 850">
            Transport
          </ListRow>
          <ListRow selected focused trailing="R 4 100">
            Groceries
          </ListRow>
        </Stack>
      </Card>
    </div>
  ),
};

/** `leadingWidth="thumbnail"` gives `leading` a fixed 8rem box that sizes its image to it, for a row that shows a screenshot. The label may be a block: a title over a caption. */
export const Thumbnail: S = {
  render: () => (
    <div className="max-w-md">
      <Card flush>
        <Stack divided>
          {["Dashboard", "Settings"].map((name) => (
            <ListRow
              key={name}

              href={`#${name.toLowerCase()}`}
              leadingWidth="thumbnail"
              leading={<img alt="" src={samplePhoto} />}
              trailing={<Pill tone="warn">changed</Pill>}
            >
              <Text>{name}</Text>
              <Caption>0.4% of pixels differ</Caption>
            </ListRow>
          ))}
        </Stack>
      </Card>
    </div>
  ),
};

/** A row with no `href` and no `onClick` is not a button or a link, so it can hold its own buttons. */
export const StaticWithActions: S = {
  render: () => (
    <div className="max-w-md">
      <Card flush>
        <Stack divided>
          <ListRow
            leading={<Avatar name="Ada Lovelace" size="sm" />}
            trailing={<Pill tone="neutral">admin</Pill>}
          >
            Ada Lovelace
          </ListRow>
          <ListRow
            leading={<Avatar name="Grace Hopper" size="sm" />}
            actions={
              <>
                <Button size="sm" variant="outline">
                  Reject
                </Button>
                <Button size="sm">Accept</Button>
              </>
            }
          >
            Grace Hopper
          </ListRow>
          <ListRow
            selected
            leading={<Avatar name="Linus T" size="sm" />}
            trailing="invited"
            actions={<Button size="sm">Resend</Button>}
          >
            Linus T
          </ListRow>
        </Stack>
      </Card>
    </div>
  ),
};

/** A static row's `actions`, after `trailing`: always shown, so a touch, a keyboard and a pointer find them alike. */
export const RowActions: S = {
  render: () => (
    <div className="max-w-md">
      <Card flush>
        <Stack divided>
          {["Rent", "Insurance", "Transport"].map((name) => (
            <ListRow
              key={name}

              trailing="R 1 850"
              actions={<IconButton label={`Remove ${name}`} icon="close" />}
            >
              {name}
            </ListRow>
          ))}
        </Stack>
      </Card>
    </div>
  ),
};

export const DoList: S = {
  render: examples.DoList,
};

export const DontList: S = {
  render: examples.DontList,
};

export const DoRowActions: S = {
  render: examples.DoRowActions,
};

/** `sm`, `md` (the default) and `lg`: the row's padding; the text stays `text-sm`. */
export const Sizes: S = {
  render: () => (
    <div className="max-w-md">
      <Card flush>
        <Stack divided>
          {(["sm", "md", "lg"] as const).map((size) => (
            <ListRow key={size} size={size} trailing="R 9 500">
              Rent, {size}
            </ListRow>
          ))}
        </Stack>
      </Card>
    </div>
  ),
};

/** `highlighted` marks the row a pointer or the keyboard is on, so a list can follow both with one state: here the pointer and Tab move the same mark. */
export const ActiveFollowsPointerAndKeyboard: S = {
  render: function Render() {
    const names = ["Dashboard", "Settings", "Billing"];
    const [active, setActive] = useState<string | undefined>(undefined);
    return (
      <div className="max-w-md">
        <Card flush>
          <Stack divided>
            {names.map((name) => (
              <ListRow
                key={name}
                href={`#${name}`}

                highlighted={active === name}
                onPointerEnter={() => setActive(name)}
                onPointerLeave={() => setActive(undefined)}
                onFocus={() => setActive(name)}
                trailing={active === name ? "Open" : undefined}
              >
                {name}
              </ListRow>
            ))}
          </Stack>
        </Card>
      </div>
    );
  },
};

/** `secondary` is a muted second line under the label, like `TableCell`'s. */
export const Secondary: S = {
  render: () => (
    <div className="max-w-sm">
      <Card flush>
        <Stack divided>
          <ListRow trailing="R 9 500" secondary="Due 1 December">
            Rent
          </ListRow>
          <ListRow trailing="R 1 850" secondary="Debit order, FNB">
            Transport
          </ListRow>
          <ListRow href="#insurance" trailing="R 640" secondary="Renews in March">
            Insurance
          </ListRow>
        </Stack>
      </Card>
    </div>
  ),
};
