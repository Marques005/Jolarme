import { NextResponse } from "next/server";
import { getProduct } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ data: { items: [], quantity: 0, subtotal: 0, currency: "EUR" }, meta: { source: "mock", persistence: "client-localStorage" } });
}

export async function POST(request: Request) {
  const body = await request.json();
  const product = getProduct(body.productId);
  const quantity = Math.max(1, Number(body.quantity ?? 1));
  if (!product) return NextResponse.json({ error: { code: "PRODUCT_NOT_FOUND", message: "Produto não encontrado." } }, { status: 404 });
  if (product.stock === "unavailable") return NextResponse.json({ error: { code: "OUT_OF_STOCK", message: "Produto indisponível." } }, { status: 409 });
  return NextResponse.json({ data: { product, quantity, lineTotal: product.price * quantity, currency: "EUR" }, meta: { source: "mock", persisted: false } }, { status: 201 });
}
