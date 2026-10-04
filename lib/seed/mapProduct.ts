export type DummyJsonProduct = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  images: string[];
  thumbnail: string;
  reviews: Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }>;
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export type MappedProduct = {
  slug: string;
  title: string;
  brand: string;
  description: string;
  categoryId: string;
  basePrice: number;
  listPrice: number | null;
  images: string[];
  ratingAvg: number;
  ratingCount: number;
  stock: number;
  isPrimeEligible: boolean;
};

/**
 * Pure mapping from a DummyJSON product to our Product shape. `categoryId`
 * is resolved by the caller (our leaf Category row's id) since this function
 * has no DB access. DummyJSON's `price` is the pre-discount price and
 * `discountPercentage` derives our actual selling price, matching the
 * list-price-strikethrough + current-price pattern seen on amazon.com.
 */
export function mapDummyProductToProduct(
  dummy: DummyJsonProduct,
  categoryId: string,
): MappedProduct {
  const discount = dummy.discountPercentage ?? 0;
  const basePrice = round2(dummy.price * (1 - discount / 100));
  const listPrice = discount > 0.5 ? round2(dummy.price) : null;
  const images = dummy.images && dummy.images.length > 0 ? dummy.images : [dummy.thumbnail];

  return {
    slug: `${slugify(dummy.title)}-${dummy.id}`,
    title: dummy.title,
    brand: dummy.brand ?? "Generic",
    description: dummy.description,
    categoryId,
    basePrice,
    listPrice,
    images,
    ratingAvg: Math.round(dummy.rating * 10) / 10,
    ratingCount: dummy.reviews?.length ?? 0,
    stock: dummy.stock,
    // Deterministic (not random) so seeding is reproducible: ~2/3 of products are Prime-eligible.
    isPrimeEligible: dummy.id % 3 !== 0,
  };
}
