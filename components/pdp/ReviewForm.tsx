"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Star } from "lucide-react";

export function ReviewForm({ productId }: { productId: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (status === "loading") return null;

  if (!session?.user) {
    return (
      <p className="text-sm text-muted-foreground">
        <Link href="/login" className="text-az-link hover:underline">
          Sign in
        </Link>{" "}
        to write a review.
      </p>
    );
  }

  if (done) {
    return <p className="text-sm font-medium text-green-700">Thanks — your review has been posted.</p>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, title, body }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: "Something went wrong." }));
      setError(data.error ?? "Something went wrong.");
      return;
    }

    setDone(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-3 rounded-lg border p-4">
      <h3 className="font-bold">Write a customer review</h3>

      <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n} star${n === 1 ? "" : "s"}`}
            onClick={() => setRating(n)}
            onMouseEnter={() => setHoverRating(n)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-0.5"
          >
            <Star
              className={`h-6 w-6 ${
                n <= (hoverRating || rating) ? "fill-az-prime text-az-prime" : "fill-none text-neutral-300"
              }`}
            />
          </button>
        ))}
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Review title (optional)"
        className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
        maxLength={200}
      />

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="What did you like or dislike? What did you use this product for?"
        className="h-24 w-full rounded border border-neutral-300 px-3 py-2 text-sm"
        maxLength={2000}
      />

      {error && <p className="text-sm text-az-price">{error}</p>}

      <button
        type="submit"
        disabled={submitting || rating === 0}
        className="rounded-full bg-az-cta-yellow px-5 py-2 text-sm font-medium hover:bg-az-cta-yellow-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        Submit review
      </button>
    </form>
  );
}
