"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, Headphones, Mail, MapPin, MessageSquareText, Phone } from "lucide-react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    const body = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (response.ok) setStatus("success");
  }

  return (
    <div className="contact-page">
      <section className="contact-hero"><div className="container"><span className="eyebrow light">Estamos aqui para ajudar</span><h1>Vamos falar sobre<br />o seu projeto?</h1><p>Da escolha do equipamento à instalação, conte com aconselhamento de quem trabalha com segurança eletrónica todos os dias.</p></div></section>
      <section className="container contact-layout">
        <div className="contact-info">
          <span className="eyebrow">Contactos</span><h2>Fale diretamente connosco</h2><p>Explique-nos o que pretende proteger e quais os equipamentos que já tem. Responderemos com uma recomendação clara.</p>
          <div className="contact-cards">
            <a href="tel:+351258321725"><span><Phone /></span><div><small>Telefone</small><strong>258 321 725</strong><p>Chamada para rede fixa nacional</p></div></a>
            <a href="mailto:comercial@jolarme.pt"><span><Mail /></span><div><small>E-mail</small><strong>comercial@jolarme.pt</strong><p>Resposta habitual em 1 dia útil</p></div></a>
            <div><span><MapPin /></span><div><small>Morada</small><strong>Avenida 1.º de Maio, 806</strong><p>4935-114 Darque, Viana do Castelo</p></div></div>
            <div><span><Clock3 /></span><div><small>Horário</small><strong>Segunda a Sexta</strong><p>09:00–12:00 · 14:30–18:00</p></div></div>
          </div>
          <div className="support-promise"><Headphones /><div><strong>Apoio técnico gratuito</strong><p>Depois da compra, continuamos disponíveis para esclarecer dúvidas de configuração e instalação.</p></div></div>
        </div>
        <div className="contact-form-card">
          {status === "success" ? <div className="form-success"><CheckCircle2 /><span className="eyebrow">Mensagem enviada</span><h2>Obrigado pelo contacto.</h2><p>Este é um envio simulado. Num projeto real, a equipa receberia agora o seu pedido.</p><button className="button button-dark" onClick={() => setStatus("idle")}>Enviar nova mensagem</button></div> : <>
            <MessageSquareText /><span className="eyebrow">Pedido de informação</span><h2>Como podemos ajudar?</h2>
            <form onSubmit={submit}>
              <div className="form-row"><label>Nome<input name="name" placeholder="O seu nome" required /></label><label>Empresa <small>(opcional)</small><input name="company" placeholder="Nome da empresa" /></label></div>
              <div className="form-row"><label>E-mail<input name="email" type="email" placeholder="nome@empresa.pt" required /></label><label>Telefone<input name="phone" type="tel" placeholder="+351" /></label></div>
              <label>Assunto<select name="subject" required defaultValue=""><option value="" disabled>Selecione uma opção</option><option>Ajuda a escolher produtos</option><option>Compatibilidade técnica</option><option>Estado de encomenda</option><option>Pedido de orçamento</option><option>Outro assunto</option></select></label>
              <label>Mensagem<textarea name="message" rows={6} placeholder="Conte-nos um pouco sobre o seu projeto..." required /></label>
              <label className="privacy-check"><input type="checkbox" required /><span>Li e aceito a política de privacidade. Os dados serão usados apenas para responder a este pedido.</span></label>
              <button className="button button-orange button-block" disabled={status === "loading"}>{status === "loading" ? "A enviar..." : <>Enviar mensagem <ArrowRight /></>}</button>
            </form>
          </>}
        </div>
      </section>
    </div>
  );
}
