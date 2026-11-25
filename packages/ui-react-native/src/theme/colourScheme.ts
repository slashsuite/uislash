/**
 * The colour scheme an app shows: the reader's choice when they made one, else the system's. The
 * choice is kept in a `SchemeStorage` the app passes in (AsyncStorage, MMKV, a file), so this
 * package takes no storage dependency; `memoryStorage` keeps it for the session only.
 */
import { useCallback, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

export type Scheme = "light" | "dark";
/** The reader's choice: a scheme, or `system` to follow the device. */
export type SchemeChoice = Scheme | "system";

/** Where the reader's choice is kept. Both calls may be async. */
export type SchemeStorage = {
  get(): Promise<SchemeChoice | null> | SchemeChoice | null;
  set(choice: SchemeChoice): Promise<void> | void;
};

/** A storage that keeps the choice in memory, for the session. */
export function memoryStorage(initial: SchemeChoice | null = null): SchemeStorage {
  let choice = initial;
  return {
    get: () => choice,
    set: (next) => {
      choice = next;
    },
  };
}

/** The scheme shown for a choice and the system's scheme; the system's unknown reads as light. */
export function schemeFor(choice: SchemeChoice, system: Scheme | null | undefined): Scheme {
  if (choice !== "system") return choice;
  return system === "dark" ? "dark" : "light";
}

export type ColourScheme = {
  scheme: Scheme;
  choice: SchemeChoice;
  setChoice: (choice: SchemeChoice) => void;
};

/** The scheme to show and the reader's choice, kept in `storage`; it follows the system until a choice is read. */
export function useColourScheme(storage: SchemeStorage): ColourScheme {
  const system = useColorScheme();
  const [choice, setLocal] = useState<SchemeChoice>("system");

  useEffect(() => {
    let live = true;
    void Promise.resolve(storage.get()).then((stored) => {
      if (live && stored !== null) setLocal(stored);
    });
    return () => {
      live = false;
    };
  }, [storage]);

  const setChoice = useCallback(
    (next: SchemeChoice) => {
      setLocal(next);
      void Promise.resolve(storage.set(next));
    },
    [storage],
  );

  return { scheme: schemeFor(choice, system), choice, setChoice };
}
