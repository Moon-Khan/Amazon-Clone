const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

export function isValidName(name: string): boolean {
  return name.trim().length >= 1 && name.trim().length <= 100;
}

/**
 * Format-only check for the mock checkout payment form - per docs/PLAN.md's
 * scope cut, card details are validated but never stored or sent anywhere.
 */
export function isValidCardNumber(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\s+/g, "");
  return /^\d{13,19}$/.test(digits);
}

/** Expects "MM/YY"; true only for a real month that hasn't already passed. */
export function isValidExpiry(expiry: string, now: Date = new Date()): boolean {
  const match = /^(\d{2})\/(\d{2})$/.exec(expiry.trim());
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  return year > currentYear || (year === currentYear && month >= currentMonth);
}

export function isValidCvv(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv.trim());
}
