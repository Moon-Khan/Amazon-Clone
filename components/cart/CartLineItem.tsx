"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { notifyCartUpdated } from "@/lib/cart-events";

export type CartLineItemData = {
  id: string;
  quantity: number;
  unitPrice: number;
  stock: number;
  product: { slug: string; title: string; images: string[] };
  variant: { value: string } | null;
};

export function CartLineItem({ item }: { item: CartLineItemData }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const image = item.product.images[0];
  const maxQty = Math.min(item.stock, 10);

  async function updateQuantity(quantity: number) {
    setBusy(true);
    await fetch(`/api/cart/items/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    notifyCartUpdated();
    router.refresh();
    setBusy(false);
  }

  async function remove() {
    setBusy(true);
    await fetch(`/api/cart/items/${item.id}`, { method: "DELETE" });
    notifyCartUpdated();
    router.refresh();
  }

  return (
    <li className="flex gap-4 border-b py-4 last:border-0">
      <Link href={`/product/${item.product.slug}`} className="relative h-28 w-28 shrink-0 overflow-hidden rounded bg-neutral-50">
        {image && <Image src={image} alt={item.product.title} fill sizes="112px" className="object-contain p-2" />}
      </Link>
      <div className="flex-1">
        <Link href={`/product/${item.product.slug}`} className="line-clamp-2 text-sm hover:text-az-link hover:underline">
          {item.product.title}
        </Link>
        {item.variant && <p className="text-sm text-muted-foreground">Size: {item.variant.value}</p>}
        <p className="mt-1 font-medium">${item.unitPrice.toFixed(2)}</p>
        <div className="mt-2 flex items-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            Qty:
            <select
              value={item.quantity}
              disabled={busy}
              onChange={(e) => updateQuantity(Number(e.target.value))}
              className="rounded border border-neutral-300 px-2 py-1"
            >
              {Array.from({ length: maxQty }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={remove} disabled={busy} className="text-az-link hover:underline">
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}
