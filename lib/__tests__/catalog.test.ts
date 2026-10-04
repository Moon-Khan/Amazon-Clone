import { describe, expect, it } from "vitest";
import { parseProductSearchParams, buildProductWhere, buildProductOrderBy } from "../catalog";

describe("parseProductSearchParams", () => {
  it("defaults sort/page/limit when absent", () => {
    const params = parseProductSearchParams({});
    expect(params.sort).toBe("relevance");
    expect(params.page).toBe(1);
    expect(params.limit).toBe(24);
  });

  it("falls back to relevance for an unknown sort value", () => {
    const params = parseProductSearchParams({ sort: "not-a-real-sort" });
    expect(params.sort).toBe("relevance");
  });

  it("accepts a known sort value", () => {
    const params = parseProductSearchParams({ sort: "price_asc" });
    expect(params.sort).toBe("price_asc");
  });

  it("clamps limit to the max and ignores non-positive values", () => {
    expect(parseProductSearchParams({ limit: "500" }).limit).toBe(48);
    expect(parseProductSearchParams({ limit: "-5" }).limit).toBe(24);
    expect(parseProductSearchParams({ limit: "0" }).limit).toBe(24);
  });

  it("ignores a non-positive or non-numeric page and falls back to 1", () => {
    expect(parseProductSearchParams({ page: "-1" }).page).toBe(1);
    expect(parseProductSearchParams({ page: "abc" }).page).toBe(1);
  });

  it("parses a comma-separated brand string into an array", () => {
    const params = parseProductSearchParams({ brand: "Nike,Adidas" });
    expect(params.brand).toEqual(["Nike", "Adidas"]);
  });

  it("accepts brand already as an array (repeated query params)", () => {
    const params = parseProductSearchParams({ brand: ["Nike", "Adidas"] });
    expect(params.brand).toEqual(["Nike", "Adidas"]);
  });

  it("treats category=all the same as no category", () => {
    expect(parseProductSearchParams({ category: "all" }).category).toBeUndefined();
    expect(parseProductSearchParams({ category: "electronics" }).category).toBe("electronics");
  });

  it("trims q and treats an empty/whitespace q as absent", () => {
    expect(parseProductSearchParams({ q: "  shoes  " }).q).toBe("shoes");
    expect(parseProductSearchParams({ q: "   " }).q).toBeUndefined();
  });

  it("parses prime=1 as true and anything else as absent", () => {
    expect(parseProductSearchParams({ prime: "1" }).prime).toBe(true);
    expect(parseProductSearchParams({}).prime).toBeUndefined();
    expect(parseProductSearchParams({ prime: "0" }).prime).toBeUndefined();
  });

  it("parses minPrice/maxPrice/minRating as numbers, dropping invalid ones", () => {
    const params = parseProductSearchParams({ minPrice: "10.5", maxPrice: "abc", minRating: "4" });
    expect(params.minPrice).toBe(10.5);
    expect(params.maxPrice).toBeUndefined();
    expect(params.minRating).toBe(4);
  });
});

describe("buildProductWhere", () => {
  it("builds an empty where-clause for no filters", () => {
    const where = buildProductWhere({});
    expect(where).toEqual({});
  });

  it("includes categoryId.in only when categoryIds is non-empty", () => {
    expect(buildProductWhere({}, []).categoryId).toBeUndefined();
    expect(buildProductWhere({}, ["c1", "c2"]).categoryId).toEqual({ in: ["c1", "c2"] });
  });

  it("builds a case-insensitive OR search across title/brand/description", () => {
    const where = buildProductWhere({ q: "shoe" });
    expect(where.OR).toEqual([
      { title: { contains: "shoe", mode: "insensitive" } },
      { brand: { contains: "shoe", mode: "insensitive" } },
      { description: { contains: "shoe", mode: "insensitive" } },
    ]);
  });

  it("filters by brand.in", () => {
    const where = buildProductWhere({ brand: ["Nike", "Adidas"] });
    expect(where.brand).toEqual({ in: ["Nike", "Adidas"] });
  });

  it("builds a price range with only the bounds that are present", () => {
    expect(buildProductWhere({ minPrice: 10 }).basePrice).toEqual({ gte: 10 });
    expect(buildProductWhere({ maxPrice: 50 }).basePrice).toEqual({ lte: 50 });
    expect(buildProductWhere({ minPrice: 10, maxPrice: 50 }).basePrice).toEqual({ gte: 10, lte: 50 });
  });

  it("filters by minimum rating", () => {
    expect(buildProductWhere({ minRating: 4 }).ratingAvg).toEqual({ gte: 4 });
  });

  it("filters by Prime eligibility only when requested", () => {
    expect(buildProductWhere({}).isPrimeEligible).toBeUndefined();
    expect(buildProductWhere({ prime: true }).isPrimeEligible).toBe(true);
  });
});

describe("buildProductOrderBy", () => {
  it("orders by basePrice ascending for price_asc", () => {
    expect(buildProductOrderBy("price_asc")).toEqual([{ basePrice: "asc" }]);
  });

  it("orders by basePrice descending for price_desc", () => {
    expect(buildProductOrderBy("price_desc")).toEqual([{ basePrice: "desc" }]);
  });

  it("orders by rating then review count for rating", () => {
    expect(buildProductOrderBy("rating")).toEqual([{ ratingAvg: "desc" }, { ratingCount: "desc" }]);
  });

  it("orders by createdAt descending for newest", () => {
    expect(buildProductOrderBy("newest")).toEqual([{ createdAt: "desc" }]);
  });

  it("falls back to a relevance heuristic", () => {
    expect(buildProductOrderBy("relevance")).toEqual([{ ratingCount: "desc" }, { createdAt: "desc" }]);
  });
});
