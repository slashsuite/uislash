import {
  AppShell,
  Button,
  CenteredLayout,
  Field,
  FormLayout,
  Input,
  Tabs,
} from "@slashsuite/ui-react";

/** A whole sign-in page: the shell with its brand and nav, then one narrow card, centred. */
export const FullPage = () => (
  <AppShell
    brand={<a href="#">Hack Cove</a>}
    nav={
      <Tabs
        label="Main"
        items={[
          { label: "Quotes", href: "#quotes", selected: true },
          { label: "Clients", href: "#clients" },
        ]}
      />
    }
  >
    <CenteredLayout title="Sign in" description="Use your Hack Cove account.">
      <Field label="Email" htmlFor="full-page-email">
        <Input id="full-page-email" type="email" placeholder="you@example.com" />
      </Field>
      <Button>Continue</Button>
    </CenteredLayout>
  </AppShell>
);

/** Sign-in, landing, not-found and error pages are one narrow card, centred. */
export const DoPage = () => (
  <CenteredLayout title="Sign in" description="Use your Hack Cove account.">
    <Field label="Email" htmlFor="do-page-email">
      <Input id="do-page-email" type="email" placeholder="you@example.com" />
    </Field>
    <Button>Continue</Button>
  </CenteredLayout>
);

/** `FormLayout` is for a form inside the app: its wide column hangs off the left edge, which is wrong for a sign-in. Use `CenteredLayout`. */
export const DontPage = () => (
  <FormLayout
    title="Sign in"
    description="Use your Hack Cove account."
    actions={<Button type="submit">Continue</Button>}
  >
    <Field label="Email" htmlFor="dont-page-email">
      <Input id="dont-page-email" type="email" placeholder="you@example.com" />
    </Field>
  </FormLayout>
);
