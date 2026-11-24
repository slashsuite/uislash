import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  Button,
  Cluster,
  type Size,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/Switch.examples.js";

const meta: Meta = { title: "Forms/Switch" };
export default meta;
type S = StoryObj;

/** A Switch whose value the story keeps, the way a caller would. */
function Kept({
  initial = false,
  label,
  description,
  size,
}: {
  initial?: boolean;
  label: string;
  description?: string;
  size?: Size;
}) {
  const [checked, setChecked] = useState(initial);
  return (
    <Switch label={label} hint={description} size={size} checked={checked} onChange={setChecked} />
  );
}

export const Off: S = {
  render: () => <Kept label="Live in staging" />,
};
export const On: S = {
  render: () => <Kept label="Live in staging" initial />,
};

/** `sm`, `md` (the default) and `lg`, off and on: the track and the label grow together. */
export const Sizes: S = {
  render: () => (
    <div className="flex flex-col gap-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Cluster key={size} gap="md">
          <Kept size={size} label={`Off, ${size}`} />
          <Kept size={size} label={`On, ${size}`} initial />
        </Cluster>
      ))}
    </div>
  ),
};

/** `hint` is a muted line under the label that the switch is described by; the switch sits on the label's first line. */
export const WithDescription: S = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Kept
        label="Live in production"
        description="Serves the flag to every request in this environment."
        initial
      />
      <Kept size="sm" label="Live in staging" description="Only the QA team sees it." />
      <Kept size="lg" label="Live in preview" description="Branch previews only." />
    </div>
  ),
};

/** `busy` is the save in flight: it keeps its colour and its focus, and a click or a key does nothing. */
export const Busy: S = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Switch label="Saving, on" checked busy onChange={() => undefined} />
      <Switch label="Saving, off" checked={false} busy onChange={() => undefined} />
    </div>
  ),
};

/** The caller's state drives the cycle: a flip goes busy and holds the new value; Save lands applies it, as a server's reply would. There is no server. */
export const Saving: S = {
  render: () => {
    const [checked, setChecked] = useState(false);
    const [pending, setPending] = useState<boolean | null>(null);
    return (
      <div className="flex items-center gap-4">
        <Switch
          label="Live in staging"
          checked={checked}
          busy={pending !== null}
          onChange={setPending}
        />
        <Button
          variant="outline"
          size="sm"
          disabled={pending === null}
          onClick={() => {
            if (pending !== null) setChecked(pending);
            setPending(null);
          }}
        >
          Save lands
        </Button>
      </div>
    );
  },
};

export const Disabled: S = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Switch label="Live in staging" checked={false} disabled onChange={() => undefined} />
      <Switch label="Live in production" checked disabled onChange={() => undefined} />
    </div>
  ),
};

const flags = ["checkout-v2", "dark-mode", "new-search"];

/** Bare, in a table cell: no `label`, so `aria-label` names it. */
export const Bare: S = {
  render: () => {
    const [on, setOn] = useState<Record<string, boolean>>({ "dark-mode": true });
    return (
      <Table label="Flags">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Flag</TableHeaderCell>
            <TableHeaderCell>Staging</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {flags.map((flag) => (
            <TableRow key={flag}>
              <TableCell mono>{flag}</TableCell>
              <TableCell>
                <Switch
                  size="sm"
                  aria-label={`${flag} in staging`}
                  checked={on[flag] ?? false}
                  onChange={(next) => setOn((state) => ({ ...state, [flag]: next }))}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};

export const DoLabel: S = {
  render: examples.DoLabel,
};

export const DontLabel: S = {
  render: examples.DontLabel,
};

export const DoRow: S = {
  render: examples.DoRow,
};

export const DoDisabledReason: S = {
  render: examples.DoDisabledReason,
};

export const DontDisabledReason: S = {
  render: examples.DontDisabledReason,
};

/** While `loading` the label is drawn and the track is a bone of its size. */
export const Loading: StoryObj<{ loading: boolean }> = {
  args: { loading: true },
  render: ({ loading }) => <Switch loading={loading} label="Weekly summary" defaultChecked />,
};
