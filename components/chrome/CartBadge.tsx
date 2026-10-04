"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { onCartUpdated } from "@/lib/cart-events";

type CartItemLike = { quantity: number };

export function CartBadge() {
  const { data: session } = useSession();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!session?.user) return;

    async function fetchCount() {
      const res = await fetch("/api/cart");
      if (!res.ok) return;
      const data = await res.json();
      const items: CartItemLike[] = data.cart?.items ?? [];
      setCount(items.reduce((sum, item) => sum + item.quantity, 0));
    }

    fetchCount();
    return onCartUpdated(fetchCount);
  }, [session?.user]);

  const displayCount = session?.user ? count : 0;

  return (
    <span className="absolute -top-1.5 left-3.5 text-sm font-bold text-az-cta-orange">{displayCount}</span>
  );
}
