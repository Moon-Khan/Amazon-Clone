"use client";

import { useEffect } from "react";
import Link from "next/link";

export function ErrorState({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 px-4 py-20 text-center">
      <h1 className="text-xl font-bold">Something went wrong</h1>
      <p className="text-sm text-muted-foreground">
        We hit a snag loading this page. Please try again.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-az-cta-yellow px-5 py-2 text-sm font-medium hover:bg-az-cta-yellow-hover"
        >
          Try again
        </button>
        <Link href="/" className="rounded-full border px-5 py-2 text-sm font-medium hover:bg-neutral-50">
          Go to homepage
        </Link>
      </div>
    </div>
  );
}
