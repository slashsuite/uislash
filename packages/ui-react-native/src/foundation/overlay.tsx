/**
 * F5: overlays on native. A dialog, a sheet or a menu opens in a transparent `Modal` over a scrim in
 * the theme's colour (`states.scrim`), closes on the system's back (`onRequestClose`), and a part
 * inside closes it with `useOverlay().close()`. Motion (reanimated) and a dragged sheet wait on a
 * dependency decision; this is the host they will sit in.
 */
import { createContext, type ReactElement, type ReactNode, useContext } from "react";
import { Modal, Pressable, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider.js";

/** The utility a theme remaps for the scrim behind an overlay. */
export const SCRIM_UTILITY = "bg-slate-900/35";
const FALLBACK_SCRIM = "rgba(0, 0, 0, 0.35)";

type OverlayApi = { close: () => void };
const OverlayContext = createContext<OverlayApi | null>(null);

/** The overlay this part sits in; throws outside one. */
export function useOverlay(): OverlayApi {
  const api = useContext(OverlayContext);
  if (api === null) throw new Error("useOverlay: render inside an Overlay");
  return api;
}

/** The scrim colour of a theme: its `backdrop:` remap, else a plain dark wash. */
export function scrimColour(scrim: Record<string, { backgroundColor?: string | number }>): string {
  return String(scrim[SCRIM_UTILITY]?.backgroundColor ?? FALLBACK_SCRIM);
}

export type OverlayProps = {
  open: boolean;
  onClose: () => void;
  /** A label for the scrim, which closes the overlay when pressed. */
  closeLabel: string;
  children?: ReactNode;
};

/** A transparent Modal over the theme's scrim; pressing the scrim or the system's back closes it. */
export function Overlay({ open, onClose, closeLabel, children }: OverlayProps): ReactElement {
  const theme = useTheme();
  return (
    <Modal visible={open} transparent onRequestClose={onClose} animationType="none">
      <OverlayContext.Provider value={{ close: onClose }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={closeLabel}
          onPress={onClose}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: scrimColour(theme.states.scrim),
          }}
        />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          pointerEvents="box-none"
        >
          {children}
        </View>
      </OverlayContext.Provider>
    </Modal>
  );
}
