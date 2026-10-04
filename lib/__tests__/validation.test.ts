import { describe, expect, it } from "vitest";
import { isValidEmail, isValidPassword, isValidName, isValidCardNumber, isValidExpiry, isValidCvv } from "../validation";

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

describe("isValidCardNumber", () => {
  it("accepts 13-19 digit numbers, with or without spaces", () => {
    expect(isValidCardNumber("4111111111111111")).toBe(true);
    expect(isValidCardNumber("4111 1111 1111 1111")).toBe(true);
  });

  it("rejects numbers outside the 13-19 digit range", () => {
    expect(isValidCardNumber("123456789012")).toBe(false); // 12 digits
    expect(isValidCardNumber("1".repeat(20))).toBe(false);
  });

  it("rejects non-numeric characters", () => {
    expect(isValidCardNumber("4111-1111-1111-1111")).toBe(false);
    expect(isValidCardNumber("abcd111111111111")).toBe(false);
  });
});

describe("isValidExpiry", () => {
  const now = new Date(2026, 5, 15); // June 2026

  it("accepts the current month and future months", () => {
    expect(isValidExpiry("06/26", now)).toBe(true);
    expect(isValidExpiry("07/26", now)).toBe(true);
    expect(isValidExpiry("01/27", now)).toBe(true);
  });

  it("rejects a month that has already passed", () => {
    expect(isValidExpiry("05/26", now)).toBe(false);
    expect(isValidExpiry("12/25", now)).toBe(false);
  });

  it("rejects malformed input", () => {
    expect(isValidExpiry("6/26", now)).toBe(false);
    expect(isValidExpiry("13/26", now)).toBe(false);
    expect(isValidExpiry("00/26", now)).toBe(false);
    expect(isValidExpiry("")).toBe(false);
  });
});

describe("isValidCvv", () => {
  it("accepts 3 or 4 digit codes", () => {
    expect(isValidCvv("123")).toBe(true);
    expect(isValidCvv("1234")).toBe(true);
  });

  it("rejects other lengths or non-numeric input", () => {
    expect(isValidCvv("12")).toBe(false);
    expect(isValidCvv("12345")).toBe(false);
    expect(isValidCvv("abc")).toBe(false);
  });
});
