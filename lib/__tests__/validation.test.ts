import { describe, expect, it } from "vitest";
import { isValidEmail, isValidPassword, isValidName } from "../validation";

describe("isValidEmail", () => {
  it("accepts a normal email", () => {
    expect(isValidEmail("a@b.com")).toBe(true);
  });

  it("rejects strings without an @ or a domain", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("a@b")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });

  it("rejects an email with embedded whitespace", () => {
    expect(isValidEmail("a @b.com")).toBe(false);
  });
});

describe("isValidPassword", () => {
  it("requires at least 8 characters", () => {
    expect(isValidPassword("1234567")).toBe(false);
    expect(isValidPassword("12345678")).toBe(true);
  });
});

describe("isValidName", () => {
  it("rejects empty or whitespace-only names", () => {
    expect(isValidName("")).toBe(false);
    expect(isValidName("   ")).toBe(false);
  });

  it("accepts a normal name", () => {
    expect(isValidName("Jane Doe")).toBe(true);
  });

  it("rejects a name over 100 characters", () => {
    expect(isValidName("a".repeat(101))).toBe(false);
    expect(isValidName("a".repeat(100))).toBe(true);
  });
});
