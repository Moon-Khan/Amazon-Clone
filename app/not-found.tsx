import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">We can&apos;t find that page</h1>
      <p className="text-sm text-muted-foreground">
        The link may be broken, or the page may have moved. Try searching instead, or head back home.
      </p>
      <Link
        href="/"
        className="rounded-full bg-az-cta-yellow px-6 py-2 text-sm font-medium hover:bg-az-cta-yellow-hover"
      >
        Back to homepage
      </Link>
    </div>
  );
}
