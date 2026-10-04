import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCart } from "@/lib/cart";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cart = await getCart(session.user.id);
  return NextResponse.json({ cart });
}
