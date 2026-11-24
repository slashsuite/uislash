import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  Avatar,
  Button,
  Caption,
  Card,
  FullBleedLayout,
  ListRow,
  Text,
  Stack,
} from "@slashsuite/ui-react";

const meta: Meta = { title: "Data/ListRow" };
export default meta;
type S = StoryObj;

/** `highlighted` on a `FullBleedLayout` `aside`, a `bg-slate-50` surface: its fill is one step deeper, so it still shows. `selected` is the violet one. */
export const ActiveOnPanel: S = {
  render: () => (
    <FullBleedLayout
      padded
      aside={
        <Stack divided>
          <ListRow size="sm" trailing="2">
            Missing part
          </ListRow>
          <ListRow size="sm" highlighted trailing="1">
            Raw colour
          </ListRow>
          <ListRow size="sm" selected trailing="4">
            Local one-off
          </ListRow>
          <ListRow size="sm" trailing="3">
            Custom spacing
          </ListRow>
        </Stack>
      }
    >
      <Text>The shot under review.</Text>
    </FullBleedLayout>
  ),
};

/**
 * `panel` is content under a row with no `href` or `onClick` that starts where its label does, past `leading`: a row
 * that opens in place. In a `Stack divided` the line above the row
 * covers the panel too.
 */
export const StaticDetail: S = {
  render: function Render() {
    const chats = [
      { name: "Ada Lovelace", last: "The engine is ready for Tuesday." },
      { name: "Grace Hopper", last: "Found the moth." },
      { name: "Linus T", last: "Merged." },
    ];
    const [open, setOpen] = useState<string | null>("Ada Lovelace");
    return (
      <div className="max-w-xl">
        <Card flush>
          <Stack divided>
            {chats.map((chat) => (
              <ListRow
                key={chat.name}
                leading={<Avatar name={chat.name} />}
                trailing="10:42"
                actions={
                  <Button
                    size="sm"
                    variant="outline"
                    aria-expanded={open === chat.name}
                    onClick={() => setOpen(open === chat.name ? null : chat.name)}
                  >
                    {open === chat.name ? "Close" : "Open"}
                  </Button>
                }
                panel={open === chat.name && <Text>Thread with {chat.name} opens here.</Text>}
              >
                <Text as="span" strong>
                  {chat.name}
                </Text>
                <Caption>{chat.last}</Caption>
              </ListRow>
            ))}
          </Stack>
        </Card>
      </div>
    );
  },
};
