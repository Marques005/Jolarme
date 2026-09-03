import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/mock-data";
import { ProductDetail } from "@/components/product-detail";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  return <ProductDetail product={product} related={related} />;
}
