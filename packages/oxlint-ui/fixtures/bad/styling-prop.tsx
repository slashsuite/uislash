import { Button, Card as Panel } from "@slashsuite/ui-react";

export const a = <Button className="mt-4">Go</Button>; // expect: uislash/styling-prop
export const b = <Panel style={{ margin: 0 }} />; // expect: uislash/styling-prop
