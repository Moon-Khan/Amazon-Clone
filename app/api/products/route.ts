import { NextResponse } from "next/server";
import { parseProductSearchParams, queryProducts } from "@/lib/catalog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = Object.fromEntries(searchParams.entries());
  const params = parseProductSearchParams(raw);
  const result = await queryProducts(params);
  return NextResponse.json(result);
}
