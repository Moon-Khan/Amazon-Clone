import { PrismaClient } from "@prisma/client";
import { CATEGORY_TAXONOMY, buildDummyjsonCategoryMap } from "../lib/seed/taxonomy";
import { mapDummyProductToProduct, type DummyJsonProduct } from "../lib/seed/mapProduct";

const prisma = new PrismaClient();

const PRODUCT_LIMIT = 150;
const SEEDED_USER_PASSWORD_HASH = "SEEDED_NO_LOGIN"; // not a valid bcrypt hash - these accounts can never log in

// Leaf category slugs eligible for color/size variants (apparel & shoes).
const VARIANT_ELIGIBLE_CATEGORIES = new Set([
  "mens-shirts",
  "mens-shoes",
  "womens-shoes",
  "womens-dresses",
  "womens-tops",
]);
const VARIANT_TARGET_COUNT = 15;

const APPAREL_SIZES = ["S", "M", "L", "XL"];
const SHOE_SIZES = ["8", "9", "10", "11"];

async function seedCategories(): Promise<Map<string, string>> {
  const leafIdBySlug = new Map<string, string>();

  for (const node of CATEGORY_TAXONOMY) {
    const parent = await prisma.category.upsert({
      where: { slug: node.slug },
      update: { name: node.name },
      create: { slug: node.slug, name: node.name },
    });

    if (node.children) {
      for (const child of node.children) {
        const row = await prisma.category.upsert({
          where: { slug: child.slug },
          update: { name: child.name, parentId: parent.id },
          create: { slug: child.slug, name: child.name, parentId: parent.id },
        });
        leafIdBySlug.set(row.slug, row.id);
      }
    } else {
      leafIdBySlug.set(parent.slug, parent.id);
    }
  }

  console.log(`Seeded ${leafIdBySlug.size} leaf categories.`);
  return leafIdBySlug;
}

async function fetchDummyProducts(): Promise<DummyJsonProduct[]> {
  const res = await fetch(`https://dummyjson.com/products?limit=${PRODUCT_LIMIT}`);
  if (!res.ok) throw new Error(`DummyJSON fetch failed: ${res.status}`);
  const data = (await res.json()) as { products: DummyJsonProduct[] };
  return data.products;
}

async function upsertReviewer(name: string, email: string): Promise<string> {
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name, passwordHash: SEEDED_USER_PASSWORD_HASH },
  });
  return user.id;
}

async function main() {
  const leafIdBySlug = await seedCategories();
  const dummyToLeafSlug = buildDummyjsonCategoryMap();

  const dummyProducts = await fetchDummyProducts();
  console.log(`Fetched ${dummyProducts.length} products from DummyJSON.`);

  const variantEligibleSlugs: string[] = [];
  let productCount = 0;
  let reviewCount = 0;
  let dealCount = 0;

  for (const dummy of dummyProducts) {
    try {
      const leafSlug = dummyToLeafSlug.get(dummy.category);
      const categoryId = leafSlug ? leafIdBySlug.get(leafSlug) : undefined;
      if (!categoryId) {
        console.warn(`Skipping product ${dummy.id} - unmapped category "${dummy.category}".`);
        continue;
      }

      const mapped = mapDummyProductToProduct(dummy, categoryId);
      const product = await prisma.product.upsert({
        where: { slug: mapped.slug },
        update: mapped,
        create: mapped,
      });
      productCount++;

      if (leafSlug && VARIANT_ELIGIBLE_CATEGORIES.has(leafSlug) && variantEligibleSlugs.length < VARIANT_TARGET_COUNT) {
        variantEligibleSlugs.push(product.id);
        const isShoe = leafSlug.includes("shoes");
        const values = isShoe ? SHOE_SIZES : APPAREL_SIZES;
        const perVariantStock = Math.max(1, Math.floor(dummy.stock / values.length));
        for (const value of values) {
          await prisma.productVariant.upsert({
            where: { sku: `${product.slug}-${value}` },
            update: { stock: perVariantStock },
            create: {
              productId: product.id,
              type: "size",
              value,
              stock: perVariantStock,
              sku: `${product.slug}-${value}`,
            },
          });
        }
      }

      const reviews = dummy.reviews ?? [];
      if (reviews.length > 0) {
        const existingReviewCount = await prisma.review.count({ where: { productId: product.id } });
        if (existingReviewCount < reviews.length) {
          for (const review of reviews) {
            const userId = await upsertReviewer(review.reviewerName, review.reviewerEmail);
            await prisma.review.upsert({
              where: { productId_userId: { productId: product.id, userId } },
              update: {},
              create: {
                productId: product.id,
                userId,
                rating: review.rating,
                body: review.comment,
                createdAt: new Date(review.date),
              },
            });
            reviewCount++;
          }
        }
      }

      if (mapped.listPrice !== null) {
        const existingDeal = await prisma.deal.findFirst({ where: { productId: product.id } });
        if (!existingDeal) {
          const discountPercent = Math.round((1 - mapped.basePrice / mapped.listPrice) * 100);
          const startsAt = new Date();
          const endsAt = new Date(startsAt.getTime() + 7 * 24 * 60 * 60 * 1000);
          await prisma.deal.create({
            data: { productId: product.id, discountPercent, startsAt, endsAt },
          });
          dealCount++;
        }
      }
    } catch (err) {
      // A transient Neon connection drop shouldn't abort a 150-product run;
      // log and move on. Upserts make a full re-run of this script safe.
      console.warn(`Skipping product ${dummy.id} after error:`, err instanceof Error ? err.message : err);
    }
  }

  console.log(`Seeded ${productCount} products, ${variantEligibleSlugs.length} with variants, ${reviewCount} reviews, ${dealCount} deals.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
