import { NextResponse } from "next/server";
import { getProduct, products } from "@/lib/mock-data";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return NextResponse.json({ error: { code: "PRODUCT_NOT_FOUND", message: "Produto não encontrado." } }, { status: 404 });
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  return NextResponse.json({ data: product, included: { related }, meta: { source: "mock" } });
}
