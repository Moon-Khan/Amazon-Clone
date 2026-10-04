import Link from "next/link";
import { loginAction } from "@/lib/auth-actions";
import { Logo } from "@/components/chrome/Logo";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-4 px-4 py-10">
      <div className="rounded bg-az-header px-4 py-3">
        <Logo />
      </div>
      <div className="w-full rounded border p-6">
        <h1 className="mb-4 text-2xl font-medium">Sign in</h1>
        {error && (
          <p className="mb-4 rounded border border-az-price bg-red-50 p-2 text-sm text-az-price">
            Invalid email or password.
          </p>
        )}
        <form action={loginAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
            />
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
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-az-cta-yellow px-4 py-2 text-sm font-medium hover:bg-az-cta-yellow-hover"
          >
            Sign in
          </button>
        </form>
      </div>
      <p className="text-sm">
        New to Amazon Clone?{" "}
        <Link href="/signup" className="text-az-link hover:underline">
          Create your account
        </Link>
      </p>
    </div>
  );
}
