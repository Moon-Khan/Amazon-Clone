import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function assertOwnership(addressId: string, userId: string) {
  const address = await prisma.address.findUnique({ where: { id: addressId } });
  return address && address.userId === userId ? address : null;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const owned = await assertOwnership(id, session.user.id);
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  const { line1, line2, city, state, zip, country, isDefault } = body ?? {};

  if (isDefault) {
    await prisma.address.updateMany({ where: { userId: session.user.id }, data: { isDefault: false } });
  }

  const address = await prisma.address.update({
    where: { id },
    data: {
      ...(typeof line1 === "string" ? { line1 } : {}),
      ...(typeof line2 === "string" ? { line2: line2 || null } : {}),
      ...(typeof city === "string" ? { city } : {}),
      ...(typeof state === "string" ? { state } : {}),
      ...(typeof zip === "string" ? { zip } : {}),
      ...(typeof country === "string" ? { country } : {}),
      ...(typeof isDefault === "boolean" ? { isDefault } : {}),
    },
  });

  return NextResponse.json({ address });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const owned = await assertOwnership(id, session.user.id);
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.address.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
