"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck } from "lucide-react";
import { useCart } from "@/components/cart-context";
import { formatPrice } from "@/lib/mock-data";

export default function CartPage() {
  const { lines, total, setQuantity, removeItem, clear } = useCart();
  const shipping = total >= 100 ? 0 : 6.9;

  return (
    <div className="cart-page page-surface">
      <div className="container">
        <div className="simple-page-head"><span className="eyebrow">A sua encomenda</span><h1>Carrinho de compras</h1><p>Confirme os artigos antes de avançar.</p></div>
        {lines.length === 0 ? (
          <div className="cart-empty-page"><span><ShoppingBag /></span><h2>O seu carrinho está vazio</h2><p>Ainda não adicionou nenhum produto.</p><Link href="/produtos" className="button button-orange">Explorar produtos</Link></div>
        ) : (
          <div className="cart-page-grid">
            <section className="cart-items-panel">
              <div className="panel-head"><h2>Produtos <small>({lines.length})</small></h2><button onClick={clear}><Trash2 /> Limpar</button></div>
              {lines.map(({ product, quantity }) => <article className="cart-page-line" key={product.id}>
                <Link href={`/produtos/${product.slug}`} className="cart-page-image"><Image src={product.image} alt={product.shortName} fill sizes="120px" /></Link>
                <div className="cart-page-copy"><span>{product.brand}</span><Link href={`/produtos/${product.slug}`}>{product.shortName}</Link><small>Ref. {product.reference}</small><div className={`stock ${product.stock}`}><i /> {product.stockLabel}</div></div>
                <div className="cart-page-actions"><strong>{formatPrice(product.price * quantity)}</strong><div className="quantity-control compact"><button onClick={() => setQuantity(product.id, quantity - 1)}><Minus /></button><span>{quantity}</span><button onClick={() => setQuantity(product.id, quantity + 1)}><Plus /></button></div><button className="line-delete" onClick={() => removeItem(product.id)}>Remover</button></div>
              </article>)}
              <Link href="/produtos" className="back-shopping"><ArrowLeft /> Continuar a comprar</Link>
            </section>
            <aside className="order-summary">
              <h2>Resumo</h2>
              <div><span>Subtotal</span><strong>{formatPrice(total)}</strong></div>
              <div><span>Envio</span><strong>{shipping ? formatPrice(shipping) : "Grátis"}</strong></div>
              {shipping > 0 && <div className="shipping-progress"><p>Faltam <strong>{formatPrice(100 - total)}</strong> para envio grátis</p><i><span style={{ width: `${Math.min(100, total)}%` }} /></i></div>}
              <div className="summary-total"><span>Total <small>IVA incluído</small></span><strong>{formatPrice(total + shipping)}</strong></div>
              <button className="button button-orange button-block" onClick={() => alert("Checkout de demonstração — nenhuma cobrança será efetuada.")}>Finalizar encomenda</button>
              <p className="secure-note"><ShieldCheck /> Pagamento seguro e encriptado</p>
              <div className="summary-benefits"><p><Check /> Apoio técnico incluído</p><p><Truck /> Entrega acompanhada</p></div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
