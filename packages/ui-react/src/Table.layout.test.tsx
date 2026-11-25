// @vitest-environment jsdom
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, user, within } from "./render.harness.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  type TableSort,
} from "./Table.js";

afterEach(() => {
  Reflect.deleteProperty(HTMLElement.prototype, "offsetWidth");
  Reflect.deleteProperty(HTMLElement.prototype, "clientWidth");
  vi.unstubAllGlobals();
});

/** jsdom has no layout and no ResizeObserver: say how wide the table is and how wide its box. */
function widths(table: number, box: number) {
  Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
    configurable: true,
    get(this: HTMLElement) {
      return this.tagName === "TABLE" ? table : box;
    },
  });
  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    value: box,
  });
  // As in a browser, an observer reports once as soon as it starts observing.
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(private readonly notify: () => void) {}
      observe() {
        this.notify();
      }
      disconnect() {}
    },
  );
}

/** A table whose rows the app sorts by Total, as an app does: it holds the sort and passes it back. */
function Sorting({
  sortedLabel,
}: {
  sortedLabel?: (column: string, sort: "ascending" | "descending") => string;
}) {
  const [sort, setSort] = useState<TableSort>("none");
  return (
    <Table label="Quotes" sortedLabel={sortedLabel}>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Quote</TableHeaderCell>
          <TableHeaderCell numeric sort={sort} onSort={setSort}>
            Total
          </TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Q-1043</TableCell>
          <TableCell>R 1 200</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

describe("a sort", () => {
  it("is said aloud in a status region: the column's title and the new direction", async () => {
    render(<Sorting />);
    const status = screen.getByRole("status");
    expect(status.textContent).toBe("");
    await user().click(screen.getByRole("button", { name: "Total" }));
    expect(status.textContent).toBe("Sorted by Total, ascending");
    await user().click(screen.getByRole("button", { name: "Total" }));
    expect(status.textContent).toBe("Sorted by Total, descending");
  });

  it("takes its words from `sortedLabel`", async () => {
    render(<Sorting sortedLabel={(column, sort) => `Gesorteer op ${column} (${sort})`} />);
    await user().click(screen.getByRole("button", { name: "Total" }));
    expect(screen.getByRole("status").textContent).toBe("Gesorteer op Total (ascending)");
  });

  it("the title is a native button named by the title, in the column's header", () => {
    render(<Sorting />);
    const button = screen.getByRole("button", { name: "Total" });
    expect(button.tagName).toBe("BUTTON");
    expect(within(screen.getByRole("columnheader", { name: "Total" })).getByRole("button")).toBe(
      button,
    );
  });
});

describe("a header cell in a body row", () => {
  it('is the row\'s header, `<th scope="row">`, drawn as a strong cell', () => {
    render(
      <Table label="Quotes">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Customer</TableHeaderCell>
            <TableHeaderCell numeric>Total</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableHeaderCell>Acme Ltd</TableHeaderCell>
            <TableCell>R 1 200</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    const header = screen.getByRole("rowheader", { name: "Acme Ltd" });
    expect(header.getAttribute("scope")).toBe("row");
    expect(screen.getByRole("cell", { name: "R 1 200" })).toBeTruthy();
    expect(screen.getByRole("columnheader", { name: "Customer" }).getAttribute("scope")).toBe(
      "col",
    );
  });
});

function quotes() {
  return (
    <Table label="Quotes">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Quote</TableHeaderCell>
          <TableHeaderCell numeric>Total</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Q-1043</TableCell>
          <TableCell>R 1 200</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

describe("the table's box", () => {
  it("wider than its box with nothing to focus, it scrolls and takes a tab stop named by the table", async () => {
    widths(900, 300);
    render(quotes());
    const box = screen.getByRole("group", { name: "Quotes" });
    expect(box.getAttribute("tabindex")).toBe("0");
    await user().tab();
    expect(document.activeElement).toBe(box);
  });

  it("wider than its box with a link in it, it scrolls and takes no tab stop", () => {
    widths(900, 300);
    render(
      <Table label="Quotes">
        <TableBody>
          <TableRow>
            <TableCell>
              <a href="/q/1043">Q-1043</a>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.queryByRole("group")).toBeNull();
  });

  it("fitting its box, it takes no tab stop", () => {
    widths(300, 300);
    render(quotes());
    expect(screen.queryByRole("group")).toBeNull();
    expect(screen.getByRole("table", { name: "Quotes" })).not.toBeNull();
  });
});

function builds() {
  return (
    <Table label="Builds" narrow="stack">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Build</TableHeaderCell>
          <TableHeaderCell>Branch</TableHeaderCell>
          <TableHeaderCell numeric>Changed</TableHeaderCell>
          <TableHeaderCell label="Actions" />
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow stripe="danger">
          <TableHeaderCell>#412</TableHeaderCell>
          <TableCell>main</TableCell>
          <TableCell>3</TableCell>
          <TableCell>
            <button type="button">Review</button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell span="full">A note across the row</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

// How a stacked table looks on a phone is the visual check's (the Table Stacked story).
describe('narrow="stack"', () => {
  it("keeps the table's roles, since a part drawn as a block can lose them", () => {
    render(builds());
    const table = screen.getByRole("table", { name: "Builds" });
    expect(table.getAttribute("role")).toBe("table");
    expect(within(table).getAllByRole("row")).toHaveLength(3);
    expect(
      within(table)
        .getAllByRole("rowgroup")
        .map((group) => group.getAttribute("role")),
    ).toEqual(["rowgroup", "rowgroup"]);
    expect(screen.getByRole("rowheader", { name: "#412" }).getAttribute("role")).toBe("rowheader");
    expect(screen.getByRole("cell", { name: "main" }).getAttribute("role")).toBe("cell");
  });

  it("draws each cell after the first with its column's title, left out of the cell's name", () => {
    render(builds());
    expect(screen.getByRole("cell", { name: "main" }).textContent).toBe("Branchmain");
    expect(screen.getByRole("cell", { name: "3" }).textContent).toBe("Changed3");
    // The first column is the card's title; a column with a hidden title and a full row take no label.
    expect(screen.getByRole("rowheader", { name: "#412" }).textContent).toBe("#412");
    expect(screen.getByRole("cell", { name: "Review" }).textContent).toBe("Review");
    expect(screen.getByRole("cell", { name: "A note across the row" }).textContent).toBe(
      "A note across the row",
    );
  });

  it("a scrolling table (the default) adds no roles and no labels", () => {
    render(quotes());
    expect(screen.getByRole("table", { name: "Quotes" }).hasAttribute("role")).toBe(false);
    expect(screen.getByRole("cell", { name: "R 1 200" }).textContent).toBe("R 1 200");
  });
});
