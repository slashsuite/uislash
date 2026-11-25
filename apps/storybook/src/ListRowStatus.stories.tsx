import type { Meta, StoryObj } from "@storybook/react-vite";
import { Caption, Card, ListRow, Pill, Stack, Text } from "@slashsuite/ui-react";
import { samplePhoto } from "./samplePhoto";

const meta: Meta = { title: "Data/ListRow" };
export default meta;
type S = StoryObj;

/** On a phone the thumbnail narrows and the trailing Pill moves under the label, so the label keeps its room. */
export const ThumbnailNarrow: S = {
  render: () => (
    <div className="max-w-[360px]">
      <Card flush>
        <Stack divided>
          {["Dashboard", "Account settings"].map((name) => (
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

/** `stripe` marks a row's status on its leading edge; the row's words say it too. */
export const Stripes: S = {
  render: () => (
    <div className="max-w-md">
      <Card flush>
        <Stack divided>
          <ListRow stripe="danger" href="#412" trailing={<Pill tone="danger">failed</Pill>}>
            Build #412
          </ListRow>
          <ListRow stripe="warn" trailing={<Pill tone="warn">slow</Pill>}>
            Build #411
          </ListRow>
          <ListRow
            stripe="positive"
            onClick={() => undefined}
            trailing={<Pill tone="positive">passed</Pill>}
          >
            Build #410
          </ListRow>
        </Stack>
      </Card>
    </div>
  ),
};
