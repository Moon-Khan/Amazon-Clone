import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { addToWishlist, removeFromWishlist, isWishlisted } from "@/lib/wishlist";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const productId = new URL(request.url).searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId is required." }, { status: 400 });

  const wishlisted = await isWishlisted(session.user.id, productId);
  return NextResponse.json({ wishlisted });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const productId = typeof body?.productId === "string" ? body.productId : null;
  if (!productId) return NextResponse.json({ error: "productId is required." }, { status: 400 });

  await addToWishlist(session.user.id, productId);
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const productId = typeof body?.productId === "string" ? body.productId : null;
  if (!productId) return NextResponse.json({ error: "productId is required." }, { status: 400 });

  await removeFromWishlist(session.user.id, productId);
  return NextResponse.json({ ok: true });
}
