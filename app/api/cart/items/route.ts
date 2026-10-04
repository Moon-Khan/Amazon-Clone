import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { addItem } from "@/lib/cart";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const productId = typeof body?.productId === "string" ? body.productId : null;
  const variantId = typeof body?.variantId === "string" ? body.variantId : null;
  const quantity = Number(body?.quantity);
  const protectionPlan = body?.protectionPlan === true;

  if (!productId || !Number.isFinite(quantity) || quantity <= 0) {
    return NextResponse.json({ error: "productId and a positive quantity are required." }, { status: 400 });
  }

  const cart = await addItem(session.user.id, productId, variantId, Math.floor(quantity), protectionPlan);
  return NextResponse.json({ cart }, { status: 201 });
}
