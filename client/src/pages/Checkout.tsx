/* WK Shop — checkout */
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import { MessageCircle, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ProductImage } from "@/components/shop/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { brl, buildWhatsAppMessage, SETTINGS, shippingCost, type DeliveryMethod } from "@/lib/store";

const onlyDigits = (s: string) => s.replace(/\D/g, "");
const field =
  "w-full bg-transparent border border-white/10 focus:border-[var(--color-electric)] outline-none px-4 py-3 text-sm text-white placeholder:text-white/25";
const label = "block text-xs text-white/50 mb-1.5 tracking-wide";

export default function Checkout() {
  usePageMeta(`Finalizar compra | ${SETTINGS.name}`);
  const { lines, subtotal, setQty, remove } = useCart();
  const canShip = SETTINGS.shipping.enabled;
  const canPickup = SETTINGS.pickup.enabled;
  const [method, setMethod] = useState<DeliveryMethod>(canShip ? "ship" : "pickup");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", cep: "", street: "", number: "", complement: "", district: "", city: "", state: "",
  });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const shipping = shippingCost(subtotal, method);
  const total = subtotal + shipping;

  async function lookupCep(value: string) {
    const cep = onlyDigits(value);
    if (cep.length !== 8) return;
    try {
      const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const d = await r.json();
      if (!d.erro) setForm((f) => ({ ...f, street: d.logradouro || f.street, district: d.bairro || f.district, city: d.localidade || f.city, state: d.uf || f.state }));
    } catch {
      /* preenchimento manual */
    }
  }

  function validate(): string | null {
    if (lines.length === 0) return "Seu carrinho está vazio.";
    if (form.name.trim().length < 3) return "Informe seu nome completo.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Informe um e-mail válido.";
    if (onlyDigits(form.phone).length < 10) return "Informe um WhatsApp com DDD.";
    if (method === "ship") {
      if (onlyDigits(form.cep).length !== 8) return "Informe o CEP.";
      if (!form.street.trim() || !form.number.trim() || !form.city.trim() || form.state.trim().length !== 2)
        return "Complete o endereço de entrega.";
    }
    return null;
  }

  const addressText = () =>
    `${form.street}, ${form.number}${form.complement ? ` ${form.complement}` : ""} - ${form.district}, ${form.city}/${form.state.toUpperCase()}, CEP ${form.cep}`;

  async function payOnline() {
    const err = validate();
    if (err) return toast.error(err);
    setBusy(true);
    try {
      const res = await fetch("/.netlify/functions/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({ id: l.product.id, qty: l.qty })),
          customer: { name: form.name.trim(), email: form.email.trim(), phone: onlyDigits(form.phone) },
          delivery: { method, address: method === "ship" ? { ...form, state: form.state.toUpperCase() } : null },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.init_point) {
        try {
          (window as any).gtag?.("event", "begin_checkout", { currency: "BRL", value: total });
        } catch {
          /* analytics é opcional */
        }
        window.location.href = data.init_point;
        return;
      }
      if (data.error === "not_configured") {
        toast.error("O pagamento online ainda não está ativo. Use “Pedir pelo WhatsApp”.");
      } else {
        toast.error(data.message || "Não foi possível iniciar o pagamento. Tente novamente ou peça pelo WhatsApp.");
      }
    } catch {
      toast.error("Falha de conexão. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  function orderViaWhatsApp() {
    const err = validate();
    if (err) return toast.error(err);
    const text = buildWhatsAppMessage({
      lines, subtotal, shipping, method,
      customer: { name: form.name.trim(), email: form.email.trim(), phone: form.phone },
      address: method === "ship" ? addressText() : undefined,
    });
    window.open(`https://wa.me/${SETTINGS.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-36 pb-24">
        <div className="container max-w-6xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-10" style={{ fontFamily: "var(--font-display)" }}>
            Finalizar <span className="text-[var(--color-electric)]">compra</span>
          </h1>

          {lines.length === 0 ? (
            <div className="border border-white/10 p-12 text-center">
              <p className="text-white/50 mb-6">Seu carrinho está vazio.</p>
              <Link href="/loja" className="btn-electric">Ver produtos</Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_400px] gap-12">
              <div className="space-y-10">
                <section>
                  <h2 className="text-sm tracking-[0.2em] uppercase text-[var(--color-electric)] mb-5" style={{ fontFamily: "var(--font-mono)" }}>1 · Seus dados</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className={label} htmlFor="name">Nome completo</label>
                      <input id="name" className={field} value={form.name} onChange={set("name")} autoComplete="name" />
                    </div>
                    <div>
                      <label className={label} htmlFor="email">E-mail</label>
                      <input id="email" type="email" className={field} value={form.email} onChange={set("email")} autoComplete="email" />
                    </div>
                    <div>
                      <label className={label} htmlFor="phone">WhatsApp (com DDD)</label>
                      <input id="phone" inputMode="tel" className={field} value={form.phone} onChange={set("phone")} autoComplete="tel" placeholder="(15) 90000-0000" />
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-sm tracking-[0.2em] uppercase text-[var(--color-electric)] mb-5" style={{ fontFamily: "var(--font-mono)" }}>2 · Entrega</h2>
                  <div className="grid sm:grid-cols-2 gap-3 mb-6">
                    {canShip && (
                      <button type="button" onClick={() => setMethod("ship")} className={`text-left p-4 border transition-colors ${method === "ship" ? "border-[var(--color-electric)]" : "border-white/10 hover:border-white/30"}`}>
                        <p className="font-medium">{SETTINGS.shipping.label}</p>
                        <p className="text-white/40 text-sm mt-1">{subtotal >= SETTINGS.shipping.freeFrom && SETTINGS.shipping.freeFrom > 0 ? "Frete grátis" : brl(SETTINGS.shipping.flatRate)}</p>
                      </button>
                    )}
                    {canPickup && (
                      <button type="button" onClick={() => setMethod("pickup")} className={`text-left p-4 border transition-colors ${method === "pickup" ? "border-[var(--color-electric)]" : "border-white/10 hover:border-white/30"}`}>
                        <p className="font-medium">{SETTINGS.pickup.label}</p>
                        <p className="text-white/40 text-sm mt-1">Grátis</p>
                      </button>
                    )}
                  </div>
                  <p className="text-white/40 text-sm mb-5">{method === "ship" ? SETTINGS.shipping.note : SETTINGS.pickup.note}</p>

                  {method === "ship" && (
                    <div className="grid sm:grid-cols-6 gap-4">
                      <div className="sm:col-span-2">
                        <label className={label} htmlFor="cep">CEP</label>
                        <input id="cep" inputMode="numeric" className={field} value={form.cep} onChange={(e) => { set("cep")(e); lookupCep(e.target.value); }} autoComplete="postal-code" />
                      </div>
                      <div className="sm:col-span-4">
                        <label className={label} htmlFor="street">Rua</label>
                        <input id="street" className={field} value={form.street} onChange={set("street")} autoComplete="address-line1" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={label} htmlFor="number">Número</label>
                        <input id="number" className={field} value={form.number} onChange={set("number")} />
                      </div>
                      <div className="sm:col-span-4">
                        <label className={label} htmlFor="complement">Complemento (opcional)</label>
                        <input id="complement" className={field} value={form.complement} onChange={set("complement")} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={label} htmlFor="district">Bairro</label>
                        <input id="district" className={field} value={form.district} onChange={set("district")} />
                      </div>
                      <div className="sm:col-span-3">
                        <label className={label} htmlFor="city">Cidade</label>
                        <input id="city" className={field} value={form.city} onChange={set("city")} />
                      </div>
                      <div className="sm:col-span-1">
                        <label className={label} htmlFor="state">UF</label>
                        <input id="state" maxLength={2} className={`${field} uppercase`} value={form.state} onChange={set("state")} />
                      </div>
                    </div>
                  )}
                </section>
              </div>

              <aside className="lg:sticky lg:top-28 self-start border border-white/10 p-6 bg-[#050505]">
                <h2 className="text-lg font-bold mb-5" style={{ fontFamily: "var(--font-display)" }}>Resumo do pedido</h2>
                <ul className="divide-y divide-white/5 mb-5">
                  {lines.map(({ product, qty }) => (
                    <li key={product.id} className="flex gap-3 py-4">
                      <div className="w-14 h-14 bg-[#0A0A0A] shrink-0 overflow-hidden"><ProductImage product={product} /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm leading-snug">{product.name}</p>
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-white/40">
                          <button onClick={() => setQty(product.id, qty - 1)} aria-label="Diminuir" className="w-6 h-6 border border-white/15 hover:text-white">−</button>
                          <span className="w-4 text-center text-white">{qty}</span>
                          <button onClick={() => setQty(product.id, qty + 1)} disabled={qty >= product.stock} aria-label="Aumentar" className="w-6 h-6 border border-white/15 hover:text-white disabled:opacity-30">+</button>
                          <button onClick={() => remove(product.id)} className="ml-2 underline hover:text-red-400">remover</button>
                        </div>
                      </div>
                      <p className="text-sm">{brl(product.price * qty)}</p>
                    </li>
                  ))}
                </ul>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between text-white/60"><dt>Subtotal</dt><dd>{brl(subtotal)}</dd></div>
                  <div className="flex justify-between text-white/60"><dt>Entrega</dt><dd>{shipping === 0 ? "Grátis" : brl(shipping)}</dd></div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-white/10"><dt>Total</dt><dd style={{ fontFamily: "var(--font-display)" }}>{brl(total)}</dd></div>
                </dl>

                <button onClick={payOnline} disabled={busy} className="btn-electric w-full justify-center mt-6 disabled:opacity-60">
                  <Lock size={14} /> {busy ? "Abrindo pagamento..." : "Pagar online"}
                </button>
                <p className="text-[11px] text-white/30 text-center mt-2">Pix, cartão (até {SETTINGS.installments}x) ou boleto · Mercado Pago</p>
                <button onClick={orderViaWhatsApp} className="w-full mt-4 border border-white/15 hover:border-[#25D366] hover:text-[#25D366] text-white/70 py-3.5 text-xs tracking-[0.15em] uppercase transition-colors flex items-center justify-center gap-2" style={{ fontFamily: "var(--font-mono)" }}>
                  <MessageCircle size={14} /> Pedir pelo WhatsApp
                </button>
                <p className="text-[11px] text-white/30 text-center mt-4">
                  Ao comprar você concorda com nossa <Link href="/trocas-e-devolucoes" className="underline">política de trocas e devoluções</Link> e a <Link href="/privacidade" className="underline">política de privacidade</Link>.
                </p>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
