import { describe, expect, it } from "vitest";
import { calcProtectionPlanPrice } from "../protectionPlan";

describe("calcProtectionPlanPrice", () => {
  it("is 8% of the item price, rounded to cents", () => {
    expect(calcProtectionPlanPrice(100)).toBe(8);
    expect(calcProtectionPlanPrice(28.17)).toBe(2.99); // 8% = 2.2536, below the floor
  });

  it("floors to the minimum price for cheap items", () => {
    expect(calcProtectionPlanPrice(10)).toBe(2.99);
    expect(calcProtectionPlanPrice(0)).toBe(2.99);
  });

  it("scales for expensive items", () => {
    expect(calcProtectionPlanPrice(1000)).toBe(80);
  });
});
