// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { Combobox } from "./Combobox.js";
import { render, screen, user } from "./render.harness.js";

const COUNTRIES = [
  { value: "nl", label: "Netherlands" },
  { value: "nz", label: "New Zealand" },
  { value: "no", label: "Norway", disabled: true },
  { value: "za", label: "South Africa" },
];
const field = () => screen.getByRole<HTMLInputElement>("combobox", { name: "Country" });
const options = () => screen.getAllByRole("option").map((option) => option.textContent);

describe("Combobox", () => {
  it("is a combobox named by its label, showing the chosen item's label", () => {
    render(<Combobox label="Country" items={COUNTRIES} defaultValue="za" />);
    expect(field().value).toBe("South Africa");
  });

  it("filters the list by what is typed", async () => {
    render(<Combobox label="Country" items={COUNTRIES} />);
    await user().type(field(), "Ne");
    expect(options()).toEqual(["Netherlands", "New Zealand"]);
  });

  it("reports the chosen item's value", async () => {
    const onChange = vi.fn<(value: string | null) => void>();
    render(<Combobox label="Country" items={COUNTRIES} onChange={onChange} />);
    await user().type(field(), "Zea");
    await user().click(screen.getByRole("option", { name: "New Zealand" }));
    expect(field().value).toBe("New Zealand");
    expect(onChange).toHaveBeenLastCalledWith("nz");
  });

  it("says so when nothing matches, in the given words", async () => {
    render(<Combobox label="Country" items={COUNTRIES} emptyLabel="Geen" />);
    await user().type(field(), "xyz");
    expect(screen.getByText("Geen")).toBeTruthy();
  });

  it("opens the whole list from its button", async () => {
    render(<Combobox label="Country" items={COUNTRIES} />);
    await user().click(screen.getByRole("button"));
    expect(options()).toEqual(["Netherlands", "New Zealand", "Norway", "South Africa"]);
  });

  it("keeps a disabled item unpickable", async () => {
    render(<Combobox label="Country" items={COUNTRIES} />);
    await user().click(screen.getByRole("button"));
    expect(screen.getByRole("option", { name: "Norway" }).getAttribute("aria-disabled")).toBe(
      "true",
    );
  });

  it("posts the chosen value under name", () => {
    render(
      <form aria-label="Address">
        <Combobox label="Country" items={COUNTRIES} defaultValue="nl" name="country" />
      </form>,
    );
    const data = new FormData(screen.getByRole<HTMLFormElement>("form", { name: "Address" }));
    expect(data.get("country")).toBe("nl");
  });

  it("describes the field by its hint, and with an error marks it invalid", () => {
    render(<Combobox label="Country" items={COUNTRIES} hint="Where you live" error="Pick one" />);
    expect(
      screen.getByRole("combobox", { name: "Country", description: "Where you live Pick one" }),
    ).not.toBeNull();
    expect(field().getAttribute("aria-invalid")).toBe("true");
  });

  it("disables the field", () => {
    render(<Combobox label="Country" items={COUNTRIES} disabled />);
    expect(field().disabled).toBe(true);
  });
});
