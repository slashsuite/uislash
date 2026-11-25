/** Writes a little-endian number of `bytes` bytes. */
function le(value: number, bytes: number): string {
  let out = "";
  for (let i = 0; i < bytes; i++) out += String.fromCharCode((value >> (8 * i)) & 0xff);
  return out;
}

/** Half a second of silence, 8 kHz, 8-bit mono. */
const samples = 4000;
const wav =
  "RIFF" +
  le(36 + samples, 4) +
  "WAVEfmt " +
  le(16, 4) +
  le(1, 2) +
  le(1, 2) +
  le(8000, 4) +
  le(8000, 4) +
  le(1, 2) +
  le(8, 2) +
  "data" +
  le(samples, 4) +
  String.fromCharCode(128).repeat(samples);

/** A stand-in clip for stories: half a second of silence as an inline WAV, so no story depends on a file or the network. */
export const sampleAudio = `data:audio/wav;base64,${btoa(wav)}`;
