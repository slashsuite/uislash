import { type ReactNode, useState } from "react";
import { BottomSheet, ListRow, Pill, SectionHeading, Stack } from "@slashsuite/ui-react";

/** The docs and Storybook show every example of this file in it. A stand-in for a full-screen view: the sheet's positioned parent. */
export const Frame = ({ children }: { children: ReactNode }) => (
  <div className="relative h-96 overflow-hidden bg-slate-100">{children}</div>
);

/** The heading and the count go in `header`: they stay put while the list scrolls under them. */
export const DoHeader = () => {
  const [snap, setSnap] = useState(1);
  return (
    <BottomSheet
      label="Shops"
      snaps={[0.3, 0.75]}
      snap={snap}
      onSnapChange={setSnap}
      header={
        <>
          <SectionHeading>Shops nearby</SectionHeading>
          <Pill>12</Pill>
        </>
      }
    >
      <Stack divided>
        {Array.from({ length: 12 }, (_, i) => (
          <ListRow key={i} trailing={`${i + 2}00 m`}>
            Shop {i + 1}
          </ListRow>
        ))}
      </Stack>
    </BottomSheet>
  );
};

/** Do not put the heading first in the body: it scrolls away with the list. */
export const DontHeader = () => {
  const [snap, setSnap] = useState(1);
  return (
    <BottomSheet label="Shops" snaps={[0.3, 0.75]} snap={snap} onSnapChange={setSnap}>
      <SectionHeading>Shops nearby</SectionHeading>
      <Stack divided>
        {Array.from({ length: 12 }, (_, i) => (
          <ListRow key={i} trailing={`${i + 2}00 m`}>
            Shop {i + 1}
          </ListRow>
        ))}
      </Stack>
    </BottomSheet>
  );
};
