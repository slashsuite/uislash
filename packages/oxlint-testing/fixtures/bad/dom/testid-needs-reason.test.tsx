import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

test("finds by test id with no reason", () => {
  render(<canvas data-testid="chart" />);
  expect(screen.getByTestId("chart")).toBeTruthy(); // expect: ui-testing/testid-needs-reason
});

// A comment outside the test does not reason for it.
test("a comment before the test is not its reason", () => {
  render(<canvas data-testid="chart" />);
  expect(screen.getByTestId("chart")).toBeTruthy(); // expect: ui-testing/testid-needs-reason
});
