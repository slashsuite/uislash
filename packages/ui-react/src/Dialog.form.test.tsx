// @vitest-environment jsdom
import { useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Button } from "./Button.js";
import { Dialog } from "./Dialog.js";
import { stubDialog } from "./dom.harness.js";
import { Field } from "./Field.js";
import { Input } from "./Input.js";
import { announced, follows, render, screen, user } from "./render.harness.js";

// stubDialog supplies the modal <dialog> methods jsdom lacks; it does not act through the DOM.
beforeEach(stubDialog);

type Submit = () => void;

function open({
  onSubmit,
  error,
  fieldError,
}: {
  onSubmit?: Submit;
  error?: string;
  fieldError?: string;
}): void {
  render(
    <Dialog
      title="New flag"
      onClose={() => {}}
      onSubmit={onSubmit}
      error={error}
      footer={
        <>
          <Button variant="ghost">Cancel</Button>
          <Button type="submit">Create</Button>
        </>
      }
    >
      <Field label="Key">
        <Input />
      </Field>
      <Field label="Name" error={fieldError}>
        <Input />
      </Field>
    </Dialog>,
  );
}

const field = (name: string) => screen.getByRole<HTMLInputElement>("textbox", { name });
const button = (name: string) => screen.getByRole<HTMLButtonElement>("button", { name });

describe("Dialog onSubmit", () => {
  it("submits once on Enter in a field", async () => {
    const onSubmit = vi.fn<Submit>();
    open({ onSubmit });
    await user().type(field("Key"), "beta{Enter}");
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("submits once from the footer's submit button, and not from Cancel", async () => {
    const onSubmit = vi.fn<Submit>();
    open({ onSubmit });
    await user().click(button("Cancel"));
    expect(onSubmit).not.toHaveBeenCalled();
    await user().click(button("Create"));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("puts the fields and the submit button in one form", () => {
    open({ onSubmit: vi.fn<Submit>() });
    const form = field("Key").form;
    expect(form).not.toBeNull();
    expect(button("Create").form).toBe(form);
  });

  it("is no form without onSubmit", () => {
    open({});
    expect(field("Key").form).toBeNull();
  });
});

describe("Dialog error", () => {
  it("announces the error between the body and the footer", () => {
    open({ onSubmit: vi.fn<Submit>(), error: "Could not save." });
    const alert = screen.getByRole("alert");
    expect(alert.textContent).toBe("Could not save.");
    expect(follows(field("Name"), alert)).toBe(true);
    expect(follows(alert, button("Cancel"))).toBe(true);
  });

  it("shows the error with no onSubmit", () => {
    open({ error: "Could not delete." });
    expect(screen.getByRole("alert").textContent).toBe("Could not delete.");
  });

  it("shows no alert with no error", () => {
    open({ onSubmit: vi.fn<Submit>() });
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("keeps a field's error and the dialog's error apart", () => {
    open({ onSubmit: vi.fn<Submit>(), error: "Could not save.", fieldError: "Taken." });
    // The dialog's error interrupts (an alert); the field's is announced politely with the rest.
    const texts = screen.getAllByRole("alert").map((alert) => alert.textContent);
    expect(texts).toEqual(["Could not save."]);
    expect(announced()).toEqual(["Taken."]);
  });
});

/** A form dialog that marks Name invalid on a submit while it is empty, now or after a wait. */
function Checked({ later = false }: { later?: boolean }) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | undefined>();
  const check = () => setError(name === "" ? "Enter a name." : undefined);
  return (
    <Dialog
      title="New flag"
      onClose={() => {}}
      onSubmit={later ? () => Promise.resolve().then(check) : check}
      footer={<Button type="submit">Create</Button>}
    >
      <Field label="Key">
        <Input />
      </Field>
      <Field label="Name" error={error}>
        <Input value={name} onChange={(event) => setName(event.target.value)} />
      </Field>
    </Dialog>
  );
}

describe("Dialog failed submit", () => {
  it("moves the focus to the first invalid field", async () => {
    render(<Checked />);
    await user().type(field("Key"), "beta{Enter}");
    expect(document.activeElement).toBe(field("Name"));
  });

  it("moves it once an async submit settles", async () => {
    render(<Checked later />);
    await user().click(button("Create"));
    expect(document.activeElement).toBe(field("Name"));
  });

  it("leaves the focus where it is when nothing is invalid", async () => {
    render(<Checked />);
    await user().type(field("Name"), "Beta");
    await user().type(field("Key"), "beta{Enter}");
    expect(document.activeElement).toBe(field("Key"));
  });
});
