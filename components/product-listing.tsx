"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronRight, Filter, Grid2X2, List, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { brands, categories } from "@/lib/mock-data";
import { Product } from "@/lib/types";
import { ProductCard } from "./product-card";

type ApiPayload = { data: Product[]; meta: { total: number; page: number; pages: number } };

export function ProductListing() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");

  const queryString = searchParams.toString();
  const activeCategory = searchParams.get("categoria") ?? "";
  const activeBrand = searchParams.get("marca") ?? "";
  const query = searchParams.get("q") ?? "";
  const sort = searchParams.get("ordem") ?? "featured";
  const page = Number(searchParams.get("pagina") ?? "1");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/products?${queryString}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((payload: ApiPayload) => { setProducts(payload.data); setMeta(payload.meta); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [queryString]);

  const categoryName = useMemo(() => categories.find((category) => category.id === activeCategory)?.name, [activeCategory]);

  function updateFilter(key: string, value?: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value); else next.delete(key);
    if (key !== "pagina") next.delete("pagina");
    router.push(`/produtos?${next.toString()}`, { scroll: false });
  }

  function resetFilters() { router.push("/produtos"); }

  return (
    <div className="catalog-page">
      <div className="catalog-hero">
        <div className="container">
          <div className="breadcrumbs"><span>Início</span><ChevronRight /> <strong>Produtos</strong>{categoryName && <><ChevronRight /><strong>{categoryName}</strong></>}</div>
          <span className="eyebrow">Catálogo profissional</span>
          <h1>{query ? `Resultados para “${query}”` : categoryName ?? "Todos os produtos"}</h1>
          <p>{categoryName ? categories.find((category) => category.id === activeCategory)?.description : "Encontre soluções de segurança eletrónica com apoio técnico especializado."}</p>
        </div>
      </div>

      <div className="container catalog-layout">
        <button className="mobile-filter-trigger button button-outline" onClick={() => setFiltersOpen(true)}><Filter /> Filtros</button>
        <div className={`filter-backdrop ${filtersOpen ? "is-open" : ""}`} onClick={() => setFiltersOpen(false)} />
        <aside className={`filter-sidebar ${filtersOpen ? "is-open" : ""}`}>
          <div className="filter-title"><div><SlidersHorizontal /><h2>Filtros</h2></div><button className="close-filters" onClick={() => setFiltersOpen(false)}><X /></button></div>
          <div className="filter-group">
            <h3>Categorias</h3>
            <button className={`filter-option ${!activeCategory ? "active" : ""}`} onClick={() => updateFilter("categoria")}><span>Todos os produtos</span><small>617</small></button>
            {categories.map((category) => <button key={category.id} className={`filter-option ${activeCategory === category.id ? "active" : ""}`} onClick={() => updateFilter("categoria", category.id)}><span>{category.shortName}</span><small>{category.count}</small></button>)}
          </div>
          <div className="filter-group">
            <h3>Marcas</h3>
            {brands.map((brand) => <label className="check-option" key={brand}><input type="checkbox" checked={activeBrand === brand} onChange={() => updateFilter("marca", activeBrand === brand ? undefined : brand)} /><i>{activeBrand === brand && <Check />}</i><span>{brand}</span></label>)}
          </div>
          <div className="filter-group">
            <h3>Disponibilidade</h3>
            <label className="check-option"><input type="checkbox" /><i /><span>Disponível</span></label>
            <label className="check-option"><input type="checkbox" /><i /><span>Por encomenda</span></label>
          </div>
          {(activeCategory || activeBrand || query) && <button className="reset-filters" onClick={resetFilters}><RotateCcw /> Limpar filtros</button>}
        </aside>

        <section className="catalog-results">
          <div className="catalog-toolbar">
            <div><strong>{meta.total}</strong> produtos encontrados</div>
            <div className="catalog-controls">
              <label>Ordenar por<select value={sort} onChange={(event) => updateFilter("ordem", event.target.value)}><option value="featured">Relevância</option><option value="price-asc">Preço: mais baixo</option><option value="price-desc">Preço: mais alto</option><option value="name">Nome A–Z</option><option value="newest">Novidades</option></select></label>
              <div className="view-toggle"><button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")} aria-label="Vista em grelha"><Grid2X2 /></button><button className={view === "list" ? "active" : ""} onClick={() => setView("list")} aria-label="Vista em lista"><List /></button></div>
            </div>
          </div>

          {(activeCategory || activeBrand || query) && <div className="active-filters">{query && <button onClick={() => updateFilter("q")}>Pesquisa: {query} <X /></button>}{activeCategory && <button onClick={() => updateFilter("categoria")}>{categoryName} <X /></button>}{activeBrand && <button onClick={() => updateFilter("marca")}>{activeBrand} <X /></button>}</div>}

          {loading ? (
            <div className="product-grid catalog-grid">{Array.from({ length: 8 }).map((_, index) => <div className="product-skeleton" key={index}><span /><i /><i /><b /></div>)}</div>
          ) : products.length ? (
            <div className={`product-grid catalog-grid ${view === "list" ? "list-view" : ""}`}>{products.map((product) => <ProductCard product={product} key={product.id} />)}</div>
          ) : (
            <div className="no-results"><Search /><h2>Não encontrámos produtos</h2><p>Tente outra pesquisa ou remova alguns filtros.</p><button className="button button-dark" onClick={resetFilters}>Ver todo o catálogo</button></div>
          )}

          {meta.pages > 1 && <nav className="pagination" aria-label="Paginação">{Array.from({ length: meta.pages }).map((_, index) => <button className={page === index + 1 ? "active" : ""} key={index} onClick={() => updateFilter("pagina", String(index + 1))}>{index + 1}</button>)}</nav>}
        </section>
      </div>
    </div>
  );
}
