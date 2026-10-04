import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { placeOrder, EmptyCartError, InvalidAddressError, OutOfStockError } from "@/lib/checkout";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const addressId = typeof body?.addressId === "string" ? body.addressId : null;
  if (!addressId) return NextResponse.json({ error: "addressId is required." }, { status: 400 });

  try {
    const order = await placeOrder(session.user.id, addressId);
    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    if (err instanceof EmptyCartError || err instanceof InvalidAddressError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    if (err instanceof OutOfStockError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    throw err;
  }
}
