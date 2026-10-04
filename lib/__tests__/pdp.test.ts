import { describe, expect, it } from "vitest";
import { resolveVariantPricing, type VariantOption } from "../pdp";

const product = { basePrice: 50, listPrice: 60, stock: 10 };
const variants: VariantOption[] = [
  { id: "v1", value: "S", priceDelta: 0, stock: 3 },
  { id: "v2", value: "L", priceDelta: 5, stock: 7 },
];

describe("resolveVariantPricing", () => {
  it("falls back to base product figures when no variant is selected", () => {
    expect(resolveVariantPricing(product, variants, null)).toEqual({
      price: 50,
      listPrice: 60,
      stock: 10,
    });
  });

  it("falls back to base product figures when there are no variants at all", () => {
    expect(resolveVariantPricing(product, [], null)).toEqual({
      price: 50,
      listPrice: 60,
      stock: 10,
    });
  });

  it("uses the selected variant's stock and applies its priceDelta", () => {
    expect(resolveVariantPricing(product, variants, "v2")).toEqual({
      price: 55,
      listPrice: 65,
      stock: 7,
    });
  });

  it("applies a zero priceDelta without changing price but still swaps stock", () => {
    expect(resolveVariantPricing(product, variants, "v1")).toEqual({
      price: 50,
      listPrice: 60,
      stock: 3,
    });
  });

  it("falls back to base figures when the selected id doesn't match any variant", () => {
    expect(resolveVariantPricing(product, variants, "missing")).toEqual({
      price: 50,
      listPrice: 60,
      stock: 10,
    });
  });

  it("keeps listPrice null when the product has no list price", () => {
    const noDiscount = { basePrice: 20, listPrice: null, stock: 5 };
    expect(resolveVariantPricing(noDiscount, variants, "v2").listPrice).toBeNull();
  });
});
