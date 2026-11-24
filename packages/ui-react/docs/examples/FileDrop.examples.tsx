import { useState } from "react";
import { FileDrop } from "@slashsuite/ui-react";

/** Name the file the zone wants in its prompt, restrict it with `accept`, and show the chosen file's name from `onChange`. */
export const DoChosen = () => {
  const [name, setName] = useState("");
  return (
    <FileDrop accept=".csv" onChange={(event) => setName(event.target.files?.[0]?.name ?? "")}>
      {name === "" ? "Drop a bank statement here or click to choose" : name}
    </FileDrop>
  );
};

/** A prompt that never changes leaves the person unsure the file was taken, and with no `accept` any file is. */
export const DontChosen = () => <FileDrop>Drop here</FileDrop>;
