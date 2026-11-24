import { useState } from "react";
import {
  Button,
  PageFade,
  SegmentedControl,
  Stack,
  startPageTransition,
  Text,
} from "@slashsuite/ui-react";

/** `PageFade` wraps only the content that changes between pages; the frame around it, with the control, stays put. */
export const DoChangingArea = () => {
  const [value, setValue] = useState("overview");
  const items = [
    { value: "overview", label: "Overview" },
    { value: "activity", label: "Activity" },
  ];
  return (
    <Stack gap="sm">
      <SegmentedControl
        label="Page"
        items={items}
        value={value}
        onChange={(next) => startPageTransition(() => setValue(next))}
      />
      <PageFade>
        <Text>The {value} page.</Text>
      </PageFade>
    </Stack>
  );
};

/** Wrapping the frame too makes the control fade with the content, so the page flickers instead of changing in place. */
export const DontChangingArea = () => {
  const [value, setValue] = useState("overview");
  const items = [
    { value: "overview", label: "Overview" },
    { value: "activity", label: "Activity" },
  ];
  return (
    <PageFade>
      <Stack gap="sm">
        <SegmentedControl
          label="Page"
          items={items}
          value={value}
          onChange={(next) => startPageTransition(() => setValue(next))}
        />
        <Text>The {value} page.</Text>
      </Stack>
    </PageFade>
  );
};

/** The change goes through `startPageTransition`, so the browser has the old and the new page to fade between. */
export const DoTransition = () => {
  const [value, setValue] = useState("overview");
  return (
    <Stack gap="sm">
      <Button
        variant="outline"
        onClick={() =>
          startPageTransition(() => setValue(value === "overview" ? "activity" : "overview"))
        }
      >
        Switch page
      </Button>
      <PageFade>
        <Text>The {value} page.</Text>
      </PageFade>
    </Stack>
  );
};

/** A plain state change swaps the content at once: there is no transition to fade. */
export const DontTransition = () => {
  const [value, setValue] = useState("overview");
  return (
    <Stack gap="sm">
      <Button
        variant="outline"
        onClick={() => setValue(value === "overview" ? "activity" : "overview")}
      >
        Switch page
      </Button>
      <PageFade>
        <Text>The {value} page.</Text>
      </PageFade>
    </Stack>
  );
};
