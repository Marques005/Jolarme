"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Boxes, Headphones, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { products } from "@/lib/mock-data";
import { ProductCard } from "./product-card";

export function HomePage() {
  const featured = products.filter((product) => product.featured).slice(0, 8);

  return (
    <>
      <section className="hero">
        <div className="hero-grid-overlay" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <div className="hero-kicker"><span /> Segurança profissional, ao seu alcance</div>
            <h1>Proteja o que importa.<br /><em>Com confiança.</em></h1>
            <p>Soluções de alarme e videovigilância escolhidas por especialistas, com apoio técnico gratuito em todas as fases do projeto.</p>
            <div className="hero-actions">
              <Link href="/produtos" className="button button-orange">Explorar catálogo <ArrowRight /></Link>
              <Link href="/contactos" className="button button-ghost">Falar com especialista</Link>
            </div>
            <div className="hero-proof">
              <span><strong>28+</strong><small>Anos de experiência</small></span>
              <span><strong>600+</strong><small>Produtos profissionais</small></span>
              <span><strong>4.9/5</strong><small>Avaliação de clientes</small></span>
            </div>
          </div>
          <div className="hero-visual" aria-label="Seleção de produtos de segurança">
            <div className="hero-orbit" />
            <div className="hero-product hero-product-main"><span className="hero-image-wrap"><Image src="/products/750.jpg" alt="Câmara IP Safire" fill priority sizes="400px" /></span><div><small>Videovigilância IP</small><strong>Câmara Safire 4MP</strong><span>desde 75,00 €</span></div></div>
            <div className="hero-product hero-product-small top"><span><Image src="/products/72.jpg" alt="Detetor Paradox" fill sizes="130px" /></span><div><small>Intrusão</small><strong>Detetor PMD75</strong></div></div>
            <div className="hero-product hero-product-small bottom"><span><Image src="/products/785.jpg" alt="Mini Smart Switch" fill sizes="130px" /></span><div><small>Automação</small><strong>MiniSmartSwitch</strong></div></div>
            <div className="hero-status"><i><ShieldCheck /></i><span><strong>Sistema protegido</strong><small>Todos os dispositivos online</small></span></div>
          </div>
        </div>
      </section>

      <section className="benefit-strip">
        <div className="container benefit-grid">
          <div><Truck /><span><strong>Envio rápido</strong><small>Para todo o país</small></span></div>
          <div><Headphones /><span><strong>Apoio especializado</strong><small>Antes e depois da compra</small></span></div>
          <div><PackageCheck /><span><strong>Stock em Portugal</strong><small>Expedição em 24–48h</small></span></div>
          <div><BadgeCheck /><span><strong>Garantia e qualidade</strong><small>Equipamento certificado</small></span></div>
        </div>
      </section>

      <section className="section products-section">
        <div className="container">
          <div className="section-head">
            <div><span className="eyebrow">Escolhas dos especialistas</span><h2>Produtos em destaque</h2></div>
            <p className="section-head-note">Uma seleção de equipamento disponível<br />e recomendado pela nossa equipa.</p>
          </div>
          <div className="product-grid">
            {featured.map((product) => <ProductCard product={product} key={product.id} />)}
          </div>
          <div className="catalog-cta-inline">
            <div>
              <span className="eyebrow">Catálogo completo</span>
              <strong>Procura outro produto?</strong>
              <p>Explore todas as categorias, marcas e soluções disponíveis no nosso catálogo.</p>
            </div>
            <Link href="/produtos" className="button button-dark">Ver todos os produtos <ArrowRight /></Link>
          </div>
        </div>
      </section>

      <section className="project-banner-wrap">
        <div className="container project-banner">
          <div className="project-pattern" />
          <div className="project-copy">
            <span className="eyebrow light">Apoio técnico gratuito</span>
            <h2>Tem um projeto de segurança?</h2>
            <p>Diga-nos o que precisa. A nossa equipa ajuda a selecionar equipamentos compatíveis e acompanha a instalação.</p>
            <Link href="/contactos" className="button button-white">Pedir aconselhamento <ArrowRight /></Link>
          </div>
          <div className="project-steps">
            <div><span>01</span><strong>Conte-nos o projeto</strong><small>Casa, empresa ou instalação técnica.</small></div>
            <div><span>02</span><strong>Receba uma solução</strong><small>Material compatível e orçamento claro.</small></div>
            <div><span>03</span><strong>Instale com apoio</strong><small>Acompanhamento técnico especializado.</small></div>
          </div>
        </div>
      </section>

      <section className="section brand-section">
        <div className="container brand-grid">
          <div><span className="eyebrow">Marcas de confiança</span><h2>Equipamento de referência</h2><p>Trabalhamos com marcas reconhecidas para garantir compatibilidade, fiabilidade e suporte a longo prazo.</p></div>
          <div className="brand-logos"><strong>BOSCH</strong><strong>HIKVISION</strong><strong>PARADOX</strong><strong>INIM</strong><strong>SAFIRE</strong><strong>SATEL</strong></div>
        </div>
      </section>

      <section className="newsletter">
        <div className="container newsletter-inner">
          <div><Boxes /><span><strong>Novidades técnicas, sem ruído.</strong><small>Novos produtos, guias e oportunidades profissionais.</small></span></div>
          <form onSubmit={(event) => event.preventDefault()}><input type="email" placeholder="O seu melhor e-mail" aria-label="E-mail" /><button className="button button-orange">Subscrever</button></form>
        </div>
      </section>
    </>
  );
}
