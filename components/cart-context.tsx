"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Check, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CartLine, Product } from "@/lib/types";
import { formatPrice } from "@/lib/mock-data";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  total: number;
  isOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: number) => void;
  setQuantity: (id: number, quantity: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "jolarme-demo-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setLines(JSON.parse(saved));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setLines((current) => {
      const found = current.find((line) => line.product.id === product.id);
      return found
        ? current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + quantity } : line)
        : [...current, { product, quantity }];
    });
    setNotice(`${product.shortName} adicionado`);
    setTimeout(() => setNotice(""), 2200);
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: number) => setLines((current) => current.filter((line) => line.product.id !== id)), []);
  const setQuantity = useCallback((id: number, quantity: number) => {
    if (quantity < 1) return removeItem(id);
    setLines((current) => current.map((line) => line.product.id === id ? { ...line, quantity } : line));
  }, [removeItem]);

  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const total = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const value = useMemo(() => ({
    lines, count, total, isOpen, addItem, removeItem, setQuantity,
    clear: () => setLines([]), openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false),
  }), [lines, count, total, isOpen, addItem, removeItem, setQuantity]);

  return (
    <CartContext.Provider value={value}>
      {children}
      {notice && <div className="toast"><Check size={17} /> {notice}</div>}
      <div className={`drawer-backdrop ${isOpen ? "is-open" : ""}`} onClick={() => setIsOpen(false)} />
      <aside className={`cart-drawer ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}>
        <div className="drawer-head">
          <div>
            <span className="eyebrow">A sua seleção</span>
            <h2>Carrinho <small>{count} {count === 1 ? "artigo" : "artigos"}</small></h2>
          </div>
          <button className="icon-button" onClick={() => setIsOpen(false)} aria-label="Fechar carrinho"><X /></button>
        </div>
        <div className="drawer-body">
          {lines.length === 0 ? (
            <div className="empty-cart">
              <span><ShoppingBag /></span>
              <h3>O carrinho está vazio</h3>
              <p>Explore o catálogo e encontre a solução certa para o seu projeto.</p>
              <button className="button button-dark" onClick={() => setIsOpen(false)}>Continuar a comprar</button>
            </div>
          ) : lines.map(({ product, quantity }) => (
            <article className="cart-line" key={product.id}>
              <Link href={`/produtos/${product.slug}`} onClick={() => setIsOpen(false)} className="cart-line-image">
                <Image src={product.image} alt={product.shortName} fill sizes="88px" />
              </Link>
              <div className="cart-line-copy">
                <Link href={`/produtos/${product.slug}`} onClick={() => setIsOpen(false)}>{product.shortName}</Link>
                <span>{formatPrice(product.price)}</span>
                <div className="quantity-control compact">
                  <button onClick={() => setQuantity(product.id, quantity - 1)} aria-label="Diminuir"><Minus /></button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(product.id, quantity + 1)} aria-label="Aumentar"><Plus /></button>
                </div>
              </div>
              <button className="remove-line" onClick={() => removeItem(product.id)} aria-label="Remover"><Trash2 /></button>
            </article>
          ))}
        </div>
        {lines.length > 0 && (
          <div className="drawer-summary">
            <div><span>Subtotal</span><strong>{formatPrice(total)}</strong></div>
            <p>IVA incluído. Portes calculados no checkout.</p>
            <Link href="/carrinho" className="button button-orange button-block" onClick={() => setIsOpen(false)}>Ver carrinho</Link>
          </div>
        )}
      </aside>
    </CartContext.Provider>
  );
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
