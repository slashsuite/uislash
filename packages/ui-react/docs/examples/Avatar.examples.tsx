import { Avatar, Cluster, Text } from "@slashsuite/ui-react";

/** Give the person's full name every time: the same name gets the same colour and initials in every list and header. */
export const DoIdentity = () => (
  <Cluster>
    <Avatar name="Ada Lovelace" />
    <Avatar name="Ada Lovelace" size="lg" />
    <Avatar name="Grace Hopper" />
  </Cluster>
);

/** The colour comes from the name, so "Ada" in one place and "A. Lovelace" in another read as two different people. */
export const DontIdentity = () => (
  <Cluster>
    <Avatar name="Ada" />
    <Avatar name="A. Lovelace" />
  </Cluster>
);

/** The initials are hidden from a screen reader, so the person's name sits beside the Avatar as text. */
export const DoBeside = () => (
  <Cluster>
    <Avatar name="Ada Lovelace" />
    <Text strong>Ada Lovelace</Text>
  </Cluster>
);

/** An initials Avatar on its own is `aria-hidden`: it names no one to a screen reader. Put the name beside it. */
export const DontBeside = () => <Avatar name="Ada Lovelace" />;
