// @vitest-environment jsdom
import { useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Button } from "./Button.js";
import { Drawer } from "./Drawer.js";
import { stubDialog } from "./dom.harness.js";
import { Field } from "./Field.js";
import { Input } from "./Input.js";
import { follows, render, screen, user } from "./render.harness.js";

// stubDialog supplies the modal <dialog> methods jsdom lacks; it does not act through the DOM.
beforeEach(stubDialog);

type Submit = () => void;

function open({ onSubmit, error }: { onSubmit?: Submit; error?: string }): void {
  render(
    <Drawer
      title="Edit flag"
      onClose={() => {}}
      onSubmit={onSubmit}
      error={error}
      footer={
        <>
          <Button variant="ghost">Cancel</Button>
          <Button type="submit">Save</Button>
        </>
      }
    >
      <Field label="Key">
        <Input />
      </Field>
    </Drawer>,
  );
}

const field = (name: string) => screen.getByRole<HTMLInputElement>("textbox", { name });
const button = (name: string) => screen.getByRole<HTMLButtonElement>("button", { name });

describe("Drawer onSubmit", () => {
  it("submits once on Enter in a field", async () => {
    const onSubmit = vi.fn<Submit>();
    open({ onSubmit });
    await user().type(field("Key"), "beta{Enter}");
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("submits from the footer's submit button, not from Cancel", async () => {
    const onSubmit = vi.fn<Submit>();
    open({ onSubmit });
    await user().click(button("Cancel"));
    expect(onSubmit).not.toHaveBeenCalled();
    await user().click(button("Save"));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("puts the fields and the footer's submit button in one form", () => {
    open({ onSubmit: vi.fn<Submit>() });
    const form = field("Key").form;
    expect(form).not.toBeNull();
    expect(button("Save").form).toBe(form);
  });

  it("is no form without onSubmit", () => {
    open({});
    expect(field("Key").form).toBeNull();
  });
});

describe("Drawer error", () => {
  it("announces the error between the body and the footer", () => {
    open({ onSubmit: vi.fn<Submit>(), error: "Could not save." });
    const alert = screen.getByRole("alert");
    expect(alert.textContent).toBe("Could not save.");
    expect(follows(field("Key"), alert)).toBe(true);
    expect(follows(alert, button("Cancel"))).toBe(true);
  });

  it("shows no alert with no error", () => {
    open({ onSubmit: vi.fn<Submit>() });
    expect(screen.queryByRole("alert")).toBeNull();
  });
});

/** A form drawer that marks Name invalid on a submit while it is empty. */
function Checked() {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | undefined>();
  return (
    <Drawer
      title="Edit flag"
      onClose={() => {}}
      onSubmit={() => setError(name === "" ? "Enter a name." : undefined)}
      footer={<Button type="submit">Save</Button>}
    >
      <Field label="Key">
        <Input />
      </Field>
      <Field label="Name" error={error}>
        <Input value={name} onChange={(event) => setName(event.target.value)} />
      </Field>
    </Drawer>
  );
}

describe("Drawer failed submit", () => {
  it("moves the focus to the first invalid field", async () => {
    render(<Checked />);
    await user().type(field("Key"), "beta{Enter}");
    expect(document.activeElement).toBe(field("Name"));
  });
});
