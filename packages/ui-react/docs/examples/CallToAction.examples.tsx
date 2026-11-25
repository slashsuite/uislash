import { Button, CallToAction, Card, Cluster } from "@slashsuite/ui-react";

/** The page's closing ask: one title, one sentence, a primary action and a quieter one. */
export const DoClose = () => (
  <CallToAction
    overline="Ready when you are"
    title="Start your first review today"
    description="Free for open source, and a minute to set up."
    actions={
      <>
        <Button href="#start">Get started</Button>
        <Button href="#pricing" variant="outline">
          See pricing
        </Button>
      </>
    }
  />
);

/** A Card with buttons in it reads as one more feature, not the page's closing ask. */
export const DontClose = () => (
  <Card title="Start your first review today">
    <Cluster>
      <Button href="#start">Get started</Button>
    </Cluster>
  </Card>
);
