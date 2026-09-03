import { NextRequest, NextResponse } from "next/server";
import { brands, categories, products } from "@/lib/mock-data";

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const q = normalize(params.get("q") ?? "");
  const category = params.get("categoria") ?? params.get("category");
  const brand = params.get("marca") ?? params.get("brand");
  const stock = params.get("stock");
  const sort = params.get("ordem") ?? params.get("sort") ?? "featured";
  const featured = params.get("featured");
  const page = Math.max(1, Number(params.get("pagina") ?? params.get("page") ?? 1));
  const limit = Math.min(48, Math.max(1, Number(params.get("limit") ?? 12)));

  let result = products.filter((product) => {
    const searchable = normalize(`${product.name} ${product.shortName} ${product.reference} ${product.brand} ${product.subcategory}`);
    return (!q || searchable.includes(q)) && (!category || product.category === category) && (!brand || product.brand === brand) && (!stock || product.stock === stock) && (!featured || product.featured);
  });

  result = [...result].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "name") return a.name.localeCompare(b.name, "pt");
    if (sort === "newest") return Number(Boolean(b.isNew)) - Number(Boolean(a.isNew));
    return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
  });

  const total = result.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const data = result.slice((page - 1) * limit, page * limit);
  return NextResponse.json({
    data,
    meta: { total, page, limit, pages, source: "mock", generatedAt: new Date().toISOString() },
    filters: { categories, brands, active: { q, category, brand, stock, sort } },
  });
}
