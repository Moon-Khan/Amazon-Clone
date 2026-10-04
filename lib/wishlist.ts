import { prisma } from "./prisma";

/** DB-touching: all wishlisted products for a user, newest first. */
export async function getWishlist(userId: string) {
  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    orderBy: { addedAt: "desc" },
    include: { product: true },
  });
  return items.map((i) => i.product);
}

/** DB-touching: the set of product ids a user has wishlisted (for toggle-button state). */
export async function getWishlistProductIds(userId: string): Promise<Set<string>> {
  const items = await prisma.wishlistItem.findMany({ where: { userId }, select: { productId: true } });
  return new Set(items.map((i) => i.productId));
}

/** DB-touching: whether a single product is in a user's wishlist. */
export async function isWishlisted(userId: string, productId: string): Promise<boolean> {
  const item = await prisma.wishlistItem.findUnique({ where: { userId_productId: { userId, productId } } });
  return item !== null;
}

/** DB-touching: idempotent add. */
export async function addToWishlist(userId: string, productId: string) {
  await prisma.wishlistItem.upsert({
    where: { userId_productId: { userId, productId } },
    update: {},
    create: { userId, productId },
  });
}

/** DB-touching: idempotent remove. */
export async function removeFromWishlist(userId: string, productId: string) {
  await prisma.wishlistItem.deleteMany({ where: { userId, productId } });
}
