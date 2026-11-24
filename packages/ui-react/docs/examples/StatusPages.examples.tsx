import { ErrorPage, NotFound } from "@slashsuite/ui-react";

/** A missing page is `NotFound`: the reader needs a way home, and a retry would load the same nothing. */
export const DoPickPage = () => <NotFound />;

/** `ErrorPage` with a retry for a missing page promises that trying again helps, and it does not. */
export const DontPickPage = () => <ErrorPage onRetry={() => {}} />;

/** `detail` is a request id or a short message the reader can quote, and `onRetry` offers another go. */
export const DoErrorDetail = () => (
  <ErrorPage detail="Request 4f2a91 failed: upstream timed out" onRetry={() => {}} />
);

/** A stack trace shows the reader your internals and buries the one line they can act on. */
export const DontErrorDetail = () => (
  <ErrorPage
    detail={
      "TypeError: Cannot read properties of undefined\n  at loadBuild (build.ts:42:9)\n" +
      "  at async handler (route.ts:17:3)"
    }
    onRetry={() => {}}
  />
);
