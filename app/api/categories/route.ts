import { NextResponse } from "next/server";
import { getCategoryTree } from "@/lib/catalog";

export async function GET() {
  const categories = await getCategoryTree();
  return NextResponse.json({ categories });
}
