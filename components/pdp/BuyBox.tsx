"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PriceBlock } from "@/components/catalog/PriceBlock";
import { resolveVariantPricing, type VariantOption } from "@/lib/pdp";
import { notifyCartUpdated } from "@/lib/cart-events";
import { AddToCartModal } from "./AddToCartModal";
import { WishlistButton } from "./WishlistButton";

export function BuyBox({
  productId,
  title,
  image,
  product,
  variants,
}: {
  productId: string;
  title: string;
  image?: string;
  product: { basePrice: number; listPrice: number | null; stock: number; isPrimeEligible: boolean };
  variants: VariantOption[];
}) {
  const router = useRouter();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(variants[0]?.id ?? null);
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState<{ subtotal: number; itemCount: number } | null>(null);

  const resolved = useMemo(
    () => resolveVariantPricing(product, variants, selectedVariantId),
    [product, variants, selectedVariantId],
  );
  const inStock = resolved.stock > 0;
  const maxQty = Math.min(resolved.stock, 10);

  async function addToCart(): Promise<boolean> {
    setSubmitting(true);
    const res = await fetch("/api/cart/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, variantId: selectedVariantId, quantity }),
    });
    setSubmitting(false);

    if (res.status === 401) {
      router.push("/login");
      return false;
    }
    if (!res.ok) return false;

    const data = await res.json();
    const subtotal = data.cart.items.reduce(
      (sum: number, item: { quantity: number; product: { basePrice: string }; variant: { priceDelta: string } | null }) =>
        sum + (Number(item.product.basePrice) + (item.variant ? Number(item.variant.priceDelta) : 0)) * item.quantity,
      0,
    );
    const itemCount = data.cart.items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);

    notifyCartUpdated();
    setModal({ subtotal, itemCount });
    return true;
  }

  return (
    <div className="w-full shrink-0 space-y-4 rounded-lg border p-5 sm:w-80">
      <PriceBlock basePrice={resolved.price} listPrice={resolved.listPrice} />

      <p className="text-sm text-az-link">FREE delivery</p>

      {variants.length > 0 && (
        <div>
          <p className="mb-1.5 text-sm">
            Size: <span className="font-bold">{variants.find((v) => v.id === selectedVariantId)?.value ?? "Select"}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedVariantId(variant.id)}
                disabled={variant.stock === 0}
                className={`rounded border px-3 py-1.5 text-sm ${
                  variant.id === selectedVariantId
                    ? "border-az-prime bg-neutral-100 font-bold"
                    : "border-neutral-300 hover:border-neutral-500"
                } ${variant.stock === 0 ? "cursor-not-allowed text-neutral-300 line-through" : ""}`}
              >
                {variant.value}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className={`font-medium ${inStock ? "text-green-700" : "text-az-price"}`}>
        {inStock ? "In Stock" : "Out of Stock"}
      </p>

      {inStock && (
        <label className="flex items-center gap-2 text-sm">
          Quantity:
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="rounded border border-neutral-300 px-2 py-1"
          >
            {Array.from({ length: maxQty }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="flex flex-col gap-2">
        <button
          type="button"
          disabled={!inStock || submitting}
          onClick={addToCart}
          className="rounded-full bg-az-cta-yellow px-4 py-2 text-sm font-medium hover:bg-az-cta-yellow-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add to Cart
        </button>
        <button
          type="button"
          disabled={!inStock || submitting}
          onClick={async () => {
            if (await addToCart()) router.push("/cart");
          }}
          className="rounded-full bg-az-cta-orange px-4 py-2 text-sm font-medium hover:bg-az-cta-orange-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          Buy Now
        </button>
        <WishlistButton productId={productId} />
      </div>

      {product.isPrimeEligible && <p className="text-xs font-bold text-az-prime">✔ prime eligible</p>}
      <p className="text-xs text-muted-foreground">Shipped from and sold by Amazon Clone.</p>

      {modal && (
        <AddToCartModal
          open
          onOpenChange={(open) => !open && setModal(null)}
          item={{ title, image, price: resolved.price, quantity }}
          subtotal={modal.subtotal}
          itemCount={modal.itemCount}
        />
      )}
    </div>
  );
}
