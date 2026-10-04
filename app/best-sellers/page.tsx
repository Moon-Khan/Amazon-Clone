import { parseProductSearchParams, queryProducts, toProductCardData } from "@/lib/catalog";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Pagination } from "@/components/catalog/Pagination";

export const revalidate = 60;

type RawSearchParams = Record<string, string | string[] | undefined>;

function flatten(raw: RawSearchParams): Record<string, string | undefined> {
  return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]));
}

export default async function BestSellersPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const rawSearchParams = await searchParams;
  const parsed = parseProductSearchParams({ ...rawSearchParams, sort: "rating" });
  const result = await queryProducts(parsed);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6">
      <h1 className="mb-1 text-2xl font-bold">Best Sellers</h1>
      <p className="mb-4 text-sm text-muted-foreground">Our top-rated products, ranked by customer rating.</p>
      <ProductGrid products={result.products.map(toProductCardData)} />
      <Pagination page={result.page} totalPages={result.totalPages} searchParams={flatten(rawSearchParams)} />
    </div>
  );
}
