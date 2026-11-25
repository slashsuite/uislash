import { Audio } from "@slashsuite/ui-react";

/** `label` names the player, since a voice note has no visible title; `children` is the text for a browser that cannot play it. */
export const DoLabel = () => (
  <Audio src="/media/voice-note.ogg" label="Voice note from Anna, 0:14">
    Your browser cannot play audio.
  </Audio>
);

/** A bare `<audio>` has no name, loads the whole file up front and takes whatever size the browser picks. */
export const DontLabel = () => <audio src="/media/voice-note.ogg" controls />;
