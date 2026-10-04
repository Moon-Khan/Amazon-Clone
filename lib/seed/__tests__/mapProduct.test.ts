import { describe, expect, it } from "vitest";
import { mapDummyProductToProduct, slugify, round2, type DummyJsonProduct } from "../mapProduct";

function makeDummy(overrides: Partial<DummyJsonProduct> = {}): DummyJsonProduct {
  return {
    id: 1,
    title: "Essence Mascara Lash Princess",
    description: "A mascara.",
    category: "beauty",
    price: 9.99,
    discountPercentage: 10.48,
    rating: 2.56,
    stock: 99,
    brand: "Essence",
    images: ["https://cdn.example.com/1.webp"],
    thumbnail: "https://cdn.example.com/thumb.webp",
    reviews: [
      { rating: 3, comment: "ok", date: "2025-01-01", reviewerName: "A", reviewerEmail: "a@x.com" },
      { rating: 5, comment: "great", date: "2025-01-02", reviewerName: "B", reviewerEmail: "b@x.com" },
    ],
    ...overrides,
  };
}

describe("slugify", () => {
  it("lowercases and dashes non-alphanumeric runs", () => {
    expect(slugify("Essence Mascara Lash Princess")).toBe("essence-mascara-lash-princess");
  });

  it("trims leading/trailing dashes", () => {
    expect(slugify("  --Weird Title!! ")).toBe("weird-title");
  });
});

describe("round2", () => {
  it("rounds to 2 decimal places", () => {
    expect(round2(8.942847)).toBe(8.94);
    expect(round2(8.945)).toBe(8.95);
  });
});

describe("mapDummyProductToProduct", () => {
  it("derives a discounted basePrice and a strikethrough listPrice when discounted", () => {
    const mapped = mapDummyProductToProduct(makeDummy({ price: 100, discountPercentage: 20 }), "cat_1");
    expect(mapped.basePrice).toBe(80);
    expect(mapped.listPrice).toBe(100);
  });

  it("omits listPrice when there is no meaningful discount", () => {
    const mapped = mapDummyProductToProduct(makeDummy({ price: 50, discountPercentage: 0 }), "cat_1");
    expect(mapped.basePrice).toBe(50);
    expect(mapped.listPrice).toBeNull();
  });

  it("appends the dummyjson id to the slug for uniqueness", () => {
    const mapped = mapDummyProductToProduct(makeDummy({ id: 42, title: "Red Shoe" }), "cat_1");
    expect(mapped.slug).toBe("red-shoe-42");
  });

  it("falls back to the thumbnail when images is empty", () => {
    const mapped = mapDummyProductToProduct(makeDummy({ images: [], thumbnail: "https://cdn.example.com/thumb.webp" }), "cat_1");
    expect(mapped.images).toEqual(["https://cdn.example.com/thumb.webp"]);
  });

  it("falls back to brand 'Generic' when brand is missing", () => {
    const mapped = mapDummyProductToProduct(makeDummy({ brand: undefined }), "cat_1");
    expect(mapped.brand).toBe("Generic");
  });

  it("derives ratingCount from the number of seeded reviews", () => {
    const mapped = mapDummyProductToProduct(makeDummy(), "cat_1");
    expect(mapped.ratingCount).toBe(2);
  });

  it("is deterministic for isPrimeEligible (not random) across repeated calls", () => {
    const a = mapDummyProductToProduct(makeDummy({ id: 7 }), "cat_1");
    const b = mapDummyProductToProduct(makeDummy({ id: 7 }), "cat_1");
    expect(a.isPrimeEligible).toBe(b.isPrimeEligible);
  });
});
