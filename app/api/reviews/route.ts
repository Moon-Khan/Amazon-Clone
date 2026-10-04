import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { validateReviewInput, submitReview } from "@/lib/reviews";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const productId = typeof body?.productId === "string" ? body.productId : null;
  if (!productId) return NextResponse.json({ error: "productId is required." }, { status: 400 });

  const validated = validateReviewInput(body ?? {});
  if (!validated.ok) return NextResponse.json({ error: validated.error }, { status: 400 });

  const { review, slug } = await submitReview(productId, session.user.id, validated.value);
  revalidatePath(`/product/${slug}`);

  return NextResponse.json({ review }, { status: 201 });
}
