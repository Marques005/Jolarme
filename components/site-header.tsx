"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Headphones, Heart, LockKeyhole, Menu, Search, ShieldCheck, ShoppingBag, UserRound, X } from "lucide-react";
import { categories } from "@/lib/mock-data";
import { Product } from "@/lib/types";
import { useCart } from "./cart-context";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loginState, setLoginState] = useState<"idle" | "loading" | "ok">("idle");
  const { count, openCart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const searchBox = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
      const payload = await response.json();
      setResults(payload.data ?? []);
      setSearchOpen(true);
    }, 180);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!searchBox.current?.contains(event.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    if (query.trim()) router.push(`/produtos?q=${encodeURIComponent(query.trim())}`);
  }

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginState("loading");
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData)),
    });
    setLoginState(response.ok ? "ok" : "idle");
  }

  return (
    <header className="site-header">
      <div className="utility-bar">
        <div className="container utility-inner">
          <div className="utility-message"><ShieldCheck size={15} /> Apoio técnico de instalação gratuito</div>
          <nav>
            <a href="tel:+351258321725"><Headphones size={14} /> 258 321 725</a>
            <Link href="/contactos">Contactos</Link>
            <span>Portugal · EUR</span>
          </nav>
        </div>
      </div>

      <div className="main-header container">
        <button className="mobile-menu-button" onClick={() => setMobileOpen(true)} aria-label="Abrir menu"><Menu /></button>
        <Link href="/" className="brand" aria-label="Jolarme - início">
          <Image src="/brand/jolarme-logo.png" alt="Jolarme" width={178} height={92} priority />
        </Link>
        <div className="header-search" ref={searchBox}>
          <form onSubmit={submitSearch}>
            <Search />
            <input value={query} onChange={(event) => setQuery(event.target.value)} onFocus={() => results.length && setSearchOpen(true)} placeholder="Pesquisar por produto, referência ou marca..." aria-label="Pesquisar catálogo" />
            <button type="submit">Pesquisar</button>
          </form>
          {searchOpen && (
            <div className="search-results">
              <div className="search-results-head"><span>Sugestões</span><small>{results.length} resultados</small></div>
              {results.slice(0, 5).map((product) => (
                <Link key={product.id} href={`/produtos/${product.slug}`} className="search-result">
                  <span className="search-result-image"><Image src={product.image} alt="" fill sizes="52px" /></span>
                  <span><strong>{product.shortName}</strong><small>{product.reference} · {product.brand}</small></span>
                  <b>{product.price.toFixed(2).replace(".", ",")} €</b>
                </Link>
              ))}
              <button onClick={() => submitSearch({ preventDefault() {} } as FormEvent)}>Ver todos os resultados</button>
            </div>
          )}
        </div>
        <div className="header-actions">
          <button className="header-action hide-tablet" aria-label="Favoritos"><Heart /><span><small>Lista</small>Favoritos</span></button>
          <div className="account-wrap">
            <button className="header-action" onClick={() => setAccountOpen((value) => !value)}><UserRound /><span><small>A minha</small>Conta</span></button>
            {accountOpen && (
              <div className="account-popover">
                {loginState === "ok" ? (
                  <div className="login-success"><span><ShieldCheck /></span><h3>Olá, Cliente Demo</h3><p>Sessão mock iniciada com sucesso.</p></div>
                ) : (
                  <form onSubmit={submitLogin}>
                    <span className="eyebrow">Área reservada</span>
                    <h3>Iniciar sessão</h3>
                    <label>E-mail<input name="email" type="email" defaultValue="demo@jolarme.pt" required /></label>
                    <label>Password<input name="password" type="password" defaultValue="demo123" required /></label>
                    <button className="button button-dark button-block" disabled={loginState === "loading"}>{loginState === "loading" ? "A entrar..." : "Entrar"}</button>
                    <div className="login-links"><a href="#">Criar conta</a><a href="#">Recuperar password</a></div>
                  </form>
                )}
              </div>
            )}
          </div>
          <button className="header-action cart-action" onClick={openCart}><span className="cart-icon"><ShoppingBag /><b>{count}</b></span><span><small>O meu</small>Carrinho</span></button>
        </div>
      </div>

      <nav className="category-nav">
        <div className="container category-nav-inner">
          <Link href="/produtos" className="all-products"><Menu size={18} /> Todos os produtos</Link>
          {categories.map((category) => (
            <div className="category-nav-item" key={category.id}>
              <Link href={`/produtos?categoria=${category.id}`}>{category.shortName}<ChevronDown size={14} /></Link>
              <div className="mega-menu">
                <div>
                  <span className="eyebrow">{category.shortName}</span>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <Link href={`/produtos?categoria=${category.id}`} className="text-link">Ver toda a categoria →</Link>
                </div>
                <ul>{category.subcategories.map((sub) => <li key={sub}><Link href={`/produtos?categoria=${category.id}`}>{sub}</Link></li>)}</ul>
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div className={`mobile-panel-backdrop ${mobileOpen ? "is-open" : ""}`} onClick={() => setMobileOpen(false)} />
      <aside className={`mobile-panel ${mobileOpen ? "is-open" : ""}`}>
        <div className="mobile-panel-head"><Image src="/brand/jolarme-logo.png" alt="Jolarme" width={138} height={72} /><button onClick={() => setMobileOpen(false)}><X /></button></div>
        <form className="mobile-search" onSubmit={submitSearch}><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar..." /></form>
        <nav><Link href="/produtos">Todos os produtos</Link>{categories.map((category) => <Link key={category.id} href={`/produtos?categoria=${category.id}`}>{category.name}</Link>)}<Link href="/contactos">Contactos</Link></nav>
        <div className="mobile-secure"><LockKeyhole /> Compra segura e apoio especializado</div>
      </aside>
    </header>
  );
}
