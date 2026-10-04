import Link from "next/link";

type CategoryLink = { slug: string; name: string };

const PRICE_BUCKETS: { label: string; min?: number; max?: number }[] = [
  { label: "Under $25", max: 25 },
  { label: "$25 to $50", min: 25, max: 50 },
  { label: "$50 to $100", min: 50, max: 100 },
  { label: "$100 to $200", min: 100, max: 200 },
  { label: "$200 & Above", min: 200 },
];

function hrefWith(
  searchParams: Record<string, string | undefined>,
  overrides: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value && !(key in overrides) && key !== "page") params.set(key, value);
  }
  for (const [key, value] of Object.entries(overrides)) {
    if (value) params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "?";
}

export function FilterSidebar({
  categories,
  categoryHeading = "Category",
  brands,
  searchParams,
}: {
  categories: CategoryLink[];
  categoryHeading?: string;
  brands: string[];
  searchParams: Record<string, string | undefined>;
}) {
  const activeBrands = new Set((searchParams.brand ?? "").split(",").filter(Boolean));
  const isActivePrice = (bucket: (typeof PRICE_BUCKETS)[number]) =>
    searchParams.minPrice === (bucket.min?.toString() ?? undefined) &&
    searchParams.maxPrice === (bucket.max?.toString() ?? undefined);

  function toggleBrand(brand: string): string | undefined {
    const next = new Set(activeBrands);
    if (next.has(brand)) next.delete(brand);
    else next.add(brand);
    return next.size > 0 ? Array.from(next).join(",") : undefined;
  }

  return (
    <aside className="w-full shrink-0 space-y-6 text-sm sm:w-56">
      {categories.length > 0 && (
        <div>
          <h3 className="mb-2 font-bold">{categoryHeading}</h3>
          <ul className="space-y-1.5">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/category/${cat.slug}`} className="hover:underline">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="mb-2 font-bold">Amazon Prime</h3>
        <Link
          href={hrefWith(searchParams, { prime: searchParams.prime ? undefined : "1" })}
          className="flex items-center gap-2 hover:underline"
        >
          <span
            className={`flex h-4 w-4 items-center justify-center rounded border ${searchParams.prime ? "bg-primary text-primary-foreground" : ""}`}
          >
            {searchParams.prime ? "✓" : ""}
          </span>
          <span className="text-az-prime">✔ prime</span>
        </Link>
      </div>

      {brands.length > 0 && (
        <div>
          <h3 className="mb-2 font-bold">Brands</h3>
          <ul className="space-y-1.5">
            {brands.map((brand) => (
              <li key={brand}>
                <Link href={hrefWith(searchParams, { brand: toggleBrand(brand) })} className="flex items-center gap-2 hover:underline">
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded border ${activeBrands.has(brand) ? "bg-primary text-primary-foreground" : ""}`}
                  >
                    {activeBrands.has(brand) ? "✓" : ""}
                  </span>
                  {brand}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="mb-2 font-bold">Customer Reviews</h3>
        <Link
          href={hrefWith(searchParams, { minRating: searchParams.minRating === "4" ? undefined : "4" })}
          className="flex items-center gap-2 hover:underline"
        >
          <span
            className={`h-3 w-3 rounded-full border ${searchParams.minRating === "4" ? "border-4 border-primary" : ""}`}
          />
          4 Stars &amp; Up
        </Link>
      </div>

      <div>
        <h3 className="mb-2 font-bold">Price</h3>
        <ul className="space-y-1.5">
          {PRICE_BUCKETS.map((bucket) => (
            <li key={bucket.label}>
              <Link
                href={hrefWith(searchParams, {
                  minPrice: isActivePrice(bucket) ? undefined : bucket.min?.toString(),
                  maxPrice: isActivePrice(bucket) ? undefined : bucket.max?.toString(),
                })}
                className="flex items-center gap-2 hover:underline"
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded border ${isActivePrice(bucket) ? "bg-primary text-primary-foreground" : ""}`}
                >
                  {isActivePrice(bucket) ? "✓" : ""}
                </span>
                {bucket.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
