"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check, ChevronRight, Heart, Minus, PackageCheck, Plus, RotateCcw, Share2, ShieldCheck, ShoppingBag, Star, Truck } from "lucide-react";
import { Product } from "@/lib/types";
import { categories, formatPrice } from "@/lib/mock-data";
import { useCart } from "./cart-context";
import { ProductCard } from "./product-card";

export function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<"description" | "specs" | "shipping">("description");
  const [favorite, setFavorite] = useState(false);
  const { addItem } = useCart();
  const category = categories.find((item) => item.id === product.category);

  return (
    <div className="product-page">
      <div className="container breadcrumbs product-breadcrumbs"><Link href="/">Início</Link><ChevronRight /><Link href="/produtos">Produtos</Link><ChevronRight /><Link href={`/produtos?categoria=${product.category}`}>{category?.shortName}</Link><ChevronRight /><strong>{product.shortName}</strong></div>
      <section className="container product-detail-grid">
        <div className="product-gallery">
          <div className="gallery-thumbs"><button className="active"><Image src={product.image} alt="" fill sizes="76px" /></button>{[1, 2].map((item) => <button className="placeholder-thumb" key={item}><span /></button>)}</div>
          <div className="main-product-image">{product.badge && <span className="product-badge">{product.badge}</span>}<Image src={product.image} alt={product.name} fill priority sizes="(max-width: 800px) 90vw, 550px" /></div>
        </div>
        <div className="product-info">
          <div className="product-info-top"><span className="brand-pill">{product.brand}</span><div><button onClick={() => setFavorite((value) => !value)} className={favorite ? "active" : ""}><Heart fill={favorite ? "currentColor" : "none"} /> Guardar</button><button><Share2 /> Partilhar</button></div></div>
          <h1>{product.name}</h1>
          <div className="rating-row"><span><Star fill="currentColor" /> {product.rating}</span><a href="#reviews">{product.reviews} avaliações</a><small>Ref. {product.reference}</small></div>
          <div className="product-price-large">{product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}<strong>{formatPrice(product.price)}</strong><small>{formatPrice(product.price / 1.23)} sem IVA</small></div>
          <div className={`availability-box ${product.stock}`}><span><Check /></span><div><strong>{product.stockLabel}</strong><small>{product.stock === "available" ? "Encomende hoje, expedição em 24–48h" : product.stock === "limited" ? "Prazo estimado após confirmação" : "Contacte-nos para alternativa"}</small></div></div>
          <p className="product-lead">{product.description}</p>
          <ul className="feature-list">{product.features.slice(0, 4).map((feature) => <li key={feature}><Check /> {feature}</li>)}</ul>
          <div className="purchase-row">
            <div className="quantity-control"><button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus /></button><span>{quantity}</span><button onClick={() => setQuantity(quantity + 1)}><Plus /></button></div>
            <button className="button button-orange add-main" disabled={product.stock === "unavailable"} onClick={() => addItem(product, quantity)}><ShoppingBag /> {product.stock === "unavailable" ? "Indisponível" : "Adicionar ao carrinho"}</button>
          </div>
          <div className="product-assurances"><div><Truck /><span><strong>Envio para todo o país</strong><small>Entrega rápida e acompanhada</small></span></div><div><ShieldCheck /><span><strong>Compra segura</strong><small>Pagamento protegido</small></span></div><div><PackageCheck /><span><strong>Garantia oficial</strong><small>Assistência em Portugal</small></span></div></div>
        </div>
      </section>

      <section className="container product-tabs-section">
        <div className="product-tabs"><button className={tab === "description" ? "active" : ""} onClick={() => setTab("description")}>Descrição</button><button className={tab === "specs" ? "active" : ""} onClick={() => setTab("specs")}>Características técnicas</button><button className={tab === "shipping" ? "active" : ""} onClick={() => setTab("shipping")}>Envio e devoluções</button></div>
        <div className="tab-content">
          {tab === "description" && <div className="description-content"><div><span className="eyebrow">Sobre o produto</span><h2>Desempenho fiável, instalação simples</h2><p>{product.description} Foi selecionado pela equipa Jolarme para oferecer uma solução robusta, compatível e fácil de integrar no seu sistema.</p><ul>{product.features.map((feature) => <li key={feature}><Check /> {feature}</li>)}</ul></div><aside><ShieldCheck /><h3>Dúvidas de compatibilidade?</h3><p>Fale connosco antes de comprar. Ajudamos a confirmar todos os componentes.</p><Link href="/contactos" className="text-link">Pedir ajuda técnica →</Link></aside></div>}
          {tab === "specs" && <div className="spec-table">{Object.entries(product.specs).map(([key, value]) => <div key={key}><strong>{key}</strong><span>{value}</span></div>)}</div>}
          {tab === "shipping" && <div className="shipping-copy"><RotateCcw /><div><h2>Envio rápido e devoluções simples</h2><p>Expedição habitual em 24–48 horas para produtos em stock. Pode solicitar devolução nos termos legais; contacte a equipa para receber instruções e acompanhamento.</p></div></div>}
        </div>
      </section>

      {related.length > 0 && <section className="section related-section"><div className="container"><div className="section-head"><div><span className="eyebrow">Complete a solução</span><h2>Também pode interessar</h2></div><Link href={`/produtos?categoria=${product.category}`} className="text-link">Ver categoria →</Link></div><div className="product-grid">{related.map((item) => <ProductCard product={item} key={item.id} />)}</div></div></section>}
    </div>
  );
}
