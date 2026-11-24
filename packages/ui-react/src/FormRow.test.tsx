// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { FormRow, FormRowField } from "./FormRow.js";
import { announced, follows, render, screen } from "./render.harness.js";

describe("FormRowField", () => {
  it("names the control with its label", () => {
    render(
      <FormRowField label="Amount" htmlFor="amount">
        <input id="amount" />
      </FormRowField>,
    );
    expect(screen.getByLabelText("Amount").id).toBe("amount");
  });
});

describe("FormRow", () => {
  const fields = (
    <FormRowField label="Name" htmlFor="name" span={2}>
      <input id="name" />
    </FormRowField>
  );

  it("reads the action after the fields", () => {
    render(<FormRow actions={<button type="button">Save</button>}>{fields}</FormRow>);
    expect(
      follows(screen.getByLabelText("Name"), screen.getByRole("button", { name: "Save" })),
    ).toBeTruthy();
  });

  it("draws no note when given no hint or error", () => {
    render(<FormRow>{fields}</FormRow>);
    expect(screen.queryByRole("paragraph")).toBeNull();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("reads the hint after the whole row, the action included, and it is no alert", () => {
    render(
      <FormRow hint="Saved on enter." actions={<button type="button">Save</button>}>
        {fields}
      </FormRow>,
    );
    expect(
      follows(screen.getByRole("button", { name: "Save" }), screen.getByText("Saved on enter.")),
    ).toBeTruthy();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("keeps the hint and adds the error under it, announced politely", () => {
    render(
      <FormRow hint="Saved on enter." error="Amount is required.">
        {fields}
      </FormRow>,
    );
    expect(announced()).toEqual(["Amount is required."]);
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByText("Saved on enter.")).toBeInstanceOf(HTMLElement);
  });
});
