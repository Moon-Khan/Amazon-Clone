const CART_UPDATED_EVENT = "cart:updated";

/** Lets the header cart badge refetch without a shared state library. */
export function notifyCartUpdated() {
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function onCartUpdated(handler: () => void) {
  window.addEventListener(CART_UPDATED_EVENT, handler);
  return () => window.removeEventListener(CART_UPDATED_EVENT, handler);
}
