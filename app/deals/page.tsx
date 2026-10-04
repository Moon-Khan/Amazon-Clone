import { getDealsPage, toProductCardData } from "@/lib/catalog";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Pagination } from "@/components/catalog/Pagination";

export const revalidate = 60;

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageRaw } = await searchParams;
  const page = Math.max(1, Number(pageRaw) || 1);
  const result = await getDealsPage(page, 24);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6">
      <h1 className="mb-1 text-2xl font-bold">Today&apos;s Deals</h1>
      <p className="mb-4 text-sm text-muted-foreground">{result.total} deals available right now.</p>
      <ProductGrid products={result.products.map(toProductCardData)} />
      <Pagination page={result.page} totalPages={result.totalPages} searchParams={{ page: pageRaw }} />
    </div>
  );
}
