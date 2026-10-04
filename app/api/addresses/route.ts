import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { isDefault: "desc" },
  });
  return NextResponse.json({ addresses });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const { line1, line2, city, state, zip, country, isDefault } = body ?? {};

  if (![line1, city, state, zip, country].every((v) => typeof v === "string" && v.trim().length > 0)) {
    return NextResponse.json({ error: "line1, city, state, zip, and country are required." }, { status: 400 });
  }

  if (isDefault) {
    await prisma.address.updateMany({ where: { userId: session.user.id }, data: { isDefault: false } });
  }

  const address = await prisma.address.create({
    data: {
      userId: session.user.id,
      line1,
      line2: typeof line2 === "string" && line2.trim() ? line2 : null,
      city,
      state,
      zip,
      country,
      isDefault: Boolean(isDefault),
    },
  });

  return NextResponse.json({ address }, { status: 201 });
}
