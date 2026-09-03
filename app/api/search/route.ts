import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/mock-data";

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export async function GET(request: NextRequest) {
  const query = normalize(request.nextUrl.searchParams.get("q") ?? "");
  const data = query.length < 2 ? [] : products.filter((product) => normalize(`${product.name} ${product.reference} ${product.brand}`).includes(query)).slice(0, 8);
  return NextResponse.json({ data, meta: { query, total: data.length, source: "mock" } });
}
