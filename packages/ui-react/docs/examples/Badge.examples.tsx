import { Badge, Cluster, IconButton, Pill } from "@slashsuite/ui-react";

/** `count` on an `IconButton` pins the count to the corner and adds it to the button's name ("Alerts, 3"). */
export const DoOnIcon = () => <IconButton label="Alerts" count={3} icon="bell" />;

/** A Pill beside the button is not pinned to it and a screen reader never hears it as part of the button. Use `count`. */
export const DontOnIcon = () => (
  <Cluster>
    <IconButton label="Alerts" icon="bell" />
    <Pill tone="danger" round>
      3
    </Pill>
  </Cluster>
);

/** On its own a Badge is a count; above 99 it reads `99+`. */
export const DoCount = () => (
  <Cluster>
    <Badge count={7} />
    <Badge count={120} />
  </Cluster>
);

/** A count is not a `Pill`: a Pill is a status label, and it prints `120` where a Badge caps at `99+`. */
export const DontCount = () => (
  <Cluster>
    <Pill>7</Pill>
    <Pill>120</Pill>
  </Cluster>
);
