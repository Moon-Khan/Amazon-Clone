"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/chrome/Logo";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    router.push("/login?signedup=1");
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-4 px-4 py-10">
      <div className="rounded bg-az-header px-4 py-3">
        <Logo />
      </div>
      <div className="w-full rounded border p-6">
        <h1 className="mb-4 text-2xl font-medium">Create account</h1>
        {error && (
          <p className="mb-4 rounded border border-az-price bg-red-50 p-2 text-sm text-az-price">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Your name
            </label>
            <input id="name" name="name" type="text" required className="w-full rounded border border-neutral-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input id="email" name="email" type="email" required className="w-full rounded border border-neutral-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-muted-foreground">At least 8 characters.</p>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-az-cta-yellow px-4 py-2 text-sm font-medium hover:bg-az-cta-yellow-hover disabled:opacity-50"
          >
            {submitting ? "Creating account..." : "Create your Amazon Clone account"}
          </button>
        </form>
      </div>
      <p className="text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-az-link hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
