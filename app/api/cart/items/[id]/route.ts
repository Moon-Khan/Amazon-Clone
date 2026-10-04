import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateItemQuantity, removeItem } from "@/lib/cart";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const quantity = Number(body?.quantity);
  if (!Number.isFinite(quantity)) {
    return NextResponse.json({ error: "quantity is required." }, { status: 400 });
  }

  const cart = await updateItemQuantity(session.user.id, id, Math.floor(quantity));
  if (!cart) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ cart });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const cart = await removeItem(session.user.id, id);
  if (!cart) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ cart });
}
