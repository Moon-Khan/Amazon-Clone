const RATE = 0.08;
const MIN_PRICE = 2.99;

/** Pure: price of a 2-year protection plan for an item at the given unit price. */
export function calcProtectionPlanPrice(itemPrice: number): number {
  return Math.max(MIN_PRICE, Math.round(itemPrice * RATE * 100) / 100);
}
