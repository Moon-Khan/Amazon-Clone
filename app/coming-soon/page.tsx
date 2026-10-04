import Link from "next/link";

export default async function ComingSoonPage({
  searchParams,
}: {
  searchParams: Promise<{ feature?: string }>;
}) {
  const { feature } = await searchParams;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">{feature ? `${feature} isn’t part of this build` : "Coming soon"}</h1>
      <p className="text-sm text-muted-foreground">
        This is a scoped rebuild of amazon.com’s core shopping flow (browse, search, product detail, cart,
        checkout, orders) — {feature ? `${feature} wasn't` : "this feature wasn't"} part of that scope.
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
