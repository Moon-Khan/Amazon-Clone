"use client";

import { ErrorState } from "@/components/ErrorState";

export default function WishlistError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorState error={error} reset={reset} />;
}
