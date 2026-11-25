/**
 * F4: links on native. An external address opens in the system (`Linking.openURL`); any other goes
 * to the app's router, which the app hands in once with `LinkProvider`. A link is `inline` (text in
 * running text) or `block` (a box that is the link, such as a card).
 */
import { createContext, type ReactElement, type ReactNode, useContext } from "react";
import { Linking } from "react-native";

export type Navigate = (href: string) => void;
const LinkContext = createContext<Navigate | null>(null);

/** Hands the app's router to every link inside. */
export function LinkProvider({
  navigate,
  children,
}: {
  navigate: Navigate;
  children?: ReactNode;
}): ReactElement {
  return <LinkContext.Provider value={navigate}>{children}</LinkContext.Provider>;
}

/** Whether `href` leaves the app: a scheme such as `https:` or `mailto:`. */
export const isExternal = (href: string): boolean => /^[a-z][a-z\d+.-]*:/i.test(href);

/** Follows `href`: the system for an external one, else `navigate`; throws when an internal one has no router. */
export function follow(href: string, navigate: Navigate | null): void {
  if (isExternal(href)) {
    void Linking.openURL(href);
    return;
  }
  if (navigate === null) throw new Error(`follow: no LinkProvider for the internal link "${href}"`);
  navigate(href);
}

/** A function that follows `href` from here, for a press handler. */
export function useFollow(): (href: string) => void {
  const navigate = useContext(LinkContext);
  return (href) => follow(href, navigate);
}

export type LinkKind = "inline" | "block";

/**
 * What a link of `kind` renders as: an inline link is a nested Text (so it wraps with the sentence
 * around it), a block link a Pressable holding its content.
 */
export function linkHost(kind: LinkKind): "text" | "pressable" {
  return kind === "inline" ? "text" : "pressable";
}
