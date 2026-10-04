import { describe, expect, it } from "vitest";
import { calcOrderTotals } from "../checkout";

describe("calcOrderTotals", () => {
  it("applies standard shipping below the free-shipping threshold", () => {
    const result = calcOrderTotals(20);
    expect(result.shippingFee).toBe(5.99);
    expect(result.tax).toBe(1.6);
    expect(result.total).toBe(27.59);
  });

  it("gives free shipping at or above the threshold", () => {
    expect(calcOrderTotals(35).shippingFee).toBe(0);
    expect(calcOrderTotals(100).shippingFee).toBe(0);
  });

  it("charges standard shipping just under the threshold", () => {
    expect(calcOrderTotals(34.99).shippingFee).toBe(5.99);
  });

  it("gives free shipping for a zero subtotal rather than charging for nothing", () => {
    const result = calcOrderTotals(0);
    expect(result).toEqual({ subtotal: 0, tax: 0, shippingFee: 0, total: 0 });
  });

  it("rounds tax and total to 2 decimal places", () => {
    const result = calcOrderTotals(28.17);
    expect(result.tax).toBe(2.25);
    expect(result.total).toBe(36.41);
  });
});
