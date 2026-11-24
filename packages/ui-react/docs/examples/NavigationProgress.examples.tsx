import { useState } from "react";
import {
  Button,
  NavigationProgress,
  PageFade,
  ProgressBar,
  Stack,
  Text,
} from "@slashsuite/ui-react";

/** Pass `loading` from the router's pending state: the bar shows while it is true and is gone when the page has arrived. */
export const DoPending = () => {
  const [pending, setPending] = useState(true);
  return (
    <Stack gap="sm">
      <NavigationProgress loading={pending} />
      <Button variant="outline" onClick={() => setPending(!pending)}>
        {pending ? "The page has arrived" : "Open the store page"}
      </Button>
      <PageFade>
        <Text>{pending ? "Waiting for the next page." : "The current page."}</Text>
      </PageFade>
    </Stack>
  );
};

/** A `ProgressBar` needs a value, and a page load has none to give: a guessed one sits still or lies about how far along it is. */
export const DontPending = () => (
  <Stack gap="sm">
    <ProgressBar value={60} label="Loading page" />
    <Text>Waiting for the next page.</Text>
  </Stack>
);
