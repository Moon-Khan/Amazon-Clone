"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";

export function WishlistButton({ productId }: { productId: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!session?.user) return;
    let cancelled = false;
    fetch(`/api/wishlist?productId=${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setWishlisted(Boolean(data.wishlisted));
          setLoaded(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [session?.user, productId]);

  async function toggle() {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    setPending(true);
    const next = !wishlisted;
    const res = await fetch("/api/wishlist", {
      method: next ? "POST" : "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    setPending(false);
    if (res.ok) setWishlisted(next);
  }

  if (status === "loading") return null;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending || (Boolean(session?.user) && !loaded)}
      aria-pressed={wishlisted}
      className="flex items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 text-sm hover:border-neutral-500 disabled:opacity-50"
    >
      <Heart className={`h-4 w-4 ${wishlisted ? "fill-az-price text-az-price" : "fill-none text-neutral-600"}`} />
      {wishlisted ? "Saved" : "Add to List"}
    </button>
  );
}
