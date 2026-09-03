"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart, ShoppingBag, Star } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/mock-data";
import { useCart } from "./cart-context";
import { useState } from "react";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [favorite, setFavorite] = useState(false);

  return (
    <article className="product-card">
      <div className="product-card-media">
        {product.badge && <span className="product-badge">{product.badge}</span>}
        {product.isNew && !product.badge && <span className="product-badge blue">Novo</span>}
        <button className={`favorite-button ${favorite ? "active" : ""}`} onClick={() => setFavorite((value) => !value)} aria-label="Adicionar aos favoritos"><Heart /></button>
        <Link href={`/produtos/${product.slug}`}><Image src={product.image} alt={product.shortName} fill sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 25vw" /></Link>
      </div>
      <div className="product-card-body">
        <div className="product-meta"><span>{product.brand}</span><span><Star size={13} fill="currentColor" /> {product.rating}</span></div>
        <Link href={`/produtos/${product.slug}`} className="product-title">{product.shortName}</Link>
        <small className="product-ref">Ref. {product.reference}</small>
        <div className={`stock ${product.stock}`}><i /> {product.stockLabel}</div>
        <div className="product-card-foot">
          <div className="price-wrap">{product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}<strong>{formatPrice(product.price)}</strong><small>IVA incluído</small></div>
          <button className="add-button" disabled={product.stock === "unavailable"} onClick={() => addItem(product)} aria-label="Adicionar ao carrinho"><ShoppingBag /></button>
        </div>
      </div>
      <Link href={`/produtos/${product.slug}`} className="quick-link">Ver detalhes <ArrowUpRight /></Link>
    </article>
  );
}
