import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export type SortOption = "relevance" | "price_asc" | "price_desc" | "rating" | "newest";

export type ProductQueryParams = {
  q?: string;
  category?: string; // leaf or parent Category slug
  brand?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  prime?: boolean;
  sort: SortOption;
  page: number;
  limit: number;
};

const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 48;
const SORT_OPTIONS: SortOption[] = ["relevance", "price_asc", "price_desc", "rating", "newest"];

function toPositiveInt(value: string | undefined, fallback: number, max?: number): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  const int = Math.floor(n);
  return max ? Math.min(int, max) : int;
}

function toPositiveFloat(value: string | undefined): number | undefined {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

/** Pure: normalizes raw (URL search params style) input into typed, bounded query params. */
export function parseProductSearchParams(
  raw: Record<string, string | string[] | undefined>,
): ProductQueryParams {
  const single = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const sortRaw = single(raw.sort);
  const sort = SORT_OPTIONS.includes(sortRaw as SortOption) ? (sortRaw as SortOption) : "relevance";

  const brandRaw = raw.brand;
  const brand = Array.isArray(brandRaw)
    ? brandRaw.filter(Boolean)
    : typeof brandRaw === "string" && brandRaw.length > 0
      ? brandRaw.split(",").filter(Boolean)
      : undefined;

  return {
    q: single(raw.q)?.trim() || undefined,
    category: single(raw.category) && single(raw.category) !== "all" ? single(raw.category) : undefined,
    brand,
    minPrice: toPositiveFloat(single(raw.minPrice)),
    maxPrice: toPositiveFloat(single(raw.maxPrice)),
    minRating: toPositiveFloat(single(raw.minRating)),
    prime: single(raw.prime) === "1" ? true : undefined,
    sort,
    page: toPositiveInt(single(raw.page), 1),
    limit: toPositiveInt(single(raw.limit), DEFAULT_LIMIT, MAX_LIMIT),
  };
}

/** Pure: builds the Prisma where-clause. `categoryIds` is resolved by the caller (DB lookup), not here. */
export function buildProductWhere(
  params: Pick<ProductQueryParams, "q" | "brand" | "minPrice" | "maxPrice" | "minRating" | "prime">,
  categoryIds?: string[],
): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};

  if (categoryIds && categoryIds.length > 0) {
    where.categoryId = { in: categoryIds };
  }

  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: "insensitive" } },
      { brand: { contains: params.q, mode: "insensitive" } },
      { description: { contains: params.q, mode: "insensitive" } },
    ];
  }

  if (params.brand && params.brand.length > 0) {
    where.brand = { in: params.brand };
  }

  if (params.minPrice !== undefined || params.maxPrice !== undefined) {
    where.basePrice = {
      ...(params.minPrice !== undefined ? { gte: params.minPrice } : {}),
      ...(params.maxPrice !== undefined ? { lte: params.maxPrice } : {}),
    };
  }

  if (params.minRating !== undefined) {
    where.ratingAvg = { gte: params.minRating };
  }

  if (params.prime) {
    where.isPrimeEligible = true;
  }

  return where;
}

/** Pure: builds the Prisma orderBy clause for a sort option. */
export function buildProductOrderBy(sort: SortOption): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case "price_asc":
      return [{ basePrice: "asc" }];
    case "price_desc":
      return [{ basePrice: "desc" }];
    case "rating":
      return [{ ratingAvg: "desc" }, { ratingCount: "desc" }];
    case "newest":
      return [{ createdAt: "desc" }];
    case "relevance":
    default:
      return [{ ratingCount: "desc" }, { createdAt: "desc" }];
  }
}

/** DB-touching: expands a category slug (leaf or parent) into the leaf category ids to filter by. */
export async function resolveCategoryIds(categorySlug: string): Promise<string[] | undefined> {
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    include: { children: true },
  });
  if (!category) return undefined;
  if (category.children.length > 0) return category.children.map((c) => c.id);
  return [category.id];
}

export type ProductListItem = Awaited<ReturnType<typeof queryProducts>>["products"][number];

/** Converts a Prisma Product's Decimal fields into plain numbers for client-safe rendering. */
export function toProductCardData(product: {
  slug: string;
  title: string;
  brand: string;
  images: unknown;
  basePrice: { toNumber(): number };
  listPrice: { toNumber(): number } | null;
  ratingAvg: number;
  ratingCount: number;
  isPrimeEligible: boolean;
}) {
  return {
    slug: product.slug,
    title: product.title,
    brand: product.brand,
    images: product.images as string[],
    basePrice: product.basePrice.toNumber(),
    listPrice: product.listPrice ? product.listPrice.toNumber() : null,
    ratingAvg: product.ratingAvg,
    ratingCount: product.ratingCount,
    isPrimeEligible: product.isPrimeEligible,
  };
}

/** DB-touching: resolves category, runs the filtered/sorted/paginated product query. */
export async function queryProducts(params: ProductQueryParams) {
  const categoryIds = params.category ? await resolveCategoryIds(params.category) : undefined;
  const where = buildProductWhere(params, categoryIds);
  const orderBy = buildProductOrderBy(params.sort);
  const skip = (params.page - 1) * params.limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: params.limit,
      include: { category: true },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page: params.page,
    limit: params.limit,
    totalPages: Math.max(1, Math.ceil(total / params.limit)),
  };
}

/** DB-touching: distinct brands available within a category scope, for the filter sidebar. */
export async function getAvailableBrands(categoryIds?: string[]): Promise<string[]> {
  const rows = await prisma.product.findMany({
    where: categoryIds && categoryIds.length > 0 ? { categoryId: { in: categoryIds } } : {},
    select: { brand: true },
    distinct: ["brand"],
    orderBy: { brand: "asc" },
  });
  return rows.map((r) => r.brand);
}

/** DB-touching: top discounted products for the home page's deals rail. */
export async function getTopDeals(limit = 8) {
  const deals = await prisma.deal.findMany({
    orderBy: { discountPercent: "desc" },
    take: limit,
    distinct: ["productId"],
    include: { product: true },
  });
  return deals.map((d) => d.product);
}

/** DB-touching: paginated deal-backed products for the standalone /deals page. */
export async function getDealsPage(page: number, limit: number) {
  const skip = (page - 1) * limit;
  const [deals, total] = await Promise.all([
    prisma.deal.findMany({
      orderBy: { discountPercent: "desc" },
      distinct: ["productId"],
      skip,
      take: limit,
      include: { product: true },
    }),
    prisma.deal.findMany({ distinct: ["productId"], select: { productId: true } }).then((rows) => rows.length),
  ]);
  return { products: deals.map((d) => d.product), total, page, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

/** DB-touching: a few top-level categories with a handful of preview products each, for home-page rails. */
export async function getCategoryRails(categoryCount = 4, productsPerCategory = 4) {
  const topLevel = await prisma.category.findMany({
    where: { parentId: null },
    take: categoryCount,
    orderBy: { name: "asc" },
  });

  const rails = await Promise.all(
    topLevel.map(async (category) => {
      const leafIds = await resolveCategoryIds(category.slug);
      const products = await prisma.product.findMany({
        where: leafIds ? { categoryId: { in: leafIds } } : undefined,
        orderBy: [{ ratingCount: "desc" }],
        take: productsPerCategory,
      });
      return { category, products };
    }),
  );

  return rails;
}

/** DB-touching: full product detail for the PDP - variants, category, and reviews with reviewer names. */
export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: { orderBy: { value: "asc" } },
      reviews: {
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
      },
    },
  });
}

/** DB-touching: a handful of other products in the same category, for the PDP's related-products rail. */
export async function getRelatedProducts(categoryId: string, excludeProductId: string, limit = 6) {
  return prisma.product.findMany({
    where: { categoryId, id: { not: excludeProductId } },
    orderBy: [{ ratingCount: "desc" }],
    take: limit,
  });
}

export async function getCategoryTree() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const byParent = new Map<string | null, typeof categories>();
  for (const cat of categories) {
    const key = cat.parentId;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(cat);
  }
  const top = byParent.get(null) ?? [];
  return top.map((parent) => ({
    ...parent,
    children: byParent.get(parent.id) ?? [],
  }));
}
