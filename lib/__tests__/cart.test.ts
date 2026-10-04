import { describe, expect, it } from "vitest";
import { computeTotals } from "../cart";

describe("computeTotals", () => {
  it("returns zero for an empty cart", () => {
    expect(computeTotals([])).toEqual({ subtotal: 0, itemCount: 0 });
  });

  it("sums unitPrice * quantity across lines", () => {
    const result = computeTotals([
      { unitPrice: 10, quantity: 2 },
      { unitPrice: 5.5, quantity: 3 },
    ]);
    expect(result.subtotal).toBe(36.5);
    expect(result.itemCount).toBe(5);
  });

  it("rounds the subtotal to 2 decimal places to avoid float drift", () => {
    const result = computeTotals([
      { unitPrice: 0.1, quantity: 1 },
      { unitPrice: 0.2, quantity: 1 },
    ]);
    expect(result.subtotal).toBe(0.3);
  });

  it("handles a single line correctly", () => {
    expect(computeTotals([{ unitPrice: 28.17, quantity: 4 }])).toEqual({
      subtotal: 112.68,
      itemCount: 4,
    });
  });
});
