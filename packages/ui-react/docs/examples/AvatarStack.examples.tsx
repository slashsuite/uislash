import { Avatar, AvatarStack, Cluster } from "@slashsuite/ui-react";

/** With many people, `max` keeps the row short and the "+N" says how many more there are. */
export const DoMax = () => (
  <AvatarStack
    items={[
      { name: "Ada Lovelace" },
      { name: "Grace Hopper" },
      { name: "Linus Torvalds" },
      { name: "Margaret Hamilton" },
      { name: "Dennis Ritchie" },
      { name: "Ken Thompson" },
    ]}
    max={4}
  />
);

/** Avatars side by side are a row of separate marks: they take the width of the whole team and read as a list, not a group. */
export const DontMax = () => (
  <Cluster gap="xs">
    <Avatar name="Ada Lovelace" />
    <Avatar name="Grace Hopper" />
    <Avatar name="Linus Torvalds" />
    <Avatar name="Margaret Hamilton" />
    <Avatar name="Dennis Ritchie" />
    <Avatar name="Ken Thompson" />
  </Cluster>
);
