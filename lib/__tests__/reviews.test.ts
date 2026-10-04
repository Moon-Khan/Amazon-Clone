import { describe, expect, it } from "vitest";
import { validateReviewInput } from "../reviews";

describe("validateReviewInput", () => {
  it("accepts a valid rating and body", () => {
    const result = validateReviewInput({ rating: 4, body: "Works great, exactly as described." });
    expect(result).toEqual({ ok: true, value: { rating: 4, title: undefined, body: "Works great, exactly as described." } });
  });

  it("trims and caps an optional title", () => {
    const result = validateReviewInput({ rating: 5, title: "  Great buy  ", body: "Solid product overall." });
    expect(result.ok).toBe(true);
    expect(result.ok && result.value.title).toBe("Great buy");
  });

  it.each([0, 6, 2.5, "x", null, undefined])("rejects an invalid rating %p", (rating) => {
    const result = validateReviewInput({ rating, body: "A long enough review body here." });
    expect(result.ok).toBe(false);
  });

  it("rejects a body under 10 characters", () => {
    const result = validateReviewInput({ rating: 3, body: "short" });
    expect(result).toEqual({ ok: false, error: "Review must be at least 10 characters." });
  });

  it("rejects a body over 2000 characters", () => {
    const result = validateReviewInput({ rating: 3, body: "a".repeat(2001) });
    expect(result.ok).toBe(false);
  });
});
