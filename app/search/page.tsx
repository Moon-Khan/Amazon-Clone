import {
  parseProductSearchParams,
  queryProducts,
  getAvailableBrands,
  resolveCategoryIds,
  getCategoryTree,
  toProductCardData,
} from "@/lib/catalog";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { SortSelect } from "@/components/catalog/SortSelect";
import { Pagination } from "@/components/catalog/Pagination";

type RawSearchParams = Record<string, string | string[] | undefined>;

function flatten(raw: RawSearchParams): Record<string, string | undefined> {
  return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]));
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const rawSearchParams = await searchParams;
  const parsed = parseProductSearchParams(rawSearchParams);
  const result = await queryProducts(parsed);

  const categoryIds = parsed.category ? await resolveCategoryIds(parsed.category) : undefined;
  const [brands, categoryTree] = await Promise.all([
    getAvailableBrands(categoryIds),
    getCategoryTree(),
  ]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold">
        {parsed.q ? `Results for "${parsed.q}"` : "All Products"}
      </h1>
      <div className="flex flex-col gap-6 sm:flex-row">
        <FilterSidebar
          categories={categoryTree.map((c) => ({ slug: c.slug, name: c.name }))}
          categoryHeading="Department"
          brands={brands}
          searchParams={flatten(rawSearchParams)}
        />
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{result.total} results</p>
            <SortSelect value={parsed.sort} />
          </div>
          <ProductGrid products={result.products.map(toProductCardData)} />
          <Pagination page={result.page} totalPages={result.totalPages} searchParams={flatten(rawSearchParams)} />
        </div>
      </div>
    </div>
  );
}
