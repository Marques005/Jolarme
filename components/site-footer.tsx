import Link from "next/link";
import Image from "next/image";
import { Clock3, Headphones, Mail, MapPin, ShieldCheck } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <section className="footer-support">
        <div className="container support-grid">
          <div><Headphones /><span><strong>Precisa de ajuda?</strong><small>Fale com um especialista</small></span></div>
          <a href="tel:+351258321725"><span>Telefone</span><strong>258 321 725</strong></a>
          <a href="mailto:comercial@jolarme.pt"><span>E-mail</span><strong>comercial@jolarme.pt</strong></a>
          <div><Clock3 /><span><strong>Seg–Sex</strong><small>09:00–12:00 · 14:30–18:00</small></span></div>
        </div>
      </section>
      <div className="container footer-main">
        <div className="footer-brand">
          <Image src="/brand/jolarme-logo.png" alt="Jolarme" width={156} height={82} />
          <p>Especialistas em alarmes, videovigilância e segurança eletrónica desde 1996.</p>
          <div><MapPin /> Avenida 1.º de Maio, 806<br />4935-114 Darque, Viana do Castelo</div>
        </div>
        <div><h4>Comprar</h4><Link href="/produtos?categoria=alarmes-intrusao">Alarmes de intrusão</Link><Link href="/produtos?categoria=alarmes-incendio">Alarmes de incêndio</Link><Link href="/produtos?categoria=cctv">Videovigilância</Link><Link href="/produtos?categoria=acessos-fibra">Controlo de acessos</Link></div>
        <div><h4>Informação</h4><Link href="/contactos">Contactos</Link><a href="#">Termos e condições</a><a href="#">Política de privacidade</a><a href="#">Trocas e devoluções</a></div>
        <div><h4>Confiança Jolarme</h4><p className="trust-line"><ShieldCheck /> Compra segura</p><p className="trust-line"><Headphones /> Apoio técnico gratuito</p><p className="trust-line"><Mail /> Resposta em 1 dia útil</p></div>
      </div>
      <div className="footer-bottom"><div className="container"><span>© {new Date().getFullYear()} Jolarme. Todos os valores incluem IVA.</span><span>Protótipo Next.js com API simulada</span></div></div>
    </footer>
  );
}
