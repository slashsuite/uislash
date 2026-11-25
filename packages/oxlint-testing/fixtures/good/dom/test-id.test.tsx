import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

test("finds a canvas by its test id, saying why", () => {
  render(<canvas data-testid="chart" />);
  // A canvas has no accessible name to find it by.
  expect(screen.getByTestId("chart")).toBeTruthy();
});

test("one reason covers its test", () => {
  // A canvas has no accessible name to find it by.
  render(<canvas data-testid="chart" />);
  expect(screen.getByTestId("chart")).toBeTruthy();
  expect(screen.getAllByTestId("chart")).toHaveLength(1);
});
