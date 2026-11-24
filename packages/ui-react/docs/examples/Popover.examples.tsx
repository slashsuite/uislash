import { Button, KeyValue, KeyValueList, Popover } from "@slashsuite/ui-react";

/** A detail beside the thing it explains: the panel holds a few facts and closes on a click away. */
export const DoPopover = () => (
  <Popover label="Build details" icon="more">
    <KeyValueList>
      <KeyValue label="Commit">982a166</KeyValue>
      <KeyValue label="Shots">412</KeyValue>
      <KeyValue label="Took">3 min 12 s</KeyValue>
    </KeyValueList>
  </Popover>
);

/** A list of actions in a Popover: the arrow keys do not move through them and nothing says they are a menu. */
export const DontPopover = () => (
  <Popover label="Actions">
    <Button variant="ghost">Rename</Button>
    <Button variant="ghost">Duplicate</Button>
    <Button variant="ghost" tone="danger">
      Delete
    </Button>
  </Popover>
);
