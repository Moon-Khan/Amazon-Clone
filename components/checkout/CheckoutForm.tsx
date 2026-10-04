"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isValidCardNumber, isValidExpiry, isValidCvv, isValidName } from "@/lib/validation";
import { notifyCartUpdated } from "@/lib/cart-events";

type Address = {
  id: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
};

type Line = {
  id: string;
  title: string;
  variant: string | null;
  quantity: number;
  unitPrice: number;
  protectionPlanPrice: number | null;
};
type Totals = { subtotal: number; tax: number; shippingFee: number; total: number };

export function CheckoutForm({ addresses, items, totals }: { addresses: Address[]; items: Line[]; totals: Totals }) {
  const router = useRouter();
  const [addressId, setAddressId] = useState<string | null>(addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? null);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!addressId) errors.address = "Select a delivery address.";
    if (!isValidName(cardName)) errors.cardName = "Enter the name on the card.";
    if (!isValidCardNumber(cardNumber)) errors.cardNumber = "Enter a valid 13-19 digit card number.";
    if (!isValidExpiry(expiry)) errors.expiry = "Enter a valid, unexpired MM/YY date.";
    if (!isValidCvv(cvv)) errors.cvv = "Enter a valid 3-4 digit security code.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setSubmitting(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addressId }),
    });
    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setSubmitError(data.error ?? "Something went wrong placing your order.");
      return;
    }

    const data = await res.json();
    notifyCartUpdated();
    router.push(`/orders/${data.order.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 lg:flex-row">
      <div className="flex-1 space-y-6">
        <section className="rounded border p-5">
          <h2 className="mb-3 text-lg font-bold">1. Delivery address</h2>
          {addresses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You don&apos;t have a saved address yet.{" "}
              <Link href="/account" className="text-az-link hover:underline">
                Add one in Your Account
              </Link>
              .
            </p>
          ) : (
            <ul className="space-y-2">
              {addresses.map((addr) => (
                <li key={addr.id}>
                  <label className="flex items-start gap-2 rounded border p-3 text-sm has-[:checked]:border-az-prime">
                    <input
                      type="radio"
                      name="address"
                      checked={addressId === addr.id}
                      onChange={() => setAddressId(addr.id)}
                      className="mt-1"
                    />
                    <span>
                      {addr.line1}
                      {addr.line2 ? `, ${addr.line2}` : ""}, {addr.city}, {addr.state} {addr.zip}, {addr.country}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}
          {fieldErrors.address && <p className="mt-2 text-sm text-az-price">{fieldErrors.address}</p>}
        </section>

        <section className="rounded border p-5">
          <h2 className="mb-3 text-lg font-bold">2. Payment method</h2>
          <p className="mb-3 text-xs text-muted-foreground">
            This is a demo checkout - card details are validated for format only and are never stored or sent anywhere.
          </p>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="cardName">
                Name on card
              </label>
              <input
                id="cardName"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
              />
              {fieldErrors.cardName && <p className="mt-1 text-xs text-az-price">{fieldErrors.cardName}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="cardNumber">
                Card number
              </label>
              <input
                id="cardNumber"
                inputMode="numeric"
                placeholder="4111 1111 1111 1111"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
              />
              {fieldErrors.cardNumber && <p className="mt-1 text-xs text-az-price">{fieldErrors.cardNumber}</p>}
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="mb-1 block text-sm font-medium" htmlFor="expiry">
                  Expiry (MM/YY)
                </label>
                <input
                  id="expiry"
                  placeholder="06/27"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
                />
                {fieldErrors.expiry && <p className="mt-1 text-xs text-az-price">{fieldErrors.expiry}</p>}
              </div>
              <div className="w-28">
                <label className="mb-1 block text-sm font-medium" htmlFor="cvv">
                  CVV
                </label>
                <input
                  id="cvv"
                  inputMode="numeric"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
                />
                {fieldErrors.cvv && <p className="mt-1 text-xs text-az-price">{fieldErrors.cvv}</p>}
              </div>
            </div>
          </div>
        </section>
      </div>

      <aside className="w-full shrink-0 space-y-4 rounded-lg border p-5 lg:w-80">
        <h2 className="text-lg font-bold">Order summary</h2>
        <ul className="space-y-1 text-sm">
          {items.map((item) => (
            <li key={item.id}>
              <div className="flex justify-between gap-2">
                <span className="line-clamp-1">
                  {item.title}
                  {item.variant ? ` (${item.variant})` : ""} &times; {item.quantity}
                </span>
                <span className="shrink-0">${(item.unitPrice * item.quantity).toFixed(2)}</span>
              </div>
              {item.protectionPlanPrice !== null && (
                <div className="flex justify-between gap-2 text-xs text-muted-foreground">
                  <span>2-Year Protection Plan</span>
                  <span className="shrink-0">${item.protectionPlanPrice.toFixed(2)}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="space-y-1 border-t pt-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{totals.shippingFee === 0 ? "FREE" : `$${totals.shippingFee.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${totals.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t pt-1 font-bold">
            <span>Total</span>
            <span>${totals.total.toFixed(2)}</span>
          </div>
        </div>

        {submitError && <p className="text-sm text-az-price">{submitError}</p>}

        <button
          type="submit"
          disabled={submitting || addresses.length === 0}
          className="w-full rounded-full bg-az-cta-yellow px-4 py-2 text-sm font-medium hover:bg-az-cta-yellow-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Placing order..." : "Place your order"}
        </button>
      </aside>
    </form>
  );
}
