import type { ButtonFixtureItem, StoryFixture } from "@slashsuite/core";
import { Button } from "@slashsuite/ui-react";

/** Each fixture layout's row: the same classes the stories wrote by hand. */
const LAYOUT: Record<StoryFixture<ButtonFixtureItem>["layout"], string> = {
  wrap: "flex flex-wrap gap-2",
  "wrap-center": "flex flex-wrap items-center gap-2",
};

/**
 * A Button story drawn from core's fixture (`@slashsuite/core`'s `buttonFixtures`), the data the
 * native gallery draws the same story from, under the same story id.
 */
export function ButtonFixture({ fixture }: { fixture: StoryFixture<ButtonFixtureItem> }) {
  return (
    <div className={LAYOUT[fixture.layout]}>
      {fixture.items.map(({ label, ...props }, index) => (
        // The fixture is fixed data, so its order is the identity.
        <Button key={index} {...props}>
          {label}
        </Button>
      ))}
    </div>
  );
}
