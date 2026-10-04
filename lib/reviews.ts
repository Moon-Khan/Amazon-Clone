import { prisma } from "./prisma";

export type ReviewInput = { rating: number; title?: string; body: string };

/** Pure: validates raw review input, returning a normalized value or an error message. */
export function validateReviewInput(input: {
  rating: unknown;
  title?: unknown;
  body: unknown;
}): { ok: true; value: ReviewInput } | { ok: false; error: string } {
  const rating = Number(input.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { ok: false, error: "Rating must be a whole number from 1 to 5." };
  }

  const body = typeof input.body === "string" ? input.body.trim() : "";
  if (body.length < 10) {
    return { ok: false, error: "Review must be at least 10 characters." };
  }
  if (body.length > 2000) {
    return { ok: false, error: "Review must be under 2000 characters." };
  }

  const title = typeof input.title === "string" && input.title.trim() ? input.title.trim().slice(0, 200) : undefined;

  return { ok: true, value: { rating, title, body } };
}

/** DB-touching: upserts a user's single review for a product, then recomputes the product's denormalized rating fields. */
export async function submitReview(productId: string, userId: string, input: ReviewInput) {
  const review = await prisma.review.upsert({
    where: { productId_userId: { productId, userId } },
    update: { rating: input.rating, title: input.title, body: input.body },
    create: { productId, userId, rating: input.rating, title: input.title, body: input.body },
    include: { user: { select: { name: true } } },
  });

  const agg = await prisma.review.aggregate({ where: { productId }, _avg: { rating: true }, _count: true });
  const product = await prisma.product.update({
    where: { id: productId },
    data: { ratingAvg: agg._avg.rating ?? 0, ratingCount: agg._count },
    select: { slug: true },
  });

  return { review, slug: product.slug };
}
