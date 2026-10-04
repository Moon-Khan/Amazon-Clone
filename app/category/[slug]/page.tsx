import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseProductSearchParams, queryProducts, getAvailableBrands, toProductCardData } from "@/lib/catalog";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { SortSelect } from "@/components/catalog/SortSelect";
import { Pagination } from "@/components/catalog/Pagination";

export const revalidate = 60;

type RawSearchParams = Record<string, string | string[] | undefined>;

function flatten(raw: RawSearchParams): Record<string, string | undefined> {
  return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]));
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<RawSearchParams>;
}) {
  const { slug } = await params;
  const rawSearchParams = await searchParams;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: { children: true, parent: { include: { children: true } } },
  });
  if (!category) notFound();

  const parsed = parseProductSearchParams({ ...rawSearchParams, category: slug });
  const result = await queryProducts(parsed);

  const categoryIds = category.children.length > 0 ? category.children.map((c) => c.id) : [category.id];
  const brands = await getAvailableBrands(categoryIds);

  const sidebarCategories = category.children.length > 0
    ? category.children.map((c) => ({ slug: c.slug, name: c.name }))
    : category.parent
      ? category.parent.children.map((c) => ({ slug: c.slug, name: c.name }))
      : [];
  const categoryHeading = category.children.length > 0 ? "Shop by " + category.name : category.parent?.name;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold">{category.name}</h1>
      <div className="flex flex-col gap-6 sm:flex-row">
        <FilterSidebar
          categories={sidebarCategories}
          categoryHeading={categoryHeading}
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
